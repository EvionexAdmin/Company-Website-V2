-- Migration: Add subscriptions table
create table if not exists public.subscriptions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users not null,
  razorpay_subscription_id text not null unique,
  plan_name text not null,
  currency text not null,
  amount numeric not null,
  status text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- RLS
alter table public.subscriptions enable row level security;
create policy "Users can view their own subscriptions."
  on public.subscriptions for select
  using ( auth.uid() = user_id );

create policy "Users can update their own subscriptions."
  on public.subscriptions for update
  using ( auth.uid() = user_id );
