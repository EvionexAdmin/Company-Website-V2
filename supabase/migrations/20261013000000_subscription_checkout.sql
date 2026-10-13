alter table public.subscriptions
  add column if not exists plan_type text not null default 'monthly',
  add column if not exists coupon_code text,
  add column if not exists razorpay_payment_id text,
  add column if not exists current_period_end timestamptz,
  add column if not exists cancel_at_period_end boolean not null default false,
  add column if not exists updated_at timestamptz not null default now();

alter table public.subscriptions
  drop constraint if exists subscriptions_plan_type_check;

alter table public.subscriptions
  add constraint subscriptions_plan_type_check
  check (plan_type in ('monthly', 'yearly'));

drop policy if exists "Users can update their own subscriptions." on public.subscriptions;

create table if not exists public.razorpay_subscription_plans (
  plan_key text primary key,
  razorpay_plan_id text not null unique,
  created_at timestamptz not null default now()
);

alter table public.razorpay_subscription_plans enable row level security;
