import { useEffect, useRef, useCallback } from 'react'

/**
 * Cloudflare Turnstile CAPTCHA widget (explicit rendering for React SPA).
 *
 * Props:
 *   onVerify(token)  — called when challenge is solved
 *   onError()        — called on challenge error
 *   onExpire()       — called when token expires (5 min)
 */
export default function TurnstileWidget({ onVerify, onError, onExpire }) {
    const containerRef = useRef(null)
    const widgetIdRef = useRef(null)

    const siteKey = import.meta.env.VITE_TURNSTILE_SITE_KEY

    const handleVerify = useCallback(
        (token) => {
            if (onVerify) onVerify(token)
        },
        [onVerify]
    )

    const handleError = useCallback(() => {
        if (onError) onError()
    }, [onError])

    const handleExpire = useCallback(() => {
        // Token expired — clear parent state so form can't submit stale token
        if (onExpire) onExpire()
        // Reset widget to get a fresh challenge
        if (widgetIdRef.current != null && window.turnstile) {
            window.turnstile.reset(widgetIdRef.current)
        }
    }, [onExpire])

    useEffect(() => {
        if (!containerRef.current) return

        const renderWidget = () => {
            // Prevent duplicate renders
            if (widgetIdRef.current != null) return
            if (!containerRef.current) return

            widgetIdRef.current = window.turnstile.render(containerRef.current, {
                sitekey: siteKey,
                theme: 'dark',
                size: 'flexible',
                callback: handleVerify,
                'error-callback': handleError,
                'expired-callback': handleExpire,
            })
        }

        // If the deferred Turnstile script hasn't loaded yet, poll until ready
        if (!window.turnstile) {
            const interval = setInterval(() => {
                if (window.turnstile && containerRef.current) {
                    clearInterval(interval)
                    renderWidget()
                }
            }, 200)
            return () => clearInterval(interval)
        }

        // Script already loaded — render immediately (no turnstile.ready)
        renderWidget()

        // Cleanup on unmount — remove the widget from the DOM
        return () => {
            if (widgetIdRef.current != null && window.turnstile) {
                try {
                    window.turnstile.remove(widgetIdRef.current)
                } catch {
                    // Ignore if already removed
                }
                widgetIdRef.current = null
            }
        }
    }, [siteKey, handleVerify, handleError, handleExpire])

    return <div ref={containerRef} className="turnstile-container" />
}
