import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers":
        "authorization, x-client-info, apikey, content-type",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
};

Deno.serve(async (req: Request) => {
    // Handle CORS preflight
    if (req.method === "OPTIONS") {
        return new Response("ok", { headers: corsHeaders });
    }

    try {
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
        const razorpayKeySecret = Deno.env.get("RAZORPAY_KEY_SECRET");
        if (!razorpayKeySecret) {
            console.error("RAZORPAY_KEY_SECRET not configured");
            throw new Error("Payment verification not configured");
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

        // ── Persist to database ──
        const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
        const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
        const supabase = createClient(supabaseUrl, supabaseServiceKey);

        // Look up the original order
        const { data: orderData, error: orderError } = await supabase
            .from("orders")
            .select("id")
            .eq("razorpay_order_id", razorpay_order_id)
            .single();

        if (orderError) {
            console.error("Order lookup error:", orderError);
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
        if (orderData) {
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

        return new Response(
            JSON.stringify({
                verified: isValid,
                payment_id: razorpay_payment_id,
            }),
            {
                status: 200,
                headers: { ...corsHeaders, "Content-Type": "application/json" },
            }
        );
    } catch (error) {
        console.error("verify-razorpay-payment error:", error);
        return new Response(
            JSON.stringify({ error: error.message }),
            {
                status: 500,
                headers: { ...corsHeaders, "Content-Type": "application/json" },
            }
        );
    }
});
