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
export const LIFETIME_YEARS = 5

export const PLAN_CATALOG = {
    INR: {
        monthly: { amount: 7800, weeklyReference: 18, label: 'Weekly, billed monthly' },
        yearly: { amount: 49900, label: 'Yearly' },
        lifetime: { amount: 249500, label: 'Lifetime' },
    },
    USD: {
        monthly: { amount: 650, weeklyReference: 1.5, label: 'Weekly, billed monthly' },
        yearly: { amount: 6300, label: 'Yearly' },
        lifetime: { amount: 31500, label: 'Lifetime' },
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
 * The family discount is applied to the price of the plan.
 */
export function resolvePriceBreakdown(currency, planType, extraSeats = 0) {
    const plan = PLAN_CATALOG[currency]?.[planType]
    if (!plan) return null

    const seats = normalizeSeatCount(extraSeats)
    const discountPercent = seatDiscountPercent(seats)
    const discountAmount = Math.round((plan.amount * discountPercent) / 100)
    const totalAmount = Math.max(0, plan.amount - discountAmount)
    const weeklyReference = plan.weeklyReference != null
        ? Math.round(plan.weeklyReference * (1 - discountPercent / 100) * 100) / 100
        : null

    return {
        currency,
        planType,
        baseAmount: plan.amount,
        discountAmount,
        totalAmount,
        discountPercent,
        extraSeats: seats,
        weeklyReference,
        label: plan.label,
    }
}

/** Keeps the invited addresses unique, lower case and free of blanks. */
export function normalizeSeatEmails(value, ownerEmail) {
    if (!Array.isArray(value)) return []
    const owner = String(ownerEmail || '').trim().toLowerCase()
    const seen = new Set()
    const emails = []
    for (const entry of value) {
        const email = String(entry || '').trim().toLowerCase()
        if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) continue
        if (owner && email === owner) continue
        if (seen.has(email)) continue
        seen.add(email)
        emails.push(email)
        if (emails.length >= MAX_EXTRA_SEATS) break
    }
    return emails
}
