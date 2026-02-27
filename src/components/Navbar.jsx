import { useEffect, useState, useRef } from 'react'
import { Link, useLocation } from 'react-router-dom'
import ThemeToggle from './ThemeToggle'
import evionexLogo from '../assets/images/logo/evionex-logo.png'
import evionexText from '../assets/images/logo/evionex-text.png'
import evionexLogoLight from '../assets/images/logo/evionex-logo-light.png'
import evionexTextLight from '../assets/images/logo/evionex-text-light.png'
import { useTheme } from '../contexts/ThemeContext'
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
    const { theme } = useTheme()
    const isLight = theme === 'light'
    const [scrolled, setScrolled] = useState(false)
    const [mobileOpen, setMobileOpen] = useState(false)
    const navRef = useRef(null)

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
                className={`gn-navbar ${scrolled ? 'gn-navbar--scrolled' : ''} ${isLight ? 'gn-navbar--light' : ''}`}
                role="navigation"
                aria-label="Main navigation"
            >
                {/* Animated gradient bottom border */}
                <div className="gn-navbar__gradient-border" aria-hidden="true" />

                <div className="gn-navbar__inner">
                    {/* Logo */}
                    <Link to="/" className="gn-navbar__logo" aria-label="Evionex — Go to homepage">
                        <img
                            src={isLight ? evionexLogoLight : evionexLogo}
                            alt=""
                            className="gn-navbar__logo-icon"
                        />
                        <img
                            src={isLight ? evionexTextLight : evionexText}
                            alt="Evionex"
                            className="gn-navbar__logo-text"
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

                    {/* Right side: theme toggle + CTA */}
                    <div className="gn-navbar__actions">
                        <ThemeToggle />
                        <Link to="/contact" className="gn-navbar__cta">
                            Get in Touch
                        </Link>
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
                className={`gn-mobile-drawer ${mobileOpen ? 'gn-mobile-drawer--open' : ''} ${isLight ? 'gn-mobile-drawer--light' : ''}`}
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
                    <ThemeToggle />
                    <Link
                        to="/contact"
                        className="gn-mobile-drawer__cta"
                        onClick={() => setMobileOpen(false)}
                    >
                        Get in Touch
                    </Link>
                </div>
            </aside>
        </>
    )
}
