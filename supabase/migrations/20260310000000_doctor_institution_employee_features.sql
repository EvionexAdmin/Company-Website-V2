-- ============================================================
-- Migration: Doctor-Institution Connections + Employee Enhancements
-- ============================================================


-- ============================================================
-- 1. Doctor-Institution Connection Requests
--    Mirrors the existing doctor-patient connection system.
-- ============================================================
CREATE TABLE IF NOT EXISTS public.evionex_doctor_institution_requests (
    id              uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    doctor_id       uuid REFERENCES public.evionex_doctors(id)      ON DELETE CASCADE NOT NULL,
    institution_id  uuid REFERENCES public.evionex_institutions(id)  ON DELETE CASCADE NOT NULL,
    status          text DEFAULT 'pending'
                    CHECK (status IN ('pending', 'accepted', 'rejected')) NOT NULL,
    created_at      timestamptz DEFAULT now() NOT NULL,
    responded_at    timestamptz,
    UNIQUE (doctor_id, institution_id)
);

ALTER TABLE public.evionex_doctor_institution_requests ENABLE ROW LEVEL SECURITY;

-- Doctors can send requests
CREATE POLICY dir_insert_doctor ON public.evionex_doctor_institution_requests
    FOR INSERT TO authenticated
    WITH CHECK (
        doctor_id = auth.uid()
        AND evionex_is_active_user(auth.uid())
        AND evionex_get_sub_role(auth.uid()) = 'doctor'
    );

-- Both sides can read their own requests
CREATE POLICY dir_select_own ON public.evionex_doctor_institution_requests
    FOR SELECT TO authenticated
    USING (
        evionex_is_active_user(auth.uid())
        AND (doctor_id = auth.uid() OR institution_id = auth.uid())
    );

-- Admins see all
CREATE POLICY dir_select_admin ON public.evionex_doctor_institution_requests
    FOR SELECT TO authenticated
    USING (
        evionex_is_active_user(auth.uid())
        AND evionex_get_sub_role(auth.uid()) = 'admin'
    );

-- Institutions can accept/reject
CREATE POLICY dir_update_institution ON public.evionex_doctor_institution_requests
    FOR UPDATE TO authenticated
    USING (
        institution_id = auth.uid()
        AND evionex_is_active_user(auth.uid())
        AND evionex_get_sub_role(auth.uid()) = 'institution'
    )
    WITH CHECK (institution_id = auth.uid());

-- Doctors can withdraw pending requests
CREATE POLICY dir_delete_doctor ON public.evionex_doctor_institution_requests
    FOR DELETE TO authenticated
    USING (
        doctor_id = auth.uid()
        AND status = 'pending'
        AND evionex_is_active_user(auth.uid())
    );

CREATE INDEX IF NOT EXISTS idx_dir_doctor_id     ON public.evionex_doctor_institution_requests (doctor_id);
CREATE INDEX IF NOT EXISTS idx_dir_institution_id ON public.evionex_doctor_institution_requests (institution_id);
CREATE INDEX IF NOT EXISTS idx_dir_status         ON public.evionex_doctor_institution_requests (status);


-- ============================================================
-- 2. Institutions need to read doctor profiles for request-based
--    connections (not just admin-assigned institution_id).
--    Also need to count doctor-patient connections.
-- ============================================================

-- Allow institutions to SELECT any doctor who sent them a request
CREATE POLICY evionex_doctors_select_request_institution
    ON public.evionex_doctors FOR SELECT TO authenticated
    USING (
        evionex_is_active_user(auth.uid())
        AND evionex_get_sub_role(auth.uid()) = 'institution'
        AND id IN (
            SELECT doctor_id FROM public.evionex_doctor_institution_requests
            WHERE institution_id = auth.uid()
        )
    );

-- Allow institutions to count patient-doctor connections for
-- doctors connected to them (via request or admin-assigned)
CREATE POLICY evionex_dp_select_institution
    ON public.evionex_doctor_patients FOR SELECT TO authenticated
    USING (
        evionex_is_active_user(auth.uid())
        AND evionex_get_sub_role(auth.uid()) = 'institution'
        AND doctor_id IN (
            -- Admin-assigned doctors
            SELECT id FROM public.evionex_doctors WHERE institution_id = auth.uid()
            UNION
            -- Request-based connected doctors
            SELECT doctor_id FROM public.evionex_doctor_institution_requests
            WHERE institution_id = auth.uid() AND status = 'accepted'
        )
    );

-- Allow doctors to read institutions (to look up by code/ID for connection)
CREATE POLICY evionex_institutions_select_doctor
    ON public.evionex_institutions FOR SELECT TO authenticated
    USING (
        evionex_is_active_user(auth.uid())
        AND evionex_get_sub_role(auth.uid()) = 'doctor'
    );


-- ============================================================
-- 3. Add columns to evionex_employees for employee portal
--    (phone and personal_email for employee-editable personal
--    details, first_login_complete to enforce password change)
-- ============================================================
ALTER TABLE public.evionex_employees
    ADD COLUMN IF NOT EXISTS phone            text,
    ADD COLUMN IF NOT EXISTS personal_email   text,
    ADD COLUMN IF NOT EXISTS first_login_complete boolean DEFAULT false NOT NULL;

-- Set first_login_complete = true for existing employees
-- (they already have working passwords)
UPDATE public.evionex_employees SET first_login_complete = true WHERE first_login_complete = false;
