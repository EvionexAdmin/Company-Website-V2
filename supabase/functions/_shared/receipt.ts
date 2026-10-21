/**
 * Payment receipts.
 *
 * The mail provider is configured on the website project, so the receipt is
 * sent through the `send-payment-receipt` function of that project. The
 * website service key is used to authenticate the call.
 */

import { razorpayRequest } from "./subscription.ts"
import { seatDiscountPercent } from "./pricing.ts"

export interface ReceiptDetails {
  email: string
  name?: string | null
  plan: string
  planType: "monthly" | "yearly" | "lifetime"
  kind?: "subscription" | "lifetime"
  amount: number
  currency: string
  paidAt?: string | null
  periodEnd?: string | null
  nextBillingDate?: string | null
  paymentId?: string | null
  invoiceId?: string | null
  orderId?: string | null
  subscriptionId?: string | null
  couponCode?: string | null
  couponPercent?: number | null
  familyDiscountPercent?: number | null
  seats?: string[] | null
  receiptId?: string | null
}

/**
 * Sends the receipt. Never throws: a customer must not see a payment error
 * because the receipt could not be delivered.
 */
export async function sendPaymentReceipt(details: ReceiptDetails): Promise<boolean> {
  // The mail provider is configured on the website project, so the receipt is
  // sent through its function. The URL and the service key are secrets of this
  // project.
  const functionUrl = Deno.env.get("EVIONEX_RECEIPT_FUNCTION_URL")
  const serviceKey = Deno.env.get("EVIONEX_RECEIPT_SERVICE_KEY") || Deno.env.get("EVIONEX_WEBSITE_SERVICE_KEY")
  if (!functionUrl || !serviceKey) {
    console.error("[receipt] The receipt function is not configured.")
    return false
  }

  try {
    const response = await fetch(functionUrl, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${serviceKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(details),
    })

    if (!response.ok) {
      const detail = await response.text()
      console.error("[receipt] Could not send the receipt:", response.status, detail.slice(0, 200))
      return false
    }

    return true
  } catch (error) {
    console.error("[receipt] Could not send the receipt:", error)
    return false
  }
}

/** The plan name that is shown to the customer. */
export function planLabel(planType: "monthly" | "yearly" | "lifetime", seats = 0): string {
  const accounts = seats > 0 ? ` (${seats + 1} accounts)` : ""
  if (planType === "monthly") return `Evio Life Premium - Weekly, billed monthly${accounts}`
  if (planType === "yearly") return `Evio Life Premium - Yearly${accounts}`
  return `Evio Life Premium - Lifetime${accounts}`
}

/** True when a receipt was already sent for this reference. */
export async function receiptAlreadySent(
  db: any,
  reference: string,
): Promise<boolean> {
  const { data } = await db
    .from("payment_receipts")
    .select("id")
    .eq("reference", reference)
    .maybeSingle()
  return !!data
}

async function rememberReceipt(db: any, userId: string, reference: string, kind: string) {
  const { error } = await db.from("payment_receipts").insert({
    user_id: userId,
    reference,
    kind,
  })
  if (error) {
    console.error("[receipt] Could not remember the receipt:", error.message)
  }
}

/**
 * Sends the receipt for a subscription payment. The invoice is read from
 * Razorpay so the receipt shows what was actually charged.
 */
export async function sendSubscriptionReceipt(options: {
  db: any
  userId: string
  email: string
  name?: string | null
  subscriptionId: string
  paymentId?: string | null
  status: string
  periodEnd?: string | null
  planType: "monthly" | "yearly"
  couponCode?: string | null
  seats?: number
  seatEmails?: string[]
}) {
  const {
    db, userId, email, name, subscriptionId, paymentId, status, periodEnd,
    planType, couponCode, seats = 0, seatEmails = [],
  } = options

  let invoiceId: string | null = null
  let amount = 0
  let currency = "INR"

  try {
    const subscription = await razorpayRequest(`/subscriptions/${subscriptionId}`, undefined, "GET")
    currency = subscription?.currency || currency
    if (subscription?.plan_id) {
      const plan = await razorpayRequest(`/plans/${subscription.plan_id}`, undefined, "GET")
      amount = (plan?.item?.amount || 0) / 100
    }
    const invoices = await razorpayRequest(
      `/invoices?subscription_id=${subscriptionId}&type=subscription`,
      undefined,
      "GET",
    )
    const invoice = invoices?.items?.[0]
    if (invoice) {
      invoiceId = invoice.id
      if (invoice.amount_paid) amount = invoice.amount_paid / 100
    }
  } catch (invoiceError) {
    console.error("[receipt] Could not read the invoice:", invoiceError)
  }

  const reference = `${subscriptionId}:${invoiceId || paymentId || "first"}`
  if (await receiptAlreadySent(db, reference)) {
    console.log("[receipt] This payment already has a receipt.")
    return false
  }

  const sent = await sendPaymentReceipt({
    email,
    name,
    plan: planLabel(planType, seats),
    planType,
    kind: "subscription",
    amount,
    currency,
    paidAt: new Date().toISOString(),
    periodEnd,
    nextBillingDate: periodEnd,
    paymentId: paymentId || null,
    invoiceId,
    subscriptionId,
    couponCode: couponCode || null,
    familyDiscountPercent: seats > 0 ? seatDiscountPercent(seats) : 0,
    seats: seatEmails?.length ? seatEmails : null,
    receiptId: reference,
  })

  if (sent) await rememberReceipt(db, userId, reference, "subscription")
  return sent
}

/** Sends the receipt for a one-off payment (the lifetime plan). */
export async function sendOneOffReceipt(options: {
  db: any
  userId: string
  email: string
  name?: string | null
  orderId: string
  paymentId?: string | null
  amount: number
  currency: string
  planType: "lifetime"
  couponCode?: string | null
  seats?: number
  seatEmails?: string[]
  validUntil?: string | null
}) {
  const {
    db, userId, email, name, orderId, paymentId, amount, currency,
    planType, couponCode, seats = 0, seatEmails = [], validUntil = null,
  } = options

  const reference = `${orderId}:${paymentId || "payment"}`
  if (await receiptAlreadySent(db, reference)) {
    console.log("[receipt] This payment already has a receipt.")
    return false
  }

  const sent = await sendPaymentReceipt({
    email,
    name,
    plan: planLabel(planType, seats),
    planType,
    kind: "lifetime",
    amount,
    currency,
    paidAt: new Date().toISOString(),
    periodEnd: validUntil,
    nextBillingDate: null,
    paymentId: paymentId || null,
    orderId,
    couponCode: couponCode || null,
    familyDiscountPercent: seats > 0 ? seatDiscountPercent(seats) : 0,
    seats: seatEmails?.length ? seatEmails : null,
    receiptId: reference,
  })

  if (sent) await rememberReceipt(db, userId, reference, "lifetime")
  return sent
}
