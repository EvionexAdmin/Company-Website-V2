import { constantTimeEqual, getAdminClient, hmacHex, jsonResponse } from "../_shared/subscription.ts"

Deno.serve(async (req: Request) => {
  if (req.method !== "POST") return jsonResponse(req, { error: "Method not allowed" }, 405)
  try {
    const webhookSecret = Deno.env.get("RAZORPAY_WEBHOOK_SECRET")
    const signature = req.headers.get("x-razorpay-signature")
    if (!webhookSecret || !signature) {
      return jsonResponse(req, { error: "Webhook signature configuration is missing." }, 400)
    }

    const rawBody = await req.text()
    const expectedSignature = await hmacHex(rawBody, webhookSecret)
    if (!constantTimeEqual(expectedSignature, signature)) {
      return jsonResponse(req, { error: "Invalid webhook signature." }, 400)
    }

    const event = JSON.parse(rawBody)
    const entity = event?.payload?.subscription?.entity
    const subscriptionId = entity?.id
    if (typeof subscriptionId !== "string" || !event?.event?.startsWith("subscription.")) {
      return jsonResponse(req, { received: true })
    }

    const db = getAdminClient()
    const status = String(entity.status || "unknown")
    const periodEnd = Number(entity.current_end)
    const { data: subscription, error: updateError } = await db
      .from("subscriptions")
      .update({
        status,
        current_period_end: Number.isFinite(periodEnd) && periodEnd > 0 ? new Date(periodEnd * 1000).toISOString() : null,
        updated_at: new Date().toISOString(),
      })
      .eq("razorpay_subscription_id", subscriptionId)
      .select("user_id, coupon_code")
      .maybeSingle()
    if (updateError) throw updateError
    if (!subscription) return jsonResponse(req, { error: "Subscription record not found." }, 404)

    if (status === "active") {
      const { error: profileError } = await db
        .from("profiles")
        .update({ is_premium: true, subscription_tier: "premium" })
        .eq("id", subscription.user_id)
      if (profileError) throw profileError
    } else if (["cancelled", "completed", "halted"].includes(status)) {
      const { error: profileError } = await db
        .from("profiles")
        .update({ is_premium: false, subscription_tier: "free" })
        .eq("id", subscription.user_id)
      if (profileError) throw profileError
    }

    if (subscription.coupon_code && ["subscription.activated", "subscription.charged"].includes(event.event)) {
      const { error: redemptionError } = await db.rpc("record_subscription_coupon_redemption", {
        p_code: subscription.coupon_code,
        p_subscription_id: subscriptionId,
      })
      if (redemptionError) throw redemptionError
    }

    return jsonResponse(req, { received: true })
  } catch (error) {
    console.error("razorpay-subscription-webhook error", error)
    return jsonResponse(req, { error: "Webhook processing failed." }, 500)
  }
})
