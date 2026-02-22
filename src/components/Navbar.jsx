import { useEffect, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import CardNav from './ui/CardNav/CardNav'
import ThemeToggle from './ThemeToggle'
import evionexLogo from '../assets/images/logo/evionex-logo.png'
import evionexText from '../assets/images/logo/evionex-text.png'
import evionexLogoLight from '../assets/images/logo/evionex-logo-light.png'
import evionexTextLight from '../assets/images/logo/evionex-text-light.png'
import { useTheme } from '../contexts/ThemeContext'
import './Navbar.css'

const darkNavItems = [
    {
        label: 'Company',
        bgColor: '#0d2137',
        textColor: '#fff',
        links: [
            { label: 'Home', href: '/', ariaLabel: 'Go to Home page' },
            { label: 'Who We Are', href: '/who-we-are', ariaLabel: 'About Evionex' },
            { label: 'Team', href: '/team', ariaLabel: 'Meet the team' },
        ],
    },
    {
        label: 'Solutions',
        bgColor: '#0a2a3f',
        textColor: '#fff',
        links: [
            { label: 'Products', href: '/products', ariaLabel: 'View our products' },
            { label: 'Pricing', href: '/pricing', ariaLabel: 'View pricing' },
        ],
    },
    {
        label: 'Connect',
        bgColor: '#1a1a2e',
        textColor: '#fff',
        links: [
            { label: 'Careers', href: '/careers', ariaLabel: 'View open positions' },
            { label: 'Contact', href: '/contact', ariaLabel: 'Contact us' },
        ],
    },
]

const lightNavItems = [
    {
        label: 'Company',
        bgColor: '#c8dff5',
        textColor: '#0d1e32',
        links: [
            { label: 'Home', href: '/', ariaLabel: 'Go to Home page' },
            { label: 'Who We Are', href: '/who-we-are', ariaLabel: 'About Evionex' },
            { label: 'Team', href: '/team', ariaLabel: 'Meet the team' },
        ],
    },
    {
        label: 'Solutions',
        bgColor: '#bde4ef',
        textColor: '#082d3e',
        links: [
            { label: 'Products', href: '/products', ariaLabel: 'View our products' },
            { label: 'Pricing', href: '/pricing', ariaLabel: 'View pricing' },
        ],
    },
    {
        label: 'Connect',
        bgColor: '#ced6f0',
        textColor: '#111430',
        links: [
            { label: 'Careers', href: '/careers', ariaLabel: 'View open positions' },
            { label: 'Contact', href: '/contact', ariaLabel: 'Contact us' },
        ],
    },
]

export default function Navbar() {
    const location = useLocation()
    const navigate = useNavigate()
    const [forceClose, setForceClose] = useState(false)
    const { theme } = useTheme()
    const isLight = theme === 'light'

    // Close the nav menu on every route change
    useEffect(() => {
        setForceClose(true)
        const timer = setTimeout(() => setForceClose(false), 100)
        return () => clearTimeout(timer)
    }, [location.pathname])

    // Intercept CardNav link clicks for client-side routing
    useEffect(() => {
        const handleNavClick = (e) => {
            const link = e.target.closest('.nav-card-link')
            if (!link) return

            const href = link.getAttribute('href')
            if (href && href.startsWith('/')) {
                e.preventDefault()
                navigate(href)
            }
        }

        document.addEventListener('click', handleNavClick)
        return () => document.removeEventListener('click', handleNavClick)
    }, [navigate, location])

    const LogoElement = (
        <Link to="/" className="navbar__logo" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <img
                src={isLight ? evionexLogoLight : evionexLogo}
                alt="Evionex Logo"
                className="navbar__logo-icon"
                style={{ height: '32px', width: 'auto' }}
            />
            <img
                src={isLight ? evionexTextLight : evionexText}
                alt="Evionex"
                className="navbar__logo-text"
                style={{ height: '20px', width: 'auto' }}
            />
        </Link>
    )

    return (
        <CardNav
            logo={LogoElement}
            logoAlt="Evionex"
            items={isLight ? lightNavItems : darkNavItems}
            baseColor={isLight ? 'rgba(240, 245, 252, 0.98)' : 'rgba(10, 22, 40, 0.95)'}
            menuColor={isLight ? '#0d1e32' : '#fff'}
            showCta={false}
            rightSlot={<ThemeToggle />}
            forceClose={forceClose}
        />
    )
}
