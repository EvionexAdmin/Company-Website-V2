import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

/**
 * ProtectedRoute — wraps any route that requires authentication.
 * If no user session exists, redirects to /portal/login.
 * If the account is suspended, shows a blocked message and signs out.
 */
export default function ProtectedRoute({ children }) {
    const { user, loading, isSuspended, signOut } = useAuth()
    const location = useLocation()

    // Show loading while auth state is being determined
    if (loading) {
        return (
            <div className="loading-spinner">
                <div className="loading-spinner__ring" />
            </div>
        )
    }

    // No authenticated user — redirect to login
    if (!user) {
        const redirect = `${location.pathname}${location.search}${location.hash}`
        return <Navigate to={`/portal/login?redirect=${encodeURIComponent(redirect)}`} replace />
    }

    // Account suspended — force sign out and redirect
    if (isSuspended) {
        signOut()
        return <Navigate to="/portal/login" replace />
    }

    return children
}
