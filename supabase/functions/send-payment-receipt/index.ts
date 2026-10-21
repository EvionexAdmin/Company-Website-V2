// Sends the payment receipt to the customer.
//
// The Evio Life app and the website share one Supabase project, but only the
// website project has a mail provider configured, so the payment functions
// call this function with the website service key.
//
// Required secrets:
//   SUPABASE_SERVICE_ROLE_KEY  (used to authenticate the caller)
//   RESEND_API_KEY
//
// The caller is authenticated with the service role key, so a receipt can
// only be requested from the server.

import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const CORS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

const DEFAULT_FROM = "Evio Life <receipts@evionex.com>";
const PORTAL_URL = "https://www.evionex.com/#/portal/dashboard";
const SUPPORT_EMAIL = "support@evionex.com";

interface ReceiptPayload {
  to: string;
  name?: string | null;
  plan: string;
  planType: "monthly" | "yearly" | "lifetime";
  kind?: "subscription" | "lifetime";
  amount: number;
  currency: string;
  paidAt?: string | null;
  periodEnd?: string | null;
  nextBillingDate?: string | null;
  paymentId?: string | null;
  invoiceId?: string | null;
  orderId?: string | null;
  subscriptionId?: string | null;
  couponCode?: string | null;
  couponPercent?: number | null;
  familyDiscountPercent?: number | null;
  seats?: string[] | null;
  receiptId?: string | null;
}

function json(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...CORS, "Content-Type": "application/json" },
  });
}

function escapeHtml(value: unknown): string {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function formatMoney(currency: string, amount: number): string {
  const value = Number(amount) || 0;
  try {
    return new Intl.NumberFormat(currency === "INR" ? "en-IN" : "en-US", {
      style: "currency",
      currency,
      minimumFractionDigits: 2,
    }).format(value);
  } catch {
    return `${currency} ${value.toFixed(2)}`;
  }
}

function formatDate(value?: string | null): string {
  if (!value) return "-";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "-";
  return date.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
}

function buildRows(receipt: ReceiptPayload): Array<[string, string]> {
  const rows: Array<[string, string]> = [
    ["Plan", receipt.plan],
    ["Amount paid", formatMoney(receipt.currency, receipt.amount)],
    ["Payment date", formatDate(receipt.paidAt)],
  ];

  if (receipt.kind !== "lifetime") {
    rows.push(["Renews on", formatDate(receipt.nextBillingDate || receipt.periodEnd)]);
    rows.push(["Access until", formatDate(receipt.periodEnd)]);
  } else {
    rows.push(["Valid until", formatDate(receipt.periodEnd)]);
  }

  if (receipt.couponCode) {
    rows.push([
      "Coupon",
      `${receipt.couponCode}${receipt.couponPercent ? ` (${receipt.couponPercent}% off the first cycle)` : ""}`,
    ]);
  }
  if (receipt.familyDiscountPercent) {
    rows.push(["Family discount", `${receipt.familyDiscountPercent}% off`]);
  }
  if (receipt.seats?.length) {
    rows.push(["Family accounts", receipt.seats.join(", ")]);
  }
  if (receipt.paymentId) rows.push(["Payment id", receipt.paymentId]);
  if (receipt.invoiceId) rows.push(["Invoice id", receipt.invoiceId]);
  if (receipt.orderId) rows.push(["Order id", receipt.orderId]);
  if (receipt.subscriptionId) rows.push(["Subscription id", receipt.subscriptionId]);
  if (receipt.receiptId) rows.push(["Receipt id", receipt.receiptId]);

  return rows;
}

function buildEmail(receipt: ReceiptPayload) {
  const rows = buildRows(receipt);
  const name = receipt.name ? escapeHtml(receipt.name) : "there";
  const subject = receipt.kind === "lifetime"
    ? "Your Evio Life lifetime plan is active"
    : `Payment confirmed - Evio Life Premium`;

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${escapeHtml(subject)}</title>
</head>
<body style="margin: 0; padding: 0; background-color: #0b0f17; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; -webkit-font-smoothing: antialiased;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #0b0f17; padding: 40px 15px;">
    <tr>
      <td align="center">
        <table width="100%" max-width="580" cellpadding="0" cellspacing="0" style="max-width: 580px; width: 100%; background-color: #131926; border: 1px solid #1f293d; border-radius: 24px; overflow: hidden;">
          <tr>
            <td style="padding: 36px 40px 22px 40px; text-align: center; background: linear-gradient(180deg, rgba(13, 148, 136, 0.16) 0%, rgba(19, 25, 38, 0) 100%);">
              <div style="display: inline-block; padding: 6px 16px; background-color: rgba(13, 148, 136, 0.2); border: 1px solid rgba(13, 148, 136, 0.4); border-radius: 50px; margin-bottom: 14px;">
                <span style="color: #2dd4bf; font-size: 11px; font-weight: 800; letter-spacing: 1.5px; text-transform: uppercase;">Evio Life</span>
              </div>
              <h1 style="margin: 0; color: #ffffff; font-size: 24px; font-weight: 800;">Payment confirmed</h1>
              <p style="margin: 8px 0 0 0; color: #94a3b8; font-size: 14px; line-height: 1.6;">
                Thank you${receipt.name ? `, ${escapeHtml(receipt.name)}` : ""}. Your Evio Life Premium is active.
              </p>
            </td>
          </tr>

          <tr>
            <td style="padding: 10px 40px 8px 40px;">
              <table width="100%" cellpadding="0" cellspacing="0">
                ${rows
                  .map(
                    ([label, value]) => `<tr>
                  <td style="padding: 12px 0; border-bottom: 1px solid #1f293d; color: #94a3b8; font-size: 13px; width: 45%; vertical-align: top;">${escapeHtml(label)}</td>
                  <td style="padding: 12px 0; border-bottom: 1px solid #1f293d; color: #f8fafc; font-size: 14px; font-weight: 600; text-align: right;">${escapeHtml(value)}</td>
                </tr>`,
                  )
                  .join("\n                ")}
              </table>
            </td>
          </tr>

          <tr>
            <td style="padding: 26px 40px 34px 40px; text-align: center;">
              <a href="${PORTAL_URL}" style="display: inline-block; background: linear-gradient(135deg, #0d9488 0%, #0891b2 100%); color: #ffffff; text-decoration: none; font-size: 15px; font-weight: 700; padding: 14px 34px; border-radius: 14px; box-shadow: 0 10px 25px rgba(13, 148, 136, 0.35);">
                Open Evio Life
              </a>
              <p style="margin: 22px 0 0 0; color: #64748b; font-size: 12px; line-height: 1.6;">
                Questions about this payment? Reply to this email or write to
                <a href="mailto:${SUPPORT_EMAIL}" style="color: #2dd4bf; text-decoration: underline;">${SUPPORT_EMAIL}</a>.
              </p>
              <p style="margin: 10px 0 0 0; color: #475569; font-size: 11px;">
                This receipt confirms the payment above. Prices include applicable taxes.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;

  const text = [
    `Payment confirmed - Evio Life`,
    ``,
    receipt.name ? `Hello ${receipt.name},` : `Hello,`,
    `Your Evio Life Premium is active.`,
    ``,
    ...rows.map(([label, value]) => `${label}: ${value}`),
    ``,
    `Open Evio Life: ${PORTAL_URL}`,
    `Questions? ${SUPPORT_EMAIL}`,
  ].join("\n");

  return { subject, html, text };
}

function isServiceRoleToken(token: string): boolean {
  try {
    const payload = token.split(".")[1];
    if (!payload) return false;
    const normalized = payload.replace(/-/g, "+").replace(/_/g, "/");
    const json = JSON.parse(atob(normalized));
    return json?.role === "service_role";
  } catch {
    return false;
  }
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: CORS });
  if (req.method !== "POST") return json({ error: "Method not allowed" }, 405);

  try {
    // Only the server (with a service role key) may send a receipt.
    const authorization = req.headers.get("Authorization") || "";
    const token = authorization.startsWith("Bearer ") ? authorization.slice(7) : "";
    if (!token || !isServiceRoleToken(token)) {
      return json({ error: "Unauthorized" }, 401);
    }

    const receipt = (await req.json()) as ReceiptPayload;
    const recipient = String(receipt?.to || receipt?.email || "").trim();
    if (!recipient || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(recipient)) {
      return json({ error: "A valid recipient address is required." }, 400);
    }

    const apiKey = Deno.env.get("RESEND_API_KEY");
    if (!apiKey) {
      console.error("[send-payment-receipt] RESEND_API_KEY is not set");
      return json({ error: "Email service is not configured" }, 500);
    }

    const fromEmail = Deno.env.get("RECEIPT_FROM_EMAIL") || DEFAULT_FROM;
    const { subject, html, text } = buildEmail(receipt);

    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: fromEmail,
        to: [recipient],
        subject,
        html,
        text,
      }),
    });

    if (!res.ok) {
      const detail = await res.text();
      console.error("[send-payment-receipt] Resend error:", res.status, detail);
      return json({ error: "Failed to send the receipt", detail }, 502);
    }

    const sent = await res.json();
    return json({ ok: true, id: sent?.id || null });
  } catch (error) {
    console.error("[send-payment-receipt] error", error);
    return json({ error: error instanceof Error ? error.message : "Unable to send the receipt." }, 500);
  }
});
