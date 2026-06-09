import { Navigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

/**
 * PaymentProtectedRoute — wraps payment/checkout pages that require authentication.
 * 
 * If no user session exists, redirects to /portal/login with the current location
 * as a `redirect` param so the user returns to the payment page after login.
 * 
 * If the account is suspended, blocks access and redirects to login.
 */
export default function PaymentProtectedRoute({ children }) {
    const { user, loading, isSuspended, signOut } = useAuth()

    // Show loading while auth state is being determined
    if (loading) {
        return (
            <div className="loading-spinner">
                <div className="loading-spinner__ring" />
            </div>
        )
    }

    // No authenticated user — redirect to login with return path
    if (!user) {
        return <Navigate to={`/portal/login?redirect=${encodeURIComponent(window.location.pathname + window.location.search)}`} replace />
    }

    // Account suspended — force sign out and redirect
    if (isSuspended) {
        signOut()
        return <Navigate to="/portal/login" replace />
    }

    return children
}
