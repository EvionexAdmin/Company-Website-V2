// notify-mri-upload — emails evionex.info@gmail.com whenever a premium user
// uploads an MRI scan.
//
// Deploy (from website-repo):
//   supabase functions deploy notify-mri-upload --project-ref <EVIOLIFE project ref>
//   supabase secrets set --project-ref <EVIOLIFE project ref> RESEND_API_KEY=<your Resend key>
//
// The client calls it right after inserting the mri_scans row, passing the
// user's own access token. The function re-reads the row with the service key,
// so it always has the truth (and never trusts raw client fields).

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const TO_EMAIL = 'evionex.info@gmail.com'
const FROM_EMAIL = Deno.env.get('RECEIPT_FROM_EMAIL') || 'Evio Life <receipts@evionex.com>'

const json = (status, body) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json' },
  })

Deno.serve(async (req) => {
  if (req.method !== 'POST') return json(405, { error: 'POST only' })

  const authHeader = req.headers.get('Authorization') || ''
  const token = authHeader.replace(/^Bearer\s+/i, '')
  if (!token) return json(401, { error: 'Missing Authorization header' })

  let payload
  try {
    payload = await req.json()
  } catch {
    return json(400, { error: 'Invalid JSON body' })
  }
  const scanId = payload?.scanId
  if (!scanId) return json(400, { error: 'Missing scanId' })

  // Verify the caller's JWT, then read the scan row with the service key.
  const admin = createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
  )

  const { data: authData, error: authError } = await admin.auth.getUser(token)
  if (authError || !authData?.user) return json(401, { error: 'Invalid token' })

  const { data: scan, error: scanError } = await admin
    .from('mri_scans')
    .select('id, user_id, full_name, email, purpose, notes, file_name, file_size, created_at')
    .eq('id', scanId)
    .single()

  if (scanError || !scan) return json(404, { error: 'Scan not found' })
  if (scan.user_id !== authData.user.id) return json(403, { error: 'Scan belongs to another user' })

  const size =
    scan.file_size ? `${(Number(scan.file_size) / (1024 * 1024)).toFixed(2)} MB` : 'unknown'
  const purpose = scan.purpose === 'health_concerns'
    ? 'Health concerns'
    : scan.purpose === 'routine'
      ? 'Routine check'
      : (scan.purpose || 'Unspecified')

  const html = `
    <h2 style="font-family:sans-serif">New MRI upload on Evio Life</h2>
    <table style="font-family:sans-serif;font-size:14px;border-collapse:collapse">
      <tr><td align="right" style="padding:6px 12px;color:#666"><b>User name</b></td><td>${scan.full_name ?? '—'}</td></tr>
      <tr><td align="right" style="padding:6px 12px;color:#666"><b>Email</b></td><td>${scan.email ?? '—'}</td></tr>
      <tr><td align="right" style="padding:6px 12px;color:#666"><b>User ID</b></td><td>${scan.user_id}</td></tr>
      <tr><td align="right" style="padding:6px 12px;color:#666"><b>Why the MRI was done</b></td><td>${purpose}</td></tr>
      <tr><td align="right" style="padding:6px 12px;color:#666"><b>Notes</b></td><td>${scan.notes ? scan.notes : '—'}</td></tr>
      <tr><td align="right" style="padding:6px 12px;color:#666"><b>File</b></td><td>${scan.file_name ?? '—'} (${size})</td></tr>
      <tr><td align="right" style="padding:6px 12px;color:#666"><b>Uploaded at</b></td><td>${scan.created_at}</td></tr>
    </table>
    <p style="font-family:sans-serif;color:#666">Storage path: <code>${scan.id}</code> — see the <b>mri-scans</b> bucket. Enter the results at evionex.com <code>#/mri-admin</code>.</p>
  `

  try {
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${Deno.env.get('RESEND_API_KEY')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: FROM_EMAIL,
        to: [TO_EMAIL],
        subject: `MRI scan uploaded by ${scan.full_name || scan.email || scan.user_id}`,
        html,
      }),
    })
    if (!res.ok) {
      const body = await res.text()
      return json(502, { error: `Resend failed: ${res.status}`, body })
    }
    return json(200, { ok: true })
  } catch (err) {
    return json(502, { error: err instanceof Error ? err.message : String(err) })
  }
})
