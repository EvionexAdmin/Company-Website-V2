-- Migration: Add RLS policies to orders and payments tables
-- These tables had RLS enabled but zero policies, making them inaccessible
-- via the client but also unprotected if the anon key is ever used directly.

-- ============================================================
-- ORDERS: Only admins/employees can read; service role writes
-- ============================================================

-- Admins and employees can view all orders
CREATE POLICY orders_select_admin_employee ON public.orders
    FOR SELECT TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM public.evionex_profiles
            WHERE id = auth.uid()
              AND account_status = 'active'
              AND (sub_role = 'admin' OR role = 'employee')
        )
    );

-- Patients can view their own orders (matched by customer_email)
CREATE POLICY orders_select_own ON public.orders
    FOR SELECT TO authenticated
    USING (
        customer_email = (
            SELECT email FROM public.evionex_profiles WHERE id = auth.uid()
        )
    );

-- No INSERT/UPDATE/DELETE via client — orders are created by service role in Edge Functions only.
-- This is enforced by having no INSERT/UPDATE/DELETE policies.

-- ============================================================
-- PAYMENTS: Only admins can read; service role writes
-- ============================================================

-- Admins can view all payment records
CREATE POLICY payments_select_admin ON public.payments
    FOR SELECT TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM public.evionex_profiles
            WHERE id = auth.uid()
              AND account_status = 'active'
              AND sub_role = 'admin'
        )
    );

-- No INSERT/UPDATE/DELETE via client — payments are recorded by service role in Edge Functions only.
