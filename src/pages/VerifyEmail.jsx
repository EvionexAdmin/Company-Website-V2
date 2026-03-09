import { Link } from 'react-router-dom'
import './Portal.css'

export default function VerifyEmail() {
    return (
        <div className="auth-page">
            <div className="auth-card animate-fade-in-up" style={{ textAlign: 'center' }}>
                <div className="auth-card__logo">
                    <span>Evionex</span>
                </div>

                <div className="verify-icon">
                    <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        width="56"
                        height="56"
                    >
                        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                        <polyline points="22 4 12 14.01 9 11.01" />
                    </svg>
                </div>

                <h1 className="auth-card__title" style={{ marginTop: '1rem' }}>
                    Congratulations!
                </h1>
                <p className="auth-card__subtitle" style={{ marginBottom: '2rem', fontSize: '1rem' }}>
                    Verification successful
                </p>

                <p style={{ color: 'var(--text-muted)', fontSize: 'var(--text-sm)', lineHeight: 1.6 }}>
                    Your email has been verified. Click{' '}
                    <Link
                        to="/portal/login"
                        style={{
                            color: 'var(--primary-cyan)',
                            fontWeight: 600,
                            textDecoration: 'underline',
                            textUnderlineOffset: '3px',
                        }}
                    >
                        here
                    </Link>{' '}
                    to go back to logging in.
                </p>
            </div>
        </div>
    )
}
