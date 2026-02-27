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
        const { amount, currency = "INR", plan_name, customer_name, customer_email } =
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

        // Read Razorpay credentials from environment secrets
        const razorpayKeyId = Deno.env.get("RAZORPAY_KEY_ID");
        const razorpayKeySecret = Deno.env.get("RAZORPAY_KEY_SECRET");

        if (!razorpayKeyId || !razorpayKeySecret) {
            console.error("Razorpay credentials not configured");
            throw new Error("Payment gateway not configured");
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
                amount,
                currency,
                receipt,
                notes: {
                    plan_name,
                    customer_name: customer_name || "",
                    customer_email: customer_email || "",
                },
            }),
        });

        if (!razorpayResponse.ok) {
            const errorData = await razorpayResponse.json();
            console.error("Razorpay API error:", errorData);
            throw new Error(`Payment gateway error: ${errorData?.error?.description || "Unknown error"}`);
        }

        const order = await razorpayResponse.json();

        // Store order in Supabase database using service role
        const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
        const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
        const supabase = createClient(supabaseUrl, supabaseServiceKey);

        const { error: dbError } = await supabase.from("orders").insert({
            razorpay_order_id: order.id,
            amount,
            currency,
            plan_name,
            status: "created",
            customer_name: customer_name || null,
            customer_email: customer_email || null,
            receipt,
        });

        if (dbError) {
            console.error("Database insert error:", dbError);
            // Don't fail the request — the Razorpay order was already created
        }

        return new Response(
            JSON.stringify({
                id: order.id,
                amount: order.amount,
                currency: order.currency,
            }),
            {
                status: 200,
                headers: { ...corsHeaders, "Content-Type": "application/json" },
            }
        );
    } catch (error) {
        console.error("create-razorpay-order error:", error);
        return new Response(
            JSON.stringify({ error: error.message }),
            {
                status: 500,
                headers: { ...corsHeaders, "Content-Type": "application/json" },
            }
        );
    }
});
