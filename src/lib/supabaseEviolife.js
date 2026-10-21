import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_EVIOLIFE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_EVIOLIFE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
    console.error('Missing VITE_EVIOLIFE_SUPABASE_URL or VITE_EVIOLIFE_SUPABASE_ANON_KEY in environment variables.')
}

export const supabaseEviolife = createClient(supabaseUrl || '', supabaseAnonKey || '', {
    auth: {
        persistSession: true,     // Persist session in localStorage across page refreshes
        autoRefreshToken: true,   // Auto-refresh token before expiry
        detectSessionInUrl: true, // Finish the OAuth sign-in when the browser comes back
        // The site uses a hash router, so the route already lives in the URL
        // fragment (#/portal/dashboard). The implicit flow would append the
        // session tokens to that same fragment, producing
        // "#/portal/dashboard#access_token=..." which the router (and
        // supabase-js) cannot read. PKCE puts a short-lived code in the query
        // string instead: "/?code=...#/portal/dashboard".
        flowType: 'pkce',
    },
})
