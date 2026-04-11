import { useState, useCallback } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { supabaseGeneSetu } from '../lib/supabaseGeneSetu'
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
    const { signIn } = useAuth()
    const navigate = useNavigate()
    const location = useLocation()

    // Read redirect param (e.g. from pricing page payment flow)
    const redirectParam = new URLSearchParams(location.search).get('redirect')

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
                await supabaseGeneSetu.functions.invoke('verify-turnstile', {
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
                } else {
                    setError('Invalid credentials. Please try again.')
                }
                // Reset Turnstile — tokens are single-use
                setTurnstileToken(null)
                setTurnstileKey((k) => k + 1)
                setLoading(false)
            } else {
                navigate(redirectParam || '/portal/dashboard', { replace: true })
            }
        } catch {
            setError('An unexpected error occurred. Please try again.')
            setTurnstileToken(null)
            setTurnstileKey((k) => k + 1)
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
                                <Link className="evx-auth__inline-link" to="/contact">Reset password</Link>
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

                        <p className="evx-auth__switch">
                            New to our platform?{' '}
                            <Link to={`/portal/signup${redirectParam ? `?redirect=${encodeURIComponent(redirectParam)}` : ''}`}>Create Account</Link>
                        </p>
                    </section>
                </div>
            </section>
        </main>
    )
}
