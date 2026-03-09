// deno-lint-ignore-file
// @ts-nocheck
// This file runs in the Deno/Supabase Edge Runtime — Deno globals are always available there.

// --- Security: Restrict CORS to allowed origins only ---
const PRODUCTION_ORIGIN = Deno.env.get("ALLOWED_ORIGIN") || "https://www.evionex.com";
const ALLOWED_ORIGINS = [
    PRODUCTION_ORIGIN,
    "http://localhost:5173",
    "http://localhost:3000",
];

function getCorsHeaders(req: Request) {
    const origin = req.headers.get("Origin") || "";
    const allowedOrigin = ALLOWED_ORIGINS.includes(origin) ? origin : PRODUCTION_ORIGIN;
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
        const { token } = await req.json();

        // Validate required field
        if (!token || typeof token !== "string") {
            return new Response(
                JSON.stringify({
                    success: false,
                    error: "Missing or invalid turnstile token",
                }),
                {
                    status: 400,
                    headers: {
                        ...corsHeaders,
                        "Content-Type": "application/json",
                    },
                }
            );
        }

        // Read the secret key from environment (set via `supabase secrets set`)
        const secretKey = Deno.env.get("TURNSTILE_SECRET_KEY");
        if (!secretKey) {
            console.error("TURNSTILE_SECRET_KEY not configured");
            return new Response(
                JSON.stringify({
                    success: false,
                    error: "CAPTCHA verification not configured",
                }),
                {
                    status: 500,
                    headers: {
                        ...corsHeaders,
                        "Content-Type": "application/json",
                    },
                }
            );
        }

        // Extract client IP for additional validation
        const remoteip =
            req.headers.get("cf-connecting-ip") ||
            req.headers.get("x-forwarded-for") ||
            undefined;

        // ── Call Cloudflare Siteverify API ──
        const verifyResponse = await fetch(
            "https://challenges.cloudflare.com/turnstile/v0/siteverify",
            {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    secret: secretKey,
                    response: token,
                    ...(remoteip && { remoteip }),
                }),
            }
        );

        if (!verifyResponse.ok) {
            console.error(
                "Siteverify API error:",
                verifyResponse.status,
                await verifyResponse.text()
            );
            return new Response(
                JSON.stringify({
                    success: false,
                    error: "CAPTCHA verification service error",
                }),
                {
                    status: 502,
                    headers: {
                        ...corsHeaders,
                        "Content-Type": "application/json",
                    },
                }
            );
        }

        const result = await verifyResponse.json();

        return new Response(
            JSON.stringify({
                success: result.success === true,
                // Never forward error-codes to client — log them server-side only
            }),
            {
                status: 200,
                headers: {
                    ...corsHeaders,
                    "Content-Type": "application/json",
                },
            }
        );
    } catch (error) {
        console.error("verify-turnstile error:", error);
        return new Response(
            JSON.stringify({
                success: false,
                error: "Internal server error",
            }),
            {
                status: 500,
                headers: {
                    ...corsHeaders,
                    "Content-Type": "application/json",
                },
            }
        );
    }
});
