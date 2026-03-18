import { lazy, Suspense } from 'react'
import { Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import Home from './pages/Home'
import ProtectedRoute from './components/ProtectedRoute'

// Lazy-loaded pages — only downloaded when the route is visited.
// This dramatically reduces the initial JS bundle (Dashboard alone is ~143 KB).
const WhoWeAre = lazy(() => import('./pages/WhoWeAre'))
const Products = lazy(() => import('./pages/Products'))
const GeneSetuDetail = lazy(() => import('./pages/GeneSetuDetail'))
const EviNoteDetail = lazy(() => import('./pages/EviNoteDetail'))
const LuminaryDetail = lazy(() => import('./pages/LuminaryDetail'))
const Team = lazy(() => import('./pages/Team'))
const Careers = lazy(() => import('./pages/Careers'))
const Contact = lazy(() => import('./pages/Contact'))
const Pricing = lazy(() => import('./pages/Pricing'))
const Login = lazy(() => import('./pages/Login'))
const Signup = lazy(() => import('./pages/Signup'))
const VerifyEmail = lazy(() => import('./pages/VerifyEmail'))
const Dashboard = lazy(() => import('./pages/Dashboard'))
const PrivacyPolicy = lazy(() => import('./pages/PrivacyPolicy'))

export default function App() {
    return (
        <Suspense fallback={null}>
            <Routes>
                <Route path="/" element={<Layout />}>
                    <Route index element={<Home />} />
                    <Route path="who-we-are" element={<WhoWeAre />} />
                    <Route path="products" element={<Products />} />
                    <Route path="products/genesetu" element={<GeneSetuDetail />} />
                    <Route path="products/evinote" element={<EviNoteDetail />} />
                    <Route path="products/luminary" element={<LuminaryDetail />} />
                    <Route path="team" element={<Team />} />
                    <Route path="careers" element={<Careers />} />
                    <Route path="contact" element={<Contact />} />
                    <Route path="pricing" element={<Pricing />} />
                    <Route path="portal/login" element={<Login />} />
                    <Route path="portal/signup" element={<Signup />} />
                    <Route path="portal/verify-email" element={<VerifyEmail />} />
                    <Route path="portal/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
                    <Route path="privacy-policy" element={<PrivacyPolicy />} />
                </Route>
            </Routes>
        </Suspense>
    )
}
