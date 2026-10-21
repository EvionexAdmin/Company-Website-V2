-- Migration: 20261021040000_payment_receipts.sql
--
-- Keeps track of the payment receipts that were sent, so a customer never
-- receives the same receipt twice.

create table if not exists public.payment_receipts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  reference text not null unique,
  kind text not null default 'subscription' check (kind in ('subscription', 'lifetime')),
  sent_at timestamptz not null default now()
);

create index if not exists payment_receipts_user_idx
  on public.payment_receipts (user_id, sent_at desc);

alter table public.payment_receipts enable row level security;

drop policy if exists "Users can read their receipts" on public.payment_receipts;
create policy "Users can read their receipts"
  on public.payment_receipts for select to authenticated
  using (auth.uid() = user_id);
