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
 *   lifetime -> a one-off payment worth five years
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
export const LIFETIME_YEARS = 5
/** How long a lifetime purchase keeps the premium features active. */
export const LIFETIME_PERIOD_YEARS = 6

export interface PlanPrice {
  /** Amount in the smallest currency unit (paise / cents). */
  amount: number
  /** Reference price per week for plans that are billed monthly. */
  weeklyReference?: number
  /** Human readable billing period. */
  billingPeriod: "week" | "month" | "year" | "lifetime"
  /** What the plan is called. */
  label: string
}

export const PLAN_CATALOG: Record<Currency, Record<PlanType, PlanPrice>> = {
  INR: {
    // 18 rupees per week, billed every month (18 * 4.33 = 78).
    monthly: { amount: 7800, weeklyReference: 18, billingPeriod: "week", label: "Weekly, billed monthly" },
    yearly: { amount: 49900, billingPeriod: "year", label: "Yearly" },
    // Worth five years of the yearly plan (499 * 5 = 2495).
    lifetime: { amount: 249500, billingPeriod: "lifetime", label: "Lifetime" },
  },
  USD: {
    monthly: { amount: 650, weeklyReference: 1.5, billingPeriod: "week", label: "Weekly, billed monthly" },
    yearly: { amount: 6300, billingPeriod: "year", label: "Yearly" },
    lifetime: { amount: 31500, billingPeriod: "lifetime", label: "Lifetime" },
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

/** The discount the extra accounts earn: 8% each, capped at 30%. */
export function seatDiscountPercent(extraSeats: number): number {
  const percent = normalizeSeatCount(extraSeats) * SEAT_DISCOUNT_PERCENT
  return Math.min(SEAT_DISCOUNT_MAX_PERCENT, percent)
}

export interface PriceBreakdown {
  currency: Currency
  planType: PlanType
  /** Base price in the smallest currency unit. */
  baseAmount: number
  /** Seat discount in the smallest currency unit. */
  discountAmount: number
  /** Amount that is actually charged, in the smallest currency unit. */
  totalAmount: number
  discountPercent: number
  extraSeats: number
  weeklyReference: number | null
  billingPeriod: PlanPrice["billingPeriod"]
  label: string
}

/**
 * Works out the amount that has to be charged.
 * The seat discount is applied to the base price of the plan.
 */
export function resolvePriceBreakdown(
  currency: Currency,
  planType: PlanType,
  extraSeats: number = 0,
): PriceBreakdown {
  const plan = PLAN_CATALOG[currency][planType]
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
  const base = `${currency}_${planType}_seats${normalizeSeatCount(extraSeats)}`
  return discountPercent > 0 ? `${base}_c${discountPercent}` : base
}

/**
 * The amount of the first cycle when a coupon is used: the plan price with
 * the family discount and then the coupon on top.
 */
export function resolveFirstCycleAmount(
  currency: Currency,
  planType: PlanType,
  extraSeats: number = 0,
  discountPercent: number = 0,
): number {
  const plan = PLAN_CATALOG[currency][planType]
  const withSeats = Math.round(plan.amount * (1 - seatDiscountPercent(extraSeats) / 100))
  return Math.round(withSeats * (1 - discountPercent / 100))
}

/** Lifetime purchases keep premium access for this many years. */
export function lifetimePeriodYears(): number {
  return LIFETIME_PERIOD_YEARS
}
