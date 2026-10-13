import { createClient, type User } from "https://esm.sh/@supabase/supabase-js@2"

const configuredOrigin = Deno.env.get("ALLOWED_ORIGIN") || "https://www.evionex.com"
const allowedOrigins = new Set([
  configuredOrigin,
  "https://evionex.com",
  "https://www.evionex.com",
  "http://localhost:5173",
  "http://localhost:3000",
])

export function corsHeaders(req: Request): Record<string, string> {
  const origin = req.headers.get("Origin") || ""
  return {
    "Access-Control-Allow-Origin": allowedOrigins.has(origin) ? origin : configuredOrigin,
    "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Max-Age": "86400",
    "Vary": "Origin",
  }
}

export function jsonResponse(req: Request, body: Record<string, unknown>, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders(req), "Content-Type": "application/json" },
  })
}

export function handleOptions(req: Request): Response | null {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders(req) })
  if (req.method !== "POST") return jsonResponse(req, { error: "Method not allowed" }, 405)
  return null
}

export async function getAuthenticatedUser(req: Request): Promise<User | null> {
  const authorization = req.headers.get("Authorization")
  const token = authorization?.match(/^Bearer (.+)$/)?.[1]
  const url = Deno.env.get("SUPABASE_URL")
  const anonKey = Deno.env.get("SUPABASE_ANON_KEY")
  if (!token || !url || !anonKey) return null
  const client = createClient(url, anonKey)
  const { data, error } = await client.auth.getUser(token)
  if (error) {
    console.error("Subscription caller authentication failed", error.message)
    return null
  }
  return data.user
}

export function getAdminClient() {
  const url = Deno.env.get("SUPABASE_URL")
  const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")
  if (!url || !serviceKey) throw new Error("Supabase service configuration is missing.")
  return createClient(url, serviceKey)
}

export function getRazorpayCredentials() {
  const keyId = Deno.env.get("RAZORPAY_KEY_ID") || Deno.env.get("VITE_RAZORPAY_KEY_ID")
  const keySecret = Deno.env.get("RAZORPAY_KEY_SECRET") || Deno.env.get("VITE_RAZORPAY_KEY_SECRET")
  if (!keyId || !keySecret) throw new Error("Razorpay credentials are not configured.")
  return { keyId, keySecret }
}

export async function razorpayRequest(path: string, body?: Record<string, unknown>, method = "POST") {
  const { keyId, keySecret } = getRazorpayCredentials()
  const response = await fetch(`https://api.razorpay.com/v1${path}`, {
    method,
    headers: {
      Authorization: `Basic ${btoa(`${keyId}:${keySecret}`)}`,
      "Content-Type": "application/json",
    },
    ...(body ? { body: JSON.stringify(body) } : {}),
  })
  const result = await response.json()
  if (!response.ok) {
    console.error("Razorpay API request failed", { path, status: response.status, error: result?.error?.description })
    throw new Error(result?.error?.description || "Razorpay could not process the request.")
  }
  return result
}

export async function resolveCoupon(code: string, planType: "monthly" | "yearly") {
  const normalizedCode = code.trim().toUpperCase()
  if (!normalizedCode || normalizedCode.length > 64) return null

  const db = getAdminClient()
  const { data, error } = await db
    .from("promo_codes")
    .select("code, discount_type, discount_value, expiry_date, max_uses, current_uses, active")
    .eq("code", normalizedCode)
    .eq("active", true)
    .maybeSingle()

  if (error) {
    console.error("Coupon lookup failed", error.message)
    throw new Error("Unable to validate this coupon right now.")
  }
  if (!data) return null

  const discountType = String(data.discount_type).toLowerCase()
  const discountPercent = Number(data.discount_value)
  if (!["percentage", "percent"].includes(discountType) || ![30, 50].includes(discountPercent)) return null
  if (data.expiry_date) {
    const expiry = Date.parse(data.expiry_date)
    if (!Number.isFinite(expiry) || expiry < Date.now()) return null
  }
  if (data.max_uses != null && Number(data.current_uses || 0) >= Number(data.max_uses)) return null

  const offerId = Deno.env.get(`RAZORPAY_OFFER_INR_${planType.toUpperCase()}_${discountPercent}`)
  if (!offerId) {
    throw new Error("This coupon is not enabled for checkout yet.")
  }
  return { code: normalizedCode, discountPercent, offerId }
}

export async function hmacHex(value: string, secret: string) {
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  )
  const signature = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(value))
  return Array.from(new Uint8Array(signature), (byte) => byte.toString(16).padStart(2, "0")).join("")
}

export function constantTimeEqual(left: string, right: string) {
  if (left.length !== right.length) return false
  let difference = 0
  for (let index = 0; index < left.length; index += 1) {
    difference |= left.charCodeAt(index) ^ right.charCodeAt(index)
  }
  return difference === 0
}
