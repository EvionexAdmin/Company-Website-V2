import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import evionexLogo from '../assets/images/logo/evionex-logo.png'
import evionexText from '../assets/images/logo/evionex-text.png'
import geneSetuMockup from '../../Gene setu Mockup.png'
import eviNoteMockup from '../../Evinote Mockup.png'
import luminaryMockup from '../../Luminary Mockup.png'
import loginBackground from '../assets/images/auth/login-background.webp'
import doctorHandshake from '../assets/doctor-handshake.jpg'
import { useAuth } from '../contexts/AuthContext'
import './Navbar.css'

const mobileNavLinks = [
    { label: 'Home', href: '/' },
    { label: 'Who We Are', href: '/who-we-are' },
    { label: 'Products', href: '/products' },
    { label: 'Pricing', href: '/pricing' },
    { label: 'Team', href: '/team' },
    { label: 'Careers', href: '/careers' },
    { label: 'Contact', href: '/contact' },
]

const desktopNavItems = [
    { id: 'home', label: 'Home', type: 'link', href: '/' },
    { id: 'company', label: 'Company', type: 'mega' },
    { id: 'products', label: 'Products', type: 'mega' },
    { id: 'pricing', label: 'Pricing', type: 'mega' },
]

const MENU_OPEN_DELAY = 90
const MENU_CLOSE_DELAY = 220
const PREVIEW_FADE_DURATION = 170
const MENU_CLOSE_ANIMATION_DURATION = 280

const defaultPreview = {
    title: 'Evionex',
    description: 'Hover a page card to preview a section.',
    src: loginBackground,
    alt: 'Evionex menu preview',
}

const megaMenuConfig = {
    company: {
        label: 'Company',
        items: [
            {
                id: 'company-about',
                label: 'About Us',
                description: 'Learn how Evionex builds AI-first platforms for research, education, and healthcare.',
                href: '/who-we-are',
                preview: {
                    title: 'About Evionex',
                    description: 'Mission-led technology focused on compliant and impactful innovation.',
                    src: loginBackground,
                    alt: 'Evionex brand preview',
                },
            },
            {
                id: 'company-team',
                label: 'Team',
                description: 'Meet the founding team driving the company vision and execution.',
                href: '/team',
                preview: {
                    title: 'Leadership Team',
                    description: 'Founders building trusted AI products for institutions.',
                    src: loginBackground,
                    alt: 'Evionex team preview',
                },
            },
            {
                id: 'company-careers',
                label: 'Careers',
                description: 'Explore opportunities to build in research, education, and healthcare technology.',
                href: '/careers',
                preview: {
                    title: 'Careers at Evionex',
                    description: 'Join a fast-moving team building meaningful technology.',
                    src: loginBackground,
                    alt: 'Evionex careers preview',
                },
            },
            {
                id: 'company-contact',
                label: 'Contact Us',
                description: 'Connect with us for demos, partnerships, and support inquiries.',
                href: '/contact',
                preview: {
                    title: 'Get in Touch',
                    description: 'Reach Evionex for product demos and collaborations.',
                    src: doctorHandshake,
                    alt: 'Evionex contact preview',
                },
            },
        ],
    },
    products: {
        label: 'Products',
        items: [
            {
                id: 'products-genesetu',
                label: 'GeneSetu',
                description: 'AI-enabled health intelligence using genomic insights and longitudinal records.',
                href: '/products/genesetu',
                preview: {
                    title: 'GeneSetu',
                    description: 'Screen 6,000+ conditions and track lifelong biomarker health data.',
                    src: geneSetuMockup,
                    alt: 'GeneSetu product preview',
                },
            },
            {
                id: 'products-evinote',
                label: 'EviNote',
                description: 'An AI-powered lab platform for experiments, resources, and research operations.',
                href: '/products/evinote',
                preview: {
                    title: 'EviNote',
                    description: 'Run modern labs with structured records and smarter workflows.',
                    src: eviNoteMockup,
                    alt: 'EviNote product preview',
                },
            },
            {
                id: 'products-luminary',
                label: 'Luminary',
                description: 'Adaptive learning experiences with AI-assisted assessments and analytics.',
                href: '/products/luminary',
                preview: {
                    title: 'Luminary',
                    description: 'Personalized learning built for institutions and educators.',
                    src: luminaryMockup,
                    alt: 'Luminary product preview',
                },
            },
            {
                id: 'products-other-services',
                label: 'Other Services',
                description: 'Discover additional offerings and upcoming solutions from Evionex.',
                href: '/',
                preview: {
                    title: 'Other Services',
                    description: 'More platform services and capabilities are on the way.',
                    src: loginBackground,
                    alt: 'Evionex services preview',
                },
            },
        ],
    },
    pricing: {
        label: 'Pricing',
        items: [
            {
                id: 'pricing-genesetu',
                label: 'GeneSetu',
                description: 'Compare genetic testing and healthcare plan options for families and providers.',
                href: '/pricing',
                preview: {
                    title: 'GeneSetu Pricing',
                    description: 'Plans for individuals, families, and healthcare institutions.',
                    src: geneSetuMockup,
                    alt: 'GeneSetu pricing preview',
                },
            },
            {
                id: 'pricing-evinote',
                label: 'EviNote',
                description: 'Evaluate flexible pricing for labs, research teams, and enterprise setups.',
                href: '/pricing',
                preview: {
                    title: 'EviNote Pricing',
                    description: 'Scales from individual labs to institution-wide deployments.',
                    src: eviNoteMockup,
                    alt: 'EviNote pricing preview',
                },
            },
            {
                id: 'pricing-luminary',
                label: 'Luminary',
                description: 'See plan options for students, educators, and university ecosystems.',
                href: '/pricing',
                preview: {
                    title: 'Luminary Pricing',
                    description: 'Flexible plans for classrooms, coaching, and universities.',
                    src: luminaryMockup,
                    alt: 'Luminary pricing preview',
                },
            },
            {
                id: 'pricing-other-services',
                label: 'Other Services',
                description: 'Explore custom packages for broader platform and support requirements.',
                href: '/',
                preview: {
                    title: 'Custom Services',
                    description: 'Reach out for bundled plans, enterprise support, and custom scope.',
                    src: loginBackground,
                    alt: 'Evionex custom services preview',
                },
            },
        ],
    },
}

const megaGroupRoutePrefixes = {
    company: ['/who-we-are', '/team', '/careers', '/contact'],
    products: ['/products'],
    pricing: ['/pricing'],
}

const clearTimer = (timerRef) => {
    if (timerRef.current) {
        window.clearTimeout(timerRef.current)
        timerRef.current = null
    }
}

export default function Navbar() {
    const location = useLocation()
    const navigate = useNavigate()
    const { user, profile, signOut } = useAuth()
    const [scrolled, setScrolled] = useState(false)
    const [mobileOpen, setMobileOpen] = useState(false)
    const [isMegaMenuOpen, setIsMegaMenuOpen] = useState(false)
    const [activeMegaMenu, setActiveMegaMenu] = useState(null)
    const [activeMegaItemId, setActiveMegaItemId] = useState(null)
    const [previewCard, setPreviewCard] = useState(defaultPreview)
    const [previewFading, setPreviewFading] = useState(false)
    const navRef = useRef(null)
    const openTimerRef = useRef(null)
    const closeTimerRef = useRef(null)
    const previewTimerRef = useRef(null)
    const closeAnimationTimerRef = useRef(null)

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

    const closeMegaMenu = useCallback(() => {
        clearTimer(openTimerRef)
        clearTimer(closeTimerRef)
        clearTimer(previewTimerRef)
        clearTimer(closeAnimationTimerRef)

        setIsMegaMenuOpen(false)
        setActiveMegaItemId(null)
        setPreviewFading(false)

        closeAnimationTimerRef.current = window.setTimeout(() => {
            setActiveMegaMenu(null)
            setPreviewCard(defaultPreview)
            closeAnimationTimerRef.current = null
        }, MENU_CLOSE_ANIMATION_DURATION)
    }, [])

    const updatePreview = useCallback((nextPreview) => {
        clearTimer(previewTimerRef)
        setPreviewFading(true)

        previewTimerRef.current = window.setTimeout(() => {
            setPreviewCard(nextPreview)
            setPreviewFading(false)
            previewTimerRef.current = null
        }, PREVIEW_FADE_DURATION)
    }, [])

    const activateMegaMenu = useCallback((menuId) => {
        clearTimer(previewTimerRef)
        clearTimer(closeAnimationTimerRef)

        setActiveMegaMenu(menuId)
        setIsMegaMenuOpen(true)
        setActiveMegaItemId(null)
        setPreviewCard(defaultPreview)
        setPreviewFading(false)
    }, [])

    const handleMegaTriggerEnter = useCallback((menuId) => {
        clearTimer(closeTimerRef)

        if (isMegaMenuOpen) {
            if (activeMegaMenu !== menuId) {
                activateMegaMenu(menuId)
            }
            return
        }

        clearTimer(openTimerRef)
        openTimerRef.current = window.setTimeout(() => {
            activateMegaMenu(menuId)
            openTimerRef.current = null
        }, MENU_OPEN_DELAY)
    }, [activateMegaMenu, activeMegaMenu, isMegaMenuOpen])

    const handleMegaTriggerClick = useCallback((menuId) => {
        clearTimer(openTimerRef)
        clearTimer(closeTimerRef)

        if (isMegaMenuOpen && activeMegaMenu === menuId) {
            closeMegaMenu()
            return
        }

        activateMegaMenu(menuId)
    }, [activateMegaMenu, activeMegaMenu, closeMegaMenu, isMegaMenuOpen])

    const handleMegaZoneEnter = useCallback(() => {
        clearTimer(closeTimerRef)
    }, [])

    const handleMegaZoneLeave = useCallback(() => {
        clearTimer(openTimerRef)
        clearTimer(closeTimerRef)

        closeTimerRef.current = window.setTimeout(() => {
            closeMegaMenu()
        }, MENU_CLOSE_DELAY)
    }, [closeMegaMenu])

    const handleMegaItemHover = useCallback((item) => {
        setActiveMegaItemId(item.id)
        updatePreview(item.preview)
    }, [updatePreview])

    const handleMegaItemsLeave = useCallback(() => {
        setActiveMegaItemId(null)
        updatePreview(defaultPreview)
    }, [updatePreview])

    // Close mobile drawer and mega menu on route change
    useEffect(() => {
        setMobileOpen(false)
        closeMegaMenu()
    }, [closeMegaMenu, location.pathname])

    // Close mobile drawer on Escape key
    useEffect(() => {
        const handleKey = (e) => {
            if (e.key === 'Escape') {
                setMobileOpen(false)
                closeMegaMenu()
            }
        }
        document.addEventListener('keydown', handleKey)
        return () => document.removeEventListener('keydown', handleKey)
    }, [closeMegaMenu])

    // Lock body scroll when mobile menu is open
    useEffect(() => {
        document.body.style.overflow = mobileOpen ? 'hidden' : ''
        return () => { document.body.style.overflow = '' }
    }, [mobileOpen])

    // Cleanup pending timers on unmount
    useEffect(() => {
        return () => {
            clearTimer(openTimerRef)
            clearTimer(closeTimerRef)
            clearTimer(previewTimerRef)
            clearTimer(closeAnimationTimerRef)
        }
    }, [])

    const isActive = (href) => {
        if (href === '/') return location.pathname === '/'
        return location.pathname.startsWith(href)
    }

    const isMegaGroupActive = useCallback((menuId) => {
        const prefixes = megaGroupRoutePrefixes[menuId] || []
        return prefixes.some((prefix) => location.pathname.startsWith(prefix))
    }, [location.pathname])

    const activeMenu = useMemo(() => {
        if (!activeMegaMenu) return null
        return megaMenuConfig[activeMegaMenu] || null
    }, [activeMegaMenu])

    return (
        <>
            <nav
                ref={navRef}
                className={`gn-navbar ${scrolled ? 'gn-navbar--scrolled' : ''}`}
                role="navigation"
                aria-label="Main navigation"
                onMouseEnter={handleMegaZoneEnter}
                onMouseLeave={handleMegaZoneLeave}
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
                        {desktopNavItems.map((item) => {
                            if (item.type === 'link') {
                                return (
                                    <li key={item.id} role="none">
                                        <Link
                                            to={item.href}
                                            role="menuitem"
                                            onMouseEnter={closeMegaMenu}
                                            className={`gn-navbar__link ${isActive(item.href) ? 'gn-navbar__link--active' : ''}`}
                                        >
                                            {item.label}
                                        </Link>
                                    </li>
                                )
                            }

                            const triggerOpen = isMegaMenuOpen && activeMegaMenu === item.id
                            const triggerActive = isMegaGroupActive(item.id)

                            return (
                                <li key={item.id} role="none" className="gn-navbar__mega-item">
                                    <button
                                        type="button"
                                        role="menuitem"
                                        className={`gn-navbar__link gn-navbar__link--trigger ${triggerActive ? 'gn-navbar__link--active' : ''} ${triggerOpen ? 'gn-navbar__link--mega-open' : ''}`}
                                        onMouseEnter={() => handleMegaTriggerEnter(item.id)}
                                        onFocus={() => handleMegaTriggerEnter(item.id)}
                                        onClick={() => handleMegaTriggerClick(item.id)}
                                        aria-haspopup="menu"
                                        aria-expanded={triggerOpen}
                                        aria-controls="gn-mega-menu-panel"
                                    >
                                        <span>{item.label}</span>
                                        <span className="gn-navbar__chevron" aria-hidden="true" />
                                    </button>
                                </li>
                            )
                        })}
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
                        onClick={() => {
                            closeMegaMenu()
                            setMobileOpen((v) => !v)
                        }}
                        aria-label={mobileOpen ? 'Close navigation menu' : 'Open navigation menu'}
                        aria-expanded={mobileOpen}
                    >
                        <span />
                        <span />
                        <span />
                    </button>
                </div>
            </nav>

            {/* Desktop mega menu */}
            <div
                className={`gn-mega-menu-wrapper ${isMegaMenuOpen && activeMenu ? 'gn-mega-menu-wrapper--open' : ''}`}
                onMouseEnter={handleMegaZoneEnter}
                onMouseLeave={handleMegaZoneLeave}
                aria-hidden={!isMegaMenuOpen}
            >
                {activeMenu && (
                    <div
                        id="gn-mega-menu-panel"
                        className="gn-mega-menu"
                        role="menu"
                        aria-label={`${activeMenu.label} menu`}
                        onKeyDown={(e) => {
                            if (e.key === 'Escape') {
                                closeMegaMenu()
                            }
                        }}
                    >
                        <div className="gn-mega-menu__left">
                            <p className="gn-mega-menu__eyebrow">{activeMenu.label}</p>
                            <h3 className="gn-mega-menu__heading">Explore Pages</h3>
                            <ul key={activeMegaMenu} className="gn-mega-menu__list" onMouseLeave={handleMegaItemsLeave}>
                                {activeMenu.items.map((item) => (
                                    <li key={item.id}>
                                        <Link
                                            to={item.href}
                                            role="menuitem"
                                            className={`gn-mega-menu__item ${activeMegaItemId === item.id ? 'gn-mega-menu__item--active' : ''}`}
                                            onMouseEnter={() => handleMegaItemHover(item)}
                                            onFocus={() => handleMegaItemHover(item)}
                                            onClick={closeMegaMenu}
                                        >
                                            <span className="gn-mega-menu__item-title">{item.label}</span>
                                            <span className="gn-mega-menu__item-description">{item.description}</span>
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <div className="gn-mega-menu__right">
                            <div className={`gn-mega-menu__preview ${previewFading ? 'gn-mega-menu__preview--fading' : ''}`}>
                                <img
                                    src={previewCard.src}
                                    alt={previewCard.alt}
                                    className="gn-mega-menu__preview-image"
                                    loading="lazy"
                                />
                                <div className="gn-mega-menu__preview-overlay" aria-hidden="true" />
                            </div>
                        </div>
                    </div>
                )}
            </div>

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
                    {mobileNavLinks.map((link) => (
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

