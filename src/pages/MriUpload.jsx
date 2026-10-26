import { useState, useRef } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { supabaseEviolife } from '../lib/supabaseEviolife'

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
    // DICOM magic: "DICM" at offset 128
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
  const [file, setFile] = useState(null)
  const [status, setStatus] = useState('idle') // idle | validating | uploading | done | error
  const [message, setMessage] = useState('')
  const [progress, setProgress] = useState(0)
  const inputRef = useRef(null)

  const handleSelect = async (e) => {
    const chosen = e.target.files && e.target.files[0]
    if (!chosen) return
    setStatus('validating')
    setMessage('')
    if (isRejected(chosen)) {
      setStatus('error')
      setMessage('Photos and image files (JPG, PNG, PDF, etc.) are not accepted. Please upload a DICOM (.dcm) file or a raw MRI dataset.')
      setFile(null)
      return
    }
    const magic = await readMagic(chosen)
    if (chosen.name.toLowerCase().endsWith('.dcm') || chosen.name.toLowerCase().endsWith('.dicom')) {
      if (magic !== 'dicom') {
        setStatus('error')
        setMessage('The selected file does not look like a valid DICOM file. Please check the file and try again.')
        setFile(null)
        return
      }
    }
    setFile(chosen)
    setStatus('idle')
    setMessage(`Selected: ${chosen.name} (${(chosen.size / 1024 / 1024).toFixed(2)} MB)`)
  }

  const handleUpload = async () => {
    if (!file) return
    setStatus('uploading')
    setProgress(0)
    try {
      const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_')
      const folder = user?.id || 'anonymous'
      const path = `${folder}/${Date.now()}_${safeName}`
      const { error } = await supabaseEviolife.storage
        .from('mri-scans')
        .upload(path, file, {
          cacheControl: '3600',
          upsert: false,
          contentType: file.type || 'application/octet-stream',
        })
      if (error) throw error
      setProgress(100)
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
    <div className="min-h-screen bg-background text-foreground">
      <div className="max-w-2xl mx-auto px-4 py-12">
        <h1 className="text-2xl md:text-3xl font-bold mb-2">Upload MRI Scan Data</h1>
        <p className="text-muted-foreground mb-6">
          Upload your MRI results in DICOM (.dcm) or raw format. Photos, screenshots and PDF reports are not accepted.
        </p>

        <div className="rounded-xl border border-border bg-card p-6 space-y-4">
          <div className="space-y-2">
            <label className="block text-sm font-medium">Select file</label>
            <input
              ref={inputRef}
              type="file"
              accept=".dcm,.dicom,application/dicom,application/octet-stream"
              onChange={handleSelect}
              className="block w-full text-sm file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:bg-primary file:text-primary-foreground file:font-medium"
            />
            <p className="text-xs text-muted-foreground">
              Accepted: DICOM (.dcm, .dicom) and raw MRI datasets. Rejected: JPG, PNG, HEIC, PDF and other image/document formats.
            </p>
          </div>

          {message && (
            <div
              className={`text-sm rounded-md p-3 ${
                status === 'error'
                  ? 'bg-destructive/10 text-destructive border border-destructive/20'
                  : status === 'done'
                  ? 'bg-green-500/10 text-green-600 border border-green-500/20'
                  : 'bg-muted text-muted-foreground'
              }`}
            >
              {message}
            </div>
          )}

          <button
            type="button"
            onClick={handleUpload}
            disabled={!file || status === 'uploading' || status === 'validating'}
            className="w-full inline-flex items-center justify-center gap-2 rounded-md bg-primary text-primary-foreground font-medium py-2 px-4 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {status === 'uploading' ? 'Uploading...' : 'Upload to Secure Storage'}
          </button>

          {!user && (
            <p className="text-xs text-muted-foreground">
              You are not signed in. The upload will be stored under an anonymous folder. Sign in on the dashboard for linked records.
            </p>
          )}
        </div>
      </div>
    </div>
  )
}
