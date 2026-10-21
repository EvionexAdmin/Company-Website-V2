// deno-lint-ignore-file
// @ts-nocheck
// This file runs in the Deno/Supabase Edge Runtime — Deno globals are always available there.
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { lifetimePeriodYears } from "../_shared/pricing.ts";
import { razorpayRequest } from "../_shared/subscription.ts";

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

        const { razorpay_order_id, razorpay_payment_id, razorpay_signature } =
            await req.json();

        // Validate required fields
        if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
            return new Response(
                JSON.stringify({
                    error: "razorpay_order_id, razorpay_payment_id, and razorpay_signature are required",
                }),
                {
                    status: 400,
                    headers: { ...corsHeaders, "Content-Type": "application/json" },
                }
            );
        }

        // Read Razorpay key secret from environment
        const razorpayKeySecret =
            Deno.env.get("RAZORPAY_KEY_SECRET") || Deno.env.get("VITE_RAZORPAY_KEY_SECRET");
        if (!razorpayKeySecret) {
            console.error("RAZORPAY_KEY_SECRET not configured");
            return new Response(
                JSON.stringify({
                    error: "Payment verification is not configured on the server. Missing: RAZORPAY_KEY_SECRET (or VITE_RAZORPAY_KEY_SECRET)",
                }),
                {
                    status: 500,
                    headers: { ...corsHeaders, "Content-Type": "application/json" },
                }
            );
        }

        // ── Verify signature using HMAC SHA-256 ──
        // As per Razorpay docs: generated_signature = hmac_sha256(order_id + "|" + payment_id, secret)
        const message = `${razorpay_order_id}|${razorpay_payment_id}`;
        const encoder = new TextEncoder();

        const key = await crypto.subtle.importKey(
            "raw",
            encoder.encode(razorpayKeySecret),
            { name: "HMAC", hash: "SHA-256" },
            false,
            ["sign"]
        );

        const signatureBytes = await crypto.subtle.sign(
            "HMAC",
            key,
            encoder.encode(message)
        );

        // Convert to hex string
        const generatedSignature = Array.from(new Uint8Array(signatureBytes))
            .map((b) => b.toString(16).padStart(2, "0"))
            .join("");

        const isValid = generatedSignature === razorpay_signature;

        // --- Persist to database ---
        const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
        const supabase = createClient(supabaseUrl, supabaseServiceKey);

        // Look up the original order. The orders table lives in the website
        // project, so the order is read from Razorpay when it is not stored
        // locally. The plan is kept in the order notes.
        let orderData: { id?: string; plan_name?: string; amount?: number; currency?: string } | null = null;
        const { data: localOrder, error: orderError } = await supabase
            .from("orders")
            .select("id, plan_name, amount, currency")
            .eq("razorpay_order_id", razorpay_order_id)
            .maybeSingle();

        if (orderError) {
            console.error("Order lookup error:", orderError);
        }
        orderData = localOrder || null;

        if (!orderData?.plan_name) {
            try {
                const razorpayOrder = await razorpayRequest(
                    `/orders/${razorpay_order_id}`,
                    undefined,
                    "GET",
                );
                orderData = {
                    plan_name: razorpayOrder?.notes?.plan_name,
                    amount: razorpayOrder?.amount,
                    currency: razorpayOrder?.currency,
                };
            } catch (orderFetchError) {
                console.error("Could not read the order from Razorpay", orderFetchError);
            }
        }

        // Insert payment record
        const { error: paymentError } = await supabase.from("payments").insert({
            order_id: orderData?.id || null,
            razorpay_payment_id,
            razorpay_order_id,
            razorpay_signature,
            verified: isValid,
        });

        if (paymentError) {
            console.error("Payment insert error:", paymentError);
        }

        // Update order status
        if (orderData?.id) {
            const { error: updateError } = await supabase
                .from("orders")
                .update({
                    status: isValid ? "paid" : "failed",
                    updated_at: new Date().toISOString(),
                })
                .eq("id", orderData.id);

            if (updateError) {
                console.error("Order update error:", updateError);
            }
        }

        // A paid premium plan (for example the lifetime plan) activates the
        // premium access and the family accounts that were added.
        let premiumActivated = false;
        if (isValid && orderData?.plan_name?.startsWith("premium_")) {
            const planType = orderData.plan_name.replace("premium_", "");
            const expiry = new Date();
            expiry.setFullYear(expiry.getFullYear() + lifetimePeriodYears());

            const { error: premiumError } = await supabase
                .from("profiles")
                .update({
                    is_premium: true,
                    subscription_tier: "premium",
                    subscription_expiry: expiry.toISOString(),
                    updated_at: new Date().toISOString(),
                })
                .eq("id", callerUser.id);

            if (premiumError) {
                console.error("Could not activate premium:", premiumError.message);
            } else {
                premiumActivated = true;

                const { error: seatError } = await supabase
                    .from("subscription_seats")
                    .update({ status: "active" })
                    .eq("owner_user_id", callerUser.id)
                    .eq("status", "pending");
                if (seatError) {
                    console.error("Could not activate the family accounts:", seatError.message);
                }
            }
        }

        return new Response(
            JSON.stringify({
                verified: isValid,
                payment_id: razorpay_payment_id,
                premium_activated: premiumActivated,
            }),
            {
                status: 200,
                headers: { ...corsHeaders, "Content-Type": "application/json" },
            }
        );
    } catch (error) {
        console.error("verify-razorpay-payment error:", error);
        return new Response(
            JSON.stringify({ error: "An internal error occurred. Please try again." }),
            {
                status: 500,
                headers: { ...corsHeaders, "Content-Type": "application/json" },
            }
        );
    }
});
