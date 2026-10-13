import { getAdminClient, getAuthenticatedUser, getRazorpayCredentials, handleOptions, jsonResponse, razorpayRequest, resolveCoupon } from "../_shared/subscription.ts"

const PRICES = {
  INR: { monthly: 5200, yearly: 49900 },
  USD: { monthly: 650, yearly: 6300 },
}

Deno.serve(async (req: Request) => {
  const earlyResponse = handleOptions(req)
  if (earlyResponse) return earlyResponse

  try {
    const user = await getAuthenticatedUser(req)
    if (!user) return jsonResponse(req, { error: "Unauthorized" }, 401)

    const { currency, planType, couponCode } = await req.json()
    if (!["INR", "USD"].includes(currency) || !["monthly", "yearly"].includes(planType)) {
      return jsonResponse(req, { error: "Invalid subscription plan." }, 400)
    }

    let coupon: Awaited<ReturnType<typeof resolveCoupon>> = null
    if (couponCode) {
      if (currency !== "INR" || typeof couponCode !== "string") {
        return jsonResponse(req, { error: "Coupons are available for INR subscriptions only." }, 400)
      }
      coupon = await resolveCoupon(couponCode, planType)
      if (!coupon) return jsonResponse(req, { error: "Coupon is invalid, expired, or unavailable." }, 400)
    }

    const db = getAdminClient()
    const { data: existingSubscription, error: existingError } = await db
      .from("subscriptions")
      .select("status")
      .eq("user_id", user.id)
      .in("status", ["authenticated", "active"])
      .limit(1)
      .maybeSingle()
    if (existingError) throw new Error("Unable to check existing subscription.")
    if (existingSubscription) {
      return jsonResponse(req, { error: "already_subscribed" }, 409)
    }

    const planKey = `${currency}_${planType}`
    const { data: cachedPlan, error: planReadError } = await db
      .from("razorpay_subscription_plans")
      .select("razorpay_plan_id")
      .eq("plan_key", planKey)
      .maybeSingle()
    if (planReadError) throw new Error("Subscription plan configuration is unavailable.")

    let planId = cachedPlan?.razorpay_plan_id
    if (!planId) {
      const createdPlan = await razorpayRequest("/plans", {
        period: planType,
        interval: 1,
        item: {
          name: `Eviolife Premium ${planType}`,
          amount: PRICES[currency as keyof typeof PRICES][planType as "monthly" | "yearly"],
          currency,
          description: `Eviolife Premium ${planType} subscription`,
        },
      })
      planId = createdPlan.id
      const { error: planWriteError } = await db
        .from("razorpay_subscription_plans")
        .upsert({ plan_key: planKey, razorpay_plan_id: planId }, { onConflict: "plan_key" })
      if (planWriteError) throw new Error("Could not save the subscription plan configuration.")
    }

    const { keyId } = getRazorpayCredentials()
    const subscription = await razorpayRequest("/subscriptions", {
      plan_id: planId,
      total_count: 100,
      quantity: 1,
      customer_notify: true,
      ...(coupon ? { offer_id: coupon.offerId } : {}),
      notes: { user_id: user.id, plan_type: planType, currency, coupon_code: coupon?.code || "" },
    })

    const { error: insertError } = await db.from("subscriptions").insert({
      user_id: user.id,
      razorpay_subscription_id: subscription.id,
      plan_id: planId,
      plan_name: `premium_${planType}`,
      plan_type: planType,
      currency,
      amount: PRICES[currency as keyof typeof PRICES][planType as "monthly" | "yearly"] / 100,
      status: subscription.status || "created",
      coupon_code: coupon?.code || null,
    })
    if (insertError) {
      console.error("Subscription persistence failed", insertError.message)
      await razorpayRequest(`/subscriptions/${subscription.id}/cancel`, { cancel_at_cycle_end: 0 }).catch((cancelError) => {
        console.error("Could not cancel unpersisted Razorpay subscription", cancelError)
      })
      throw new Error("Unable to save your subscription. Please try again.")
    }

    return jsonResponse(req, { subscription_id: subscription.id, key_id: keyId })
  } catch (error) {
    console.error("create-razorpay-subscription error", error)
    return jsonResponse(req, { error: error instanceof Error ? error.message : "Unable to create subscription." }, 500)
  }
})
