-- Migration: 20261021000000_subscription_family_and_lifetime.sql
--
-- Adds the family plan (extra accounts that take 8% off the total, up to
-- 30%) and the one-off lifetime plan.

-- ---------------------------------------------------------------------------
-- The subscription itself
-- ---------------------------------------------------------------------------
alter table public.subscriptions
  add column if not exists seats integer not null default 0,
  add column if not exists seat_emails text[] not null default '{}';

alter table public.subscriptions
  drop constraint if exists subscriptions_plan_type_check;

alter table public.subscriptions
  add constraint subscriptions_plan_type_check
  check (plan_type in ('monthly', 'yearly', 'lifetime'));

-- ---------------------------------------------------------------------------
-- The extra accounts that are added to a plan
-- ---------------------------------------------------------------------------
create table if not exists public.subscription_seats (
  id uuid primary key default gen_random_uuid(),
  owner_user_id uuid not null references auth.users(id) on delete cascade,
  email text not null,
  status text not null default 'pending' check (status in ('pending', 'active', 'revoked')),
  created_at timestamptz not null default now(),
  unique (owner_user_id, email)
);

create index if not exists subscription_seats_email_idx
  on public.subscription_seats (lower(email));
create index if not exists subscription_seats_owner_idx
  on public.subscription_seats (owner_user_id);

alter table public.subscription_seats enable row level security;

drop policy if exists "Users can read their family accounts" on public.subscription_seats;
create policy "Users can read their family accounts"
  on public.subscription_seats for select to authenticated
  using (auth.uid() = owner_user_id or lower(email) = lower(coalesce(auth.jwt() ->> 'email', '')));

drop policy if exists "Users can add their family accounts" on public.subscription_seats;
create policy "Users can add their family accounts"
  on public.subscription_seats for insert to authenticated
  with check (auth.uid() = owner_user_id);

drop policy if exists "Users can update their family accounts" on public.subscription_seats;
create policy "Users can update their family accounts"
  on public.subscription_seats for update to authenticated
  using (auth.uid() = owner_user_id);

drop policy if exists "Users can remove their family accounts" on public.subscription_seats;
create policy "Users can remove their family accounts"
  on public.subscription_seats for delete to authenticated
  using (auth.uid() = owner_user_id);

-- ---------------------------------------------------------------------------
-- Pricing rules, shared by the checkout functions and the pricing screen
-- ---------------------------------------------------------------------------
create or replace function public.subscription_seat_discount_percent(p_seats integer)
returns integer
language sql
immutable
as $$
  select least(30, greatest(0, coalesce(p_seats, 0)) * 8);
$$;

create or replace function public.subscription_plan_amount(
  p_currency text,
  p_plan_type text,
  p_seats integer default 0
)
returns numeric
language sql
immutable
as $$
  with base as (
    select case
      when p_currency = 'INR' and p_plan_type = 'monthly' then 7800   -- 18 rupees a week, billed monthly
      when p_currency = 'INR' and p_plan_type = 'yearly' then 49900
      when p_currency = 'INR' and p_plan_type = 'lifetime' then 249500 -- worth five years
      when p_currency = 'USD' and p_plan_type = 'monthly' then 650
      when p_currency = 'USD' and p_plan_type = 'yearly' then 6300
      when p_currency = 'USD' and p_plan_type = 'lifetime' then 31500
      else null
    end as amount
  )
  select case
    when amount is null then null
    else round(amount * (1 - public.subscription_seat_discount_percent(p_seats) / 100.0))
  end
  from base;
$$;

-- ---------------------------------------------------------------------------
-- A helper the app can use to activate premium for an invited account
-- ---------------------------------------------------------------------------
create or replace function public.claim_subscription_seat(p_email text)
returns boolean
language plpgsql
security definer
set search_path = public
as $$
declare
  v_seat public.subscription_seats%rowtype;
  v_subscription public.subscriptions%rowtype;
  v_expiry timestamptz;
  v_user uuid;
begin
  if p_email is null or trim(p_email) = '' then
    return false;
  end if;

  select * into v_seat
  from public.subscription_seats s
  where lower(s.email) = lower(trim(p_email))
    and s.status = 'pending'
  order by s.created_at
  limit 1;

  if not found then
    return false;
  end if;

  -- The account has to exist already.
  select id into v_user from auth.users where lower(email) = lower(trim(p_email)) limit 1;
  if v_user is null then
    return false;
  end if;

  -- Use the owner's active subscription for the period.
  select * into v_subscription
  from public.subscriptions
  where user_id = v_seat.owner_user_id
    and status in ('authenticated', 'active')
  order by created_at desc
  limit 1;

  if not found then
    update public.subscription_seats set status = 'revoked' where id = v_seat.id;
    return false;
  end if;

  v_expiry := case
    when v_subscription.current_period_end is not null then v_subscription.current_period_end
    else now() + interval '1 year'
  end;

  update public.profiles
  set is_premium = true,
      subscription_tier = 'premium',
      subscription_expiry = v_expiry,
      premium_expires_at = v_expiry,
      updated_at = now()
  where id = v_user;

  update public.subscription_seats set status = 'active' where id = v_seat.id;

  return true;
end;
$$;

revoke all on function public.claim_subscription_seat(text) from public, anon;
grant execute on function public.claim_subscription_seat(text) to authenticated;
