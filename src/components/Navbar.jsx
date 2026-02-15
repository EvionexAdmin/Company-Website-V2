import { useEffect } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import CardNav from './ui/CardNav/CardNav'
import './Navbar.css'

const navItems = [
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

export default function Navbar() {
    const location = useLocation()
    const navigate = useNavigate()

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
            <span className="navbar__logo-icon">◆</span>
            <span className="navbar__logo-text">Evionex</span>
        </Link>
    )

    return (
        <CardNav
            logo={LogoElement}
            logoAlt="Evionex"
            items={navItems}
            baseColor="rgba(10, 22, 40, 0.95)"
            menuColor="#fff"
            buttonBgColor="#00D4C8"
            buttonTextColor="#0a1628"
            onCtaClick={() => navigate('/contact')}
        />
    )
}
