alter table public.subscriptions
  add column if not exists plan_name text not null default 'premium_monthly',
  add column if not exists amount numeric not null default 0,
  add column if not exists coupon_code text,
  add column if not exists cancel_at_period_end boolean not null default false,
  add column if not exists plan_type text not null default 'monthly';

alter table public.subscriptions
  drop constraint if exists subscriptions_plan_type_check;

update public.subscriptions
set plan_type = 'monthly'
where plan_type in (
  'premium_inr',
  'premium_inr_discounted',
  'premium_usd',
  'premium_usd_discounted'
);

alter table public.subscriptions
  add constraint subscriptions_plan_type_check
  check (plan_type in ('monthly', 'yearly'));

alter table public.subscriptions
  drop constraint if exists subscriptions_status_check;

alter table public.subscriptions
  add constraint subscriptions_status_check
  check (status in ('pending', 'created', 'authenticated', 'active', 'paused', 'halted', 'cancelled', 'completed', 'expired', 'failed'));

drop policy if exists "Users can update their own subscriptions." on public.subscriptions;

create table if not exists public.razorpay_subscription_plans (
  plan_key text primary key,
  razorpay_plan_id text not null unique,
  created_at timestamptz not null default now()
);

alter table public.razorpay_subscription_plans enable row level security;

create table if not exists public.subscription_coupon_redemptions (
  razorpay_subscription_id text primary key,
  coupon_code text not null,
  redeemed_at timestamptz not null default now()
);

alter table public.subscription_coupon_redemptions enable row level security;

create or replace function public.record_subscription_coupon_redemption(p_code text, p_subscription_id text)
returns boolean
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  inserted_rows integer;
begin
  insert into public.subscription_coupon_redemptions (razorpay_subscription_id, coupon_code)
  values (p_subscription_id, upper(trim(p_code)))
  on conflict (razorpay_subscription_id) do nothing;

  get diagnostics inserted_rows = row_count;
  if inserted_rows = 0 then
    return true;
  end if;

  update public.promo_codes
  set current_uses = coalesce(current_uses, 0) + 1
  where code = upper(trim(p_code))
    and active = true
    and (max_uses is null or coalesce(current_uses, 0) < max_uses);

  if not found then
    raise exception 'Coupon is inactive or its usage limit has been reached.';
  end if;
  return true;
end;
$$;

revoke all on function public.record_subscription_coupon_redemption(text, text) from public, anon, authenticated;
grant execute on function public.record_subscription_coupon_redemption(text, text) to service_role;
