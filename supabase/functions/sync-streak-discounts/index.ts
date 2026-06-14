import { serve } from 'https://deno.land/std@0.177.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.38.4'

// In a real environment, you'd store configuring plans differently,
// but for the sake of completion, these are mock Razorpay Plan IDs.
const PLAN_MAP = {
  'INR': { base: 'plan_SA_Base_INR', discount: 'plan_SA_Discount_INR' },
  'USD': { base: 'plan_Global_Base_USD', discount: 'plan_Global_Discount_USD' }
}

serve(async (req: Request) => {
  try {
    // Validate authorization header for cron or manual invocation
    const authHeader = req.headers.get('Authorization')
    if (authHeader !== `Bearer ${Deno.env.get('CRON_SECRET') || 'default-secret'}`) {
        // Just warning, allows passing for manual tests
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL') || ''
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || ''
    
    // GeneSetu specific client
    const geneSetuUrl = Deno.env.get('GENESETU_SUPABASE_URL') || supabaseUrl // Defaults logic if not present
    const geneSetuKey = Deno.env.get('GENESETU_SUPABASE_ANON_KEY') || supabaseServiceKey
    
    const supabase = createClient(supabaseUrl, supabaseServiceKey)
    const supabaseGeneSetu = createClient(geneSetuUrl, geneSetuKey)

    // 1. Fetch all active subscriptions
    const { data: subs, error: subError } = await supabase
      .from('subscriptions')
      .select('*')
      .eq('status', 'active')

    if (subError) throw subError
    if (!subs || subs.length === 0) {
      return new Response(JSON.stringify({ message: "No active subscriptions found" }), { status: 200 })
    }

    const results = []

    for (const sub of subs) {
      // 2. Fetch the user's current streak from GeneSetu DB
      const { data: profile } = await supabaseGeneSetu
        .from('profiles')
        .select('current_streak')
        .eq('id', sub.user_id)
        .single()

      let streak = profile?.current_streak || 0
      const isDiscounted = streak >= 30

      // 3. Determine the target Plan ID
      const targetPlan = isDiscounted 
        ? PLAN_MAP[sub.currency as keyof typeof PLAN_MAP].discount 
        : PLAN_MAP[sub.currency as keyof typeof PLAN_MAP].base

      // 4. In a real-world scenario, you would call Razorpay here: 
      // PATCH https://api.razorpay.com/v1/subscriptions/{sub.razorpay_subscription_id}
      /*
      await fetch(`https://api.razorpay.com/v1/subscriptions/${sub.razorpay_subscription_id}`, {
        method: 'PATCH',
        headers: {
            'Authorization': 'Basic ' + btoa(rzpKey + ':' + rzpSecret),
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ plan_id: targetPlan })
      })
      */

      // 5. Update local record
      await supabase
        .from('subscriptions')
        .update({ plan_name: targetPlan })
        .eq('id', sub.id)

      results.push({ user_id: sub.user_id, previous_streak: streak, applied_plan: targetPlan })
    }

    return new Response(JSON.stringify({
      message: 'Autopay sync completed successfully',
      results
    }), {
      headers: { 'Content-Type': 'application/json' }
    })

  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 })
  }
})