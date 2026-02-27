import { useState, useRef } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../lib/supabaseClient'
import './Careers.css'

const ALLOWED_TYPES = [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'image/jpeg',
]
const MAX_SIZE = 20 * 1024 * 1024 // 20 MB
const ALLOWED_EXTENSIONS = '.pdf,.doc,.docx,.jpg,.jpeg'

export default function Careers() {
    const [showModal, setShowModal] = useState(false)
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [file, setFile] = useState(null)
    const [dragOver, setDragOver] = useState(false)
    const [status, setStatus] = useState('idle') // idle | uploading | success | error
    const [errorMsg, setErrorMsg] = useState('')
    const fileInputRef = useRef(null)

    const resetForm = () => {
        setName('')
        setEmail('')
        setFile(null)
        setErrorMsg('')
        setStatus('idle')
    }

    const handleClose = () => {
        setShowModal(false)
        resetForm()
    }

    const validateFile = (f) => {
        if (!f) return 'Please select a file'
        if (!ALLOWED_TYPES.includes(f.type)) {
            return 'Invalid file type. Please upload a PDF, Word document, or JPEG image.'
        }
        if (f.size > MAX_SIZE) {
            return `File too large. Maximum size is 20 MB. Your file is ${(f.size / (1024 * 1024)).toFixed(1)} MB.`
        }
        return null
    }

    const handleFileChange = (e) => {
        const selected = e.target.files?.[0]
        if (selected) {
            const err = validateFile(selected)
            if (err) {
                setErrorMsg(err)
                setFile(null)
            } else {
                setErrorMsg('')
                setFile(selected)
            }
        }
    }

    const handleDrop = (e) => {
        e.preventDefault()
        setDragOver(false)
        const dropped = e.dataTransfer.files?.[0]
        if (dropped) {
            const err = validateFile(dropped)
            if (err) {
                setErrorMsg(err)
                setFile(null)
            } else {
                setErrorMsg('')
                setFile(dropped)
            }
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setErrorMsg('')

        if (!name.trim()) { setErrorMsg('Please enter your name'); return }
        if (!email.trim()) { setErrorMsg('Please enter your email'); return }
        const fileErr = validateFile(file)
        if (fileErr) { setErrorMsg(fileErr); return }

        setStatus('uploading')

        try {
            // Generate a unique file path
            const ext = file.name.split('.').pop()
            const filePath = `${Date.now()}_${Math.random().toString(36).slice(2, 8)}.${ext}`

            // Upload to Supabase Storage
            const { error: uploadError } = await supabase.storage
                .from('resumes')
                .upload(filePath, file)

            if (uploadError) {
                throw new Error(uploadError.message || 'Upload failed')
            }

            // Invoke edge function to email + delete
            const { data, error: fnError } = await supabase.functions.invoke('process-resume', {
                body: {
                    filePath,
                    applicantName: name.trim(),
                    applicantEmail: email.trim(),
                },
            })

            if (fnError) {
                throw new Error(fnError.message || 'Failed to process resume')
            }

            setStatus('success')
        } catch (err) {
            console.error('Resume submission error:', err)
            setErrorMsg(err.message || 'Something went wrong. Please try again.')
            setStatus('error')
        }
    }

    return (
        <div className="careers-page">
            <section className="page-hero">
                <div className="container">
                    <div className="section-header animate-fade-in-up">
                        <span className="tag">Careers</span>
                        <h1>Join Our <span className="text-gradient">Journey</span></h1>
                        <p>Be part of a team that's transforming research, education, and healthcare</p>
                    </div>
                </div>
            </section>

            <section className="section">
                <div className="container">
                    <div className="careers-content animate-fade-in-up">
                        <div className="careers-status">
                            <div className="careers-status__icon">📋</div>
                            <h2>No Current Openings</h2>
                            <p>
                                While we don't have any active positions listed right now, we're always on the lookout
                                for exceptional talent who share our passion for innovation and technology.
                            </p>
                        </div>

                        <div className="glow-line"></div>

                        <div className="careers-message">
                            <h3>We're Always Looking for Talent</h3>
                            <p>
                                Evionex is a fast-growing startup, and our team is continuously expanding. If you're
                                passionate about AI, education technology, healthcare innovation, or research tools,
                                we'd love to hear from you. Send us your resume and tell us how you'd like to contribute
                                to our mission of transforming institutions through technology.
                            </p>

                            <div className="careers-perks">
                                {[
                                    { icon: '🚀', title: 'Growth Opportunity', desc: 'Join a startup at an exciting growth stage' },
                                    { icon: '💡', title: 'Innovation First', desc: 'Work on cutting-edge AI and technology' },
                                    { icon: '🌍', title: 'Impact Driven', desc: 'Make a real difference in education and research' },
                                    { icon: '🤝', title: 'Collaborative Culture', desc: 'Work with passionate founders and experts' },
                                ].map((perk, i) => (
                                    <div key={i} className="card careers-perk-card">
                                        <div className="feature-icon">{perk.icon}</div>
                                        <h4>{perk.title}</h4>
                                        <p>{perk.desc}</p>
                                    </div>
                                ))}
                            </div>

                            <div className="careers-cta">
                                <button
                                    className="btn btn-primary btn-large"
                                    onClick={() => setShowModal(true)}
                                >
                                    Send Us Your Resume
                                    <span className="btn-arrow">→</span>
                                </button>
                                <Link to="/contact" className="btn btn-secondary btn-large">
                                    Contact Us
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Resume Upload Modal */}
            {showModal && (
                <div className="resume-modal-overlay" onClick={handleClose}>
                    <div className="resume-modal" onClick={(e) => e.stopPropagation()}>
                        <button className="resume-modal__close" onClick={handleClose} aria-label="Close">
                            ✕
                        </button>

                        {status === 'success' ? (
                            <div className="resume-modal__success">
                                <div className="resume-modal__success-icon">✅</div>
                                <h3>Resume Submitted!</h3>
                                <p>
                                    Thank you for your interest in joining Evionex. We've received your resume
                                    and our team will review it shortly.
                                </p>
                                <button className="btn btn-primary" onClick={handleClose}>
                                    Close
                                </button>
                            </div>
                        ) : (
                            <>
                                <h3 className="resume-modal__title">Submit Your Resume</h3>
                                <p className="resume-modal__subtitle">
                                    Upload your resume and we'll get back to you if there's a match.
                                </p>

                                <form onSubmit={handleSubmit} className="resume-form">
                                    <div className="form-group">
                                        <label className="form-label" htmlFor="resume-name">Full Name *</label>
                                        <input
                                            id="resume-name"
                                            type="text"
                                            className="form-input"
                                            placeholder="Your full name"
                                            value={name}
                                            onChange={(e) => setName(e.target.value)}
                                            disabled={status === 'uploading'}
                                            required
                                        />
                                    </div>

                                    <div className="form-group">
                                        <label className="form-label" htmlFor="resume-email">Email Address *</label>
                                        <input
                                            id="resume-email"
                                            type="email"
                                            className="form-input"
                                            placeholder="your@email.com"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            disabled={status === 'uploading'}
                                            required
                                        />
                                    </div>

                                    <div className="form-group">
                                        <label className="form-label">Resume *</label>
                                        <div
                                            className={`resume-dropzone ${dragOver ? 'resume-dropzone--active' : ''} ${file ? 'resume-dropzone--has-file' : ''}`}
                                            onDragOver={(e) => { e.preventDefault(); setDragOver(true) }}
                                            onDragLeave={() => setDragOver(false)}
                                            onDrop={handleDrop}
                                            onClick={() => fileInputRef.current?.click()}
                                        >
                                            <input
                                                ref={fileInputRef}
                                                type="file"
                                                accept={ALLOWED_EXTENSIONS}
                                                onChange={handleFileChange}
                                                style={{ display: 'none' }}
                                                disabled={status === 'uploading'}
                                            />
                                            {file ? (
                                                <div className="resume-dropzone__file">
                                                    <span className="resume-dropzone__file-icon">📄</span>
                                                    <div>
                                                        <div className="resume-dropzone__file-name">{file.name}</div>
                                                        <div className="resume-dropzone__file-size">
                                                            {(file.size / (1024 * 1024)).toFixed(2)} MB
                                                        </div>
                                                    </div>
                                                </div>
                                            ) : (
                                                <div className="resume-dropzone__placeholder">
                                                    <span className="resume-dropzone__icon">📎</span>
                                                    <span>Drag & drop or <strong>click to browse</strong></span>
                                                    <span className="resume-dropzone__hint">
                                                        PDF, Word, or JPEG — Max 20 MB
                                                    </span>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {errorMsg && (
                                        <div className="resume-form__error">{errorMsg}</div>
                                    )}

                                    <button
                                        type="submit"
                                        className="btn btn-primary resume-form__submit"
                                        disabled={status === 'uploading'}
                                    >
                                        {status === 'uploading' ? (
                                            <>
                                                <span className="resume-spinner" />
                                                Submitting…
                                            </>
                                        ) : (
                                            'Submit Resume'
                                        )}
                                    </button>
                                </form>
                            </>
                        )}
                    </div>
                </div>
            )}
        </div>
    )
}
