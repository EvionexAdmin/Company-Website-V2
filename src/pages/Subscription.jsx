import { useEffect, useState, useCallback, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { supabaseEviolife } from '../lib/supabaseEviolife'
import {
    MAX_EXTRA_SEATS,
    normalizeSeatEmails,
    resolvePriceBreakdown,
    seatDiscountPercent,
} from '../lib/pricing'
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

const STEPS = [
    { id: 1, title: 'Choose a plan', hint: 'Weekly, yearly or lifetime' },
    { id: 2, title: 'Add family & friends', hint: '8% off each account, up to 30%' },
    { id: 3, title: 'Apply a coupon', hint: '30% or 50% off the first invoice' },
    { id: 4, title: 'Pay securely', hint: 'UPI, cards, net banking' },
]

export default function Subscription() {
    const { user, session } = useAuth()
    const navigate = useNavigate()
    const [loading, setLoading] = useState(true)
    const [processing, setProcessing] = useState(false)
    const [error, setError] = useState(null)
    const [subscribed, setSubscribed] = useState(false)
    const [planType, setPlanType] = useState('monthly')
    const [seatEmails, setSeatEmails] = useState([])
    const [seatInput, setSeatInput] = useState('')
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

    const invitedEmails = useMemo(
        () => normalizeSeatEmails(seatEmails, user?.email),
        [seatEmails, user?.email]
    )
    const extraSeats = invitedEmails.length
    const breakdown = useMemo(
        () => resolvePriceBreakdown(priceData.currency, planType, extraSeats),
        [priceData.currency, planType, extraSeats]
    )
    const familyDiscount = seatDiscountPercent(extraSeats)

    // The coupon applies to the first invoice (or to the one-off lifetime payment).
    const couponPercent = coupon?.discountPercent || 0
    const couponApplies = planType === 'lifetime' || !!coupon
    const totalAfterCoupon = breakdown
        ? Math.round(breakdown.totalAmount * (1 - (couponApplies ? couponPercent : 0) / 100))
        : 0

    const currentStep = useMemo(() => {
        if (planType) return 1
        return 1
    }, [planType])

    const completedSteps = useMemo(() => {
        const done = [true]
        done.push(extraSeats > 0 || true)
        done.push(!!coupon || true)
        done.push(false)
        return done
    }, [extraSeats, coupon])

    const primaryPrice = useMemo(() => {
        if (!breakdown) return ''
        if (planType === 'monthly') {
            const weekly = breakdown.weeklyReference
            return `${formatCurrency(priceData.currency, weekly)}/week`
        }
        if (planType === 'yearly') {
            return formatCurrency(priceData.currency, totalAfterCoupon / 100)
        }
        return formatCurrency(priceData.currency, totalAfterCoupon / 100)
    }, [breakdown, planType, priceData.currency, totalAfterCoupon])

    const originalPrice = useMemo(() => {
        if (!breakdown) return null
        if (planType === 'yearly') {
            return formatCurrency(priceData.currency, breakdown.baseAmount / 100)
        }
        if (planType === 'lifetime') {
            return formatCurrency(priceData.currency, breakdown.baseAmount / 100)
        }
        return null
    }, [breakdown, planType, priceData.currency])

    const monthlyEquivalent = useMemo(() => {
        if (!breakdown) return null
        if (planType === 'yearly') return breakdown.baseAmount / 12
        if (planType === 'lifetime') return breakdown.baseAmount / 60
        return breakdown.totalAmount / 100
    }, [breakdown, planType])

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
            setCouponMessage(
                planType === 'lifetime'
                    ? `${data.discountPercent}% off your one-off payment.`
                    : `${data.discountPercent}% off your first invoice.`
            )
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

    const addSeatEmail = useCallback(() => {
        const email = seatInput.trim().toLowerCase()
        if (!email) return
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            setError('Enter a valid email address.')
            return
        }
        if (email === String(user?.email || '').trim().toLowerCase()) {
            setError('That is your own email address.')
            return
        }
        if (invitedEmails.includes(email)) {
            setError('That email is already on the plan.')
            return
        }
        if (invitedEmails.length >= MAX_EXTRA_SEATS) {
            setError(`You can add up to ${MAX_EXTRA_SEATS} extra accounts.`)
            return
        }
        setSeatEmails((current) => [...current, email])
        setSeatInput('')
        setError(null)
    }, [seatInput, invitedEmails, user?.email])

    const removeSeatEmail = useCallback((email) => {
        setSeatEmails((current) => current.filter((item) => item !== email))
    }, [])

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

            const accessToken = session.access_token
            const seats = invitedEmails.length
            const planDescription = planType === 'monthly'
                ? 'Weekly (billed monthly)'
                : planType === 'yearly'
                    ? 'Yearly'
                    : 'Lifetime'

            // 2. The lifetime plan is a one-off payment, the other plans are
            //    subscriptions. Both are priced on the server.
            if (planType === 'lifetime') {
                const createRes = await fetch(`${SUPABASE_FUNCTIONS_URL}/create-razorpay-order`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${accessToken}`,
                    },
                    body: JSON.stringify({
                        amount: breakdown?.baseAmount || 0,
                        currency: priceData.currency,
                        plan_name: 'premium_lifetime',
                        planType: 'lifetime',
                        seats,
                        seatEmails: invitedEmails,
                        couponCode: coupon?.code || null,
                        customer_name: user.user_metadata?.full_name || '',
                        customer_email: user.email || '',
                    }),
                })
                const createData = await createRes.json()
                if (!createRes.ok) {
                    throw new Error(createData?.error || 'Failed to create the payment order.')
                }

                const verification = await new Promise((resolve, reject) => {
                    const options = {
                        key: createData.key_id,
                        order_id: createData.id,
                        name: 'Evio Life',
                        description: `Evio Life Premium — ${planDescription}`,
                        image: 'https://www.evionex.com/favicon.ico',
                        prefill: { email: user.email || '' },
                        notes: { user_id: user.id },
                        theme: { color: '#00d4c8' },
                        modal: { ondismiss: () => reject(new Error('dismissed')) },
                        handler: async (response) => {
                            try {
                                const { data: verifyData, error: verifyError } = await supabaseEviolife.functions.invoke(
                                    'verify-razorpay-payment',
                                    { body: {
                                        razorpay_order_id: response.razorpay_order_id,
                                        razorpay_payment_id: response.razorpay_payment_id,
                                        razorpay_signature: response.razorpay_signature,
                                    } }
                                )
                                if (verifyError || !verifyData?.verified) {
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

                setPaymentPending(verification?.premium_activated === false)
                setSubscribed(true)
                return
            }

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
                    seats,
                    seatEmails: invitedEmails,
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
                    name: 'Evio Life',
                    description: `Evio Life Premium — ${planDescription}`,
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
                // User closed the modal — silent reset, no error shown
            } else {
                console.error('Subscription error:', err)
                setError(err.message || 'Something went wrong. Please try again.')
            }
        } finally {
            setProcessing(false)
        }
    }, [user, session, priceData.currency, planType, coupon, couponCode, invitedEmails, breakdown])

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
                                Keep wearables, nutrition, doctor access, and family monitoring in one premium Evio Life plan.
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

                        {/* Step indicator: one page, four short steps. */}
                        <ol className="subscription-steps" aria-label="Checkout steps">
                            {STEPS.map((step) => {
                                const done = completedSteps[step.id - 1]
                                const active = step.id === currentStep + 1 || (step.id === 1)
                                return (
                                    <li
                                        key={step.id}
                                        className={`subscription-step${done ? ' is-done' : ''}${active ? ' is-active' : ''}`}
                                        aria-current={active ? 'step' : undefined}
                                    >
                                        <span className="subscription-step__index" aria-hidden="true">
                                            {done ? '✓' : step.id}
                                        </span>
                                        <span className="subscription-step__text">
                                            <strong>{step.title}</strong>
                                            <small>{step.hint}</small>
                                        </span>
                                    </li>
                                )
                            })}
                        </ol>

                        <div className="subscription-price-block">
                            <p className="subscription-price-block__label">{priceData.regionLabel}</p>
                            <div className="subscription-plan-options" role="group" aria-label="Billing period">
                                <button
                                    type="button"
                                    className={`subscription-plan-option${planType === 'monthly' ? ' is-selected' : ''}`}
                                    aria-pressed={planType === 'monthly'}
                                    onClick={() => { setPlanType('monthly'); setCoupon(null); setCouponMessage('') }}
                                >
                                    Weekly
                                    <small>billed monthly</small>
                                </button>
                                <button
                                    type="button"
                                    className={`subscription-plan-option${planType === 'yearly' ? ' is-selected' : ''}`}
                                    aria-pressed={planType === 'yearly'}
                                    onClick={() => { setPlanType('yearly'); setCoupon(null); setCouponMessage('') }}
                                >
                                    Yearly
                                    <small>save ~20%</small>
                                </button>
                                <button
                                    type="button"
                                    className={`subscription-plan-option${planType === 'lifetime' ? ' is-selected' : ''}`}
                                    aria-pressed={planType === 'lifetime'}
                                    onClick={() => { setPlanType('lifetime'); setCoupon(null); setCouponMessage('') }}
                                >
                                    Lifetime
                                    <small>pay once</small>
                                </button>
                            </div>
                            <div className="subscription-price-block__price">
                                <span className="subscription-price-block__value">
                                    {primaryPrice}
                                </span>
                                <span className="subscription-price-block__term">
                                    {planType === 'monthly'
                                        ? 'per week, billed monthly'
                                        : planType === 'yearly'
                                            ? 'per year'
                                            : 'one-off payment'}
                                </span>
                            </div>

                            <p className="subscription-price-block__discount">
                                {planType === 'monthly' && (
                                    <>Billed {formatCurrency(priceData.currency, (totalAfterCoupon) / 100)} every month
                                    {couponApplies && couponPercent > 0 && (
                                        <> · coupon takes {couponPercent}% off the first invoice</>
                                    )}.</>
                                )}
                                {planType === 'yearly' && (
                                    <><s>{originalPrice}</s> — about 20% less than paying monthly
                                    {couponApplies && couponPercent > 0 && (
                                        <> · coupon takes {couponPercent}% off the first invoice</>
                                    )}.</>
                                )}
                                {planType === 'lifetime' && (
                                    <>Pay once, keep premium for 5 years
                                    {couponApplies && couponPercent > 0 && (
                                        <> · coupon takes {couponPercent}% off</>
                                    )}.</>
                                )}
                            </p>

                            {/* Step 2: family and friends */}
                            <div className="subscription-family">
                                <div className="subscription-family__head">
                                    <label htmlFor="subscription-family-email">Family &amp; friends accounts</label>
                                    <span className="subscription-family__badge">
                                        {extraSeats > 0
                                            ? `${familyDiscount}% off`
                                            : '8% off each'}
                                    </span>
                                </div>
                                <p className="subscription-family__hint">
                                    Add up to {MAX_EXTRA_SEATS} extra accounts. Every account takes 8% off the
                                    total, up to a maximum of {30}% off.
                                </p>
                                <div className="subscription-family__row">
                                    <input
                                        id="subscription-family-email"
                                        type="email"
                                        value={seatInput}
                                        onChange={(event) => setSeatInput(event.target.value)}
                                        onKeyDown={(event) => {
                                            if (event.key === 'Enter') {
                                                event.preventDefault()
                                                addSeatEmail()
                                            }
                                        }}
                                        placeholder="name@example.com"
                                        autoComplete="off"
                                        disabled={extraSeats >= MAX_EXTRA_SEATS}
                                    />
                                    <button
                                        type="button"
                                        onClick={addSeatEmail}
                                        disabled={extraSeats >= MAX_EXTRA_SEATS}
                                    >
                                        Add
                                    </button>
                                </div>
                                {invitedEmails.length > 0 && (
                                    <ul className="subscription-family__list">
                                        {invitedEmails.map((email) => (
                                            <li key={email}>
                                                <span>{email}</span>
                                                <button
                                                    type="button"
                                                    onClick={() => removeSeatEmail(email)}
                                                    aria-label={`Remove ${email}`}
                                                >
                                                    ×
                                                </button>
                                            </li>
                                        ))}
                                    </ul>
                                )}
                                {extraSeats > 0 && (
                                    <p className="subscription-family__saving">
                                        You save {formatCurrency(priceData.currency, breakdown.discountAmount / 100)} on this plan.
                                    </p>
                                )}
                            </div>

                            {/* Step 3: coupon */}
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
                                        {couponLoading ? 'Checking...' : 'Apply'}
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
                                        : paymentPending ? 'Payment authorization received' : "You're now Premium"}
                                </p>
                                <p className="subscription-success-state__sub">
                                    {cancelScheduled
                                        ? cancelAt
                                            ? `Your plan is set to end on ${new Date(cancelAt).toLocaleDateString()}.`
                                            : 'Your plan will remain active through the current billing period.'
                                        : paymentPending
                                            ? 'Razorpay is completing the activation. Premium access begins after the payment is confirmed.'
                                            : 'Your Evio Life plan is active. Open the app to unlock all features.'}
                                </p>
                                {error && <p className="subscription-error" role="alert">{error}</p>}
                                {subscriptionId ? (
                                    <button
                                        type="button"
                                        className="subscription-cta subscription-cta--secondary"
                                        onClick={handleCancelSubscription}
                                        disabled={cancelling}
                                    >
                                        {cancelling ? 'Cancelling...' : 'Cancel subscription'}
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
                                    {processing
                                        ? 'Opening checkout...'
                                        : planType === 'lifetime'
                                            ? `Pay ${primaryPrice} once`
                                            : `Start Premium — ${primaryPrice}`}
                                </button>
                            </>
                        )}

                        {/* Trust signals, right next to the payment button. */}
                        <div className="subscription-trust" aria-label="Payment security and policies">
                            <div className="subscription-trust__row">
                                <span className="subscription-trust__item">
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                                        <rect x="4" y="10" width="16" height="10" rx="2" />
                                        <path d="M8 10V7a4 4 0 0 1 8 0v3" />
                                    </svg>
                                    256-bit SSL encrypted
                                </span>
                                <span className="subscription-trust__item">
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                                        <path d="M12 3l7 4v6c0 4.5-3 7.5-7 9-4-1.5-7-4.5-7-9V7z" />
                                        <path d="M9 12l2 2 4-4" />
                                    </svg>
                                    PCI-DSS compliant
                                </span>
                                <span className="subscription-trust__item">
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                                        <rect x="2" y="5" width="20" height="14" rx="2" />
                                        <path d="M2 10h20" />
                                    </svg>
                                    UPI, cards &amp; net banking
                                </span>
                            </div>
                            <p className="subscription-trust__policy">
                                {planType === 'lifetime'
                                    ? 'Lifetime is a one-off payment. Refunds are available within 7 days of purchase.'
                                    : 'Subscriptions renew automatically. Cancel any time from this page — you keep premium until the end of the paid period.'}
                            </p>
                            <p className="subscription-trust__support">
                                Need help?{' '}
                                <a href="mailto:support@evionex.com">support@evionex.com</a>
                                {' · '}
                                <Link to="/contact">Contact support</Link>
                            </p>
                        </div>

                        <p className="subscription-cta-note">
                            {planType === 'monthly'
                                ? `You will be charged ${formatCurrency(priceData.currency, totalAfterCoupon / 100)} now and every month until cancelled.`
                                : planType === 'yearly'
                                    ? `You will be charged ${formatCurrency(priceData.currency, totalAfterCoupon / 100)} now and every year until cancelled.`
                                    : `You will be charged ${formatCurrency(priceData.currency, totalAfterCoupon / 100)} once. No renewal.`}
                            {couponApplies && couponPercent > 0 && ` Your coupon applies ${couponPercent}% off the ${planType === 'lifetime' ? 'payment' : 'first invoice'}.`}
                            {' '}Razorpay bills subscriptions for up to 100 cycles; you can cancel before renewal.
                            {' '}Secure checkout powered by Razorpay.
                        </p>

                        <div className="subscription-cta-row" aria-label="Subscription details">
                            <span>{planType === 'monthly' ? 'Renews monthly' : planType === 'yearly' ? 'Renews yearly' : 'Never renews'}</span>
                            <span>Instant access after payment</span>
                        </div>
                    </aside>
                </section>
            </div>
        </main>
    )
}
