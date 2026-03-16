import { useState, useCallback } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { supabaseGeneSetu } from '../lib/supabaseGeneSetu'
import TurnstileWidget from '../components/TurnstileWidget'
import './Portal.css'

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
        <div className="auth-page">
            <div className="auth-card animate-fade-in-up">
                <div className="auth-card__logo">
                    <span>Evionex</span>
                </div>
                <h1 className="auth-card__title">Welcome Back</h1>
                <p className="auth-card__subtitle">Sign in to your Evionex account</p>

                {error && <div className="auth-error">{error}</div>}

                <form className="auth-form" onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label className="form-label" htmlFor="login-identifier">Email or Username</label>
                        <input
                            id="login-identifier"
                            className="form-input"
                            type="text"
                            value={identifier}
                            onChange={(e) => setIdentifier(e.target.value)}
                            placeholder="you@example.com or institution username"
                            required
                            autoComplete="username"
                        />
                    </div>

                    <div className="form-group">
                        <label className="form-label" htmlFor="login-password">Password</label>
                        <input
                            id="login-password"
                            className="form-input"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="••••••••"
                            autoComplete="current-password"
                            required
                        />
                    </div>

                    <TurnstileWidget
                        key={turnstileKey}
                        onVerify={handleTurnstileVerify}
                        onError={handleTurnstileError}
                        onExpire={handleTurnstileExpire}
                    />

                    <button
                        type="submit"
                        className="btn btn-primary"
                        disabled={loading || !turnstileToken}
                    >
                        {loading ? 'Signing In...' : 'Sign In'}
                    </button>
                </form>

                <div className="auth-footer">
                    Don't have an account?{' '}
                    <Link to={`/portal/signup${redirectParam ? `?redirect=${encodeURIComponent(redirectParam)}` : ''}`}>Create one</Link>
                </div>
            </div>
        </div>
    )
}
