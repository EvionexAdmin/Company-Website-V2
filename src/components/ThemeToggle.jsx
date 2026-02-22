import { Sun, Moon } from 'lucide-react'
import { useTheme } from '../contexts/ThemeContext'

export default function ThemeToggle() {
    const { theme, toggleTheme } = useTheme()
    const isDark = theme === 'dark'

    return (
        <button
            onClick={toggleTheme}
            className="theme-toggle"
            aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
            title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
        >
            <span className={`theme-toggle__icon ${isDark ? 'theme-toggle__icon--active' : ''}`}>
                <Moon size={16} />
            </span>
            <span className={`theme-toggle__icon ${!isDark ? 'theme-toggle__icon--active' : ''}`}>
                <Sun size={16} />
            </span>
        </button>
    )
}
