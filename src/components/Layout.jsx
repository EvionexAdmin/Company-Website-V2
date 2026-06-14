import { Outlet, useLocation } from 'react-router-dom'
import { useEffect, useRef } from 'react'
import Lenis from 'lenis'
import Navbar from './Navbar'
import DashboardHeader from './DashboardHeader'
import Footer from './Footer'
import { useAuth } from '../contexts/AuthContext'

export default function Layout() {
    const { pathname } = useLocation()
    const { user } = useAuth()
    const lenisRef = useRef(null)

    const isDashboard = pathname.startsWith('/portal/dashboard')
    const isShopPage = pathname === '/shop'
    const isSubscriptionPage = pathname.startsWith('/subscribe')
    const showMinimalHeader = isDashboard && !!user

    // Initialize Lenis smooth scrolling
    useEffect(() => {
        const lenis = new Lenis({
            duration: 1.2,
            easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
            smoothWheel: true,
            touchMultiplier: 2,
        })
        lenisRef.current = lenis

        function raf(time) {
            lenis.raf(time)
            requestAnimationFrame(raf)
        }
        requestAnimationFrame(raf)

        return () => {
            lenis.destroy()
            lenisRef.current = null
        }
    }, [])

    // Scroll to top on route change
    useEffect(() => {
        if (lenisRef.current) {
            lenisRef.current.scrollTo(0, { immediate: true })
        } else {
            window.scrollTo(0, 0)
        }
    }, [pathname])

    return (
        <div className={`app-layout ${isShopPage ? 'app-layout--shop' : ''} ${isSubscriptionPage ? 'app-layout--subscription' : ''}`}>
            {showMinimalHeader ? <DashboardHeader /> : <Navbar />}
            <main className="main-content">
                <Outlet />
            </main>
            {!isDashboard && <Footer />}
        </div>
    )
}
