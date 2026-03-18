import { useEffect, useState, useRef } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import evionexLogo from '../assets/images/logo/evionex-logo.png'
import evionexText from '../assets/images/logo/evionex-text.png'
import { useAuth } from '../contexts/AuthContext'
import './Navbar.css'

const navLinks = [
    { label: 'Home', href: '/' },
    { label: 'Who We Are', href: '/who-we-are' },
    { label: 'Products', href: '/products' },
    { label: 'Pricing', href: '/pricing' },
    { label: 'Team', href: '/team' },
    { label: 'Careers', href: '/careers' },
    { label: 'Contact', href: '/contact' },
]

export default function Navbar() {
    const location = useLocation()
    const navigate = useNavigate()
    const { user, profile, signOut } = useAuth()
    const [scrolled, setScrolled] = useState(false)
    const [mobileOpen, setMobileOpen] = useState(false)
    const navRef = useRef(null)

    // Compute initials from profile name or email
    const initials = profile?.full_name
        ? profile.full_name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()
        : user?.email
            ? user.email[0].toUpperCase()
            : '?'

    // Listen for scroll to toggle frosted glass
    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 20)
        window.addEventListener('scroll', onScroll, { passive: true })
        onScroll()
        return () => window.removeEventListener('scroll', onScroll)
    }, [])

    // Close mobile drawer on route change
    useEffect(() => {
        setMobileOpen(false)
    }, [location.pathname])

    // Close mobile drawer on Escape key
    useEffect(() => {
        const handleKey = (e) => {
            if (e.key === 'Escape') setMobileOpen(false)
        }
        document.addEventListener('keydown', handleKey)
        return () => document.removeEventListener('keydown', handleKey)
    }, [])

    // Lock body scroll when mobile menu is open
    useEffect(() => {
        document.body.style.overflow = mobileOpen ? 'hidden' : ''
        return () => { document.body.style.overflow = '' }
    }, [mobileOpen])

    const isActive = (href) => {
        if (href === '/') return location.pathname === '/'
        return location.pathname.startsWith(href)
    }

    return (
        <>
            <nav
                ref={navRef}
                className={`gn-navbar ${scrolled ? 'gn-navbar--scrolled' : ''}`}
                role="navigation"
                aria-label="Main navigation"
            >
                {/* Animated gradient bottom border */}
                <div className="gn-navbar__gradient-border" aria-hidden="true" />

                <div className="gn-navbar__inner">
                    {/* Logo */}
                    <Link to="/" className="gn-navbar__logo" aria-label="Evionex — Go to homepage">
                        <img
                            src={evionexLogo}
                            alt=""
                            className="gn-navbar__logo-icon"
                            width="30"
                            height="30"
                        />
                        <img
                            src={evionexText}
                            alt="Evionex"
                            className="gn-navbar__logo-text"
                            width="80"
                            height="18"
                        />
                    </Link>

                    {/* Desktop links */}
                    <ul className="gn-navbar__links" role="menubar">
                        {navLinks.map((link) => (
                            <li key={link.href} role="none">
                                <Link
                                    to={link.href}
                                    role="menuitem"
                                    className={`gn-navbar__link ${isActive(link.href) ? 'gn-navbar__link--active' : ''}`}
                                >
                                    {link.label}
                                </Link>
                            </li>
                        ))}
                    </ul>

                    {/* Right side: avatar + CTA */}
                    <div className="gn-navbar__actions">
                        {user ? (
                            <>
                                <Link
                                    to="/portal/dashboard"
                                    className="gn-navbar__avatar"
                                    aria-label="Go to dashboard"
                                    title="My Dashboard"
                                >
                                    {initials}
                                </Link>
                                <button
                                    className="gn-navbar__cta gn-navbar__cta--signout"
                                    onClick={async () => { await signOut(); navigate('/portal/login'); }}
                                >
                                    Sign Out
                                </button>
                            </>
                        ) : (
                            <Link to="/portal/login" className="gn-navbar__cta">
                                Login / Sign Up
                            </Link>
                        )}
                    </div>

                    {/* Mobile hamburger */}
                    <button
                        className={`gn-navbar__hamburger ${mobileOpen ? 'gn-navbar__hamburger--open' : ''}`}
                        onClick={() => setMobileOpen((v) => !v)}
                        aria-label={mobileOpen ? 'Close navigation menu' : 'Open navigation menu'}
                        aria-expanded={mobileOpen}
                    >
                        <span />
                        <span />
                        <span />
                    </button>
                </div>
            </nav>

            {/* Mobile overlay */}
            <div
                className={`gn-mobile-overlay ${mobileOpen ? 'gn-mobile-overlay--visible' : ''}`}
                onClick={() => setMobileOpen(false)}
                aria-hidden="true"
            />

            {/* Mobile drawer */}
            <aside
                className={`gn-mobile-drawer ${mobileOpen ? 'gn-mobile-drawer--open' : ''}`}
                aria-label="Mobile navigation"
            >
                <div className="gn-mobile-drawer__links">
                    {navLinks.map((link) => (
                        <Link
                            key={link.href}
                            to={link.href}
                            className={`gn-mobile-drawer__link ${isActive(link.href) ? 'gn-mobile-drawer__link--active' : ''}`}
                            onClick={() => setMobileOpen(false)}
                        >
                            {link.label}
                        </Link>
                    ))}
                </div>
                <div className="gn-mobile-drawer__bottom">
                    {user ? (
                        <>
                            <Link
                                to="/portal/dashboard"
                                className="gn-mobile-drawer__avatar-link"
                                onClick={() => setMobileOpen(false)}
                            >
                                <span className="gn-navbar__avatar gn-navbar__avatar--mobile">{initials}</span>
                                <span>My Dashboard</span>
                            </Link>
                            <button
                                className="gn-mobile-drawer__cta gn-mobile-drawer__cta--signout"
                                onClick={async () => { setMobileOpen(false); await signOut(); navigate('/portal/login'); }}
                            >
                                Sign Out
                            </button>
                        </>
                    ) : (
                        <Link
                            to="/portal/login"
                            className="gn-mobile-drawer__cta"
                            onClick={() => setMobileOpen(false)}
                        >
                            Login / Sign Up
                        </Link>
                    )}
                </div>
            </aside>
        </>
    )
}

