import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import evionexLogo from '../assets/images/logo/evionex-logo.png'
import evionexText from '../assets/images/logo/evionex-text.png'
import geneSetuMockup from '../assets/images/products/genesetu-mockup.png'
import eviNoteMockup from '../assets/images/products/evinote-mockup.png'
import luminaryMockup from '../assets/images/products/luminary-mockup.png'
import loginBackground from '../assets/images/auth/login-background.webp'
import doctorHandshake from '../assets/images/company/doctor-handshake.jpg'
import aboutUsPreview from '../assets/images/company/about-us-hero.webp'
import teamPreview from '../assets/images/company/team-hero.webp'
import careersPreview from '../assets/images/company/careers-hero.webp'
import companyPreview from '../assets/images/company/company-preview.webp'
import geneSetuPreview from '../assets/images/products-nav/genesetu-nav.webp'
import eviNotePreview from '../assets/images/products-nav/evinote-nav.webp'
import luminaryPreview from '../assets/images/products-nav/luminary-nav.webp'
import productsDefaultPreviewImage from '../assets/images/products-nav/products-preview.webp'
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
const MOTION_EASE = [0.22, 1, 0.36, 1]

const defaultPreview = {
    title: 'Evionex',
    description: 'Hover a page card to preview a section.',
    src: loginBackground,
    alt: 'Evionex menu preview',
}

const companyDefaultPreview = {
    title: 'Evionex Company',
    description: 'Explore our story, team, and culture.',
    src: companyPreview,
    alt: 'Evionex company preview',
}

const productsDefaultPreview = {
    title: 'Evionex Products',
    description: 'Explore the product portfolio and platform capabilities.',
    src: productsDefaultPreviewImage,
    alt: 'Evionex products preview',
}

const megaMenuConfig = {
    company: {
        label: 'Company',
        defaultPreview: companyDefaultPreview,
        items: [
            {
                id: 'company-about',
                label: 'About Us',
                description: 'Learn how Evionex builds AI-first platforms for research, education, and healthcare.',
                href: '/who-we-are',
                preview: {
                    title: 'About Evionex',
                    description: 'Mission-led technology focused on compliant and impactful innovation.',
                    src: aboutUsPreview,
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
                    src: teamPreview,
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
                    src: careersPreview,
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
        defaultPreview: productsDefaultPreview,
        items: [
            {
                id: 'products-genesetu',
                label: 'GeneSetu',
                description: 'AI-enabled health intelligence using genomic insights and longitudinal records.',
                href: '/products/genesetu',
                preview: {
                    title: 'GeneSetu',
                    description: 'Screen 6,000+ conditions and track lifelong biomarker health data.',
                    src: geneSetuPreview,
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
                    src: eviNotePreview,
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
                    src: luminaryPreview,
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
                    src: productsDefaultPreviewImage,
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

const getMenuDefaultPreview = (menuId) => megaMenuConfig[menuId]?.defaultPreview || defaultPreview

export default function Navbar() {
    const location = useLocation()
    const navigate = useNavigate()
    const shouldReduceMotion = false // Temporarily set to false so you can see the animations
    const { user, profile, signOut } = useAuth()
    const [scrolled, setScrolled] = useState(false)
    const [mobileOpen, setMobileOpen] = useState(false)
    const [isMegaMenuOpen, setIsMegaMenuOpen] = useState(false)
    const [activeMegaMenu, setActiveMegaMenu] = useState(null)
    const [activeMegaItemId, setActiveMegaItemId] = useState(null)
    const [previewCard, setPreviewCard] = useState(defaultPreview)
    const [fadingPreviewCard, setFadingPreviewCard] = useState(null)
    const [hoveredNavItem, setHoveredNavItem] = useState(null)
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
        setFadingPreviewCard(null)

        closeAnimationTimerRef.current = window.setTimeout(() => {
            setActiveMegaMenu(null)
            setPreviewCard(defaultPreview)
            closeAnimationTimerRef.current = null
        }, MENU_CLOSE_ANIMATION_DURATION)
    }, [])

    const updatePreview = useCallback((nextPreview) => {
        clearTimer(previewTimerRef)
        if (previewCard.src === nextPreview.src) {
            return
        }

        setFadingPreviewCard(previewCard)
        setPreviewCard(nextPreview)

        previewTimerRef.current = window.setTimeout(() => {
            setFadingPreviewCard(null)
            previewTimerRef.current = null
        }, PREVIEW_FADE_DURATION)
    }, [previewCard])

    const activateMegaMenu = useCallback((menuId) => {
        clearTimer(previewTimerRef)
        clearTimer(closeAnimationTimerRef)

        setActiveMegaMenu(menuId)
        setIsMegaMenuOpen(true)
        setActiveMegaItemId(null)
        setFadingPreviewCard(null)
        setPreviewCard(getMenuDefaultPreview(menuId))
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
        updatePreview(getMenuDefaultPreview(activeMegaMenu))
    }, [activeMegaMenu, updatePreview])

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

    const isCrossfadingPreview = Boolean(fadingPreviewCard && fadingPreviewCard.src !== previewCard.src)

    return (
        <>
            <motion.nav
                ref={navRef}
                className={`gn-navbar ${scrolled ? 'gn-navbar--scrolled' : ''}`}
                role="navigation"
                aria-label="Main navigation"
                onMouseEnter={handleMegaZoneEnter}
                onMouseLeave={handleMegaZoneLeave}
                initial={shouldReduceMotion ? false : { opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={shouldReduceMotion ? { duration: 0 } : { duration: 0.46, ease: MOTION_EASE }}
            >
                {/* Animated gradient bottom border */}
                <div className="gn-navbar__gradient-border" aria-hidden="true" />

                <div className="gn-navbar__inner">
                    {/* Logo */}
                    <motion.div
                        style={{ display: 'flex' }}
                        whileHover={shouldReduceMotion ? undefined : { y: -1, scale: 1.01 }}
                        whileTap={shouldReduceMotion ? undefined : { scale: 0.99 }}
                        transition={shouldReduceMotion ? { duration: 0 } : { duration: 0.18, ease: MOTION_EASE }}
                    >
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
                    </motion.div>

                    {/* Desktop links */}
                    <motion.ul
                        className="gn-navbar__links"
                        role="menubar"
                        initial="hidden"
                        animate="visible"
                        variants={{
                            hidden: { opacity: 0 },
                            visible: {
                                opacity: 1,
                                transition: { staggerChildren: 0.05, delayChildren: 0.1 }
                            }
                        }}
                        onMouseLeave={() => setHoveredNavItem(null)}
                    >
                        {desktopNavItems.map((item) => {
                            if (item.type === 'link') {
                                return (
                                    <motion.li
                                        key={item.id}
                                        role="none"
                                        variants={{
                                            hidden: { opacity: 0, y: -10 },
                                            visible: { opacity: 1, y: 0, transition: { duration: 0.3, ease: MOTION_EASE } }
                                        }}
                                        onMouseEnter={() => {
                                            closeMegaMenu()
                                            setHoveredNavItem(item.id)
                                        }}
                                        onFocus={() => {
                                            closeMegaMenu()
                                            setHoveredNavItem(item.id)
                                        }}
                                        style={{ position: 'relative' }}
                                    >
                                        {hoveredNavItem === item.id && (
                                            <motion.div
                                                layoutId="desktop-nav-pill"
                                                className="gn-navbar__magic-pill"
                                                initial={{ opacity: 0 }}
                                                animate={{ opacity: 1 }}
                                                exit={{ opacity: 0 }}
                                                transition={{ type: "spring", stiffness: 400, damping: 30 }}
                                                style={{
                                                    position: "absolute",
                                                    inset: 0,
                                                    backgroundColor: "rgba(255, 255, 255, 0.08)",
                                                    borderRadius: "8px",
                                                    zIndex: 0
                                                }}
                                            />
                                        )}
                                        <Link
                                            to={item.href}
                                            role="menuitem"
                                            className={`gn-navbar__link ${isActive(item.href) ? 'gn-navbar__link--active' : ''}`}
                                            style={{ position: 'relative', zIndex: 1 }}
                                        >
                                            <span className="gn-navbar__label">{item.label}</span>
                                        </Link>
                                    </motion.li>
                                )
                            }

                            const triggerOpen = isMegaMenuOpen && activeMegaMenu === item.id
                            const triggerActive = isMegaGroupActive(item.id)

                            return (
                                <motion.li
                                    key={item.id}
                                    role="none"
                                    className="gn-navbar__mega-item"
                                    variants={{
                                        hidden: { opacity: 0, y: -10 },
                                        visible: { opacity: 1, y: 0, transition: { duration: 0.3, ease: MOTION_EASE } }
                                    }}
                                    onMouseEnter={() => {
                                        handleMegaTriggerEnter(item.id)
                                        setHoveredNavItem(item.id)
                                    }}
                                    onFocus={() => {
                                        handleMegaTriggerEnter(item.id)
                                        setHoveredNavItem(item.id)
                                    }}
                                    style={{ position: 'relative' }}
                                >
                                    {hoveredNavItem === item.id && (
                                        <motion.div
                                            layoutId="desktop-nav-pill"
                                            className="gn-navbar__magic-pill"
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            exit={{ opacity: 0 }}
                                            transition={{ type: "spring", stiffness: 400, damping: 30 }}
                                            style={{
                                                position: "absolute",
                                                inset: 0,
                                                backgroundColor: "rgba(255, 255, 255, 0.08)",
                                                borderRadius: "8px",
                                                zIndex: 0
                                            }}
                                        />
                                    )}
                                    <button
                                        type="button"
                                        role="menuitem"
                                        className={`gn-navbar__link gn-navbar__link--trigger ${triggerActive ? 'gn-navbar__link--active' : ''} ${triggerOpen ? 'gn-navbar__link--mega-open' : ''}`}
                                        onClick={() => handleMegaTriggerClick(item.id)}
                                        aria-haspopup="menu"
                                        aria-expanded={triggerOpen}
                                        aria-controls="gn-mega-menu-panel"
                                        style={{ position: 'relative', zIndex: 1 }}
                                    >
                                        <span className="gn-navbar__label">{item.label}</span>
                                        <span className="gn-navbar__chevron" aria-hidden="true" />
                                    </button>
                                </motion.li>
                            )
                        })}
                    </motion.ul>

                    {/* Right side: avatar + CTA */}
                    <motion.div
                        className="gn-navbar__actions"
                        initial={shouldReduceMotion ? false : { opacity: 0, y: -8 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={shouldReduceMotion
                            ? { duration: 0 }
                            : { duration: 0.28, ease: MOTION_EASE, delay: 0.28 }}
                    >
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
                    </motion.div>

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
            </motion.nav>

            {/* Desktop mega menu */}
            <AnimatePresence>
                {isMegaMenuOpen && activeMenu && (
                    <motion.div
                        className="gn-mega-menu-wrapper gn-mega-menu-wrapper--open"
                        onMouseEnter={handleMegaZoneEnter}
                        onMouseLeave={handleMegaZoneLeave}
                        initial={shouldReduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: -14 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={shouldReduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: -10 }}
                        transition={shouldReduceMotion ? { duration: 0 } : { duration: 0.24, ease: MOTION_EASE }}
                    >
                        <motion.div
                            key={activeMegaMenu}
                            id="gn-mega-menu-panel"
                            className="gn-mega-menu"
                            role="menu"
                            aria-label={`${activeMenu.label} menu`}
                            onKeyDown={(e) => {
                                if (e.key === 'Escape') {
                                    closeMegaMenu()
                                }
                            }}
                            initial={shouldReduceMotion ? { opacity: 1, y: 0, scale: 1 } : { opacity: 0, y: -8, scale: 0.986 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={shouldReduceMotion ? { opacity: 1, y: 0, scale: 1 } : { opacity: 0, y: -6, scale: 0.986 }}
                            transition={shouldReduceMotion ? { duration: 0 } : { duration: 0.22, ease: MOTION_EASE }}
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
                                <div className="gn-mega-menu__preview">
                                    <div className="gn-mega-menu__preview-stack" aria-live="polite">
                                        {isCrossfadingPreview && (
                                            <motion.img
                                                key={`outgoing-${fadingPreviewCard.src}`}
                                                src={fadingPreviewCard.src}
                                                alt=""
                                                aria-hidden="true"
                                                className="gn-mega-menu__preview-image gn-mega-menu__preview-image--outgoing"
                                                loading="lazy"
                                                initial={shouldReduceMotion ? false : { opacity: 1, scale: 1, filter: 'blur(0px)' }}
                                                animate={{ opacity: 0, scale: 1.04, filter: 'blur(3px)' }}
                                                transition={shouldReduceMotion ? { duration: 0 } : { duration: PREVIEW_FADE_DURATION / 1000, ease: MOTION_EASE }}
                                            />
                                        )}
                                        <motion.img
                                            key={previewCard.src}
                                            src={previewCard.src}
                                            alt={previewCard.alt}
                                            className="gn-mega-menu__preview-image"
                                            loading="lazy"
                                            initial={shouldReduceMotion ? false : { opacity: isCrossfadingPreview ? 0 : 1, scale: isCrossfadingPreview ? 0.98 : 1, filter: isCrossfadingPreview ? 'blur(3px)' : 'blur(0px)' }}
                                            animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
                                            transition={shouldReduceMotion ? { duration: 0 } : { duration: isCrossfadingPreview ? PREVIEW_FADE_DURATION / 1000 : 0.22, ease: MOTION_EASE }}
                                        />
                                    </div>
                                    <div className="gn-mega-menu__preview-overlay" aria-hidden="true" />
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            <AnimatePresence>
                {mobileOpen && (
                    <>
                        {/* Mobile overlay */}
                        <motion.div
                            className="gn-mobile-overlay gn-mobile-overlay--visible"
                            onClick={() => setMobileOpen(false)}
                            aria-hidden="true"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={shouldReduceMotion ? { duration: 0 } : { duration: 0.2, ease: 'easeOut' }}
                        />

                        {/* Mobile drawer */}
                        <motion.aside
                            className="gn-mobile-drawer gn-mobile-drawer--open"
                            aria-label="Mobile navigation"
                            initial={shouldReduceMotion ? { x: 0 } : { x: '100%' }}
                            animate={{ x: 0 }}
                            exit={shouldReduceMotion ? { x: 0 } : { x: '100%' }}
                            transition={shouldReduceMotion ? { duration: 0 } : { duration: 0.34, ease: MOTION_EASE }}
                        >
                            <div className="gn-mobile-drawer__links">
                                {mobileNavLinks.map((link, index) => (
                                    <motion.div
                                        key={link.href}
                                        initial={shouldReduceMotion ? false : { opacity: 0, x: 24 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={shouldReduceMotion
                                            ? { duration: 0 }
                                            : { duration: 0.24, ease: MOTION_EASE, delay: 0.06 + (index * 0.04) }}
                                    >
                                        <Link
                                            to={link.href}
                                            className={`gn-mobile-drawer__link ${isActive(link.href) ? 'gn-mobile-drawer__link--active' : ''}`}
                                            onClick={() => setMobileOpen(false)}
                                        >
                                            {link.label}
                                        </Link>
                                    </motion.div>
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
                        </motion.aside>
                    </>
                )}
            </AnimatePresence>
        </>
    )
}

