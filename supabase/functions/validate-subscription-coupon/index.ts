import { getAuthenticatedUser, handleOptions, jsonResponse, resolveCoupon, resolveCouponPercent } from "../_shared/subscription.ts"

Deno.serve(async (req: Request) => {
  const earlyResponse = handleOptions(req)
  if (earlyResponse) return earlyResponse

  try {
    const user = await getAuthenticatedUser(req)
    if (!user) return jsonResponse(req, { error: "Unauthorized" }, 401)

    const { code, currency, planType } = await req.json()
    if (currency !== "INR") {
      return jsonResponse(req, { valid: false, error: "Coupons are available for INR subscriptions only." })
    }
    if (!["monthly", "yearly", "lifetime"].includes(planType) || typeof code !== "string") {
      return jsonResponse(req, { valid: false, error: "Invalid coupon request." }, 400)
    }

    // The lifetime plan is a one-off payment, so the coupon is applied to
    // the order amount instead of through a Razorpay offer.
    if (planType === "lifetime") {
      const coupon = await resolveCouponPercent(code)
      if (!coupon) return jsonResponse(req, { valid: false, error: "Coupon is invalid, expired, or unavailable." })
      return jsonResponse(req, { valid: true, code: coupon.code, discountPercent: coupon.discountPercent })
    }

    const coupon = await resolveCoupon(code, planType)
    if (!coupon) return jsonResponse(req, { valid: false, error: "Coupon is invalid, expired, or unavailable." })
    return jsonResponse(req, { valid: true, code: coupon.code, discountPercent: coupon.discountPercent })  } catch (error) {
    console.error("validate-subscription-coupon error", error)
    return jsonResponse(req, { valid: false, error: error instanceof Error ? error.message : "Unable to validate coupon." }, 500)
  }
})
