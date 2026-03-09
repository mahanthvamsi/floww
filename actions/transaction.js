"use server";

import aj from "@/lib/arcjet";
import { db } from "@/lib/prisma";
import { request } from "@arcjet/next";
import { auth } from "@clerk/nextjs/server";
import Groq from "groq-sdk";
import { revalidatePath } from "next/cache";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

const serializeAmount = (obj) => ({
    ...obj,
    amount: obj.amount.toNumber(),
})

export async function createTransaction(data) {
    try {
        const { userId } = await auth();
        if (!userId) throw new Error("Unauthorized");

        const req = await request();
        const decision = await aj.protect(req, {
            userId,
            requested: 1,
        })

        if (decision.isDenied()) {
            if (decision.reason.isRateLimit()) {
                const { remaining, reset } = decision.reason;
                console.error({
                    code: "RATE_LIMIT_EXCEEDED",
                    details: { remaining, resetInSeconds: reset }
                })
                throw new Error("Too many requests, please try again later");
            }
            throw new Error("Request blocked");
        }

        const user = await db.user.findUnique({
            where: { clerkUserId: userId }
        })
        if (!user) throw new Error("User not found")

        const account = await db.account.findUnique({
            where: { id: data.accountId, userId: user.id }
        })
        if (!account) throw new Error("Account not found")

        const balanceChanege = data.type === "EXPENSE" ? -data.amount : data.amount;
        const newBalance = account.balance.toNumber() + balanceChanege;

        const transaction = await db.$transaction(async (tx) => {
            const newTransaction = await tx.transaction.create({
                data: {
                    ...data,
                    userId: user.id,
                    nextRecurringDate:
                        data.isRecurring && data.recurringInterval
                            ? calculateNextRecurringDate(data.date, data.recurringInterval)
                            : null,
                }
            })
            await tx.account.update({
                where: { id: data.accountId },
                data: { balance: newBalance },
            })
            return newTransaction;
        })

        revalidatePath("/dashboard");
        revalidatePath(`/accounts/${transaction.accountId}`);

        return { success: true, data: serializeAmount(transaction) };
    } catch (error) {
        throw new Error(error.message);
    }
}

function calculateNextRecurringDate(startDate, interval) {
    const date = new Date(startDate);
    switch (interval) {
        case "DAILY":   date.setDate(date.getDate() + 1); break;
        case "WEEKLY":  date.setDate(date.getDate() + 7); break;
        case "MONTHLY": date.setMonth(date.getMonth() + 1); break;
        case "YEARLY":  date.setFullYear(date.getFullYear() + 1); break;
    }
    return date;
}

export async function scanReceipt(file) {
    try {
        // Convert image to base64
        const arrayBuffer = await file.arrayBuffer();
        const base64String = Buffer.from(arrayBuffer).toString("base64");
        const mimeType = file.type; // e.g. image/jpeg, image/png

        // Groq supports vision via llama-4-scout-17b-16e-instruct
        const response = await groq.chat.completions.create({
            model: "meta-llama/llama-4-scout-17b-16e-instruct",
            messages: [
                {
                    role: "user",
                    content: [
                        {
                            type: "image_url",
                            image_url: {
                                url: `data:${mimeType};base64,${base64String}`,
                            },
                        },
                        {
                            type: "text",
                            text: `Analyze this receipt image and extract the following information in JSON format:
- Total amount (just the number)
- Date (in ISO format)
- Description or items purchased (brief summary)
- Merchant/store name
- Suggested category (one of: housing, transportation, groceries, utilities, entertainment, food, shopping, healthcare, education, personal, travel, insurance, gifts, bills, other-expense)

Only respond with valid JSON in this exact format, no extra text:
{
  "amount": number,
  "date": "ISO date string",
  "description": "string",
  "merchantName": "string",
  "category": "string"
}

If it's not a receipt, return an empty object: {}`,
                        },
                    ],
                },
            ],
            temperature: 0.1,
            max_tokens: 500,
        });

        const text = response.choices[0]?.message?.content || "";
        const cleanedText = text.replace(/```(?:json)?\n?/g, "").trim();

        try {
            const data = JSON.parse(cleanedText);
            if (!data.amount) return {}; // not a receipt
            return {
                amount: parseFloat(data.amount),
                date: new Date(data.date),
                description: data.description,
                category: data.category,
                merchantName: data.merchantName,
            };
        } catch (parseError) {
            console.error("Error parsing JSON response:", parseError);
            throw new Error("Invalid response format from AI");
        }

    } catch (error) {
        console.error("Error scanning receipt:", error.message);
        throw new Error("Failed to scan receipt");
    }
}

export async function getTransaction(id) {
    const { userId } = await auth();
    if (!userId) throw new Error("Unauthorized");

    const user = await db.user.findUnique({
        where: { clerkUserId: userId },
    })
    if (!user) throw new Error("User not found");

    const transaction = await db.transaction.findUnique({
        where: { id, userId: user.id }
    })
    if (!transaction) throw new Error("Transaction not found");

    return serializeAmount(transaction);
}

export async function updateTransaction(id, data) {
    try {
        const { userId } = await auth();
        if (!userId) throw new Error("Unauthorized");

        const user = await db.user.findUnique({
            where: { clerkUserId: userId },
        })
        if (!user) throw new Error("User not found");

        const originalTransaction = await db.transaction.findUnique({
            where: { id, userId: user.id },
            include: { account: true },
        });
        if (!originalTransaction) throw new Error("Transaction not found");

        const oldBalanceChange =
            originalTransaction.type === "EXPENSE"
                ? -originalTransaction.amount.toNumber()
                : originalTransaction.amount.toNumber();

        const newBalanceChange =
            data.type === "EXPENSE" ? -data.amount : data.amount;

        const netBalanceChange = newBalanceChange - oldBalanceChange;

        const transaction = await db.$transaction(async (tx) => {
            const updated = await tx.transaction.update({
                where: { id, userId: user.id },
                data: {
                    ...data,
                    nextRecurringDate:
                        data.isRecurring && data.recurringInterval
                            ? calculateNextRecurringDate(data.date, data.recurringInterval)
                            : null,
                },
            })
            await tx.account.update({
                where: { id: originalTransaction.accountId },
                data: { balance: { increment: netBalanceChange } },
            })
            return updated;
        })

        revalidatePath("/dashboard");
        revalidatePath(`/account/${data.accountId}`);

        return { success: true, data: serializeAmount(transaction) };
    } catch (error) {
        throw new Error(error.message);
    }
}