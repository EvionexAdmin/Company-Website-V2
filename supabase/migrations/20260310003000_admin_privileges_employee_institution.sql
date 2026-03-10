-- Migration: Ensure active admins can manage employees and institutions
-- Why: Production create/delete admin flows rely on role checks and RLS.
-- This migration is idempotent and safe to run multiple times.

-- Helper predicate inlined in each policy to avoid dependency drift.
-- Active admin = profile row exists for auth.uid(), account_status = active, sub_role = admin.

-- =========================
-- Profiles table
-- =========================
ALTER TABLE IF EXISTS public.evionex_profiles ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename = 'evionex_profiles'
      AND policyname = 'evionex_profiles_select_admin_all'
  ) THEN
    EXECUTE $policy$
      CREATE POLICY evionex_profiles_select_admin_all
      ON public.evionex_profiles
      FOR SELECT TO authenticated
      USING (
        evionex_is_active_user(auth.uid())
        AND evionex_get_sub_role(auth.uid()) = 'admin'
      )
    $policy$;
  END IF;
END
$$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename = 'evionex_profiles'
      AND policyname = 'evionex_profiles_update_admin_all'
  ) THEN
    EXECUTE $policy$
      CREATE POLICY evionex_profiles_update_admin_all
      ON public.evionex_profiles
      FOR UPDATE TO authenticated
      USING (
        evionex_is_active_user(auth.uid())
        AND evionex_get_sub_role(auth.uid()) = 'admin'
      )
      WITH CHECK (
        evionex_is_active_user(auth.uid())
        AND evionex_get_sub_role(auth.uid()) = 'admin'
      )
    $policy$;
  END IF;
END
$$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename = 'evionex_profiles'
      AND policyname = 'evionex_profiles_delete_admin_all'
  ) THEN
    EXECUTE $policy$
      CREATE POLICY evionex_profiles_delete_admin_all
      ON public.evionex_profiles
      FOR DELETE TO authenticated
      USING (
        evionex_is_active_user(auth.uid())
        AND evionex_get_sub_role(auth.uid()) = 'admin'
      )
    $policy$;
  END IF;
END
$$;

-- =========================
-- Employees table
-- =========================
ALTER TABLE IF EXISTS public.evionex_employees ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename = 'evionex_employees'
      AND policyname = 'evionex_employees_select_admin_all'
  ) THEN
    EXECUTE $policy$
      CREATE POLICY evionex_employees_select_admin_all
      ON public.evionex_employees
      FOR SELECT TO authenticated
      USING (
        evionex_is_active_user(auth.uid())
        AND evionex_get_sub_role(auth.uid()) = 'admin'
      )
    $policy$;
  END IF;
END
$$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename = 'evionex_employees'
      AND policyname = 'evionex_employees_insert_admin_all'
  ) THEN
    EXECUTE $policy$
      CREATE POLICY evionex_employees_insert_admin_all
      ON public.evionex_employees
      FOR INSERT TO authenticated
      WITH CHECK (
        evionex_is_active_user(auth.uid())
        AND evionex_get_sub_role(auth.uid()) = 'admin'
      )
    $policy$;
  END IF;
END
$$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename = 'evionex_employees'
      AND policyname = 'evionex_employees_update_admin_all'
  ) THEN
    EXECUTE $policy$
      CREATE POLICY evionex_employees_update_admin_all
      ON public.evionex_employees
      FOR UPDATE TO authenticated
      USING (
        evionex_is_active_user(auth.uid())
        AND evionex_get_sub_role(auth.uid()) = 'admin'
      )
      WITH CHECK (
        evionex_is_active_user(auth.uid())
        AND evionex_get_sub_role(auth.uid()) = 'admin'
      )
    $policy$;
  END IF;
END
$$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename = 'evionex_employees'
      AND policyname = 'evionex_employees_delete_admin_all'
  ) THEN
    EXECUTE $policy$
      CREATE POLICY evionex_employees_delete_admin_all
      ON public.evionex_employees
      FOR DELETE TO authenticated
      USING (
        evionex_is_active_user(auth.uid())
        AND evionex_get_sub_role(auth.uid()) = 'admin'
      )
    $policy$;
  END IF;
END
$$;

-- =========================
-- Institutions table
-- =========================
ALTER TABLE IF EXISTS public.evionex_institutions ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename = 'evionex_institutions'
      AND policyname = 'evionex_institutions_select_admin_all'
  ) THEN
    EXECUTE $policy$
      CREATE POLICY evionex_institutions_select_admin_all
      ON public.evionex_institutions
      FOR SELECT TO authenticated
      USING (
        evionex_is_active_user(auth.uid())
        AND evionex_get_sub_role(auth.uid()) = 'admin'
      )
    $policy$;
  END IF;
END
$$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename = 'evionex_institutions'
      AND policyname = 'evionex_institutions_insert_admin_all'
  ) THEN
    EXECUTE $policy$
      CREATE POLICY evionex_institutions_insert_admin_all
      ON public.evionex_institutions
      FOR INSERT TO authenticated
      WITH CHECK (
        evionex_is_active_user(auth.uid())
        AND evionex_get_sub_role(auth.uid()) = 'admin'
      )
    $policy$;
  END IF;
END
$$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename = 'evionex_institutions'
      AND policyname = 'evionex_institutions_update_admin_all'
  ) THEN
    EXECUTE $policy$
      CREATE POLICY evionex_institutions_update_admin_all
      ON public.evionex_institutions
      FOR UPDATE TO authenticated
      USING (
        evionex_is_active_user(auth.uid())
        AND evionex_get_sub_role(auth.uid()) = 'admin'
      )
      WITH CHECK (
        evionex_is_active_user(auth.uid())
        AND evionex_get_sub_role(auth.uid()) = 'admin'
      )
    $policy$;
  END IF;
END
$$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename = 'evionex_institutions'
      AND policyname = 'evionex_institutions_delete_admin_all'
  ) THEN
    EXECUTE $policy$
      CREATE POLICY evionex_institutions_delete_admin_all
      ON public.evionex_institutions
      FOR DELETE TO authenticated
      USING (
        evionex_is_active_user(auth.uid())
        AND evionex_get_sub_role(auth.uid()) = 'admin'
      )
    $policy$;
  END IF;
END
$$;
