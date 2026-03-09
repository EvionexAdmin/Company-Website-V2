-- Allow patients to select their own connections
CREATE POLICY evionex_dp_select_patient ON public.evionex_doctor_patients
    FOR SELECT TO authenticated
    USING (
        evionex_is_active_user(auth.uid()) AND
        patient_id = auth.uid()
    );

-- Allow patients to delete their own connections (disconnect)
CREATE POLICY evionex_dp_delete_patient ON public.evionex_doctor_patients
    FOR DELETE TO authenticated
    USING (
        evionex_is_active_user(auth.uid()) AND
        patient_id = auth.uid()
    );
