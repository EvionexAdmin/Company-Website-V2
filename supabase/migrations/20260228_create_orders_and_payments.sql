-- Migration: Create orders and payments tables for Razorpay integration
-- Run this in: Supabase Dashboard > SQL Editor

-- Orders table: stores Razorpay orders created via the API
CREATE TABLE IF NOT EXISTS public.orders (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  razorpay_order_id text UNIQUE NOT NULL,
  amount integer NOT NULL,
  currency text DEFAULT 'INR' NOT NULL,
  plan_name text NOT NULL,
  status text DEFAULT 'created' NOT NULL,
  customer_name text,
  customer_email text,
  receipt text UNIQUE NOT NULL,
  created_at timestamptz DEFAULT timezone('utc', now()) NOT NULL,
  updated_at timestamptz DEFAULT timezone('utc', now()) NOT NULL
);

ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

-- Payments table: stores payment verification results
CREATE TABLE IF NOT EXISTS public.payments (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  order_id uuid REFERENCES public.orders(id) ON DELETE SET NULL,
  razorpay_payment_id text NOT NULL,
  razorpay_order_id text NOT NULL,
  razorpay_signature text NOT NULL,
  verified boolean DEFAULT false NOT NULL,
  created_at timestamptz DEFAULT timezone('utc', now()) NOT NULL
);

ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;

-- Indexes for common lookups
CREATE INDEX IF NOT EXISTS idx_orders_razorpay_order_id ON public.orders(razorpay_order_id);
CREATE INDEX IF NOT EXISTS idx_orders_status ON public.orders(status);
CREATE INDEX IF NOT EXISTS idx_payments_razorpay_order_id ON public.payments(razorpay_order_id);
