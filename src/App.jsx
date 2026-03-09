import { Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import Home from './pages/Home'
import WhoWeAre from './pages/WhoWeAre'
import Products from './pages/Products'
import GeneSetuDetail from './pages/GeneSetuDetail'
import EviNoteDetail from './pages/EviNoteDetail'
import LuminaryDetail from './pages/LuminaryDetail'
import Team from './pages/Team'
import Careers from './pages/Careers'
import Contact from './pages/Contact'
import Pricing from './pages/Pricing'
import Login from './pages/Login'
import Signup from './pages/Signup'
import VerifyEmail from './pages/VerifyEmail'
import Dashboard from './pages/Dashboard'
import ProtectedRoute from './components/ProtectedRoute'

export default function App() {
    return (
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
            </Route>
        </Routes>
    )
}
