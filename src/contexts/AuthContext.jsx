import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { supabaseGeneSetu } from '../lib/supabaseGeneSetu'

const AuthContext = createContext({})

export function useAuth() {
    return useContext(AuthContext)
}

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null)
    const [session, setSession] = useState(null)
    const [profile, setProfile] = useState(null)
    const [loading, setLoading] = useState(true) // Start true — wait for persisted session check

    const fetchProfile = useCallback(async (userId) => {
        try {
            const { data, error } = await supabaseGeneSetu
                .from('evionex_profiles')
                .select('*')
                .eq('id', userId)
                .single()

            if (error && error.code !== 'PGRST116') {
                console.error('Error fetching profile:', error)
            }
            setProfile(data || null)
            return data || null
        } catch (err) {
            console.error('Error fetching profile:', err)
            return null
        }
    }, [])

    useEffect(() => {
        // Restore persisted session on page load
        supabaseGeneSetu.auth.getSession().then(({ data: { session: existingSession } }) => {
            if (existingSession?.user) {
                setUser(existingSession.user)
                setSession(existingSession)
            }
            setLoading(false)
        })

        // IMPORTANT: This callback MUST be synchronous (not async).
        // Calling async operations (like DB queries) directly inside
        // onAuthStateChange deadlocks the GoTrue internal event queue,
        // which freezes the entire UI after token refresh (~1 hour).
        const { data: { subscription } } = supabaseGeneSetu.auth.onAuthStateChange(
            (event, newSession) => {
                if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
                    if (newSession?.user) {
                        setUser(newSession.user)
                        setSession(newSession)
                    }
                } else if (event === 'SIGNED_OUT') {
                    setUser(null)
                    setSession(null)
                    setProfile(null)
                }
            }
        )

        return () => subscription.unsubscribe()
    }, [])

    // Fetch profile SEPARATELY when user changes — decoupled from onAuthStateChange
    useEffect(() => {
        if (user?.id) {
            fetchProfile(user.id)
        }
    }, [user?.id, fetchProfile])

    async function signUp({ email, password, role, subRole, fullName }) {
        const metadata = {
            evionex_role: role,
            full_name: fullName,
        }
        if (subRole) metadata.evionex_sub_role = subRole

        const { data, error } = await supabaseGeneSetu.auth.signUp({
            email,
            password,
            options: {
                data: metadata,
                emailRedirectTo: 'https://www.evionex.com/#/portal/verify-email',
            },
        })
        return { data, error }
    }

    async function signIn({ email, password }) {
        const { data, error } = await supabaseGeneSetu.auth.signInWithPassword({
            email,
            password,
        })
        if (!error && data?.user) {
            // Fetch profile to check account status before granting access
            const profileData = await fetchProfile(data.user.id)

            // Block suspended accounts immediately
            if (profileData?.account_status === 'suspended') {
                await supabaseGeneSetu.auth.signOut({ scope: 'local' })
                setUser(null)
                setSession(null)
                setProfile(null)
                return {
                    data: null,
                    error: { message: 'Your account has been suspended. Please contact support.' },
                }
            }

            setUser(data.user)
            setSession(data.session)
        }
        return { data, error }
    }

    async function signOut() {
        // 1. Try Supabase signOut (best effort — don't let errors block logout)
        try {
            await supabaseGeneSetu.auth.signOut()
        } catch (err) {
            console.warn('Supabase signOut error (ignored):', err)
        }

        // 2. Manually clear ALL Supabase auth keys from localStorage as failsafe
        try {
            const keysToRemove = []
            for (let i = 0; i < localStorage.length; i++) {
                const key = localStorage.key(i)
                if (key && (key.startsWith('sb-') || key.includes('supabase'))) {
                    keysToRemove.push(key)
                }
            }
            keysToRemove.forEach(key => localStorage.removeItem(key))
        } catch (err) {
            console.warn('localStorage clear error (ignored):', err)
        }

        // 3. Clear React state
        setUser(null)
        setSession(null)
        setProfile(null)
    }

    const isSuspended = profile?.account_status === 'suspended'

    const value = {
        user,
        session,
        profile,
        loading,
        signUp,
        signIn,
        signOut,
        fetchProfile,
        isSuspended,
        isPatient: profile?.role === 'patient',
        isDoctor: profile?.sub_role === 'doctor',
        isInstitution: profile?.sub_role === 'institution',
        isEmployee: profile?.role === 'employee',
        isAdmin: profile?.sub_role === 'admin',
    }

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
