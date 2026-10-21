-- Migration: 20261021020000_subscription_regular_plan.sql
--
-- When a coupon is used, the first cycle is cheaper. The plan that takes
-- over from the second cycle is stored here.

alter table public.subscriptions
  add column if not exists regular_plan_id text;

-- The coupon offers are no longer used: the first cycle is a separate plan.
drop table if exists public.razorpay_coupon_offers;
