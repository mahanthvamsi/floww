import {
  Body, Head, Heading, Html, Preview,
} from "@react-email/components";
import * as React from "react";

/* ─────────────────────────────────────────────────────────────────────────────
   All shared styles live in ONE <style> block injected into <head>.
   This keeps the rendered HTML well under Gmail's ~102 KB clip threshold
   instead of repeating verbose inline style objects on every element.
───────────────────────────────────────────────────────────────────────────── */
const globalCss = `
body{background:#dadbdd;margin:0;padding:20px 0;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif}
.wrap{background:#fff;margin:0 auto;padding:0 0 32px;border-radius:12px;max-width:560px;overflow:hidden}
.brand-hdr{background:linear-gradient(135deg,#0a0d14 0%,#1a1200 50%,#0a0d14 100%);border-bottom:2px solid #c9a96e;padding:24px 32px}
.brand-logo{color:#fff;font-size:26px;font-weight:900;letter-spacing:.15em;font-family:Georgia,serif}
.gold{color:#c9a96e}
.title{color:#111827;font-size:22px;font-weight:700;margin:24px 32px 8px}
.txt{color:#374151;font-size:15px;line-height:1.6;margin:0 32px 16px}
.stats{margin:20px 32px}
.stat-tbl{border-collapse:separate;border-spacing:6px 0;table-layout:fixed;width:100%}
.stat-cell{vertical-align:top;width:33.33%}
.stat-box{padding:14px 10px;background:#f9fafb;border-radius:8px;border:1px solid #e5e7eb;text-align:center}
.stat-lbl{color:#9ca3af;font-size:10px;font-weight:600;text-transform:uppercase;letter-spacing:.08em;margin:0 0 6px}
.stat-val{color:#111827;font-size:15px;font-weight:700;margin:0;word-break:break-word}
.green{color:#059669}.red{color:#dc2626}
.divider{height:1px;background:#e5e7eb;margin:20px 32px}
.section{margin:0 32px 8px;padding:20px;background:#f9fafb;border-radius:8px}
.sec-hdr{color:#111827;font-size:16px;font-weight:700;margin:0 0 14px}
.cat-tbl{border-collapse:collapse;table-layout:fixed;width:100%}
.cat-row{border-bottom:1px solid #e5e7eb}
.cat-lbl{color:#374151;font-size:14px;padding:10px 8px 10px 0;text-align:left;width:60%}
.cat-amt{color:#111827;font-size:14px;font-weight:700;padding:10px 0 10px 8px;text-align:right;width:40%}
.insight{background:#fafaf7;border-left:3px solid #c9a96e;border-radius:0 6px 6px 0;padding:10px 14px;margin-bottom:10px}
.insight p{color:#374151;font-size:14px;line-height:1.6;margin:0}
.insight-num{font-weight:700;color:#c9a96e}
.sub-txt{color:#6b7280;font-size:13px;margin:0 0 16px;font-family:inherit}
.footer{text-align:center;padding:24px 32px 0;border-top:1px solid #e5e7eb;margin-top:32px}
.footer-logo{color:#111;font-size:18px;font-weight:900;letter-spacing:.15em;font-family:Georgia,serif;margin:0 0 8px}
.footer-sub{color:#9ca3af;font-size:12px;margin:0 0 4px}
.footer-link{color:#c9a96e;text-decoration:none}
.alert-red{background:#fef2f2;border-bottom:2px solid #dc2626;padding:10px 32px;text-align:center}
.alert-amber{background:#fffbeb;border-bottom:2px solid #f59e0b;padding:10px 32px;text-align:center}
.alert-txt{color:#111827;font-size:14px;font-weight:700;margin:0}
`;

const BrandHeader = () => (
  <div className="brand-hdr">
    <span className="brand-logo">FLOWW<span className="gold">.</span></span>
  </div>
);

const BrandFooter = () => (
  <div className="footer">
    <p className="footer-logo">FLOWW<span className="gold">.</span></p>
    <p className="footer-sub">
      Built by Mahanth Vamsi &nbsp;&middot;&nbsp;
      <a href="mailto:mahanthvamsis1@gmail.com" className="footer-link">
        mahanthvamsis1@gmail.com
      </a>
    </p>
    <p className="footer-sub">
      You&rsquo;re receiving this because you have a Floww account.
    </p>
  </div>
);

const Divider = () => <div className="divider" />;

export default function EmailTemplate({
  userName = "",
  type = "monthly-report",
  data = {},
}) {

  // ── Monthly Report ──────────────────────────────────────────────────────────
  if (type === "monthly-report") {
    const net = (data?.stats?.totalIncome || 0) - (data?.stats?.totalExpenses || 0);
    const isPositive = net >= 0;

    return (
      <Html>
        <Head><style>{globalCss}</style></Head>
        <Preview>Your Floww Monthly Report for {data?.month} is ready 📊</Preview>
        <Body>
          <div className="wrap">
            <BrandHeader />

            <h1 className="title">Monthly Financial Report</h1>
            <p className="txt">Hi {userName},</p>
            <p className="txt">
              Here&rsquo;s your Floww summary for <strong>{data?.month}</strong>.
              Here&rsquo;s how your money flowed this month.
            </p>

            {/* Stats */}
            <div className="stats">
              <table className="stat-tbl" cellPadding="0" cellSpacing="0">
                <tbody>
                  <tr>
                    <td className="stat-cell">
                      <div className="stat-box">
                        <p className="stat-lbl">TOTAL INCOME</p>
                        <p className="stat-val green">
                          &euro;{(data?.stats?.totalIncome || 0).toFixed(2)}
                        </p>
                      </div>
                    </td>
                    <td className="stat-cell">
                      <div className="stat-box">
                        <p className="stat-lbl">TOTAL EXPENSES</p>
                        <p className="stat-val red">
                          &euro;{(data?.stats?.totalExpenses || 0).toFixed(2)}
                        </p>
                      </div>
                    </td>
                    <td className="stat-cell">
                      <div className="stat-box">
                        <p className="stat-lbl">NET</p>
                        <p className={`stat-val ${isPositive ? "green" : "red"}`}>
                          {isPositive ? "+" : ""}&euro;{net.toFixed(2)}
                        </p>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <Divider />

            {/* Category breakdown */}
            {data?.stats?.byCategory && Object.keys(data.stats.byCategory).length > 0 && (
              <div className="section">
                <h2 className="sec-hdr">Expenses by Category</h2>
                <table className="cat-tbl" cellPadding="0" cellSpacing="0">
                  <tbody>
                    {Object.entries(data.stats.byCategory)
                      .sort(([, a], [, b]) => b - a)
                      .map(([category, amount]) => (
                        <tr key={category} className="cat-row">
                          <td className="cat-lbl">
                            {category.charAt(0).toUpperCase() + category.slice(1)}
                          </td>
                          <td className="cat-amt">
                            &euro;{(amount || 0).toFixed(2)}
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            )}

            <Divider />

            {/* AI Insights */}
            {data?.insights && data.insights.length > 0 && (
              <div className="section">
                <h2 className="sec-hdr">&#10022; Floww AI Insights</h2>
                <p className="sub-txt">
                  Personalised observations based on your spending this month:
                </p>
                {data.insights.map((insight, index) => (
                  <div key={index} className="insight">
                    <p><span className="insight-num">{index + 1}. </span>{insight}</p>
                  </div>
                ))}
              </div>
            )}

            <BrandFooter />
          </div>
        </Body>
      </Html>
    );
  }

  // ── Budget Alert ────────────────────────────────────────────────────────────
  if (type === "budget-alert") {
    const percentage = data?.percentageUsed || 0;
    const remaining = (data?.budgetAmount || 0) - (data?.totalExpenses || 0);
    const isOver = percentage >= 100;

    return (
      <Html>
        <Head><style>{globalCss}</style></Head>
        <Preview>
          {isOver
            ? `⚠️ You've exceeded your budget on ${data?.accountName}`
            : `⚡ You've used ${percentage.toFixed(1)}% of your budget on ${data?.accountName}`}
        </Preview>
        <Body>
          <div className="wrap">
            <BrandHeader />

            <div className={isOver ? "alert-red" : "alert-amber"}>
              <p className="alert-txt">
                {isOver ? "⚠️ Budget Exceeded" : "⚡ Budget Alert"}
              </p>
            </div>

            <h1 className="title">
              {isOver ? "You've gone over budget" : "You're approaching your limit"}
            </h1>

            <p className="txt">Hi {userName},</p>
            <p className="txt">
              {isOver
                ? `You've exceeded your monthly budget for ${data?.accountName}. Here's a quick summary:`
                : `You've used ${percentage.toFixed(1)}% of your monthly budget for ${data?.accountName}. Here's where things stand:`}
            </p>

            {/* Stats */}
            <div className="stats">
              <table className="stat-tbl" cellPadding="0" cellSpacing="0">
                <tbody>
                  <tr>
                    <td className="stat-cell">
                      <div className="stat-box">
                        <p className="stat-lbl">MONTHLY BUDGET</p>
                        <p className="stat-val">&euro;{Number(data?.budgetAmount || 0).toFixed(2)}</p>
                      </div>
                    </td>
                    <td className="stat-cell">
                      <div className="stat-box">
                        <p className="stat-lbl">SPENT SO FAR</p>
                        <p className="stat-val red">
                          &euro;{Number(data?.totalExpenses || 0).toFixed(2)}
                        </p>
                      </div>
                    </td>
                    <td className="stat-cell">
                      <div className="stat-box">
                        <p className="stat-lbl">{remaining < 0 ? "OVER BY" : "REMAINING"}</p>
                        <p className={`stat-val ${remaining < 0 ? "red" : "green"}`}>
                          &euro;{Math.abs(remaining).toFixed(2)}
                        </p>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <Divider />

            <p className="txt" style={{ color: "#6b7280", fontSize: "14px" }}>
              {isOver
                ? "Consider reviewing your recent transactions in Floww to identify where you can cut back next month."
                : "You still have room — but keep an eye on things. A quick check in Floww will show you what's driving the spending."}
            </p>

            <BrandFooter />
          </div>
        </Body>
      </Html>
    );
  }

  return null;
}