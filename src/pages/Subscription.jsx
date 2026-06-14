import { useEffect, useMemo, useState, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { supabaseGeneSetu } from '../lib/supabaseGeneSetu'
import genesetuMockup from '../assets/images/products/genesetu-mockup.png'
import './Subscription.css'

const SOUTH_ASIA_COUNTRIES = ['IN', 'PK', 'BD', 'LK', 'NP', 'MV', 'BT', 'AF']

// Timezones for South Asian countries — used as primary region detection
// (instant, no network call, works on all devices)
const SOUTH_ASIA_TIMEZONES = [
    'Asia/Kolkata', 'Asia/Calcutta',   // India
    'Asia/Karachi',                     // Pakistan
    'Asia/Dhaka',                       // Bangladesh
    'Asia/Colombo',                     // Sri Lanka
    'Asia/Kathmandu', 'Asia/Katmandu', // Nepal
    'Indian/Maldives',                  // Maldives
    'Asia/Thimphu',                     // Bhutan
    'Asia/Kabul',                       // Afghanistan
]

function isSouthAsiaByTimezone() {
    try {
        const tz = Intl.DateTimeFormat().resolvedOptions().timeZone
        return SOUTH_ASIA_TIMEZONES.includes(tz)
    } catch {
        return false
    }
}

const SUPABASE_FUNCTIONS_URL = 'https://bpcprnncbdjjxzqpumzy.supabase.co/functions/v1'

const featureItems = [
    {
        title: 'Wearable connection',
        description: 'Connect Apple Watch, Fitbit, and similar devices to keep your health data in one place.',
    },
    {
        title: 'Advanced health monitoring',
        description: 'Track trends across vitals, lab markers, and daily habits with a clearer long-term view.',
    },
    {
        title: 'Nutrition label scanning',
        description: 'Scan packaged food labels to get faster, more practical nutrition guidance.',
    },
    {
        title: 'Doctor connect',
        description: 'Share your health record with a doctor and keep care conversations better informed.',
    },
    {
        title: 'Family monitoring for up to 7 members',
        description: "Manage more of your family's health history from one secure premium account.",
    },
    {
        title: 'Advanced exercise filtering',
        description: 'Filter activity recommendations by goal, intensity, and health context.',
    },
    {
        title: 'Priority support',
        description: 'Get faster help when you need product guidance or account support.',
    },
]

const reassuranceItems = [
    'Billed monthly',
    'Cancel anytime',
    'Secure checkout',
]

const formatCurrency = (currency, amount) => {
    if (currency === 'INR') {
        return `₹${Math.round(amount).toLocaleString('en-IN')}`
    }
    return `$${amount.toFixed(2)}`
}

/** Dynamically loads the Razorpay checkout.js script exactly once */
function loadRazorpayScript() {
    return new Promise((resolve) => {
        if (document.getElementById('razorpay-checkout-js')) {
            resolve(true)
            return
        }
        const script = document.createElement('script')
        script.id = 'razorpay-checkout-js'
        script.src = 'https://checkout.razorpay.com/v1/checkout.js'
        script.onload = () => resolve(true)
        script.onerror = () => resolve(false)
        document.body.appendChild(script)
    })
}

export default function Subscription() {
    const { user, session } = useAuth()
    const navigate = useNavigate()
    const [loading, setLoading] = useState(true)
    const [processing, setProcessing] = useState(false)
    const [error, setError] = useState(null)
    const [subscribed, setSubscribed] = useState(false)
    const [streak, setStreak] = useState(0)
    const [priceData, setPriceData] = useState({
        currency: 'USD',
        amount: 4,
        symbol: '$',
        regionLabel: 'Global pricing',
    })

    useEffect(() => {
        window.scrollTo(0, 0)
    }, [])

    useEffect(() => {
        if (!user) {
            navigate('/portal/login?redirect=/subscribe/genesetu')
        }
    }, [user, navigate])

    useEffect(() => {
        let isMounted = true

        async function loadPlanDetails() {
            if (!user) return

            try {
                const [locationResult, profileResult] = await Promise.allSettled([
                    fetch('https://ipapi.co/json/'),
                    supabaseGeneSetu
                        .from('profiles')
                        .select('current_streak, is_premium, subscription_tier')
                        .eq('id', user.id)
                        .single(),
                ])

                let currency = 'USD'
                let amount = 4
                let symbol = '$'
                let regionLabel = 'Global pricing'

                // Primary: instant timezone-based detection (no network, no rate limits)
                if (isSouthAsiaByTimezone()) {
                    currency = 'INR'
                    amount = 38
                    symbol = '₹'
                    regionLabel = 'South Asia pricing'
                } else {
                    // Fallback: IP-based geo lookup
                    if (locationResult.status === 'fulfilled') {
                        try {
                            const locationData = await locationResult.value.json()
                            if (locationData?.country_code && SOUTH_ASIA_COUNTRIES.includes(locationData.country_code)) {
                                currency = 'INR'
                                amount = 38
                                symbol = '₹'
                                regionLabel = 'South Asia pricing'
                            }
                        } catch {
                            // Keep global fallback if geo lookup fails
                        }
                    }
                }

                if (isMounted) {
                    setPriceData({ currency, amount, symbol, regionLabel })
                }

                if (profileResult.status === 'fulfilled' && !profileResult.value.error) {
                    const profileData = profileResult.value.data
                    const nextStreak = profileData?.current_streak || 0
                    if (isMounted) {
                        setStreak(nextStreak)
                        // Already premium — show success state immediately
                        if (profileData?.is_premium && profileData?.subscription_tier === 'premium') {
                            setSubscribed(true)
                        }
                    }
                }
            } catch (err) {
                console.error('Error loading subscription details:', err)
            } finally {
                if (isMounted) {
                    setLoading(false)
                }
            }
        }

        loadPlanDetails()

        return () => {
            isMounted = false
        }
    }, [user])

    const hasDiscount = streak >= 30
    const finalAmount = hasDiscount ? priceData.amount * 0.8 : priceData.amount

    const primaryPrice = useMemo(
        () => formatCurrency(priceData.currency, finalAmount),
        [priceData.currency, finalAmount]
    )
    const originalPrice = useMemo(
        () => formatCurrency(priceData.currency, priceData.amount),
        [priceData.currency, priceData.amount]
    )

    const handleSubscribe = useCallback(async () => {
        if (!user || !session) return
        setProcessing(true)
        setError(null)

        try {
            // 1. Load Razorpay checkout script
            const scriptLoaded = await loadRazorpayScript()
            if (!scriptLoaded || !window.Razorpay) {
                throw new Error('Failed to load payment gateway. Please check your connection.')
            }

            // 2. Create subscription server-side (streak verified server-side to prevent tampering)
            const accessToken = session.access_token
            const createRes = await fetch(`${SUPABASE_FUNCTIONS_URL}/create-razorpay-subscription`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${accessToken}`,
                },
                body: JSON.stringify({ currency: priceData.currency }),
            })

            const createData = await createRes.json()

            if (!createRes.ok) {
                if (createData?.error === 'already_subscribed') {
                    setSubscribed(true)
                    setProcessing(false)
                    return
                }
                throw new Error(createData?.error || 'Failed to create subscription.')
            }

            const { subscription_id, key_id } = createData

            // 3. Open Razorpay checkout modal
            await new Promise((resolve, reject) => {
                const options = {
                    key: key_id,
                    subscription_id,
                    name: 'GeneSetu',
                    description: 'GeneSetu Premium — Monthly',
                    image: 'https://www.evionex.com/favicon.ico',
                    prefill: {
                        email: user.email || '',
                    },
                    notes: {
                        user_id: user.id,
                    },
                    theme: {
                        color: '#00d4c8',
                    },
                    modal: {
                        ondismiss: () => reject(new Error('dismissed')),
                    },
                    handler: async (response) => {
                        try {
                            // 4. Verify HMAC signature server-side
                            const verifyRes = await fetch(`${SUPABASE_FUNCTIONS_URL}/verify-razorpay-payment`, {
                                method: 'POST',
                                headers: {
                                    'Content-Type': 'application/json',
                                    'Authorization': `Bearer ${accessToken}`,
                                },
                                body: JSON.stringify({
                                    razorpay_payment_id: response.razorpay_payment_id,
                                    razorpay_subscription_id: response.razorpay_subscription_id,
                                    razorpay_signature: response.razorpay_signature,
                                }),
                            })

                            const verifyData = await verifyRes.json()

                            if (!verifyRes.ok || !verifyData.success) {
                                reject(new Error(verifyData?.message || 'Payment verification failed.'))
                                return
                            }

                            resolve()
                        } catch (err) {
                            reject(err)
                        }
                    },
                }

                const rzp = new window.Razorpay(options)
                rzp.on('payment.failed', (resp) => {
                    reject(new Error(resp?.error?.description || 'Payment failed. Please try again.'))
                })
                rzp.open()
            })

            // 5. Verified — show premium success state
            setSubscribed(true)

        } catch (err) {
            if (err.message === 'dismissed') {
                // User closed modal — silent reset, no error shown
            } else {
                console.error('Subscription error:', err)
                setError(err.message || 'Something went wrong. Please try again.')
            }
        } finally {
            setProcessing(false)
        }
    }, [user, session, priceData.currency])

    if (loading || !user) {
        return (
            <main className="subscription-page subscription-page--loading" aria-busy="true">
                <div className="subscription-loading-card">
                    <div className="subscription-loading-bar" />
                    <div className="subscription-loading-title" />
                    <div className="subscription-loading-text" />
                    <div className="subscription-loading-text subscription-loading-text--short" />
                </div>
            </main>
        )
    }

    return (
        <main className="subscription-page">
            <div className="subscription-bg" aria-hidden="true">
                <span className="subscription-orb subscription-orb--one" />
                <span className="subscription-orb subscription-orb--two" />
                <span className="subscription-grid" />
            </div>

            <div className="subscription-shell">

                <section className="subscription-hero">
                    <div className="subscription-hero__copy">
                        <img src={genesetuMockup} alt="GeneSetu App" className="subscription-hero__mockup" />
                        <div className="subscription-hero__text-content">
                            <span className="subscription-badge">Best for individuals &amp; families</span>
                            <h1>Premium health tracking, built for daily use.</h1>
                            <p className="subscription-hero__description">
                                Keep wearables, nutrition, doctor access, and family monitoring in one premium GeneSetu plan.
                                Clear pricing. Faster support. Less friction.
                            </p>

                            <div className="subscription-reassurance-row" aria-label="Pricing reassurance">
                                {reassuranceItems.map((item) => (
                                    <span key={item} className="subscription-reassurance-pill">{item}</span>
                                ))}
                            </div>
                        </div>
                    </div>

                    <aside className="subscription-plan-card">
                        <div className="subscription-plan-card__header">
                            <span className="subscription-plan-card__eyebrow">Recommended plan</span>
                            <span className="subscription-plan-card__tag">Most popular</span>
                        </div>

                        <div className="subscription-price-block">
                            <p className="subscription-price-block__label">{priceData.regionLabel}</p>
                            <div className="subscription-price-block__price">
                                <span className="subscription-price-block__value">
                                    {hasDiscount ? primaryPrice : originalPrice}
                                </span>
                                <span className="subscription-price-block__term">/ month</span>
                            </div>

                            {hasDiscount ? (
                                <p className="subscription-price-block__discount subscription-price-block__discount--active">
                                    🔥 20% streak discount applied — {streak}-day nutri-logging streak.
                                </p>
                            ) : (
                                <p className="subscription-price-block__discount">
                                    Start at the monthly rate shown above. Streak rewards unlock automatically at renewal.
                                </p>
                            )}
                        </div>

                        <ul className="subscription-feature-list">
                            {featureItems.map((feature) => (
                                <li key={feature.title} className="subscription-feature-item">
                                    <span className="subscription-feature-item__icon" aria-hidden="true">✓</span>
                                    <div>
                                        <strong>{feature.title}</strong>
                                        <p>{feature.description}</p>
                                    </div>
                                </li>
                            ))}
                        </ul>

                        {subscribed ? (
                            <div className="subscription-success-state" role="status">
                                <div className="subscription-success-state__icon" aria-hidden="true">
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M20 6L9 17l-5-5" />
                                    </svg>
                                </div>
                                <p className="subscription-success-state__title">You&apos;re now Premium</p>
                                <p className="subscription-success-state__sub">
                                    Your GeneSetu subscription is active. Open the app to unlock all features.
                                </p>
                                <button
                                    type="button"
                                    className="subscription-cta subscription-cta--secondary"
                                    onClick={() => navigate('/portal/dashboard')}
                                >
                                    Go to Dashboard
                                </button>
                            </div>
                        ) : (
                            <>
                                {error && (
                                    <p className="subscription-error" role="alert">{error}</p>
                                )}
                                <button
                                    id="genesetu-subscribe-btn"
                                    type="button"
                                    className="subscription-cta"
                                    onClick={handleSubscribe}
                                    disabled={processing}
                                >
                                    {processing && (
                                        <span className="subscription-cta__spinner" aria-hidden="true" />
                                    )}
                                    {processing ? 'Opening checkout…' : 'Start Premium'}
                                </button>
                            </>
                        )}

                        <p className="subscription-cta-note">
                            Billed monthly. Cancel anytime. Secure checkout powered by Razorpay.
                        </p>

                        <div className="subscription-cta-row" aria-label="Subscription details">
                            <span>Monthly billing</span>
                            <span>Instant access after payment</span>
                        </div>
                    </aside>
                </section>
            </div>
        </main>
    )
}