# Subscription checkout setup

The checkout uses server-owned Razorpay plans and prices. The edge function creates and caches one Razorpay plan for each currency and billing period. Monthly billing is INR 52 / USD 6.50; yearly billing is INR 499 / USD 63.

## Deploy

1. Review and apply `migrations/20261013000000_subscription_checkout.sql` after confirming the existing `subscriptions` and `profiles` schemas.
2. Deploy `create-razorpay-subscription`, `validate-subscription-coupon`, `verify-razorpay-subscription`, `cancel-razorpay-subscription`, and `razorpay-webhook`. The webhook keeps the existing Razorpay webhook URL.
3. Configure `RAZORPAY_KEY_ID`, `RAZORPAY_KEY_SECRET`, `RAZORPAY_WEBHOOK_SECRET`, `SUPABASE_URL`, `SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`, and `ALLOWED_ORIGIN` as Supabase Function secrets. Never place secret values in source control.
4. Confirm the existing Razorpay webhook URL still points to `/functions/v1/razorpay-webhook` and enable `subscription.activated`, `subscription.charged`, `subscription.halted`, `subscription.cancelled`, and `subscription.completed`.

Razorpay requires `total_count` when creating a subscription. This checkout currently creates subscriptions for up to 100 billing cycles; the user can cancel earlier from the subscription page.

## Coupon offers

Coupons are checked against active entries in `public.promo_codes`. Only percentage discounts of exactly 30% or 50% are accepted, and coupon redemption is INR-only. Usage counts increment once after the first subscription payment is confirmed. Create a Razorpay Subscription Offer for each applicable plan/discount in the Razorpay Dashboard and configure that offer as a single-use/first-cycle offer.

Add the corresponding Offer IDs to Supabase Function secrets:

- `RAZORPAY_OFFER_INR_MONTHLY_30`
- `RAZORPAY_OFFER_INR_MONTHLY_50`
- `RAZORPAY_OFFER_INR_YEARLY_30`
- `RAZORPAY_OFFER_INR_YEARLY_50`

The matching offer must be enabled for the relevant plan and payment methods. The checkout refuses to apply a coupon if its offer ID is missing. Razorpay documents subscription offers as available in India only.
