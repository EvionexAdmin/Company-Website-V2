import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { supabaseEviolife } from '../lib/supabaseEviolife'
import './Auth.css'

// Mirrors the MRI Insights page in the Evio Life app (src/lib/mock-data.ts).
// Only metrics the analyst marks as "quantifiable" are replaced in the app.
const MRI_CATALOGUE = [
  {
    title: 'Body Composition Metrics',
    metrics: [
      'Total Body Fat Volume::L', 'Visceral Fat Volume::L', 'Subcutaneous Fat Volume::L',
      'Visceral/Subcutaneous Fat Ratio::', 'Liver Fat Percentage::%', 'Pancreatic Fat::%',
      'Skeletal Muscle Volume::L', 'Muscle Symmetry (L/R)::%',
    ],
  },
  {
    title: 'Cardiometabolic Risk Indicators',
    metrics: [
      'Aortic Diameter (Ascending)::cm', 'Epicardial Fat Volume::cm³',
      'Kidney Size (Average)::cm', 'Spleen Size::cm',
    ],
  },
  {
    title: 'Musculoskeletal Health',
    metrics: [
      'Joint Cartilage Thickness::mm', 'Bone Marrow Fat (Femur)::%', 'Muscle Quality Index::',
    ],
  },
  {
    title: 'Organ Health Screening',
    metrics: [
      'Brain Volume::cm³', 'White Matter Hyperintensities::cm³', 'Prostate Volume::mL',
    ],
  },
  {
    title: 'Aging & Longevity Biomarkers',
    metrics: ['Muscle-to-Fat Ratio::', 'Visceral Fat Index::', 'Biological Organ Age::years'],
  },
].map((group) => ({
  title: group.title,
  metrics: group.metrics.map((entry) => {
    const [name, unit] = entry.split('::')
    return { name, unit }
  }),
}))

const SCAN_STATUSES = ['pending', 'processing', 'processed']

export default function MriAdmin() {
  const { user, profile, loading } = useAuth()
  const isAdmin = profile?.sub_role === 'admin'
  const [scans, setScans] = useState(null)
  const [statusFilter, setStatusFilter] = useState('pending')
  const [selected, setSelected] = useState(null)
  const [existing, setExisting] = useState(null)
  const [metrics, setMetrics] = useState({})
  const [modelUrl, setModelUrl] = useState('')
  const [modelType, setModelType] = useState('none')
  const [analystNotes, setAnalystNotes] = useState('')
  const [saving, setSaving] = useState(false)
  const [savingMsg, setSavingMsg] = useState('')
  const [uploadingModel, setUploadingModel] = useState(false)

  useEffect(() => {
    if (!user || !isAdmin) return
    loadScans()
  }, [user, isAdmin, statusFilter])

  async function loadScans() {
    setScans(null)
    const query = supabaseEviolife
      .from('mri_scans')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(200)
    const { data } =
      statusFilter === 'all'
        ? await query
        : await query.eq('status', statusFilter)
    setScans(data || [])
  }

  const roundedDate = () => new Date().toISOString().split('T')[0]

  // Warm the form from a scan row + any results already saved for that user.
  async function openScan(scan) {
    setSelected(scan)
    setSavingMsg('')
    setMetrics({})
    setModelUrl('')
    setModelType('none')
    setAnalystNotes('')
    setExisting(null)
    const { data } = await supabaseEviolife
      .from('mri_results')
      .select('*')
      .eq('user_id', scan.user_id)
      .maybeSingle()
    if (data) {
      setExisting(data)
      setModelUrl(data.model_url || '')
      setModelType(data.model_type || (data.model_url ? 'image' : 'none'))
      setAnalystNotes(data.analyst_notes || '')
      const restored = {}
      for (const m of data.metrics || []) {
        if (m?.name && m.quantifiable) {
          restored[`${m.category}::${m.name}`] = String(m.value ?? '')
        }
      }
      setMetrics(restored)
    }
  }

  function handleModelFile(e) {
    const file = e.target.files?.[0]
    if (!file) return
    uploadModel(file)
    e.target.value = ''
  }

  async function uploadModel(file) {
    setUploadingModel(true)
    setSavingMsg('')
    try {
      const ext = (file.name.split('.').pop() || '').toLowerCase()
      const isModel = ext === 'glb' || ext === 'gltf'
      const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_')
      const path = `${selected.user_id}/${Date.now()}_${safeName}`
      const { error } = await supabaseEviolife.storage
        .from('mri-results')
        .upload(path, file, {
          cacheControl: '31536000',
          upsert: false,
          contentType: isModel ? 'model/gltf-binary' : file.type || 'application/octet-stream',
        })
      if (error) throw error
      const { data: { publicUrl } } = supabaseEviolife.storage.from('mri-results').getPublicUrl(path)
      setModelUrl(publicUrl)
      setModelType(isModel ? 'gltf' : 'image')
    } catch (err) {
      setSavingMsg(`Model upload failed: ${err.message || err}`)
    } finally {
      setUploadingModel(false)
    }
  }

  async function saveResults() {
    if (!selected) return
    setSaving(true)
    setSavingMsg('')
    try {
      const payloadMetrics = []
      for (const group of MRI_CATALOGUE) {
        for (const m of group.metrics) {
          const key = `${group.title}::${m.name}`
          const raw = metrics[key]
          const quantifiable = raw !== undefined && raw !== '' && raw !== null
          payloadMetrics.push({
            category: group.title,
            name: m.name,
            unit: m.unit,
            quantifiable,
            // A single date-stamped point; the app treats one point as the
            // current reading, and later uploads build the trend line.
            data: quantifiable
              ? [{ date: roundedDate(), value: Number(raw) }]
              : [],
            description: undefined,
          })
        }
      }
      const row = {
        user_id: selected.user_id,
        model_url: modelUrl || null,
        model_type: modelType,
        metrics: payloadMetrics,
        analyst_notes: analystNotes.trim() || null,
        status: 'ready',
        reviewed_by: user.id,
        reviewed_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }
      const { error } = await supabaseEviolife
        .from('mri_results')
        .upsert(row, { onConflict: 'user_id' })
      if (error) throw error
      await supabaseEviolife
        .from('mri_scans')
        .update({ status: 'processed' })
        .eq('id', selected.id)
      setSavingMsg('Results saved — the user\'s app replaces its dummy MRI data with this now.')
      await loadScans()
    } catch (err) {
      setSavingMsg(`Save failed: ${err.message || err}`)
    } finally {
      setSaving(false)
    }
  }

  const quantifiedCount = useMemo(
    () => Object.values(metrics).filter((v) => v !== '' && v !== undefined && v !== null).length,
    [metrics],
  )

  if (loading) {
    return <main className="evx-auth-shell"><p style={{ padding: '2rem' }}>Loading…</p></main>
  }
  if (!isAdmin) {
    return (
      <main className="evx-auth-shell">
        <p style={{ padding: '2rem', color: '#f43f5e' }}>
          Admins only. ({profile ? `signed in as ${profile.sub_role || 'patient'}` : 'not signed in'}){' '}
          <Link to="/portal/login" style={{ color: '#38bdf8' }}>Sign in</Link>
        </p>
      </main>
    )
  }

  return (
    <main className="evx-auth-shell">
      <section className="evx-auth evx-mri" aria-labelledby="mri-admin-title">
        <div className="evx-auth__frame evx-mri__frame animate-fade-in-up">
          <section className="evx-auth__panel" style={{ maxHeight: '90vh', overflow: 'auto' }}>
            <span className="evx-auth__kicker">Evio Life · Admin</span>
            <h1 id="mri-admin-title" className="evx-auth__title">MRI upload console</h1>
            <p className="evx-auth__subtitle">
              Pick a pending scan, then push the analysed 3D model and biomarker values.
              Saved results instantly replace the dummy data in that user's app.
            </p>

            <div style={{ display: 'flex', gap: '.5rem', flexWrap: 'wrap', margin: '1rem 0' }}>
              {SCAN_STATUSES.concat('all').map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => setStatusFilter(s)}
                  style={{
                    padding: '.4rem .9rem', borderRadius: '999px', cursor: 'pointer',
                    border: statusFilter === s ? '1px solid #38bdf8' : '1px solid rgba(148,163,184,.4)',
                    background: statusFilter === s ? 'rgba(56,189,248,.15)' : 'transparent',
                    color: statusFilter === s ? '#38bdf8' : '#94a3b8',
                    textTransform: 'capitalize',
                  }}
                >
                  {s}
                </button>
              ))}
              <button type="button" onClick={loadScans}
                style={{ padding: '.4rem .9rem', borderRadius: '999px', border: '1px solid rgba(148,163,184,.4)', background: 'transparent', color: '#94a3b8', cursor: 'pointer' }}>
                Refresh
              </button>
            </div>

            {scans === null && <p style={{ color: '#94a3b8' }}>Loading scans…</p>}
            {scans !== null && scans.length === 0 && (
              <p style={{ color: '#94a3b8' }}>No scans with this status yet.</p>
            )}
            <ul style={{ listStyle: 'none', padding: 0, display: 'grid', gap: '.55rem' }}>
              {(scans || []).map((scan) => (
                <li key={scan.id}
                  style={{
                    border: selected?.id === scan.id ? '1px solid #38bdf8' : '1px solid rgba(148,163,184,.3)',
                    borderRadius: '12px', padding: '.7rem .9rem', cursor: 'pointer',
                  }}
                  onClick={() => openScan(scan)}
                >
                  <div style={{ fontWeight: 700 }}>{scan.full_name || scan.email || '(unnamed user)'}</div>
                  <div style={{ color: '#94a3b8', fontSize: '.8rem' }}>
                    {new Date(scan.created_at).toLocaleString('en-IN')} ·{' '}
                    purpose: {scan.purpose === 'health_concerns' ? 'Health concerns' : 'Routine'} ·{' '}
                    {scan.file_name || scan.storage_path}
                    {scan.notes && <> · notes: <em>{scan.notes}</em></>}
                  </div>
                </li>
              ))}
            </ul>

            {selected && (
              <div style={{ marginTop: '1.5rem', borderTop: '1px solid rgba(148,163,184,.25)', paddingTop: '1rem' }}>
                <h2 style={{ fontSize: '1.05rem', margin: 0 }}>
                  Results for {selected.full_name || selected.email}{' '}
                  {existing && <span style={{ color: '#f59e0b', fontSize: '.75rem' }}> (previous results loaded — saving replaces them)</span>}
                </h2>

                {/* 3D model */}
                <div style={{ marginTop: '1rem' }}>
                  <strong style={{ color: '#e2e8f0' }}>3D model</strong>
                  <div style={{ display: 'flex', gap: '.6rem', alignItems: 'center', marginTop: '.4rem', flexWrap: 'wrap' }}>
                    <input type="file" accept=".glb,.gltf,image/*" onChange={handleModelFile} />
                    {uploadingModel && <span style={{ color: '#38bdf8' }}>Uploading…</span>}
                  </div>
                  <input
                    type="url"
                    placeholder="…or paste a model/image URL"
                    value={modelUrl}
                    onChange={(e) => setModelUrl(e.target.value)}
                    style={{ width: '100%', marginTop: '.4rem', padding: '.45rem .6rem', borderRadius: '8px', border: '1px solid rgba(148,163,184,.35)', background: 'transparent', color: '#e2e8f0' }}
                  />
                  {modelUrl && (
                    <p style={{ color: '#34d399', fontSize: '.8rem', marginTop: '.3rem' }}>
                      Model set ({modelUrl.endsWith('.glb') || modelUrl.endsWith('.gltf') ? 'interactive 3D' : 'image'})
                    </p>
                  )}
                </div>

                {/* Biomarkers */}
                <div style={{ marginTop: '1.4rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <strong style={{ color: '#e2e8f0' }}>Biomarker values</strong>
                    <span style={{ color: '#94a3b8', fontSize: '.8rem' }}>{quantifiedCount} valid</span>
                  </div>
                  <p style={{ color: '#94a3b8', fontSize: '.8rem', marginTop: '.2rem' }}>
                    Fill only the markers your analysis quantified. Blank markers stay
                    "not quantifiable from this scan" in the user's app instead of dummy values.
                  </p>
                  {MRI_CATALOGUE.map((group) => (
                    <div key={group.title} style={{ marginTop: '.9rem' }}>
                      <div style={{ color: '#38bdf8', fontWeight: 700, marginBottom: '.35rem' }}>{group.title}</div>
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(210px, 1fr))', gap: '.5rem' }}>
                        {group.metrics.map((m) => {
                          const key = `${group.title}::${m.name}`
                          return (
                            <label key={key} style={{ display: 'flex', alignItems: 'center', gap: '.4rem', color: '#cbd5e1', fontSize: '.8rem' }}>
                              <span style={{ flex: 1 }}>{m.name}</span>
                              <input
                                type="number"
                                step="any"
                                value={metrics[key] ?? ''}
                                onChange={(e) => setMetrics((prev) => ({ ...prev, [key]: e.target.value }))}
                                style={{ width: '5rem', padding: '.3rem .4rem', borderRadius: '8px', border: '1px solid rgba(148,163,184,.35)', background: 'transparent', color: '#e2e8f0' }}
                              />
                              <span style={{ color: '#94a3b8' }}>{m.unit}</span>
                            </label>
                          )
                        })}
                      </div>
                    </div>
                  ))}
                </div>

                <label style={{ display: 'block', marginTop: '1.2rem', color: '#cbd5e1', fontSize: '.85rem' }}>
                  Analyst notes (optional)
                  <textarea
                    value={analystNotes}
                    onChange={(e) => setAnalystNotes(e.target.value)}
                    style={{ width: '100%', minHeight: '3.5rem', marginTop: '.3rem', padding: '.5rem .6rem', borderRadius: '8px', border: '1px solid rgba(148,163,184,.35)', background: 'transparent', color: '#e2e8f0', resize: 'vertical' }}
                  />
                </label>

                <button
                  type="button"
                  className="evx-auth__submit"
                  style={{ marginTop: '1rem' }}
                  disabled={saving || uploadingModel}
                  onClick={saveResults}
                >
                  {saving ? 'Saving…' : 'Save results & mark processed'}
                </button>
                {savingMsg && <p style={{ marginTop: '.6rem', color: savingMsg.startsWith('Save failed') ? '#f43f5e' : '#34d399' }}>{savingMsg}</p>}
              </div>
            )}
          </section>
        </div>
      </section>
    </main>
  )
}
