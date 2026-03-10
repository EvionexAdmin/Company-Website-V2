import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "jsr:@supabase/supabase-js@2";

const ALLOWED_ORIGINS = [
    'https://www.evionex.com',
    'https://evionex.com',
    'http://localhost:5173',
    'http://localhost:5174',
];

function getCorsHeaders(req: Request) {
    const origin = req.headers.get('Origin') || '';
    const allowedOrigin = ALLOWED_ORIGINS.includes(origin) ? origin : ALLOWED_ORIGINS[0];
    return {
        'Access-Control-Allow-Origin': allowedOrigin,
        'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Vary': 'Origin',
    };
}

function decodeBase64Url(input: string): string {
    let base64 = input.replace(/-/g, '+').replace(/_/g, '/');
    while (base64.length % 4) base64 += '=';
    return atob(base64);
}

function getCallerIdFromJwt(req: Request): { callerId: string | null; debug?: string } {
    const authHeader = req.headers.get('Authorization') || '';
    if (!authHeader.startsWith('Bearer ')) {
        return { callerId: null, debug: 'Auth header missing or invalid' };
    }
    const token = authHeader.slice(7).trim();
    if (token === 'undefined' || token === 'null' || !token) {
        return { callerId: null, debug: 'Token value is empty or invalid' };
    }
    const parts = token.split('.');
    if (parts.length !== 3) {
        return { callerId: null, debug: 'Malformed JWT' };
    }
    try {
        const jsonStr = decodeBase64Url(parts[1]);
        const payload = JSON.parse(jsonStr);
        return {
            callerId: typeof payload?.sub === 'string' ? payload.sub : null,
            debug: payload?.sub ? 'OK' : 'No sub claim in JWT'
        };
    } catch (err) {
        return { callerId: null, debug: 'JWT decode failed' };
    }
}

Deno.serve(async (req: Request) => {
    const corsHeaders = getCorsHeaders(req);

    if (req.method === 'OPTIONS') {
        return new Response('ok', { headers: corsHeaders });
    }

    if (req.method !== 'POST') {
        return new Response(JSON.stringify({ error: 'Method not allowed' }), { status: 405, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
    }

    try {
        const { callerId, debug } = getCallerIdFromJwt(req);
        if (!callerId) {
            console.error("401 Unauthorized:", debug);
            return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
        }

        const supabaseAdmin = createClient(
            Deno.env.get('SUPABASE_URL')!,
            Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
            { auth: { autoRefreshToken: false, persistSession: false } }
        );

        const { data: callerProfile, error: profileErr } = await supabaseAdmin
            .from('evionex_profiles')
            .select('sub_role')
            .eq('id', callerId)
            .single();

        if (profileErr) {
            console.error("Debug: Profile DB error", profileErr);
        }

        if (!callerProfile || callerProfile.sub_role !== 'admin') {
            console.error("Debug: callerProfile sub_role mismatch:", callerProfile?.sub_role);
            return new Response(JSON.stringify({ error: 'Forbidden: admin access required' }), { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
        }

        const { email, password, fullName, subRole, department } = await req.json();

        if (!email || !password || !fullName || !subRole || !department) {
            return new Response(JSON.stringify({ error: 'Missing required fields' }), { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
        }

        if (password.length < 8) {
            return new Response(JSON.stringify({ error: 'Password must be at least 8 characters' }), { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
        }

        const { data: newUser, error: createError } = await supabaseAdmin.auth.admin.createUser({
            email: email.toLowerCase(),
            password,
            email_confirm: true,
            user_metadata: {
                evionex_role: 'employee',
                evionex_sub_role: subRole.toLowerCase(),
                full_name: fullName,
            },
        });

        if (createError) {
            console.error('Create employee error:', createError);
            return new Response(JSON.stringify({ error: 'Failed to create employee account' }), { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
        }

        if (newUser?.user?.id) {
            await supabaseAdmin
                .from('evionex_employees')
                .update({ department })
                .eq('id', newUser.user.id);
        }

        return new Response(JSON.stringify({
            success: true,
            userId: newUser?.user?.id,
            message: `Employee '${fullName}' created.`
        }), { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });

    } catch (err) {
        console.error('evionex-create-employee error:', err);
        return new Response(JSON.stringify({ error: 'An internal error occurred' }), { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
    }
});
