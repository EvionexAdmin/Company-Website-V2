import { createClient } from '@supabase/supabase-js'

// "Evionex Website" project — used by Contact & Careers pages (orders/payments).
// For the "Eviolife" healthcare project, use supabaseEviolife.js instead.
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
    console.error('Missing VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY in environment variables.')
}

export const supabase = createClient(supabaseUrl || '', supabaseAnonKey || '')
