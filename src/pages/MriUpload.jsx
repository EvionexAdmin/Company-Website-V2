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
    setStatus('uploading')
    try {
      const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_')
      const path = `${user.id}/${Date.now()}_${safeName}`
      const { error } = await supabaseEviolife.storage
        .from('mri-scans')
        .upload(path, file, {
          cacheControl: '3600',
          upsert: false,
          contentType: file.type || 'application/octet-stream',
        })
      if (error) throw error
      setStatus('done')
      setMessage('Upload complete. Your MRI data has been stored securely. Our team will review it shortly.')
      setFile(null)
      if (inputRef.current) inputRef.current.value = ''
    } catch (err) {
      setStatus('error')
      setMessage(err?.message || 'Upload failed. Please try again.')
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
                  disabled={!file || status === 'uploading' || status === 'validating'}
                >
                  {status === 'validating'
                    ? 'Validating file...'
                    : status === 'uploading'
                    ? 'Uploading...'
                    : 'Upload to secure storage'}
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
    </main>
  )
}
