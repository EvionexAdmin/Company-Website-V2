import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { supabaseEviolife } from '../lib/supabaseEviolife'
import './Auth.css'

const REJECTED_EXTENSIONS = [
  '.jpg', '.jpeg', '.png', '.gif', '.webp', '.heic', '.bmp', '.tiff', '.tif',
  '.pdf', '.doc', '.docx', '.txt', '.rtf', '.html', '.csv',
]

function isRejected(file) {
  const name = (file.name || '').toLowerCase()
  if (REJECTED_EXTENSIONS.some((ext) => name.endsWith(ext))) return true
  const type = (file.type || '').toLowerCase()
  if (type.startsWith('image/') || type === 'application/pdf') return true
  return false
}

async function readMagic(file) {
  try {
    const buf = await file.slice(0, 132).arrayBuffer()
    const bytes = new Uint8Array(buf)
    // DICOM files carry the "DICM" marker at offset 128.
    if (bytes.length >= 132) {
      const magic = String.fromCharCode(bytes[128], bytes[129], bytes[130], bytes[131])
      if (magic === 'DICM') return 'dicom'
    }
    return 'unknown'
  } catch {
    return 'unknown'
  }
}

export default function MriUpload() {
  const { user } = useAuth()
  const [status, setStatus] = useState('idle') // idle | validating | uploading | done | error
  const [message, setMessage] = useState('')
  const [gate, setGate] = useState('checking') // checking | signed-out | free | premium
  const [file, setFile] = useState(null)
  const inputRef = useRef(null)
  // Why the MRI was done — required before the upload runs.
  const [purpose, setPurpose] = useState('') // '' | 'health_concerns' | 'routine'
  const [notes, setNotes] = useState('')
  // Success window explaining the specialist review turnaround.
  const [showSuccessModal, setShowSuccessModal] = useState(false)

  // MRI uploads are a premium feature. A paid Razorpay subscription row or an
  // active premium profile (trial or grant) unlocks the uploader.
  useEffect(() => {
    let isMounted = true
    if (!user) {
      setGate('signed-out')
      return
    }
    ;(async () => {
      try {
        const { data: subscription } = await supabaseEviolife
          .from('subscriptions')
          .select('id')
          .eq('user_id', user.id)
          .in('status', ['authenticated', 'active'])
          .order('created_at', { ascending: false })
          .limit(1)
          .maybeSingle()
        if (subscription) {
          if (isMounted) setGate('premium')
          return
        }
        const { data: profileData } = await supabaseEviolife
          .from('profiles')
          .select('is_premium, subscription_tier')
          .eq('id', user.id)
          .maybeSingle()
        if (isMounted) {
          setGate(
            profileData?.is_premium && profileData?.subscription_tier === 'premium'
              ? 'premium'
              : 'free'
          )
        }
      } catch {
        // Fail closed: if premium cannot be verified, treat as free.
        if (isMounted) setGate('free')
      }
    })()
    return () => { isMounted = false }
  }, [user])

  const handleSelect = async (e) => {
    const chosen = e.target.files && e.target.files[0]
    if (!chosen) return
    setStatus('validating')
    setMessage('')
    if (isRejected(chosen)) {
      setStatus('error')
      setMessage('Photos and image files (JPG, PNG, PDF, etc.) are not accepted. Please upload a DICOM (.dcm) file or a raw MRI dataset.')
      setFile(null)
      e.target.value = ''
      return
    }
    const magic = await readMagic(chosen)
    if (/\.(dcm|dicom)$/.test(chosen.name.toLowerCase()) && magic !== 'dicom') {
      setStatus('error')
      setMessage('The selected file does not look like a valid DICOM file. Please check the file and try again.')
      setFile(null)
      e.target.value = ''
      return
    }
    setFile(chosen)
    setStatus('idle')
    setMessage(`Selected: ${chosen.name} (${(chosen.size / 1024 / 1024).toFixed(2)} MB)`)
  }

  const handleUpload = async () => {
    if (!file || !user) return
    if (!purpose) {
      setStatus('error')
      setMessage('Please tell us why the MRI was done before uploading.')
      return
    }
    setStatus('uploading')
    try {
      const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_')
      const path = `${user.id}/${Date.now()}_${safeName}`
      const { data: uploaded, error } = await supabaseEviolife.storage
        .from('mri-scans')
        .upload(path, file, {
          cacheControl: '3600',
          upsert: false,
          contentType: file.type || 'application/octet-stream',
        })
      if (error) throw error

      // Record the upload so the team can pick it up and attach results to
      // the same account later (the app's MRI page reads mri_results).
      const fullName =
        user.user_metadata?.full_name || user.user_metadata?.name || ''
      const scanId = await recordScan({
        userId: user.id,
        fullName,
        email: user.email,
        path: uploaded?.path || path,
        fileName: file.name,
        fileSize: file.size,
        purpose,
        notes: notes.trim() || null,
      })

      setStatus('done')
      setMessage('Upload complete. Your MRI data has been stored securely and a specialist review has been queued.')
      setShowSuccessModal(true)
      setFile(null)
      setNotes('')
      setPurpose('')
      if (inputRef.current) inputRef.current.value = ''

      // Tell the team about the upload (non-blocking: the scan is already safe).
      if (scanId) {
        try {
          const { data: { session } } = await supabaseEviolife.auth.getSession()
          await fetch(
            `${import.meta.env.VITE_EVIOLIFE_SUPABASE_URL}/functions/v1/notify-mri-upload`,
            {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${session?.access_token || ''}`,
              },
              body: JSON.stringify({ scanId }),
            },
          )
        } catch {
          // Email notification is best-effort; the upload itself succeeded.
        }
      }
    } catch (err) {
      setStatus('error')
      setMessage(err?.message || 'Upload failed. Please try again.')
    }
  }

  /** Insert one mri_scans row. Returns the new row id, or null on failure. */
  async function recordScan(fields) {
    try {
      const { data, error } = await supabaseEviolife
        .from('mri_scans')
        .insert(fields)
        .select('id')
        .single()
      if (error) throw error
      return data?.id || null
    } catch (err) {
      console.warn('Could not record the upload in mri_scans:', err?.message)
      return null
    }
  }

  return (
    <main className="evx-auth-shell">
      <section className="evx-auth evx-mri" aria-labelledby="mri-upload-title">
        <div className="evx-auth__frame evx-mri__frame animate-fade-in-up">
          <section className="evx-auth__panel" aria-label="Upload MRI data">
            <span className="evx-auth__kicker">Evio Life · MRI Insights</span>

            {gate === 'checking' && (
              <>
                <h1 id="mri-upload-title" className="evx-auth__title">Checking your access…</h1>
                <p className="evx-auth__subtitle">Hold on while we confirm your plan.</p>
              </>
            )}

            {gate === 'signed-out' && (
              <>
                <h1 id="mri-upload-title" className="evx-auth__title">Sign in to upload</h1>
                <p className="evx-auth__subtitle">
                  MRI uploads are part of Evio Life Premium. Sign in with your Evio Life account
                  to continue.
                </p>
                <Link to="/portal/login" className="evx-auth__submit evx-mri__cta">Sign in</Link>
                <p className="evx-mri__note">
                  No account yet? <Link to="/portal/signup" className="evx-mri__link">Create one</Link>.
                </p>
              </>
            )}

            {gate === 'free' && (
              <>
                <h1 id="mri-upload-title" className="evx-auth__title">Premium required</h1>
                <p className="evx-auth__subtitle">
                  Uploading your own MRI scans is a Premium feature. Start a plan to unlock MRI
                  Insights, secure scan storage and analyst review.
                </p>
                <Link to="/subscribe/eviolife" className="evx-auth__submit evx-mri__cta">See Premium plans</Link>
                <p className="evx-mri__note">
                  Every new account also gets a 14 day free Premium trial once you sign in.
                </p>
              </>
            )}

            {gate === 'premium' && (
              <>
                <h1 id="mri-upload-title" className="evx-auth__title">Upload MRI scan data</h1>
                <p className="evx-auth__subtitle">
                  Send your MRI results in DICOM (.dcm) or raw format. Photos, screenshots and PDF
                  reports are not accepted, only the original scan data.
                </p>

                <div className="evx-auth__field" style={{ marginTop: '0.4rem' }}>
                  <span className="evx-mri__label">Select file</span>
                  <input
                    ref={inputRef}
                    type="file"
                    accept=".dcm,.dicom,application/dicom,application/octet-stream"
                    onChange={handleSelect}
                    className="evx-mri__file-input"
                    aria-label="Select a DICOM or raw MRI file to upload"
                  />
                  <p className="evx-mri__hint">
                    Accepted: DICOM (.dcm, .dicom) and raw MRI datasets. Rejected: JPG, PNG, HEIC,
                    PDF and other image or document formats.
                  </p>
                </div>

                <div className="evx-auth__field" style={{ marginTop: '1.2rem' }}>
                  <span className="evx-mri__label">Why was the MRI done?</span>
                  <div className="evx-mri__purpose-options" style={{ display: 'flex', gap: '0.6rem', flexWrap: 'wrap', marginTop: '0.5rem' }}>
                    {[
                      { value: 'health_concerns', label: 'Health concerns' },
                      { value: 'routine', label: 'Routine check' },
                    ].map((option) => (
                      <label
                        key={option.value}
                        style={{
                          display: 'flex', alignItems: 'center', gap: '0.45rem', cursor: 'pointer',
                          padding: '0.55rem 0.9rem', borderRadius: '10px',
                          border: purpose === option.value ? '1px solid currentColor' : '1px solid rgba(148,163,184,.45)',
                          background: purpose === option.value ? 'rgba(56,189,248,.12)' : 'transparent',
                          color: purpose === option.value ? '#38bdf8' : 'inherit',
                          fontWeight: purpose === option.value ? 600 : 400,
                        }}
                      >
                        <input
                          type="radio"
                          name="mri-purpose"
                          value={option.value}
                          checked={purpose === option.value}
                          onChange={() => setPurpose(option.value)}
                        />
                        {option.label}
                      </label>
                    ))}
                  </div>
                </div>

                <div className="evx-auth__field" style={{ marginTop: '0.9rem' }}>
                  <span className="evx-mri__label">Anything we should know? (optional)</span>
                  <textarea
                    className="evx-mri__file-input"
                    style={{ minHeight: '4.5rem', padding: '0.6rem', resize: 'vertical' }}
                    placeholder="e.g. lower back pain, follow-up of a previous finding…"
                    value={notes}
                    maxLength={500}
                    onChange={(e) => setNotes(e.target.value)}
                    aria-label="Additional notes about the MRI"
                  />
                </div>

                {message && (
                  <div
                    role="status"
                    className={`evx-auth__alert ${
                      status === 'error' ? 'evx-auth__alert--error' : 'evx-auth__alert--success'
                    }`}
                    style={{ marginTop: '0.9rem' }}
                  >
                    {message}
                  </div>
                )}

                <button
                  type="button"
                  className="evx-auth__submit"
                  onClick={handleUpload}
                  disabled={!file || !purpose || status === 'uploading' || status === 'validating'}
                >
                  {status === 'validating'
                    ? 'Validating file...'
                    : status === 'uploading'
                    ? 'Uploading...'
                    : `Upload to secure storage${file && !purpose ? ' (choose why the MRI was done)' : ''}`}
                </button>

                <p className="evx-mri__note">
                  Uploaded to your own private folder. <Link to="/contact" className="evx-mri__link">Contact us</Link>{' '}
                  if you need help preparing your scan.
                </p>
              </>
            )}
          </section>

          <aside className="evx-auth__showcase" style={{ backgroundImage: 'none' }} aria-hidden="true">
            <div className="evx-mri__showcase">
              <div className="evx-mri__showcase-kicker">Secure clinical pipeline</div>
              <h2>Your scan, read by specialists</h2>
              <p>
                Uploaded MRI data flows into the Evio Life analysis pipeline. Our team reviews the
                raw study, and results appear in the MRI Insights section of the app.
              </p>
              <ul className="evx-mri__list">
                <li>DICOM and raw study formats</li>
                <li>Encrypted private cloud storage</li>
                <li>Reviewed by trained analysts</li>
                <li>Results delivered in the app</li>
              </ul>
              {gate === 'free' && (
                <p className="evx-mri__showcase-note">Premium unlocks MRI uploads and the rest of the analysis suite.</p>
              )}
            </div>
          </aside>
        </div>
      </section>

      {/* Success window — sets expectations about the specialist review. */}
      {showSuccessModal && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Upload received"
          onClick={() => setShowSuccessModal(false)}
          style={{
            position: 'fixed', inset: 0, zIndex: 1000, display: 'flex',
            alignItems: 'center', justifyContent: 'center', padding: '1.5rem',
            background: 'rgba(2,6,23,.75)', backdropFilter: 'blur(6px)',
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              maxWidth: '34rem', width: '100%', borderRadius: '18px',
              border: '1px solid rgba(56,189,248,.35)', background: '#0f172a',
              color: '#e2e8f0', padding: '1.8rem', boxShadow: '0 24px 60px rgba(0,0,0,.5)',
            }}
          >
            <h2 style={{ marginTop: 0, fontSize: '1.25rem', color: '#38bdf8' }}>
              Upload received — thank you
            </h2>
            <p style={{ lineHeight: 1.6, margin: '0.9rem 0' }}>
              MRI data are complex and require specialists to analyze them, therefore
              this might take <strong>up to 7 business days</strong> to reflect in your app.
            </p>
            <p style={{ lineHeight: 1.6, color: '#94a3b8', fontSize: '.92rem' }}>
              We have notified our analysis team. You can close this page — we will
              update the MRI Insights section of your Evio Life app as soon as the
              review is complete. No action is needed from you in the meantime.
            </p>
            <button
              type="button"
              className="evx-auth__submit"
              style={{ marginTop: '1.2rem' }}
              onClick={() => setShowSuccessModal(false)}
            >
              Got it
            </button>
          </div>
        </div>
      )}
    </main>
  )
}
