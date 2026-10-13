import { getAdminClient, getAuthenticatedUser, handleOptions, jsonResponse, razorpayRequest } from "../_shared/subscription.ts"

Deno.serve(async (req: Request) => {
  const earlyResponse = handleOptions(req)
  if (earlyResponse) return earlyResponse

  try {
    const user = await getAuthenticatedUser(req)
    if (!user) return jsonResponse(req, { error: "Unauthorized" }, 401)

    const { subscriptionId } = await req.json()
    if (typeof subscriptionId !== "string" || !/^sub_[a-zA-Z0-9]+$/.test(subscriptionId)) {
      return jsonResponse(req, { error: "Invalid subscription." }, 400)
    }

    const db = getAdminClient()
    const { data: subscription, error: lookupError } = await db
      .from("subscriptions")
      .select("id, razorpay_subscription_id")
      .eq("user_id", user.id)
      .eq("razorpay_subscription_id", subscriptionId)
      .in("status", ["authenticated", "active"])
      .maybeSingle()
    if (lookupError) throw new Error("Unable to find your subscription.")
    if (!subscription) return jsonResponse(req, { error: "Active subscription not found." }, 404)

    const cancelled = await razorpayRequest(`/subscriptions/${subscriptionId}/cancel`, { cancel_at_cycle_end: 1 })
    const periodEnd = Number(cancelled.current_end)
    const cancelAt = Number.isFinite(periodEnd) && periodEnd > 0
      ? new Date(periodEnd * 1000).toISOString()
      : null
    const { error: updateError } = await db
      .from("subscriptions")
      .update({
        status: cancelled.status || "active",
        cancel_at_period_end: true,
        current_period_end: cancelAt,
        updated_at: new Date().toISOString(),
      })
      .eq("id", subscription.id)
    if (updateError) throw new Error("Cancellation was accepted, but subscription status could not be saved.")

    return jsonResponse(req, { success: true, cancelAt })
  } catch (error) {
    console.error("cancel-razorpay-subscription error", error)
    return jsonResponse(req, { success: false, error: error instanceof Error ? error.message : "Unable to cancel subscription." }, 500)
  }
})
