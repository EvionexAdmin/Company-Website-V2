import { lazy, Suspense, useEffect } from 'react'
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom'
import Layout from './components/Layout'
import Home from './pages/Home'
import ProtectedRoute from './components/ProtectedRoute'
import PaymentProtectedRoute from './components/PaymentProtectedRoute'
import ErrorBoundary from './components/ErrorBoundary'

// Lazy-loaded pages — only downloaded when the route is visited.
// This dramatically reduces the initial JS bundle (Dashboard alone is ~143 KB).
const WhoWeAre = lazy(() => import('./pages/WhoWeAre'))
const Products = lazy(() => import('./pages/Products'))
const EviolifeDetail = lazy(() => import('./pages/EviolifeDetail'))
const EviNoteDetail = lazy(() => import('./pages/EviNoteDetail'))
const LuminaryDetail = lazy(() => import('./pages/LuminaryDetail'))
const Team = lazy(() => import('./pages/Team'))
const Careers = lazy(() => import('./pages/Careers'))
const Contact = lazy(() => import('./pages/Contact'))
const Shop = lazy(() => import('./pages/Shop'))
const ServiceDetail = lazy(() => import('./pages/ServiceDetail'))
const Cart = lazy(() => import('./pages/CartPage'))
const Checkout = lazy(() => import('./pages/Checkout'))
const Login = lazy(() => import('./pages/Login'))
const Signup = lazy(() => import('./pages/Signup'))
const VerifyEmail = lazy(() => import('./pages/VerifyEmail'))
const Dashboard = lazy(() => import('./pages/Dashboard'))
const PrivacyPolicy = lazy(() => import('./pages/PrivacyPolicy'))
const TermsOfUse = lazy(() => import('./pages/TermsOfUse'))
const Subscription = lazy(() => import('./pages/Subscription'))
const ResetPassword = lazy(() => import('./pages/ResetPassword'))

export default function App() {
    const navigate = useNavigate()

    // Supabase redirects to the site URL when a password reset link cannot
    // open the app itself. Only those links belong on the reset page: a
    // sign-in or confirmation link also carries a `code`, but it already has
    // its own route in the hash and has to stay there.
    useEffect(() => {
        const params = new URLSearchParams(window.location.search)
        const hash = window.location.hash || ''
        const hasHashRoute = hash.startsWith('#/')

        // The link was refused by Supabase (expired, used before, ...).
        const isRecoveryError =
            params.has('error_code') ||
            params.has('error_description') ||
            hash.includes('error_code')

        // A recovery link that fell back to the site URL has no route at all.
        const isRecoveryCode = params.has('code') && !hasHashRoute

        // The implicit flow puts the tokens in the hash.
        const isRecoveryToken = hash.includes('access_token') && hash.includes('type=recovery')

        if (
            (isRecoveryError || isRecoveryCode || isRecoveryToken) &&
            !hash.startsWith('#/portal/reset-password')
        ) {
            // Keep the query string, the reset page needs those parameters.
            window.history.replaceState(
                null,
                '',
                `${window.location.pathname}${window.location.search}#/portal/reset-password`
            )
            navigate('/portal/reset-password', { replace: true })
        }
    }, [navigate])

    return (
        <ErrorBoundary>
            <Suspense fallback={null}>
                <Routes>
                    <Route path="/" element={<Layout />}>
                        <Route index element={<Home />} />
                        <Route path="who-we-are" element={<WhoWeAre />} />
                        <Route path="products" element={<Products />} />
                        <Route path="products/eviolife" element={<EviolifeDetail />} />
                        <Route path="products/evinote" element={<EviNoteDetail />} />
                        <Route path="products/luminary" element={<LuminaryDetail />} />
                        <Route path="pricing" element={<Navigate to="/subscribe/eviolife" replace />} />
                        <Route path="team" element={<Team />} />
                        <Route path="careers" element={<Careers />} />
                        <Route path="contact" element={<Contact />} />
                        <Route path="shop" element={<Shop />} />
                        <Route path="service/:id" element={<ServiceDetail />} />
                        <Route path="cart" element={<Cart />} />
                        <Route path="shop/:id" element={<PaymentProtectedRoute><Checkout /></PaymentProtectedRoute>} />
                        <Route path="subscribe/:id" element={<ProtectedRoute><Subscription /></ProtectedRoute>} />
                        <Route path="portal/login" element={<Login />} />
                        <Route path="portal/signup" element={<Signup />} />
                        <Route path="portal/verify-email" element={<VerifyEmail />} />
                        <Route path="portal/reset-password" element={<ResetPassword />} />
                        <Route path="reset-password" element={<ResetPassword />} />
                        <Route path="portal/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
                        <Route path="privacy-policy" element={<PrivacyPolicy />} />
                        <Route path="privacy" element={<PrivacyPolicy />} />
                        <Route path="terms" element={<TermsOfUse />} />
                        <Route path="terms-of-use" element={<TermsOfUse />} />
                    </Route>
                </Routes>
            </Suspense>
        </ErrorBoundary>
    )
}
