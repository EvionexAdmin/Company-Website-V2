/**
 * Razorpay Payment Integration Utility
 * 
 * This module provides a ready-to-use integration point for Razorpay payments.
 * Currently uses placeholder/demo mode. To activate real payments:
 * 
 * 1. Sign up at https://dashboard.razorpay.com
 * 2. Get your API Key ID from Settings > API Keys
 * 3. Replace RAZORPAY_KEY_ID below with your actual key
 * 4. Set up a backend endpoint to create Razorpay orders
 * 5. Update createOrder() to call your backend
 * 
 * Documentation: https://razorpay.com/docs/payments/
 */

// Replace with your actual Razorpay Key ID when ready
const RAZORPAY_KEY_ID = 'rzp_test_XXXXXXXXXX'

// Set to true when Razorpay is properly configured
const RAZORPAY_ENABLED = false

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
 * Create a Razorpay order via your backend
 * In production, this should call your backend API which creates an order
 * using Razorpay's Orders API: POST https://api.razorpay.com/v1/orders
 * 
 * @param {Object} params - Order parameters
 * @param {number} params.amount - Amount in smallest currency unit (paise for INR)
 * @param {string} params.currency - Currency code (e.g., 'INR')
 * @param {string} params.planName - Name of the plan being purchased
 * @returns {Promise<Object>} Order object from Razorpay
 */
export async function createOrder({ amount, currency = 'INR', planName }) {
    // TODO: Replace with actual backend API call
    // Example:
    // const response = await fetch('/api/create-order', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({ amount, currency, planName }),
    // })
    // return response.json()

    // Placeholder: return a dummy order
    return {
        id: 'order_demo_' + Date.now(),
        amount,
        currency,
        status: 'created',
    }
}

/**
 * Initiate Razorpay payment checkout
 * 
 * @param {Object} options - Payment options
 * @param {string} options.planName - Name of the plan
 * @param {number} options.amount - Amount in paise (e.g., 999900 for ₹9,999)
 * @param {string} options.currency - Currency code
 * @param {string} options.customerName - Customer's name
 * @param {string} options.customerEmail - Customer's email
 * @param {Function} options.onSuccess - Callback on successful payment
 * @param {Function} options.onFailure - Callback on failed payment
 */
export async function initiatePayment({
    planName,
    amount,
    currency = 'INR',
    customerName = '',
    customerEmail = '',
    onSuccess,
    onFailure,
}) {
    if (!RAZORPAY_ENABLED) {
        // Demo mode: show alert
        alert(
            `💳 Payment Demo Mode\n\n` +
            `Plan: ${planName}\n` +
            `Amount: ₹${(amount / 100).toLocaleString('en-IN')}\n\n` +
            `Razorpay integration is not yet active.\n` +
            `Contact the development team to enable payments.`
        )
        return
    }

    const scriptLoaded = await loadRazorpayScript()
    if (!scriptLoaded) {
        alert('Failed to load payment gateway. Please try again.')
        if (onFailure) onFailure(new Error('Script load failed'))
        return
    }

    const order = await createOrder({ amount, currency, planName })

    const options = {
        key: RAZORPAY_KEY_ID,
        amount: order.amount,
        currency: order.currency,
        name: 'Evionex Private Limited',
        description: `${planName} Subscription`,
        order_id: order.id,
        prefill: {
            name: customerName,
            email: customerEmail,
        },
        theme: {
            color: '#00D4C8',
        },
        handler: function (response) {
            // Payment successful
            // response.razorpay_payment_id
            // response.razorpay_order_id
            // response.razorpay_signature
            console.log('Payment successful:', response)
            if (onSuccess) onSuccess(response)
        },
        modal: {
            ondismiss: function () {
                console.log('Payment modal closed')
                if (onFailure) onFailure(new Error('Payment cancelled'))
            },
        },
    }

    const razorpay = new window.Razorpay(options)
    razorpay.open()
}
