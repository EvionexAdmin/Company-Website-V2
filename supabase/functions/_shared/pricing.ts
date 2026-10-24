/**
 * Plan catalogue and pricing rules.
 *
 * The same rules are used by the checkout functions and by the pricing UI, so
 * the amount a customer sees is always the amount that is charged.
 *
 * Currency:
 *   INR  -> South Asia pricing
 *   USD  -> international pricing
 *
 * Plans:
 *   monthly  -> weekly price, billed every month
 *   yearly   -> one year up front
 *   lifetime -> a one-off payment that keeps premium active for 50 years
 *
 * Family plan: every additional account that is added takes 8% off the
 * total, up to a maximum of 30% off.
 */

export type Currency = "INR" | "USD"
export type PlanType = "monthly" | "yearly" | "lifetime"

/** Discount for every additional account. */
export const SEAT_DISCOUNT_PERCENT = 8
/** The seat discount never goes above this. */
export const SEAT_DISCOUNT_MAX_PERCENT = 30
/** How many extra accounts can be added on top of the paying account. */
export const MAX_EXTRA_SEATS = 6
/** A lifetime plan is worth this many years of the yearly plan. */
export const LIFETIME_YEARS = 50
/** How long a lifetime purchase keeps the premium features active. */
export const LIFETIME_PERIOD_YEARS = 50

export interface PlanPrice {
  /** Amount in the smallest currency unit (paise / cents). */
  amount: number
  /** Reference price per week for plans that are billed monthly. */
  weeklyReference?: number
  /** Original amount before discount if applicable */
  originalAmount?: number
  /** Discount badge copy if applicable */
  discountBadge?: string
  /** Human readable billing period. */
  billingPeriod: "week" | "month" | "year" | "lifetime"
  /** What the plan is called. */
  label: string
}

export const PLAN_CATALOG: Record<Currency, Record<PlanType, PlanPrice>> = {
  INR: {
    // 18 rupees per week, billed every month (18 * 4.33 = 78).
    monthly: { amount: 7800, weeklyReference: 18, billingPeriod: "week", label: "Weekly" },
    yearly: { amount: 49900, billingPeriod: "year", label: "Yearly" },
    lifetime: { amount: 249500, billingPeriod: "lifetime", label: "Lifetime" },
  },
  USD: {
    monthly: { amount: 650, weeklyReference: 1.5, billingPeriod: "week", label: "Weekly" },
    yearly: { amount: 6300, billingPeriod: "year", label: "Yearly" },
    // 50% off current $315 ($157.50 / 15750 cents)
    lifetime: { amount: 15750, originalAmount: 31500, discountBadge: "50% OFF", billingPeriod: "lifetime", label: "Lifetime" },
  },
}

export function isCurrency(value: unknown): value is Currency {
  return value === "INR" || value === "USD"
}

export function isPlanType(value: unknown): value is PlanType {
  return value === "monthly" || value === "yearly" || value === "lifetime"
}

/** Clamps the number of extra accounts to what the plan allows. */
export function normalizeSeatCount(value: unknown): number {
  const count = Number(value)
  if (!Number.isFinite(count)) return 0
  return Math.max(0, Math.min(MAX_EXTRA_SEATS, Math.floor(count)))
}

/** Strict RFC-compliant email check, mirrored by the pricing screen. */
export function isValidEmail(email: unknown): boolean {
  if (typeof email !== "string") return false
  return /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/.test(email.trim())
}

/** Keeps the invited addresses unique, lower case and valid. */
export function normalizeSeatEmails(value: unknown, ownerEmail?: string): string[] {
  if (!Array.isArray(value)) return []
  const owner = String(ownerEmail || "").trim().toLowerCase()
  const seen = new Set<string>()
  const emails: string[] = []
  for (const entry of value) {
    const email = String(entry || "").trim().toLowerCase()
    if (!isValidEmail(email)) continue
    if (owner && email === owner) continue
    if (seen.has(email)) continue
    seen.add(email)
    emails.push(email)
    if (emails.length >= MAX_EXTRA_SEATS) break
  }
  return emails
}

/** The discount the extra accounts earn: 8% each, capped at 30%. */
export function seatDiscountPercent(extraSeats: number): number {
  const percent = normalizeSeatCount(extraSeats) * SEAT_DISCOUNT_PERCENT
  return Math.min(SEAT_DISCOUNT_MAX_PERCENT, percent)
}

export interface PriceBreakdown {
  currency: Currency
  planType: PlanType
  /** Single account base price in smallest currency unit. */
  singleSeatAmount: number
  /** Base price for all accounts combined in the smallest currency unit. */
  baseAmount: number
  /** Seat discount in the smallest currency unit. */
  discountAmount: number
  /** Amount that is actually charged, in the smallest currency unit. */
  totalAmount: number
  discountPercent: number
  extraSeats: number
  totalAccounts: number
  weeklyReference: number | null
  billingPeriod: PlanPrice["billingPeriod"]
  label: string
}

/**
 * Works out the amount that has to be charged.
 * Total accounts = 1 + extraSeats.
 * Base price scales with accounts: totalBaseAmount = plan.amount * (1 + extraSeats).
 * The seat discount is applied across the total account price.
 */
export function resolvePriceBreakdown(
  currency: Currency,
  planType: PlanType,
  extraSeats: number = 0,
): PriceBreakdown {
  const plan = PLAN_CATALOG[currency][planType]
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
    baseAmount: totalBaseAmount,
    discountAmount,
    totalAmount,
    discountPercent,
    extraSeats: seats,
    totalAccounts,
    weeklyReference,
    billingPeriod: plan.billingPeriod,
    label: plan.label,
  }
}

/** The amount in the smallest currency unit, ready for Razorpay. */
export function resolvePlanAmount(
  currency: Currency,
  planType: PlanType,
  extraSeats: number = 0,
): number {
  return resolvePriceBreakdown(currency, planType, extraSeats).totalAmount
}

/**
 * Key used to cache the Razorpay plan for a currency / plan / seat count.
 * Each seat count gets its own Razorpay plan because the amount differs.
 * A coupon adds its own plan, because the first cycle is cheaper.
 */
export function planKeyFor(
  currency: Currency,
  planType: PlanType,
  extraSeats: number = 0,
  discountPercent: number = 0,
): string {
  const seats = normalizeSeatCount(extraSeats)
  const amount = discountPercent > 0
    ? resolveFirstCycleAmount(currency, planType, seats, discountPercent)
    : resolvePlanAmount(currency, planType, seats)
  const base = `${currency}_${planType}_seats${seats}_a${amount}`
  return discountPercent > 0 ? `${base}_c${discountPercent}` : base
}

/**
 * The amount of the first cycle when a coupon is used: the total accounts plan price with
 * the family discount and then the coupon on top.
 */
export function resolveFirstCycleAmount(
  currency: Currency,
  planType: PlanType,
  extraSeats: number = 0,
  discountPercent: number = 0,
): number {
  const breakdown = resolvePriceBreakdown(currency, planType, extraSeats)
  return Math.round(breakdown.totalAmount * (1 - discountPercent / 100))
}

/** Lifetime purchases keep premium access for this many years. */
export function lifetimePeriodYears(): number {
  return LIFETIME_PERIOD_YEARS
}
