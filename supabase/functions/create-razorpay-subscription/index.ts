import { getAdminClient, getAuthenticatedUser, getRazorpayCredentials, handleOptions, jsonResponse, razorpayRequest, resolveCoupon } from "../_shared/subscription.ts"
import {
  isCurrency,
  isPlanType,
  normalizeSeatCount,
  normalizeSeatEmails,
  planKeyFor,
  resolveFirstCycleAmount,
  resolvePriceBreakdown,
  resolvePlanAmount,
} from "../_shared/pricing.ts"

const PLAN_LABEL: Record<string, string> = {
  monthly: "Weekly (billed monthly)",
  yearly: "Yearly",
}

Deno.serve(async (req: Request) => {
  const earlyResponse = handleOptions(req)
  if (earlyResponse) return earlyResponse

  try {
    const user = await getAuthenticatedUser(req)
    if (!user) return jsonResponse(req, { error: "Unauthorized" }, 401)

    const { currency, planType, couponCode, seats, seatEmails, changePlan } = await req.json()
    if (!isCurrency(currency) || !isPlanType(planType) || planType === "lifetime") {
      return jsonResponse(req, { error: "Invalid subscription plan." }, 400)
    }

    const invitedEmails = normalizeSeatEmails(seatEmails, user.email)
    // The number of seats is derived from the validated emails, never trusted
    // from the client, so the price always matches the invited accounts.
    const extraSeats = normalizeSeatCount(Math.max(normalizeSeatCount(seats), invitedEmails.length))

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
      .select("id, razorpay_subscription_id")
      .eq("user_id", user.id)
      .in("status", ["authenticated", "active"])
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle()
    if (existingError) throw new Error("Unable to check existing subscription.")

    if (existingSubscription) {
      // An existing premium subscriber may change plan (for example to a
      // family plan or to yearly). Their current subscription is ended at
      // the cycle end so nothing is charged twice.
      if (changePlan !== true) {
        return jsonResponse(req, { error: "already_subscribed" }, 409)
      }
      const existingId = String(existingSubscription.razorpay_subscription_id || "")
      if (/^sub_[a-zA-Z0-9]+$/.test(existingId)) {
        try {
          const cancelled = await razorpayRequest(`/subscriptions/${existingId}/cancel`, { cancel_at_cycle_end: 1 })
          const periodEnd = Number(cancelled.current_end)
          await db
            .from("subscriptions")
            .update({
              status: cancelled.status || "active",
              cancel_at_period_end: true,
              current_period_end: Number.isFinite(periodEnd) && periodEnd > 0
                ? new Date(periodEnd * 1000).toISOString()
                : null,
              updated_at: new Date().toISOString(),
            })
            .eq("id", existingSubscription.id)
        } catch (changeError) {
          console.error("Could not end the previous subscription at cycle end", changeError)
          throw new Error("Unable to change your current plan. Please cancel it first and try again.")
        }
      }
    }

    const discountPercent = coupon?.discountPercent || 0
    const breakdown = resolvePriceBreakdown(currency, planType, extraSeats)
    // The amount is always worked out on the server, never taken from the client.
    const amount = discountPercent > 0
      ? resolveFirstCycleAmount(currency, planType, extraSeats, discountPercent)
      : resolvePlanAmount(currency, planType, extraSeats)

    const { keyId } = getRazorpayCredentials()

    // A coupon makes the first cycle cheaper. The regular price is applied
    // from the second cycle onwards with a plan change.
    const planKey = planKeyFor(currency, planType, extraSeats, discountPercent)
    const planId = await getOrCreatePlan(db, {
      planKey,
      name: `Evio Life Premium ${PLAN_LABEL[planType] ?? planType}${extraSeats ? ` (${extraSeats + 1} accounts)` : ""}${discountPercent ? ` — ${discountPercent}% off the first cycle` : ""}`,
      description: `Evio Life Premium ${PLAN_LABEL[planType] ?? planType} subscription`,
      period: planType,
      amount,
      currency,
    })

    // The plan that takes over once the first cycle is done.
    let regularPlanId: string | null = null
    if (discountPercent > 0) {
      const regularKey = planKeyFor(currency, planType, extraSeats)
      regularPlanId = await getOrCreatePlan(db, {
        planKey: regularKey,
        name: `Evio Life Premium ${PLAN_LABEL[planType] ?? planType}${extraSeats ? ` (${extraSeats + 1} accounts)` : ""}`,
        description: `Evio Life Premium ${PLAN_LABEL[planType] ?? planType} subscription`,
        period: planType,
        amount: resolvePlanAmount(currency, planType, extraSeats),
        currency,
      })
    }

    const subscription = await razorpayRequest("/subscriptions", {
      plan_id: planId,
      total_count: 100,
      quantity: 1,
      customer_notify: true,
      notes: {
        user_id: user.id,
        plan_type: planType,
        currency,
        coupon_code: coupon?.code || "",
        seats: String(extraSeats),
      },
    })

    const { error: insertError } = await db.from("subscriptions").insert({
      user_id: user.id,
      razorpay_subscription_id: subscription.id,
      plan_id: planId,
      regular_plan_id: regularPlanId,
      plan_name: `premium_${planType}`,
      plan_type: planType,
      currency,
      amount: amount / 100,
      seats: extraSeats,
      seat_emails: invitedEmails,
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

    // The extra accounts are invited as soon as the subscription is created.
    if (invitedEmails.length) {
      const { error: seatError } = await db.from("subscription_seats").upsert(
        invitedEmails.map((email) => ({
          owner_user_id: user.id,
          email,
          status: "pending",
        })),
        { onConflict: "owner_user_id,email" },
      )
      if (seatError) console.error("Could not save the family accounts", seatError.message)
    }

    return jsonResponse(req, {
      subscription_id: subscription.id,
      key_id: keyId,
      amount,
      currency,
      seats: extraSeats,
      breakdown: {
        baseAmount: breakdown.baseAmount,
        discountAmount: breakdown.discountAmount,
        totalAmount: breakdown.totalAmount,
        discountPercent: breakdown.discountPercent,
      },
    })
  } catch (error) {
    console.error("create-razorpay-subscription error", error)
    return jsonResponse(req, { error: error instanceof Error ? error.message : "Unable to create subscription." }, 500)
  }
})

/** Returns the Razorpay plan for a plan key, creating it when it is new. */
async function getOrCreatePlan(
  db: ReturnType<typeof getAdminClient>,
  options: { planKey: string; name: string; description: string; period: string; amount: number; currency: string },
) {
  const { data: cached, error: planReadError } = await db
    .from("razorpay_subscription_plans")
    .select("razorpay_plan_id")
    .eq("plan_key", options.planKey)
    .maybeSingle()
  if (planReadError) throw new Error("Subscription plan configuration is unavailable.")

  if (cached?.razorpay_plan_id) return cached.razorpay_plan_id

  const createdPlan = await razorpayRequest("/plans", {
    period: options.period,
    interval: 1,
    item: {
      name: options.name,
      amount: options.amount,
      currency: options.currency,
      description: options.description,
    },
  })

  const { error: planWriteError } = await db
    .from("razorpay_subscription_plans")
    .upsert({ plan_key: options.planKey, razorpay_plan_id: createdPlan.id }, { onConflict: "plan_key" })
  if (planWriteError) throw new Error("Could not save the subscription plan configuration.")

  return createdPlan.id
}
