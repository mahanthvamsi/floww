import { inngest } from "./client";
import EmailTemplate from "@/emails/template";
import { sendEmail } from "@/actions/send-email";
import Groq from "groq-sdk";
import { db } from "@/lib/prisma";

export const checkBudgetAlert = inngest.createFunction(
    { name: "Check Budget Alerts" },
    { cron: "0 */6 * * *" }, // Every 6 hours
    async ({ step }) => {
      const budgets = await step.run("fetch-budgets", async () => {
        return await db.budget.findMany({
          include: {
            user: {
              include: {
                accounts: {
                  where: {
                    isDefault: true,
                  },
                },
              },
            },
          },
        });
      });
  
      for (const budget of budgets) {
        const defaultAccount = budget.user.accounts[0];
        if (!defaultAccount) continue; // Skip if no default account
  
        await step.run(`check-budget-${budget.id}`, async () => {
          const startDate = new Date();
          startDate.setDate(1); // Start of current month
  
          // Calculate total expenses for the default account only
          const expenses = await db.transaction.aggregate({
            where: {
              userId: budget.userId,
              accountId: defaultAccount.id, // Only consider default account
              type: "EXPENSE",
              date: {
                gte: startDate,
              },
            },
            _sum: {
              amount: true,
            },
          });
  
          const totalExpenses = expenses._sum.amount?.toNumber() || 0;
          const budgetAmount = budget.amount;
          const percentageUsed = (totalExpenses / budgetAmount) * 100;
  
          // Check if we should send an alert
          if (
            percentageUsed >= 80 && // Default threshold of 80%
            (!budget.lastAlertSent ||
              isNewMonth(new Date(budget.lastAlertSent), new Date()))
          ) {
            await sendEmail({
              to: budget.user.email,
              subject: `Floww Budget Alert — ${defaultAccount.name}`,
              react: EmailTemplate({
                userName: budget.user.name?.replace(/\s*null\s*/gi, "").trim() || budget.user.email.split("@")[0],
                type: "budget-alert",
                data: {
                  percentageUsed,
                  budgetAmount: parseInt(budgetAmount).toFixed(1),
                  totalExpenses: parseInt(totalExpenses).toFixed(1),
                  accountName: defaultAccount.name,
                },
              }),
            });
  
            // Update last alert sent
            await db.budget.update({
              where: { id: budget.id },
              data: { lastAlertSent: new Date() },
            });
          }
        });
      }
    }
  );

function isNewMonth(lastAlertDate, currentDate) {
    return (
        lastAlertDate.getMonth() !== currentDate.getMonth() ||
        lastAlertDate.getFullYear() !== currentDate.getFullYear()
    )
}

export const triggerRecurringTransactions = inngest.createFunction(
    {
      id: "trigger-recurring-transactions",
      name: "Trigger Recurring Transactions",
    },
    { cron: "0 0  * * *" },
    async ({ step }) => {
        const recurringTransactions = await step.run(
            "fetch-recurring-transactions", 
            async () => {
                return await db.transaction.findMany({
                    where: {
                        isRecurring: true,
                        status: "COMPLETED",
                        OR: [
                            { lastProcessed: null },
                            { nextRecurringDate: { lte: new Date() } },
                        ],
                    },
                });
            }
        );

        if (recurringTransactions.length > 0) {
            const events = recurringTransactions.map((transaction) => ({
                name: "transaction.recurring.process",
                data: { transactionId: transaction.id, userId: transaction.userId },
            }))

            await inngest.send(events);            
        }

        return { triggered: recurringTransactions.length };
    }
);


export const processRecurringTransactions = inngest.createFunction(
    {
    
    id: "process-recurring-transactions",
    throttle: {
        limit: 10,
        period: "1m",
        key: "event.data.userId",
    },
},
    {  event: "transaction.recurring.process" },
    async ({ event, step }) => {
        if (!event?.data?.transactionId || !event?.data?.userId){
            console.error("Invalid event data", event);
            return { error: "Missing required event data" };
        }

        await step.run("process-transaction", async () => {
            const transaction = await db.transaction.findUnique({
                where: {
                    id: event.data.transactionId,
                    userId: event.data.userId,
                },
                include: {
                    account: true,
                },
            });

            if(!transaction || !isTransactionDue(transaction)) return;

            await db.$transaction(async (tx) => {
                await tx.transaction.create({
                    data: {
                        type: transaction.type,
                        amount: transaction.amount,
                        description: `${transaction.description} (Recurring)`,
                        date: new Date(),
                        category: transaction.category,
                        userId: transaction.userId,
                        accountId: transaction.accountId,
                        isRecurring: false,
                    }
                });

                const balanceChange = 
                    transaction.type === "EXPENSE"
                    ? -transaction.amount.toNumber()
                    : transaction.amount.toNumber()

                await tx.account.update({
                    where: { id: transaction.accountId },
                    data: { balance: { increment: balanceChange } },
                });

                await tx.transaction.update({
                    where: { id: transaction.id },
                    data: { 
                        lastProcessed: new Date(),
                        nextRecurringDate: calculateNextRecurringDate(
                            new Date(),
                            transaction.recurringInterval
                        ), 
                    },
                });
            });
        });
    }
);

function isTransactionDue(transaction) {
    if (!transaction.lastProcessed) return true;

    const today = new Date();
    const nextDue = new Date(transaction.nextRecurringDate);

    return nextDue <= today;
}

function calculateNextRecurringDate(startDate, interval) {
    const date = new Date(startDate);

    switch (interval) {
        case "DAILY":
            date.setDate(date.getDate() + 1);
            break;
        case "WEEKLY":
            date.setDate(date.getDate() + 7);
            break;
        case "MONTHLY":
            date.setMonth(date.getMonth() + 1);
            break;
        case "YEARLY":
            date.setFullYear(date.getFullYear() + 1);
            break;
    }

    return date;
}


  export const generateMonthlyReport = inngest.createFunction(
    {
      id: "generate-monthly-reports",
      name: "Generate Monthly Reports",
    },
    { cron: "0 0 1 * *" }, // First day of each month
    async ({ step }) => {
      const users = await step.run("fetch-users", async () => {
        return await db.user.findMany({
          include: { accounts: true },
        });
      });
  
      for (const user of users) {
        await step.run(`generate-report-${user.id}`, async () => {
          const lastMonth = new Date();
          lastMonth.setMonth(lastMonth.getMonth() - 1);
  
          const stats = await getMonthlyStats(user.id, lastMonth);
          const monthName = lastMonth.toLocaleString("default", {
            month: "long",
          });
  
          // Generate AI insights
          const insights = await generateFinancialInsights(stats, monthName);
  
          await sendEmail({
            to: user.email,
            subject: `Your Floww Monthly Report - ${monthName}`,
            react: EmailTemplate({
              userName: user.name?.replace(/\s*null\s*/gi, "").trim() || user.email.split("@")[0],
              type: "monthly-report",
              data: {
                stats,
                month: monthName,
                insights,
              },
            }),
          });
        });
      }
  
      return { processed: users.length };
    }
  );

  async function generateFinancialInsights(stats, month) {
    const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
  
    const prompt = `Analyze this financial data and provide 3 concise, actionable insights.
Focus on spending patterns and give practical, specific advice.
Be direct and conversational — like a smart friend who knows finance, not a corporate report.

Financial Data for ${month}:
- Total Income: €${stats.totalIncome}
- Total Expenses: €${stats.totalExpenses}
- Net Income: €${stats.totalIncome - stats.totalExpenses}
- Expense Categories: ${Object.entries(stats.byCategory)
      .map(([category, amount]) => `${category}: €${amount}`)
      .join(", ")}

Respond ONLY with a JSON array of 3 strings, no extra text:
["insight 1", "insight 2", "insight 3"]`;
  
    try {
      const response = await groq.chat.completions.create({
        model: "llama-3.3-70b-versatile",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.4,
        max_tokens: 300,
      });

      const text = response.choices[0]?.message?.content || "";
      const cleanedText = text.replace(/```(?:json)?\n?/g, "").trim();
      return JSON.parse(cleanedText);
    } catch (error) {
      console.error("Error generating insights:", error);
      return [
        "Your highest expense category this month might need attention.",
        "Consider setting up a budget for better financial management.",
        "Track your recurring expenses to identify potential savings.",
      ];
    }
  }
  
const getMonthlyStats = async (userId, month) => {
    const startDate = new Date(month.getFullYear(), month.getMonth(), 1);
    const endDate = new Date(month.getFullYear(), month.getMonth() + 1, 0);

    const  transactions = await db.transaction.findMany({
        where: {
            userId,
            date: {
                gte: startDate,
                lte: endDate,
            },
        },
    });

    return transactions.reduce(
        (stats, t)=> {
            const amount = t.amount.toNumber(); 
            if (t.type === "EXPENSE") {
                stats.totalExpenses += amount;
                stats.byCategory[t.category] =
                    (stats.byCategory[t.category] || 0) + amount;
            } else {
                stats.totalIncome += amount;
            }
            return stats;
        },
        {
            totalExpenses: 0,
            totalIncome: 0,
            byCategory: {},
            transactionCount: transactions.length,
        }
    );
};