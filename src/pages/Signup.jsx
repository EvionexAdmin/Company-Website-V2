import { useState, useCallback } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { supabaseGeneSetu } from '../lib/supabaseGeneSetu'
import TurnstileWidget from '../components/TurnstileWidget'
import './Portal.css'

export default function Signup() {
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        confirmPassword: '',
        fullName: '',
        role: 'patient',
        subRole: '',
    })
    const [error, setError] = useState('')
    const [success, setSuccess] = useState('')
    const [loading, setLoading] = useState(false)
    const [turnstileToken, setTurnstileToken] = useState(null)
    const [turnstileKey, setTurnstileKey] = useState(0)
    const { signUp } = useAuth()
    const location = useLocation()

    // Preserve redirect param (e.g. from pricing page payment flow)
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

    function handleChange(e) {
        const { name, value } = e.target
        setFormData((prev) => {
            const updated = { ...prev, [name]: value }
            // Auto-set sub_role based on role
            if (name === 'role') {
                if (value === 'patient') updated.subRole = ''
                else if (value === 'partner') updated.subRole = 'doctor'
            }
            return updated
        })
    }

    async function handleSubmit(e) {
        e.preventDefault()
        setError('')
        setSuccess('')

        if (formData.password !== formData.confirmPassword) {
            setError('Passwords do not match')
            return
        }

        // Strong password validation
        if (formData.password.length < 8) {
            setError('Password must be at least 8 characters')
            return
        }
        if (!/[A-Z]/.test(formData.password)) {
            setError('Password must contain at least one uppercase letter')
            return
        }
        if (!/[a-z]/.test(formData.password)) {
            setError('Password must contain at least one lowercase letter')
            return
        }
        if (!/[0-9]/.test(formData.password)) {
            setError('Password must contain at least one number')
            return
        }
        if (!/[^A-Za-z0-9]/.test(formData.password)) {
            setError('Password must contain at least one special character')
            return
        }

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
                setTurnstileKey((k) => k + 1)
                setLoading(false)
                return
            }

            // ── Proceed with signup ──
            const { error: signUpError } = await signUp({
                email: formData.email,
                password: formData.password,
                role: formData.role,
                subRole: formData.subRole || undefined,
                fullName: formData.fullName,
            })

            if (signUpError) {
                // Sanitize signup errors
                setError('Unable to create account. The email may already be registered.')
                // Reset Turnstile — tokens are single-use
                setTurnstileToken(null)
                setTurnstileKey((k) => k + 1)
            } else {
                setSuccess('Account created! Please check your email to verify your account before logging in.')
            }
        } catch {
            setError('An unexpected error occurred. Please try again.')
            setTurnstileToken(null)
            setTurnstileKey((k) => k + 1)
        }

        setLoading(false)
    }

    return (
        <div className="auth-page">
            <div className="auth-card animate-fade-in-up">
                <div className="auth-card__logo">
                    <span>Evionex</span>
                </div>
                <h1 className="auth-card__title">Create Account</h1>
                <p className="auth-card__subtitle">Join the Evionex healthcare platform</p>

                {error && <div className="auth-error">{error}</div>}
                {success && <div className="auth-success">{success}</div>}

                {!success && (
                    <form className="auth-form" onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label className="form-label" htmlFor="signup-name">Full Name</label>
                            <input
                                id="signup-name"
                                className="form-input"
                                type="text"
                                name="fullName"
                                value={formData.fullName}
                                onChange={handleChange}
                                placeholder="Your full name"
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label className="form-label" htmlFor="signup-email">Email Address</label>
                            <input
                                id="signup-email"
                                className="form-input"
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                placeholder="you@example.com"
                                required
                            />
                        </div>

                        <div className="form-row">
                            <div className="form-group">
                                <label className="form-label" htmlFor="signup-password">Password</label>
                                <input
                                    id="signup-password"
                                    className="form-input"
                                    type="password"
                                    name="password"
                                    autoComplete="new-password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    placeholder="Min. 8 characters"
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label className="form-label" htmlFor="signup-confirm">Confirm Password</label>
                                <input
                                    id="signup-confirm"
                                    className="form-input"
                                    type="password"
                                    name="confirmPassword"
                                    autoComplete="new-password"
                                    value={formData.confirmPassword}
                                    onChange={handleChange}
                                    placeholder="Repeat password"
                                    required
                                />
                            </div>
                        </div>

                        <div className="form-group">
                            <label className="form-label" htmlFor="signup-role">Account Type</label>
                            <select
                                id="signup-role"
                                className="form-select"
                                name="role"
                                value={formData.role}
                                onChange={handleChange}
                            >
                                <option value="patient">Patient</option>
                                <option value="partner">Partner (Doctor)</option>
                            </select>
                        </div>

                        {/* Admin and employee accounts are created internally for security. */}

                        <TurnstileWidget
                            key={turnstileKey}
                            onVerify={handleTurnstileVerify}
                            onError={handleTurnstileError}
                            onExpire={handleTurnstileExpire}
                        />

                        <button type="submit" className="btn btn-primary" disabled={loading || !turnstileToken}>
                            {loading ? 'Creating Account...' : 'Create Account'}
                        </button>
                    </form>
                )}

                <div className="auth-footer">
                    Already have an account?{' '}
                    <Link to={`/portal/login${redirectParam ? `?redirect=${encodeURIComponent(redirectParam)}` : ''}`}>Sign in</Link>
                </div>
            </div>
        </div>
    )
}
