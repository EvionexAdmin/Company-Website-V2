import { Link } from 'react-router-dom'
import evionexLogo from '../assets/images/logo/evionex-logo.png'
import evionexText from '../assets/images/logo/evionex-text.png'
import './DashboardHeader.css'

/**
 * Minimal floating logo header for authenticated dashboard views.
 * Replaces the full navigation bar to keep the interface clean
 * and let the dashboard's own sidebar handle navigation.
 */
export default function DashboardHeader() {
    return (
        <header className="dash-header">
            <Link to="/" className="dash-header__logo" aria-label="Evionex — Back to homepage">
                <img
                    src={evionexLogo}
                    alt=""
                    className="dash-header__logo-icon"
                    draggable={false}
                />
                <img
                    src={evionexText}
                    alt="Evionex"
                    className="dash-header__logo-text"
                    draggable={false}
                />
            </Link>
        </header>
    )
}
