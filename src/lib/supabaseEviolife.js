import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_EVIOLIFE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_EVIOLIFE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
    console.error('Missing VITE_EVIOLIFE_SUPABASE_URL or VITE_EVIOLIFE_SUPABASE_ANON_KEY in environment variables.')
}

export const supabaseEviolife = createClient(supabaseUrl || '', supabaseAnonKey || '', {
    auth: {
        persistSession: true,    // Persist session in localStorage across page refreshes
        autoRefreshToken: true,   // Auto-refresh token before expiry
    },
})
