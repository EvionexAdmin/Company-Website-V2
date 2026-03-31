import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { encodeBase64 } from "jsr:@std/encoding/base64";

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
    const { filePath, applicantName, applicantEmail, applicantPosition } = await req.json();

    if (!filePath || !applicantName || !applicantEmail || !applicantPosition) {
      return new Response(
        JSON.stringify({ error: "filePath, applicantName, applicantEmail, and applicantPosition are required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Initialize Supabase client with service role key
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Download the file from storage
    const { data: fileData, error: downloadError } = await supabase.storage
      .from("resumes")
      .download(filePath);

    if (downloadError || !fileData) {
      console.error("Download error:", downloadError);
      return new Response(
        JSON.stringify({ error: "Failed to download resume from storage" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Convert file to base64 for email attachment
    const arrayBuffer = await fileData.arrayBuffer();
    const base64Content = encodeBase64(arrayBuffer);

    // Determine filename from the path
    const fileName = filePath.split("/").pop() || "resume";

    // Send email via Resend API
    const resendApiKey = Deno.env.get("RESEND_API_KEY");
    if (!resendApiKey) {
      throw new Error("RESEND_API_KEY not configured");
    }

    const now = new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" });

    const emailResponse = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${resendApiKey}`,
      },
      body: JSON.stringify({
        from: "Evionex Careers <info@evionex.com>",
        to: ["evionex.info@gmail.com"],
        subject: `New Resume Submission: ${applicantName} — ${applicantPosition}`,
        html: `
          <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
            <h2 style="color: #1a202c; border-bottom: 2px solid #00D4C8; padding-bottom: 10px;">📋 New Resume Submission</h2>
            <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
              <tr>
                <td style="padding: 8px 12px; font-weight: 600; color: #4a5568; width: 140px;">Name</td>
                <td style="padding: 8px 12px; color: #1a202c;">${applicantName}</td>
              </tr>
              <tr style="background: #f7fafc;">
                <td style="padding: 8px 12px; font-weight: 600; color: #4a5568;">Email</td>
                <td style="padding: 8px 12px; color: #1a202c;"><a href="mailto:${applicantEmail}">${applicantEmail}</a></td>
              </tr>
              <tr>
                <td style="padding: 8px 12px; font-weight: 600; color: #4a5568;">Position</td>
                <td style="padding: 8px 12px; color: #1a202c;">${applicantPosition}</td>
              </tr>
              <tr style="background: #f7fafc;">
                <td style="padding: 8px 12px; font-weight: 600; color: #4a5568;">Submitted</td>
                <td style="padding: 8px 12px; color: #1a202c;">${now}</td>
              </tr>
              <tr>
                <td style="padding: 8px 12px; font-weight: 600; color: #4a5568;">File</td>
                <td style="padding: 8px 12px; color: #1a202c;">${fileName}</td>
              </tr>
            </table>
            <p style="color: #718096; font-size: 13px; margin-top: 24px;">This resume was submitted via the Evionex website careers page.</p>
          </div>
        `,
        attachments: [
          {
            filename: fileName,
            content: base64Content,
          },
        ],
      }),
    });

    if (!emailResponse.ok) {
      const emailError = await emailResponse.json();
      console.error("Resend API error:", emailError);
      throw new Error(`Failed to send email: ${JSON.stringify(emailError)}`);
    }

    // Delete the file from storage after successful email
    const { error: deleteError } = await supabase.storage
      .from("resumes")
      .remove([filePath]);

    if (deleteError) {
      console.error("Failed to delete file (non-critical):", deleteError);
      // Non-critical: email was sent successfully, just log the error
    }

    return new Response(
      JSON.stringify({ success: true, message: "Resume sent successfully" }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("process-resume error:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
