import { useEffect, useState, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { supabaseEviolife } from '../lib/supabaseEviolife'
import eviolifeMockup from '../assets/images/products/eviolife-mockup.png'
import './Subscription.css'

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
    'Cancel anytime',
    'Secure checkout',
    'Premium health features',
]

const formatCurrency = (currency, amount) => {
    return new Intl.NumberFormat(currency === 'INR' ? 'en-IN' : 'en-US', {
        style: 'currency',
        currency,
        minimumFractionDigits: 0,
        maximumFractionDigits: 2,
    }).format(amount)
}

const PLAN_PRICES = {
    INR: {
        weeklyReference: 12,
        monthlyCharge: 52,
        yearlyCharge: 499,
        yearlyRegularPrice: 624,
    },
    USD: {
        weeklyReference: 1.5,
        monthlyCharge: 6.5,
        yearlyCharge: 63,
        yearlyRegularPrice: 78,
    },
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
    const [planType, setPlanType] = useState('monthly')
    const [couponCode, setCouponCode] = useState('')
    const [coupon, setCoupon] = useState(null)
    const [couponMessage, setCouponMessage] = useState('')
    const [couponLoading, setCouponLoading] = useState(false)
    const [subscriptionId, setSubscriptionId] = useState(null)
    const [cancelAt, setCancelAt] = useState(null)
    const [cancelScheduled, setCancelScheduled] = useState(false)
    const [cancelling, setCancelling] = useState(false)
    const [paymentPending, setPaymentPending] = useState(false)
    const [priceData, setPriceData] = useState({
        currency: isSouthAsiaByTimezone() ? 'INR' : 'USD',
        amount: 0,
        symbol: '',
        regionLabel: 'Global pricing',
    })

    useEffect(() => {
        window.scrollTo(0, 0)
    }, [])

    useEffect(() => {
        if (!user) {
            navigate('/portal/login?redirect=/subscribe/eviolife')
        }
    }, [user, navigate])

    useEffect(() => {
        let isMounted = true

        async function loadPlanDetails() {
            if (!user) return

            try {
                const currency = isSouthAsiaByTimezone() ? 'INR' : 'USD'
                if (isMounted) {
                    setPriceData({
                        currency,
                        amount: 0,
                        symbol: currency === 'INR' ? '₹' : '$',
                        regionLabel: currency === 'INR' ? 'South Asia pricing' : 'Global pricing',
                    })
                }

                const { data: profileData, error: profileError } = await supabaseEviolife
                    .from('profiles')
                    .select('is_premium, subscription_tier')
                    .eq('id', user.id)
                    .maybeSingle()

                if (profileError) throw profileError
                if (isMounted && profileData?.is_premium && profileData?.subscription_tier === 'premium') {
                    setSubscribed(true)
                }

                const { data: subscription, error: subscriptionError } = await supabaseEviolife
                    .from('subscriptions')
                    .select('razorpay_subscription_id, current_period_end, cancel_at_period_end')
                    .eq('user_id', user.id)
                    .in('status', ['authenticated', 'active'])
                    .order('created_at', { ascending: false })
                    .limit(1)
                    .maybeSingle()

                if (subscriptionError) throw subscriptionError
                if (isMounted && subscription) {
                    setCancelScheduled(Boolean(subscription.cancel_at_period_end))
                    setSubscriptionId(subscription.cancel_at_period_end ? null : subscription.razorpay_subscription_id)
                    setCancelAt(subscription.current_period_end)
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

    const selectedPlanPrice = PLAN_PRICES[priceData.currency]
    const discountFactor = coupon?.discountPercent ? (1 - coupon.discountPercent / 100) : 1
    const discountedWeekly = Math.round(selectedPlanPrice.weeklyReference * discountFactor * 100) / 100
    const discountedMonthly = Math.round(selectedPlanPrice.monthlyCharge * discountFactor * 100) / 100
    const discountedYearly = Math.round(selectedPlanPrice.yearlyCharge * discountFactor * 100) / 100

    const primaryPrice = planType === 'monthly'
        ? coupon?.discountPercent
            ? `${formatCurrency(priceData.currency, discountedWeekly)}/week`
            : `${formatCurrency(priceData.currency, selectedPlanPrice.weeklyReference)}/week`
        : coupon?.discountPercent
            ? formatCurrency(priceData.currency, discountedYearly)
            : formatCurrency(priceData.currency, selectedPlanPrice.yearlyCharge)

    const originalPrice = planType === 'yearly'
        ? formatCurrency(priceData.currency, selectedPlanPrice.yearlyRegularPrice)
        : null
    const originalMonthlyWeekly = planType === 'monthly' && coupon?.discountPercent
        ? `${formatCurrency(priceData.currency, selectedPlanPrice.weeklyReference)}/week`
        : null
    const originalMonthlyTotal = planType === 'monthly' && coupon?.discountPercent
        ? `${formatCurrency(priceData.currency, selectedPlanPrice.monthlyCharge)}/month`
        : null

    const handleApplyCoupon = useCallback(async () => {
        const normalizedCode = couponCode.trim().toUpperCase()
        if (!normalizedCode) {
            setCoupon(null)
            setCouponMessage('Enter a coupon code.')
            return
        }
        if (priceData.currency !== 'INR') {
            setCoupon(null)
            setCouponMessage('Coupons are currently available for INR subscriptions only.')
            return
        }

        setCouponLoading(true)
        setCouponMessage('')
        try {
            const { data, error: couponError } = await supabaseEviolife.functions.invoke(
                'validate-subscription-coupon',
                { body: { code: normalizedCode, planType, currency: priceData.currency } }
            )
            if (couponError) throw couponError
            if (!data?.valid) throw new Error(data?.error || 'This coupon is not available.')
            setCoupon(data)
            setCouponCode(normalizedCode)
            setCouponMessage(`${data.discountPercent}% off your first invoice.`)
        } catch (err) {
            setCoupon(null)
            setCouponMessage(err.message || 'Could not validate this coupon.')
        } finally {
            setCouponLoading(false)
        }
    }, [couponCode, planType, priceData.currency])

    const handleCancelSubscription = useCallback(async () => {
        if (!subscriptionId || !session) return
        setCancelling(true)
        setError(null)
        try {
            const { data, error: cancelError } = await supabaseEviolife.functions.invoke(
                'cancel-razorpay-subscription',
                { body: { subscriptionId } }
            )
            if (cancelError) throw cancelError
            if (!data?.success) throw new Error(data?.error || 'Unable to cancel your subscription.')
            setCancelAt(data.cancelAt || null)
            setCancelScheduled(true)
            setSubscriptionId(null)
            setSubscribed(true)
        } catch (err) {
            setError(err.message || 'Unable to cancel your subscription.')
        } finally {
            setCancelling(false)
        }
    }, [subscriptionId, session])

    const handleSubscribe = useCallback(async () => {
        if (!user || !session) return
        if (couponCode.trim() && coupon?.code !== couponCode.trim().toUpperCase()) {
            setError('Apply the coupon before starting checkout, or remove the coupon code.')
            return
        }
        setProcessing(true)
        setError(null)

        try {
            // 1. Load Razorpay checkout script
            const scriptLoaded = await loadRazorpayScript()
            if (!scriptLoaded || !window.Razorpay) {
                throw new Error('Failed to load payment gateway. Please check your connection.')
            }

            // Plan prices and coupon eligibility are validated by the server.
            const accessToken = session.access_token
            const createRes = await fetch(`${SUPABASE_FUNCTIONS_URL}/create-razorpay-subscription`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${accessToken}`,
                },
                body: JSON.stringify({
                    currency: priceData.currency,
                    planType,
                    couponCode: coupon?.code || null,
                }),
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
            const verification = await new Promise((resolve, reject) => {
                const options = {
                    key: key_id,
                    subscription_id,
                    name: 'Eviolife',
                    description: `Eviolife Premium — ${planType === 'monthly' ? 'Monthly' : 'Yearly'}`,
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
                            const { data: verifyData, error: verifyError } = await supabaseEviolife.functions.invoke(
                                'verify-razorpay-subscription',
                                { body: {
                                    razorpay_payment_id: response.razorpay_payment_id,
                                    razorpay_subscription_id: response.razorpay_subscription_id,
                                    razorpay_signature: response.razorpay_signature,
                                } }
                            )

                            if (verifyError || !verifyData?.success) {
                                reject(new Error(verifyData?.error || verifyError?.message || 'Payment verification failed.'))
                                return
                            }

                            resolve(verifyData)
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
            setPaymentPending(verification?.status !== 'active')
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
    }, [user, session, priceData.currency, planType, coupon, couponCode])

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
                        <img src={eviolifeMockup} alt="Eviolife App" className="subscription-hero__mockup" />
                        <div className="subscription-hero__text-content">
                            <span className="subscription-badge">Best for individuals &amp; families</span>
                            <h1>Premium health tracking, built for daily use.</h1>
                            <p className="subscription-hero__description">
                                Keep wearables, nutrition, doctor access, and family monitoring in one premium Eviolife plan.
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
                            <div className="subscription-plan-options" role="group" aria-label="Billing period">
                                <button
                                    type="button"
                                    className={`subscription-plan-option${planType === 'monthly' ? ' is-selected' : ''}`}
                                    aria-pressed={planType === 'monthly'}
                                    onClick={() => { setPlanType('monthly'); setCoupon(null); setCouponMessage('') }}
                                >
                                    Monthly
                                </button>
                                <button
                                    type="button"
                                    className={`subscription-plan-option${planType === 'yearly' ? ' is-selected' : ''}`}
                                    aria-pressed={planType === 'yearly'}
                                    onClick={() => { setPlanType('yearly'); setCoupon(null); setCouponMessage('') }}
                                >
                                    Yearly · save ~20%
                                </button>
                            </div>
                            <div className="subscription-price-block__price">
                                <span className="subscription-price-block__value">
                                    {primaryPrice}
                                </span>
                                <span className="subscription-price-block__term">
                                    {planType === 'monthly' ? ' reference price' : '/ year'}
                                </span>
                            </div>

                            {planType === 'monthly' ? (
                                <p className="subscription-price-block__discount">
                                    {originalMonthlyWeekly ? (
                                        <><s>{originalMonthlyWeekly}</s> ({coupon.discountPercent}% off applied) · Billed {formatCurrency(priceData.currency, discountedMonthly)}/month (was <s>{originalMonthlyTotal}</s>).</>
                                    ) : (
                                        'The subscription total and monthly renewal terms are shown before payment.'
                                    )}
                                </p>
                            ) : (
                                <p className="subscription-price-block__discount">
                                    <s>{originalPrice}</s> — about 20% less than paying monthly.
                                </p>
                            )}

                            <div className="subscription-coupon">
                                <label htmlFor="subscription-coupon">Coupon code</label>
                                <div className="subscription-coupon__row">
                                    <input
                                        id="subscription-coupon"
                                        type="text"
                                        value={couponCode}
                                        onChange={(event) => {
                                            setCouponCode(event.target.value)
                                            setCoupon(null)
                                            setCouponMessage('')
                                        }}
                                        autoComplete="off"
                                        maxLength={64}
                                        placeholder="Enter coupon"
                                    />
                                    <button
                                        type="button"
                                        onClick={handleApplyCoupon}
                                        disabled={couponLoading || priceData.currency !== 'INR'}
                                    >
                                        {couponLoading ? 'Checking…' : 'Apply'}
                                    </button>
                                </div>
                                {couponMessage && (
                                    <p className={coupon ? 'subscription-coupon__message is-valid' : 'subscription-coupon__message'} role="status">
                                        {couponMessage}
                                    </p>
                                )}
                            </div>
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
                                <p className="subscription-success-state__title">
                                    {cancelScheduled
                                        ? 'Cancellation scheduled'
                                        : paymentPending ? 'Payment authorization received' : 'You’re now Premium'}
                                </p>
                                <p className="subscription-success-state__sub">
                                    {cancelScheduled
                                        ? cancelAt
                                            ? `Your plan is set to end on ${new Date(cancelAt).toLocaleDateString()}.`
                                            : 'Your plan will remain active through the current billing period.'
                                        : paymentPending
                                            ? 'Razorpay is completing subscription activation. Premium access begins after the payment is confirmed.'
                                            : 'Your Eviolife subscription is active. Open the app to unlock all features.'}
                                </p>
                                {error && <p className="subscription-error" role="alert">{error}</p>}
                                {subscriptionId ? (
                                    <button
                                        type="button"
                                        className="subscription-cta subscription-cta--secondary"
                                        onClick={handleCancelSubscription}
                                        disabled={cancelling}
                                    >
                                        {cancelling ? 'Cancelling…' : 'Cancel subscription'}
                                    </button>
                                ) : (
                                    <button
                                        type="button"
                                        className="subscription-cta subscription-cta--secondary"
                                        onClick={() => navigate('/portal/dashboard')}
                                    >
                                        Go to Dashboard
                                    </button>
                                )}
                            </div>
                        ) : (
                            <>
                                {error && (
                                    <p className="subscription-error" role="alert">{error}</p>
                                )}
                                <button
                                    id="eviolife-subscribe-btn"
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
                            {planType === 'monthly'
                                ? `You will be charged ${formatCurrency(priceData.currency, selectedPlanPrice.monthlyCharge)} now and every month until cancelled.`
                                : `You will be charged ${formatCurrency(priceData.currency, selectedPlanPrice.yearlyCharge)} now and every year until cancelled.`}
                            {coupon && ` Your coupon applies ${coupon.discountPercent}% off the first invoice only.`}
                        {' '}Razorpay bills subscriptions for up to 100 cycles; you can cancel before renewal.
                        {' '}Secure checkout powered by Razorpay.
                        </p>

                        <div className="subscription-cta-row" aria-label="Subscription details">
                            <span>{planType === 'monthly' ? 'Renews monthly' : 'Renews yearly'}</span>
                            <span>Instant access after payment</span>
                        </div>
                    </aside>
                </section>
            </div>
        </main>
    )
}