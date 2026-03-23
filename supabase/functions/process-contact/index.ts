import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const { firstName, lastName, email, designation, phone, interest, message } = await req.json();

    if (!firstName || !lastName || !email || !message) {
      return new Response(
        JSON.stringify({ error: "Required fields missing" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const resendApiKey = Deno.env.get("RESEND_API_KEY");
    if (!resendApiKey) {
      throw new Error("RESEND_API_KEY not configured");
    }

    const now = new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" });
    const fullName = `${firstName} ${lastName}`;

    const emailResponse = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${resendApiKey}`,
      },
      body: JSON.stringify({
        from: "Evionex Contact <onboarding@resend.dev>",
        to: ["evionex.info@gmail.com"],
        subject: `New Contact Form Submission: ${fullName}`,
        html: `
          <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
            <h2 style="color: #1a202c; border-bottom: 2px solid #00D4C8; padding-bottom: 10px;">📩 New Contact Request</h2>
            <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
              <tr>
                <td style="padding: 8px 12px; font-weight: 600; color: #4a5568; width: 140px;">Name</td>
                <td style="padding: 8px 12px; color: #1a202c;">${fullName}</td>
              </tr>
              <tr style="background: #f7fafc;">
                <td style="padding: 8px 12px; font-weight: 600; color: #4a5568;">Email</td>
                <td style="padding: 8px 12px; color: #1a202c;"><a href="mailto:${email}">${email}</a></td>
              </tr>
              <tr>
                <td style="padding: 8px 12px; font-weight: 600; color: #4a5568;">Phone</td>
                <td style="padding: 8px 12px; color: #1a202c;">${phone || 'N/A'}</td>
              </tr>
              <tr style="background: #f7fafc;">
                <td style="padding: 8px 12px; font-weight: 600; color: #4a5568;">Designation</td>
                <td style="padding: 8px 12px; color: #1a202c;">${designation || 'N/A'}</td>
              </tr>
              <tr>
                <td style="padding: 8px 12px; font-weight: 600; color: #4a5568;">Interest</td>
                <td style="padding: 8px 12px; color: #1a202c;">${interest || 'N/A'}</td>
              </tr>
              <tr style="background: #f7fafc;">
                <td style="padding: 8px 12px; font-weight: 600; color: #4a5568;">Date</td>
                <td style="padding: 8px 12px; color: #1a202c;">${now}</td>
              </tr>
            </table>
            <div style="margin-top: 20px; padding: 15px; background: #fdfdfd; border-left: 4px solid #00D4C8;">
              <h3 style="margin-top: 0; color: #4a5568; font-size: 14px; text-transform: uppercase;">Message</h3>
              <p style="color: #1a202c; white-space: pre-wrap; line-height: 1.6;">${message}</p>
            </div>
            <p style="color: #718096; font-size: 13px; margin-top: 24px;">This message was submitted via the Evionex website contact form.</p>
          </div>
        `,
      }),
    });

    if (!emailResponse.ok) {
      const emailError = await emailResponse.json();
      console.error("Resend API error:", emailError);
      throw new Error(`Failed to send email: ${JSON.stringify(emailError)}`);
    }

    return new Response(
      JSON.stringify({ success: true, message: "Email sent successfully" }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("process-contact error:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
