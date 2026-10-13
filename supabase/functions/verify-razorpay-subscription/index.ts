import { getAdminClient, getAuthenticatedUser, getRazorpayCredentials, handleOptions, hmacHex, jsonResponse, razorpayRequest, constantTimeEqual } from "../_shared/subscription.ts"

Deno.serve(async (req: Request) => {
  const earlyResponse = handleOptions(req)
  if (earlyResponse) return earlyResponse

  try {
    const user = await getAuthenticatedUser(req)
    if (!user) return jsonResponse(req, { error: "Unauthorized" }, 401)

    const { razorpay_payment_id: paymentId, razorpay_subscription_id: subscriptionId, razorpay_signature: signature } = await req.json()
    if (
      typeof paymentId !== "string" ||
      typeof subscriptionId !== "string" ||
      typeof signature !== "string"
    ) {
      return jsonResponse(req, { success: false, error: "Invalid payment verification details." }, 400)
    }

    const db = getAdminClient()
    const { data: localSubscription, error: lookupError } = await db
      .from("subscriptions")
      .select("id, user_id")
      .eq("razorpay_subscription_id", subscriptionId)
      .eq("user_id", user.id)
      .maybeSingle()
    if (lookupError) throw new Error("Unable to verify subscription ownership.")
    if (!localSubscription) return jsonResponse(req, { success: false, error: "Subscription not found." }, 404)

    const { keySecret } = getRazorpayCredentials()
    const expectedSignature = await hmacHex(`${paymentId}|${subscriptionId}`, keySecret)
    if (!constantTimeEqual(expectedSignature, signature)) {
      return jsonResponse(req, { success: false, error: "Payment signature is invalid." }, 400)
    }

    const razorpaySubscription = await razorpayRequest(`/subscriptions/${subscriptionId}`, undefined, "GET")
    const periodEnd = Number(razorpaySubscription.current_end)
    const updates = {
      status: razorpaySubscription.status,
      razorpay_payment_id: paymentId,
      current_period_end: Number.isFinite(periodEnd) && periodEnd > 0 ? new Date(periodEnd * 1000).toISOString() : null,
      updated_at: new Date().toISOString(),
    }
    const { error: updateError } = await db
      .from("subscriptions")
      .update(updates)
      .eq("id", localSubscription.id)
    if (updateError) throw new Error("Unable to save subscription verification.")

    if (razorpaySubscription.status === "active") {
      const { error: profileError } = await db
        .from("profiles")
        .update({
          is_premium: true,
          subscription_tier: "premium",
          subscription_expiry: updates.current_period_end,
          updated_at: new Date().toISOString(),
        })
        .eq("id", user.id)
      if (profileError) throw new Error("Payment verified, but premium access could not be activated.")
    }

    return jsonResponse(req, { success: true, status: razorpaySubscription.status })
  } catch (error) {
    console.error("verify-razorpay-subscription error", error)
    return jsonResponse(req, { success: false, error: error instanceof Error ? error.message : "Payment verification failed." }, 500)
  }
})
