/**
 * Plan catalogue and pricing rules for the pricing screen.
 *
 * This mirrors `supabase/functions/_shared/pricing.ts`, which is the
 * authoritative version: the amount that is charged is always worked out on
 * the server.
 */

export const SEAT_DISCOUNT_PERCENT = 8
export const SEAT_DISCOUNT_MAX_PERCENT = 30
export const MAX_EXTRA_SEATS = 6
export const LIFETIME_YEARS = 50

export const SOUTH_ASIA_TIMEZONES = [
    'Asia/Kolkata', 'Asia/Calcutta',   // India
    'Asia/Karachi',                     // Pakistan
    'Asia/Dhaka',                       // Bangladesh
    'Asia/Colombo',                     // Sri Lanka
    'Asia/Kathmandu', 'Asia/Katmandu', // Nepal
    'Indian/Maldives',                  // Maldives
    'Asia/Thimphu',                     // Bhutan
    'Asia/Kabul',                       // Afghanistan
]

export function isSouthAsiaByTimezone() {
    try {
        const tz = Intl.DateTimeFormat().resolvedOptions().timeZone
        return SOUTH_ASIA_TIMEZONES.includes(tz)
    } catch {
        return false
    }
}

export const PLAN_CATALOG = {
    INR: {
        monthly: { amount: 7800, weeklyReference: 18, label: 'Weekly' },
        yearly: { amount: 49900, label: 'Yearly' },
        lifetime: { amount: 249500, label: 'Lifetime' },
    },
    USD: {
        monthly: { amount: 650, weeklyReference: 1.5, label: 'Weekly' },
        yearly: { amount: 6300, label: 'Yearly' },
        // 50% off current $315 ($157.50 / 15750 cents)
        lifetime: { amount: 15750, originalAmount: 31500, discountBadge: '50% OFF', label: 'Lifetime' },
    },
}

export function isCurrency(value) {
    return value === 'INR' || value === 'USD'
}

export function isPlanType(value) {
    return value === 'monthly' || value === 'yearly' || value === 'lifetime'
}

export function normalizeSeatCount(value) {
    const count = Number(value)
    if (!Number.isFinite(count)) return 0
    return Math.max(0, Math.min(MAX_EXTRA_SEATS, Math.floor(count)))
}

export function seatDiscountPercent(extraSeats) {
    return Math.min(SEAT_DISCOUNT_MAX_PERCENT, normalizeSeatCount(extraSeats) * SEAT_DISCOUNT_PERCENT)
}

/**
 * Works out the amount that is charged.
 * For extra family accounts: total accounts = 1 + extraSeats.
 * Base price scales with the number of accounts: baseAmount = plan.amount * (1 + extraSeats).
 * The seat discount (8% per extra seat, up to 30%) is applied across the total account price.
 */
export function resolvePriceBreakdown(currency, planType, extraSeats = 0) {
    const plan = PLAN_CATALOG[currency]?.[planType]
    if (!plan) return null

    const seats = normalizeSeatCount(extraSeats)
    const totalAccounts = 1 + seats
    const totalBaseAmount = plan.amount * totalAccounts
    const discountPercent = seatDiscountPercent(seats)
    const discountAmount = Math.round((totalBaseAmount * discountPercent) / 100)
    const totalAmount = Math.max(0, totalBaseAmount - discountAmount)
    const weeklyReference = plan.weeklyReference != null
        ? Math.round(plan.weeklyReference * totalAccounts * (1 - discountPercent / 100) * 100) / 100
        : null

    return {
        currency,
        planType,
        singleSeatAmount: plan.amount,
        originalAmount: plan.originalAmount || null,
        discountBadge: plan.discountBadge || null,
        baseAmount: totalBaseAmount,
        discountAmount,
        totalAmount,
        discountPercent,
        extraSeats: seats,
        totalAccounts,
        weeklyReference,
        label: plan.label,
    }
}

/** Validates email format strictly. */
export function isValidEmail(email) {
    if (!email || typeof email !== 'string') return false
    const trimmed = email.trim()
    // Standard RFC-compliant relaxed email regex
    return /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/.test(trimmed)
}

/** Keeps the invited addresses unique, lower case and free of blanks. */
export function normalizeSeatEmails(value, ownerEmail) {
    if (!Array.isArray(value)) return []
    const owner = String(ownerEmail || '').trim().toLowerCase()
    const seen = new Set()
    const emails = []
    for (const entry of value) {
        const email = String(entry || '').trim().toLowerCase()
        if (!isValidEmail(email)) continue
        if (owner && email === owner) continue
        if (seen.has(email)) continue
        seen.add(email)
        emails.push(email)
        if (emails.length >= MAX_EXTRA_SEATS) break
    }
    return emails
}
