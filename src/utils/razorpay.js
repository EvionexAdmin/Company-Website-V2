/**
 * Razorpay Payment Integration Utility
 *
 * Integrates Razorpay Standard Checkout with Supabase Edge Functions.
 * - Order creation happens server-side (edge function) for security
 * - Payment verification uses HMAC SHA256 server-side
 * - Key secret is NEVER exposed to the client
 */

import { supabase } from '../lib/supabaseClient'

// Publishable key — safe for client-side
const RAZORPAY_KEY_ID = import.meta.env.VITE_RAZORPAY_KEY_ID

/**
 * Load Razorpay checkout script dynamically
 * @returns {Promise<boolean>} Whether script loaded successfully
 */
export function loadRazorpayScript() {
    return new Promise((resolve) => {
        if (document.getElementById('razorpay-script')) {
            resolve(true)
            return
        }
        const script = document.createElement('script')
        script.id = 'razorpay-script'
        script.src = 'https://checkout.razorpay.com/v1/checkout.js'
        script.onload = () => resolve(true)
        script.onerror = () => resolve(false)
        document.body.appendChild(script)
    })
}

/**
 * Create a Razorpay order via Supabase Edge Function (server-side).
 * The edge function calls Razorpay Orders API with the secret key
 * and stores the order in the database.
 *
 * @param {Object} params
 * @param {number} params.amount - Amount in paise (e.g. 999900 for ₹9,999)
 * @param {string} params.currency - Currency code (default: 'INR')
 * @param {string} params.planName - Name of the plan/product
 * @param {string} params.customerName - Customer's name
 * @param {string} params.customerEmail - Customer's email
 * @returns {Promise<Object>} Order object with { id, amount, currency }
 */
export async function createOrder({ amount, currency = 'INR', planName, customerName, customerEmail }) {
    const { data, error } = await supabase.functions.invoke('create-razorpay-order', {
        body: {
            amount,
            currency,
            plan_name: planName,
            customer_name: customerName,
            customer_email: customerEmail,
        },
    })

    if (error) {
        throw new Error(error.message || 'Failed to create order')
    }

    return data
}

/**
 * Verify payment signature via Supabase Edge Function (server-side).
 * The edge function performs HMAC SHA256 verification and updates the database.
 *
 * @param {Object} params
 * @param {string} params.razorpay_order_id
 * @param {string} params.razorpay_payment_id
 * @param {string} params.razorpay_signature
 * @returns {Promise<Object>} Verification result { verified, payment_id }
 */
export async function verifyPayment({ razorpay_order_id, razorpay_payment_id, razorpay_signature }) {
    const { data, error } = await supabase.functions.invoke('verify-razorpay-payment', {
        body: {
            razorpay_order_id,
            razorpay_payment_id,
            razorpay_signature,
        },
    })

    if (error) {
        throw new Error(error.message || 'Payment verification failed')
    }

    return data
}

/**
 * Initiate Razorpay payment checkout.
 *
 * Flow:
 * 1. Create order via edge function (server-side)
 * 2. Open Razorpay Checkout modal
 * 3. On success, verify signature via edge function (server-side)
 * 4. Call onSuccess or onFailure callback
 *
 * @param {Object} options
 * @param {string} options.planName - Name of the plan/product
 * @param {number} options.amount - Amount in paise (e.g. 999900 for ₹9,999)
 * @param {string} options.currency - Currency code
 * @param {string} options.customerName - Customer's name
 * @param {string} options.customerEmail - Customer's email
 * @param {string} options.customerPhone - Customer's phone
 * @param {Function} options.onSuccess - Callback on verified payment
 * @param {Function} options.onFailure - Callback on failed/cancelled payment
 */
export async function initiatePayment({
    planName,
    amount,
    currency = 'INR',
    customerName = '',
    customerEmail = '',
    customerPhone = '',
    onSuccess,
    onFailure,
}) {
    if (!RAZORPAY_KEY_ID) {
        alert('Payment gateway is not configured. Please contact support.')
        if (onFailure) onFailure(new Error('Razorpay key not configured'))
        return
    }

    // Load Razorpay script
    const scriptLoaded = await loadRazorpayScript()
    if (!scriptLoaded) {
        alert('Failed to load payment gateway. Please check your connection and try again.')
        if (onFailure) onFailure(new Error('Script load failed'))
        return
    }

    // Step 1: Create order server-side
    let order
    try {
        order = await createOrder({ amount, currency, planName, customerName, customerEmail })
    } catch (err) {
        console.error('Order creation failed:', err)
        alert('Could not initiate payment. Please try again later.')
        if (onFailure) onFailure(err)
        return
    }

    // Step 2: Open Razorpay Checkout
    const options = {
        key: RAZORPAY_KEY_ID,
        amount: order.amount,
        currency: order.currency,
        name: 'Evionex Private Limited',
        description: planName,
        order_id: order.id,
        prefill: {
            name: customerName,
            email: customerEmail,
            contact: customerPhone,
        },
        theme: {
            color: '#00D4C8',
        },
        handler: async function (response) {
            // Step 3: Verify payment server-side
            try {
                const verification = await verifyPayment({
                    razorpay_order_id: response.razorpay_order_id,
                    razorpay_payment_id: response.razorpay_payment_id,
                    razorpay_signature: response.razorpay_signature,
                })

                if (verification.verified) {
                    if (onSuccess) onSuccess(response)
                } else {
                    if (onFailure) onFailure(new Error('Payment verification failed. Please contact support.'))
                }
            } catch (err) {
                console.error('Payment verification error:', err)
                // Security: Do NOT treat unverified payments as successful.
                // The payment may have been charged, but we cannot confirm it.
                // The user should contact support for manual reconciliation.
                if (onFailure) onFailure(new Error('Payment verification could not be completed. If you were charged, please contact support for assistance.'))
            }
        },
        modal: {
            ondismiss: function () {
                if (onFailure) onFailure(new Error('Payment cancelled'))
            },
        },
    }

    const razorpay = new window.Razorpay(options)
    razorpay.on('payment.failed', function (response) {
        console.error('Payment failed:', response.error)
        if (onFailure) onFailure(new Error(response.error.description || 'Payment failed'))
    })
    razorpay.open()
}
