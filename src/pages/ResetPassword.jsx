import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { supabaseEviolife } from '../lib/supabaseEviolife'
import loginBackground from '../assets/images/auth/login-background.webp'
import './Auth.css'

const APP_STORE_URL =
    'https://play.google.com/store/apps/details?id=com.evionex.genesetu'

/**
 * Landing page for the Evio Life password reset link.
 *
 * Supabase sends the link to the site when the app cannot open it directly.
 * The most common reasons to land here are a link that was already used or
 * one that expired, so the page explains what happened and how to get a new
 * link instead of showing a generic error.
 */
export default function ResetPassword() {
    const [status, setStatus] = useState('checking') // checking | expired | ready | done | error
    const [message, setMessage] = useState('')
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        const params = new URLSearchParams(window.location.search)
        // The router puts the route in the hash, so a link like
        // "#/portal/reset-password?code=..." keeps its code there.
        const hashQuery = window.location.hash.includes('?')
            ? window.location.hash.slice(window.location.hash.indexOf('?') + 1)
            : ''
        const hashParams = new URLSearchParams(hashQuery)

        const errorCode = params.get('error_code') || hashParams.get('error_code')
        const errorDescription = params.get('error_description') || hashParams.get('error_description')

        if (errorCode || errorDescription) {
            setStatus('expired')
            return
        }

        // A code means the link used the PKCE flow.
        const code = params.get('code') || hashParams.get('code')
        if (code) {
            supabaseEviolife.auth
                .exchangeCodeForSession(code)
                .then(({ error }) => {
                    if (error) {
                        setStatus('expired')
                        return
                    }
                    setStatus('ready')
                })
                .catch(() => setStatus('expired'))
            return
        }

        // The implicit flow puts the tokens in the hash.
        const hash = new URLSearchParams(window.location.hash.replace(/^#/, ''))
        if (hash.get('error_description') || hash.get('error_code')) {
            setStatus('expired')
            return
        }

        if (hash.get('access_token')) {
            setStatus('ready')
            return
        }

        supabaseEviolife.auth.getSession().then(({ data }) => {
            setStatus(data?.session ? 'ready' : 'expired')
        })
    }, [])

    async function handleSubmit(event) {
        event.preventDefault()
        if (password !== confirmPassword) {
            setStatus('error')
            setMessage('The two passwords do not match.')
            return
        }
        if (password.length < 8) {
            setStatus('error')
            setMessage('Please use at least 8 characters.')
            return
        }

        setLoading(true)
        const { error } = await supabaseEviolife.auth.updateUser({ password })
        setLoading(false)

        if (error) {
            setStatus('error')
            setMessage(error.message || 'We could not update your password.')
            return
        }

        setStatus('done')
    }

    return (
        <main className="evx-auth-shell">
            <section className="evx-auth" aria-labelledby="reset-title">
                <div className="evx-auth__frame animate-fade-in-up">
                    <aside
                        className="evx-auth__showcase"
                        style={{ backgroundImage: `url(${loginBackground})` }}
                        aria-hidden="true"
                    />

                    <section className="evx-auth__panel" aria-label="Reset password">
                        <div className="evx-auth__brand">EVIONEX</div>
                        <h1 id="reset-title" className="evx-auth__title">
                            {status === 'done' ? 'Password updated' : 'Reset your password'}
                        </h1>
                        <p className="evx-auth__subtitle">
                            {status === 'expired' || status === 'error'
                                ? 'This reset link is no longer valid.'
                                : 'Choose a new password for your Evio Life account.'}
                        </p>

                        {status === 'checking' && (
                            <div className="evx-auth__alert">Checking your link...</div>
                        )}

                        {status === 'expired' && (
                            <>
                                <div className="evx-auth__alert evx-auth__alert--error">
                                    This link has already been used or it has expired. Reset links can only be
                                    used once and they expire after one hour.
                                </div>
                                <p className="evx-auth__subtitle" style={{ marginBottom: '1.5rem' }}>
                                    Open the Evio Life app, go to <strong>Login &rarr; Forgot password</strong> and
                                    request a new link.
                                </p>
                                <a className="evx-auth__submit" href={APP_STORE_URL} target="_blank" rel="noreferrer">
                                    Get Evio Life
                                </a>
                            </>
                        )}

                        {status === 'error' && (
                            <div className="evx-auth__alert evx-auth__alert--error">{message}</div>
                        )}

                        {status === 'ready' && (
                            <form className="evx-auth__form" onSubmit={handleSubmit}>
                                <label className="evx-auth__field" htmlFor="reset-password">
                                    <span>New password</span>
                                    <input
                                        id="reset-password"
                                        className="evx-auth__input"
                                        type="password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        placeholder="At least 8 characters"
                                        autoComplete="new-password"
                                        required
                                    />
                                </label>

                                <label className="evx-auth__field" htmlFor="reset-confirm-password">
                                    <span>Confirm new password</span>
                                    <input
                                        id="reset-confirm-password"
                                        className="evx-auth__input"
                                        type="password"
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        placeholder="Repeat your new password"
                                        autoComplete="new-password"
                                        required
                                    />
                                </label>

                                <button type="submit" className="evx-auth__submit" disabled={loading}>
                                    {loading ? 'Updating...' : 'Update password'}
                                </button>
                            </form>
                        )}

                        {status === 'done' && (
                            <>
                                <div className="evx-auth__alert evx-auth__alert--success">
                                    Your password has been updated. You can sign in with it now.
                                </div>
                                <Link className="evx-auth__submit" to="/portal/login">
                                    Go to sign in
                                </Link>
                            </>
                        )}

                        <div className="evx-auth__switch">
                            <Link to="/portal/login">Back to sign in</Link>
                        </div>
                    </section>
                </div>
            </section>
        </main>
    )
}
