import { useState, useCallback } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { supabaseEviolife } from '../lib/supabaseEviolife'
import { safeRedirectPath } from '../lib/safeRedirect'
import TurnstileWidget from '../components/TurnstileWidget'
import loginBackground from '../assets/images/auth/login-background.webp'
import './Auth.css'

export default function Login() {
    const [identifier, setIdentifier] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)
    const [turnstileToken, setTurnstileToken] = useState(null)
    const [turnstileKey, setTurnstileKey] = useState(0) // key to force remount & reset widget
    const [forgotMode, setForgotMode] = useState(false)
    const [forgotSent, setForgotSent] = useState(false)
    const { signIn, signInWithGoogle } = useAuth()
    const navigate = useNavigate()
    const location = useLocation()

    // Read redirect param (e.g. from pricing page payment flow)
    const redirectParam = new URLSearchParams(location.search).get('redirect')

    // Sends the password reset link. The link comes back to the reset page.
    async function handleForgotPassword(e) {
        e.preventDefault()
        setError('')

        if (!identifier.trim()) {
            setError('Enter the email address of your account.')
            return
        }

        setLoading(true)
        try {
            const { error: resetError } = await supabaseEviolife.auth.resetPasswordForEmail(
                identifier.trim().toLowerCase(),
                { redirectTo: `${window.location.origin}/#/portal/reset-password` },
            )
            if (resetError) throw resetError
            setForgotSent(true)
        } catch (resetError) {
            setError(resetError?.message || 'Could not send the reset link. Please try again.')
        } finally {
            setLoading(false)
        }
    }

    const handleTurnstileVerify = useCallback((token) => {
        setTurnstileToken(token)
    }, [])

    const handleTurnstileError = useCallback(() => {
        setTurnstileToken(null)
        setError('CAPTCHA verification failed. Please try again.')
    }, [])

    const handleTurnstileExpire = useCallback(() => {
        setTurnstileToken(null)
    }, [])

    async function handleSubmit(e) {
        e.preventDefault()
        setError('')

        if (!turnstileToken) {
            setError('Please complete the CAPTCHA verification.')
            return
        }

        setLoading(true)

        try {
            // ── Server-side Turnstile token validation ──
            const { data: verifyData, error: verifyError } =
                await supabaseEviolife.functions.invoke('verify-turnstile', {
                    body: { token: turnstileToken },
                })

            if (verifyError || !verifyData?.success) {
                setError('CAPTCHA verification failed. Please try again.')
                setTurnstileToken(null)
                setTurnstileKey((k) => k + 1) // reset widget
                setLoading(false)
                return
            }

            // ── Proceed with login ──
            const email = identifier.includes('@')
                ? identifier.trim()
                : `${identifier.trim().toLowerCase()}@inst.evionex.internal`

            const { error: signInError } = await signIn({ email, password })

            if (signInError) {
                const msg = signInError.message || ''
                if (msg.includes('suspended')) {
                    setError(msg)
                } else if (msg.toLowerCase().includes('email not confirmed')) {
                    setError('This address still has to be confirmed. Open the verification email we sent you, confirm the address, then sign in again.')
                } else {
                    setError('Invalid credentials. Please try again.')
                }
                // Reset Turnstile — tokens are single-use
                setTurnstileToken(null)
                setTurnstileKey((k) => k + 1)
                setLoading(false)
            } else {
                navigate(safeRedirectPath(redirectParam) || '/portal/dashboard', { replace: true })
            }
        } catch {
            setError('An unexpected error occurred. Please try again.')
            setTurnstileToken(null)
            setTurnstileKey((k) => k + 1)
            setLoading(false)
        }
    }

    const handleGoogleSignIn = async () => {
        setError('')
        setLoading(true)

        try {
            const { error: googleError } = await signInWithGoogle(safeRedirectPath(redirectParam) || '/portal/dashboard')
            if (googleError) {
                setError(googleError.message || 'Google sign-in could not be started.')
                setLoading(false)
            }
            // On success the browser is redirected to Google, so the page
            // unmounts before anything else happens here.
        } catch {
            setError('Google sign-in could not be started. Please try again.')
            setLoading(false)
        }
    }

    return (
        <main className="evx-auth-shell">
            <section className="evx-auth" aria-labelledby="login-title">
                <div className="evx-auth__frame animate-fade-in-up">
                    <aside className="evx-auth__showcase" style={{ backgroundImage: `url(${loginBackground})` }} aria-hidden="true" />

                    <section className="evx-auth__panel" aria-label="Sign in form">
                        <div className="evx-auth__brand">EVIONEX</div>
                        <h1 id="login-title" className="evx-auth__title">Welcome Back</h1>
                        <p className="evx-auth__subtitle">Access your account and continue your journey with us.</p>

                        {error && <div className="evx-auth__alert evx-auth__alert--error">{error}</div>}

                        {forgotMode ? (
                            <form className="evx-auth__form" onSubmit={handleForgotPassword}>
                                <p className="evx-auth__subtitle" style={{ marginTop: 0 }}>
                                    {forgotSent
                                        ? 'If an account exists for that address, a reset link is on its way. The link opens this page so you can choose a new password.'
                                        : 'Enter the email address of your account and we will send you a link to choose a new password.'}
                                </p>

                                {!forgotSent && (
                                    <label className="evx-auth__field" htmlFor="forgot-identifier">
                                        <span>Email address</span>
                                        <input
                                            id="forgot-identifier"
                                            className="evx-auth__input"
                                            type="email"
                                            value={identifier}
                                            onChange={(e) => setIdentifier(e.target.value)}
                                            placeholder="you@example.com"
                                            required
                                            autoComplete="email"
                                        />
                                    </label>
                                )}

                                <button
                                    type="submit"
                                    className="evx-auth__submit"
                                    disabled={loading || forgotSent}
                                >
                                    {loading ? 'Sending...' : forgotSent ? 'Link sent' : 'Send reset link'}
                                </button>

                                <div className="evx-auth__meta-row" style={{ justifyContent: 'center' }}>
                                    <button
                                        type="button"
                                        className="evx-auth__inline-link"
                                        onClick={() => {
                                            setForgotMode(false)
                                            setForgotSent(false)
                                            setError('')
                                        }}
                                    >
                                        Back to sign in
                                    </button>
                                </div>
                            </form>
                        ) : (
                            <>
                        <form className="evx-auth__form" onSubmit={handleSubmit}>
                            <label className="evx-auth__field" htmlFor="login-identifier">
                                <span>Email or Username</span>
                                <input
                                    id="login-identifier"
                                    className="evx-auth__input"
                                    type="text"
                                    value={identifier}
                                    onChange={(e) => setIdentifier(e.target.value)}
                                    placeholder="you@example.com or institution username"
                                    required
                                    autoComplete="username"
                                />
                            </label>

                            <label className="evx-auth__field" htmlFor="login-password">
                                <span>Password</span>
                                <input
                                    id="login-password"
                                    className="evx-auth__input"
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="Enter your password"
                                    autoComplete="current-password"
                                    required
                                />
                            </label>

                            <div className="evx-auth__meta-row">
                                <label className="evx-auth__checkbox">
                                    <input type="checkbox" name="remember" />
                                    <span>Keep me signed in</span>
                                </label>
                                <button
                                    type="button"
                                    className="evx-auth__inline-link"
                                    onClick={() => {
                                        setForgotMode(true)
                                        setForgotSent(false)
                                        setError('')
                                    }}
                                >
                                    Reset password
                                </button>
                            </div>

                            <TurnstileWidget
                                key={turnstileKey}
                                onVerify={handleTurnstileVerify}
                                onError={handleTurnstileError}
                                onExpire={handleTurnstileExpire}
                            />

                            <button
                                type="submit"
                                className="evx-auth__submit"
                                disabled={loading || !turnstileToken}
                            >
                                {loading ? 'Signing In...' : 'Sign In'}
                            </button>
                        </form>

                        <div className="evx-auth__meta-row" style={{ justifyContent: 'center', marginTop: '1rem' }}>
                            <span className="evx-auth__inline-link">or</span>
                        </div>

                        <button
                            type="button"
                            className="evx-auth__submit"
                            style={{ background: '#ffffff', color: '#1f2937', border: '1px solid rgba(0,0,0,0.12)' }}
                            disabled={loading}
                            onClick={handleGoogleSignIn}
                        >
                            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.6rem' }}>
                                <svg width="18" height="18" viewBox="0 0 48 48" aria-hidden="true">
                                    <path fill="#4285F4" d="M45.12 24.5c0-1.56-.14-3.06-.4-4.5H24v8.51h11.84c-.51 2.75-2.06 5.08-4.39 6.64v5.52h7.11c4.16-3.83 6.56-9.47 6.56-16.17z" />
                                    <path fill="#34A853" d="M24 46c5.94 0 10.92-1.97 14.56-5.33l-7.11-5.52c-1.97 1.32-4.49 2.1-7.45 2.1-5.73 0-10.58-3.87-12.31-9.07H4.34v5.7C7.96 41.07 15.4 46 24 46z" />
                                    <path fill="#FBBC05" d="M11.69 28.18C11.25 26.86 11 25.45 11 24s.25-2.86.69-4.18v-5.7H4.34C2.85 17.09 2 20.45 2 24s.85 6.91 2.34 9.88l7.35-5.7z" />
                                    <path fill="#EA4335" d="M24 10.75c3.23 0 6.13 1.11 8.41 3.29l6.31-6.31C34.91 4.18 29.93 2 24 2 15.4 2 7.96 6.93 4.34 14.12l7.35 5.7c1.73-5.2 6.58-9.07 12.31-9.07z" />
                                </svg>
                                {loading ? 'Connecting...' : 'Continue with Google'}
                            </span>
                        </button>

                        <p className="evx-auth__switch">
                            New to our platform?{' '}
                            <Link to={`/portal/signup${redirectParam ? `?redirect=${encodeURIComponent(redirectParam)}` : ''}`}>Create Account</Link>
                        </p>
                            </>
                        )}
                    </section>
                </div>
            </section>
        </main>
    )
}
