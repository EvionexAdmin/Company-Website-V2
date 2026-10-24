// deno-lint-ignore-file
// @ts-nocheck
// This file runs in the Deno/Supabase Edge Runtime — Deno globals are always available there.
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import {
    isCurrency,
    isPlanType,
    normalizeSeatCount,
    normalizeSeatEmails,
    resolvePlanAmount,
} from "../_shared/pricing.ts";
import { resolveCouponPercent } from "../_shared/subscription.ts";

// --- Security: Restrict CORS to explicit origins only ---
function buildAllowedOrigins() {
    const configuredOrigin = Deno.env.get("ALLOWED_ORIGIN") || "https://www.evionex.com";
    const allowedOrigins = new Set<string>([
        configuredOrigin,
        "http://localhost:5173",
        "http://localhost:3000",
    ]);

    // Accept both apex and www variants of the configured production domain.
    try {
        const parsed = new URL(configuredOrigin);
        if (parsed.hostname.startsWith("www.")) {
            allowedOrigins.add(`${parsed.protocol}//${parsed.hostname.replace(/^www\./, "")}`);
        } else {
            allowedOrigins.add(`${parsed.protocol}//www.${parsed.hostname}`);
        }
    } catch {
        // Ignore malformed ALLOWED_ORIGIN and keep the configured value as-is.
    }

    return {
        productionOrigin: configuredOrigin,
        allowedOrigins,
    };
}

const { productionOrigin: PRODUCTION_ORIGIN, allowedOrigins: ALLOWED_ORIGINS } = buildAllowedOrigins();

function getCorsHeaders(req: Request) {
    const origin = req.headers.get("Origin") || "";
    const allowedOrigin = ALLOWED_ORIGINS.has(origin) ? origin : PRODUCTION_ORIGIN;
    return {
        "Access-Control-Allow-Origin": allowedOrigin,
        "Access-Control-Allow-Headers":
            "authorization, x-client-info, apikey, content-type",
        "Access-Control-Allow-Methods": "POST, OPTIONS",
        "Access-Control-Max-Age": "86400",
    };
}

Deno.serve(async (req: Request) => {
    const corsHeaders = getCorsHeaders(req);

    // Handle CORS preflight
    if (req.method === "OPTIONS") {
        return new Response("ok", { headers: corsHeaders });
    }

    try {
        // --- Security: Verify the caller is authenticated ---
        const authHeader = req.headers.get("Authorization");
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return new Response(
                JSON.stringify({ error: "Unauthorized" }),
                { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
            );
        }

        const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
        const supabaseAnonKey = Deno.env.get("SUPABASE_ANON_KEY")!;
        const supabaseAuth = createClient(supabaseUrl, supabaseAnonKey, {
            global: { headers: { Authorization: authHeader } },
        });
        const { data: { user: callerUser }, error: authError } = await supabaseAuth.auth.getUser();
        if (authError || !callerUser) {
            return new Response(
                JSON.stringify({ error: "Invalid or expired token" }),
                { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
            );
        }

        const { amount, currency = "INR", plan_name, customer_name, customer_email, planType, seats, couponCode, seatEmails } =
            await req.json();

        // Validate required fields
        if (!amount || !plan_name) {
            return new Response(
                JSON.stringify({ error: "amount and plan_name are required" }),
                {
                    status: 400,
                    headers: { ...corsHeaders, "Content-Type": "application/json" },
                }
            );
        }

        if (amount <= 0) {
            return new Response(
                JSON.stringify({ error: "amount must be greater than 0" }),
                {
                    status: 400,
                    headers: { ...corsHeaders, "Content-Type": "application/json" },
                }
            );
        }

        // Premium plans are priced on the server so the amount cannot be
        // tampered with in the browser.
        let orderAmount = Number(amount)
        let orderCurrency = currency
        let extraSeats = 0
        let resolvedPlanName = plan_name
        let couponPercent = 0
        const invitedEmails: string[] = []

        if (planType && isPlanType(planType)) {
            if (!isCurrency(currency)) {
                return new Response(
                    JSON.stringify({ error: "Unsupported currency for this plan." }),
                    { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } },
                )
            }
            invitedEmails.push(...normalizeSeatEmails(seatEmails, callerUser.email))
            // The number of seats comes from the validated emails, never from
            // the client, so the price always matches the invited accounts.
            extraSeats = normalizeSeatCount(Math.max(normalizeSeatCount(seats), invitedEmails.length))
            orderAmount = resolvePlanAmount(currency, planType, extraSeats)
            orderCurrency = currency
            resolvedPlanName = `premium_${planType}`

            // A coupon is applied by Razorpay for the subscription plans. The
            // one-off lifetime plan is discounted here instead.
            if (couponCode) {
                const coupon = await resolveCouponPercent(couponCode)
                if (!coupon) {
                    return new Response(
                        JSON.stringify({ error: "Coupon is invalid, expired, or unavailable." }),
                        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } },
                    )
                }
                if (planType === "lifetime") {
                    couponPercent = coupon.discountPercent
                    orderAmount = Math.round(orderAmount * (1 - couponPercent / 100))
                }
            }
        }

        // Read Razorpay credentials from environment secrets
        const razorpayKeyId =
            Deno.env.get("RAZORPAY_KEY_ID") || Deno.env.get("VITE_RAZORPAY_KEY_ID");
        const razorpayKeySecret =
            Deno.env.get("RAZORPAY_KEY_SECRET") || Deno.env.get("VITE_RAZORPAY_KEY_SECRET");

        if (!razorpayKeyId || !razorpayKeySecret) {
            const missing = [
                !razorpayKeyId ? "RAZORPAY_KEY_ID (or VITE_RAZORPAY_KEY_ID)" : null,
                !razorpayKeySecret ? "RAZORPAY_KEY_SECRET (or VITE_RAZORPAY_KEY_SECRET)" : null,
            ].filter(Boolean);
            console.error("Razorpay credentials not configured", { missing });
            return new Response(
                JSON.stringify({
                    error: `Payment gateway is not configured on the server. Missing: ${missing.join(", ")}`,
                }),
                {
                    status: 500,
                    headers: { ...corsHeaders, "Content-Type": "application/json" },
                }
            );
        }

        // Generate unique receipt ID
        const receipt = `rcpt_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;

        // Create order via Razorpay Orders API
        const razorpayResponse = await fetch("https://api.razorpay.com/v1/orders", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization:
                    "Basic " + btoa(`${razorpayKeyId}:${razorpayKeySecret}`),
            },
            body: JSON.stringify({
                amount: orderAmount,
                currency: orderCurrency,
                receipt,
                notes: {
                    plan_name: resolvedPlanName,
                    customer_name: customer_name || "",
                    customer_email: customer_email || "",
                    seats: String(extraSeats),
                },
            }),
        });

        if (!razorpayResponse.ok) {
            const errorData = await razorpayResponse.json();
            console.error("Razorpay API error:", errorData);
            return new Response(
                JSON.stringify({
                    error: `Payment gateway error: ${errorData?.error?.description || "Unable to create order"}`,
                }),
                {
                    status: 502,
                    headers: { ...corsHeaders, "Content-Type": "application/json" },
                }
            );
        }

        const order = await razorpayResponse.json();

        // Store order in Supabase database using service role
        const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
        const supabase = createClient(supabaseUrl, supabaseServiceKey);

        const { error: dbError } = await supabase.from("orders").insert({
            razorpay_order_id: order.id,
            amount: orderAmount,
            currency: orderCurrency,
            plan_name: resolvedPlanName,
            status: "created",
            customer_name: customer_name || null,
            customer_email: customer_email || null,
            receipt,
        });

        if (dbError) {
            console.error("Database insert error:", dbError);
            // Don't fail the request — the Razorpay order was already created
        }

        // The family accounts are invited and activated once the payment is
        // confirmed.
        if (invitedEmails.length) {
            const { error: seatError } = await supabase.from("subscription_seats").upsert(
                invitedEmails.map((email) => ({
                    owner_user_id: callerUser.id,
                    email,
                    status: "pending",
                })),
                { onConflict: "owner_user_id,email" },
            );
            if (seatError) console.error("Could not save the family accounts:", seatError.message);
        }

        return new Response(
            JSON.stringify({
                id: order.id,
                amount: order.amount,
                currency: order.currency,
                key_id: razorpayKeyId,
            }),
            {
                status: 200,
                headers: { ...corsHeaders, "Content-Type": "application/json" },
            }
        );
    } catch (error) {
        console.error("create-razorpay-order error:", error);
        return new Response(
            JSON.stringify({ error: "An internal error occurred. Please try again." }),
            {
                status: 500,
                headers: { ...corsHeaders, "Content-Type": "application/json" },
            }
        );
    }
});
