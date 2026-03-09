import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_GENE_SETU_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_GENE_SETU_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
    console.error('Missing VITE_GENE_SETU_SUPABASE_URL or VITE_GENE_SETU_SUPABASE_ANON_KEY in environment variables.')
}

export const supabaseGeneSetu = createClient(supabaseUrl || '', supabaseAnonKey || '', {
    auth: {
        persistSession: true,    // Persist session in localStorage across page refreshes
        autoRefreshToken: true,   // Auto-refresh token before expiry
    },
})
