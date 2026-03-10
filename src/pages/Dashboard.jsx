import { useEffect, useState, useRef } from 'react'
import { createPortal } from 'react-dom'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { supabaseGeneSetu } from '../lib/supabaseGeneSetu'
import './Portal.css'

/* =================== SVG ICON COMPONENTS =================== */
const Icon = ({ d, size = 18, className = '' }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>{typeof d === 'string' ? <path d={d} /> : d}</svg>
)

const ICONS = {
    overview: <Icon d={<><rect x="3" y="3" width="7" height="7" rx="1" /><rect x="14" y="3" width="7" height="7" rx="1" /><rect x="3" y="14" width="7" height="7" rx="1" /><rect x="14" y="14" width="7" height="7" rx="1" /></>} />,
    profile: <Icon d={<><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></>} />,
    orders: <Icon d={<><path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z" /><path d="m3.3 7 8.7 5 8.7-5" /><path d="M12 22V12" /></>} />,
    reports: <Icon d={<><path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z" /><path d="M14 2v4a2 2 0 0 0 2 2h4" /><path d="M10 13H8" /><path d="M16 17H8" /><path d="M16 13h-2" /></>} />,
    users: <Icon d={<><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M22 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></>} />,
    institutions: <Icon d={<><path d="M3 21h18" /><path d="M5 21V7l8-4v18" /><path d="M19 21V11l-6-4" /><path d="M9 9h1" /><path d="M9 13h1" /><path d="M9 17h1" /></>} />,
    patients: <Icon d={<><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M22 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></>} />,
    doctors: <Icon d={<><path d="M4.8 2.3A.3.3 0 1 0 5 2H4a2 2 0 0 0-2 2v5a6 6 0 0 0 6 6v0a6 6 0 0 0 6-6V4a2 2 0 0 0-2-2h-1a.2.2 0 1 0 .3.3" /><path d="M8 15v1a6 6 0 0 0 6 6v0a6 6 0 0 0 6-6v-4" /><circle cx="20" cy="10" r="2" /></>} />,
    signOut: <Icon d={<><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" /><polyline points="16 17 21 12 16 7" /><line x1="21" y1="12" x2="9" y2="12" /></>} />,
    check: <Icon d={<><polyline points="20 6 9 17 4 12" /></>} />,
    dna: <Icon d={<><path d="M2 15c6.667-6 13.333 0 20-6" /><path d="M9 22c1.798-1.998 2.518-3.995 2.807-5.993" /><path d="M15 2c-1.798 1.998-2.518 3.995-2.807 5.993" /><path d="m17 6-2.5-2.5" /><path d="m14 8-1-1" /><path d="m7 18 2.5 2.5" /><path d="m3.5 14.5.5.5" /><path d="m20 9 .5.5" /><path d="m6.5 12.5 1 1" /><path d="m16.5 10 1 1" /><path d="M10 16 9.5 15.5" /></>} />,
    clock: <Icon d={<><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></>} />,
    upload: <Icon d={<><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="17 8 12 3 7 8" /><line x1="12" y1="3" x2="12" y2="15" /></>} />,
    file: <Icon d={<><path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z" /><path d="M14 2v4a2 2 0 0 0 2 2h4" /></>} />,
    image: <Icon d={<><rect width="18" height="18" x="3" y="3" rx="2" ry="2" /><circle cx="9" cy="9" r="2" /><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" /></>} />,
    mail: <Icon d={<><rect width="20" height="16" x="2" y="4" rx="2" /><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" /></>} />,
    edit: <Icon d={<><path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" /></>} />,
    eye: <Icon d={<><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" /><circle cx="12" cy="12" r="3" /></>} />,
    trash: <Icon d={<><path d="M3 6h18" /><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" /><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" /></>} />,
    warning: <Icon d={<><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" /><path d="M12 9v4" /><path d="M12 17h.01" /></>} />,
    lock: <Icon d={<><rect width="18" height="11" x="3" y="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" /></>} />,
    key: <Icon d={<><circle cx="7.5" cy="15.5" r="5.5" /><path d="m21 2-9.3 9.3" /><path d="m18.5 5.5 3 3" /></>} />,
    briefcase: <Icon d={<><rect width="20" height="14" x="2" y="7" rx="2" ry="2" /><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" /></>} />,
    handshake: <Icon d={<><path d="m11 17 2 2a1 1 0 1 0 3-3" /><path d="m14 14 2.5 2.5a1 1 0 1 0 3-3l-3.88-3.88a3 3 0 0 0-4.24 0l-.88.88a1 1 0 1 1-3-3l2.81-2.81a5.79 5.79 0 0 1 7.06-.87l.47.28a2 2 0 0 0 1.68.13l2.48-.82" /><path d="M2 21a.5.5 0 0 0 .5.5H4a2 2 0 0 0 2-2v-3a.5.5 0 0 0-.5-.5H4a2 2 0 0 0-2 2Z" /><path d="M7 10.13V6a2 2 0 0 1 .47-1.29L10 2" /><path d="M22 21a.5.5 0 0 1-.5.5H20a2 2 0 0 1-2-2v-3a.5.5 0 0 1 .5-.5H20a2 2 0 0 1 2 2Z" /></>} />,
    microscope: <Icon d={<><path d="M6 18h8" /><path d="M3 22h18" /><path d="M14 22a7 7 0 1 0 0-14h-1" /><path d="M9 14h2" /><path d="M9 12a2 2 0 0 1-2-2V6h6v4a2 2 0 0 1-2 2Z" /><path d="M12 6V3a1 1 0 0 0-1-1H9a1 1 0 0 0-1 1v3" /></>} />,
    bell: <Icon d={<><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" /><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" /></>} />,
    search: <Icon d={<><circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" /></>} />,
    xCircle: <Icon d={<><circle cx="12" cy="12" r="10" /><path d="m15 9-6 6" /><path d="m9 9 6 6" /></>} />,
    send: <Icon d={<><path d="m22 2-7 20-4-9-9-4Z" /><path d="M22 2 11 13" /></>} />,
}

/* Tab config per role */
const TABS = {
    patient: [
        { id: 'overview', label: 'Overview', icon: ICONS.overview },
        { id: 'profile', label: 'My Profile', icon: ICONS.profile },
        { id: 'my_doctors', label: 'My Doctors', icon: ICONS.doctors },
        { id: 'orders', label: 'My Orders', icon: ICONS.orders },
        { id: 'reports', label: 'Medical Reports', icon: ICONS.reports },
    ],
    admin: [
        { id: 'overview', label: 'Overview', icon: ICONS.overview },
        { id: 'orders', label: 'Order Management', icon: ICONS.orders },
        { id: 'users', label: 'All Users', icon: ICONS.users },
        { id: 'institutions', label: 'Institutions', icon: ICONS.institutions },
    ],
    employee: [
        { id: 'overview', label: 'Overview', icon: ICONS.overview },
        { id: 'profile', label: 'My Profile', icon: ICONS.profile },
    ],
    doctor: [
        { id: 'overview', label: 'Overview', icon: ICONS.overview },
        { id: 'profile', label: 'My Profile', icon: ICONS.profile },
        { id: 'patients', label: 'My Patients', icon: ICONS.patients },
        { id: 'institutions', label: 'My Institutions', icon: ICONS.institutions },
    ],
    institution: [
        { id: 'overview', label: 'Overview', icon: ICONS.overview },
        { id: 'profile', label: 'Details', icon: ICONS.institutions },
        { id: 'doctors', label: 'Doctors', icon: ICONS.doctors },
    ],
}

export default function Dashboard() {
    const { user, session, profile, loading, signOut, isPatient, isDoctor, isAdmin, isEmployee, isInstitution, isSuspended } = useAuth()
    const navigate = useNavigate()
    const [activeTab, setActiveTab] = useState('overview')

    // ProtectedRoute handles redirect for unauthenticated users.
    // This is a fallback for edge cases only.
    useEffect(() => {
        if (!loading && !user) navigate('/portal/login')
    }, [user, loading, navigate])

    if (loading) return <div className="loading-spinner"><div className="loading-spinner__ring" /></div>

    // If suspended, force sign out
    if (isSuspended) {
        signOut()
        return null
    }

    if (!profile) {
        return (
            <div className="portal">
                <div className="portal__inner" style={{ gridTemplateColumns: '1fr' }}>
                    <div className="glass-card" style={{ textAlign: 'center', padding: '4rem 2rem' }}>
                        <div style={{ marginBottom: '1rem', opacity: 0.3, display: 'flex', justifyContent: 'center' }}>{ICONS.mail}</div>
                        <h2 style={{ marginBottom: '0.5rem' }}>Verify Your Email</h2>
                        <p style={{ color: 'var(--text-muted)', maxWidth: 400, margin: '0 auto' }}>
                            Check your inbox for a confirmation link to activate your Evionex account.
                        </p>
                    </div>
                </div>
            </div>
        )
    }

    async function handleSignOut() {
        try {
            await signOut()
        } catch (e) {
            // Ignore — we're leaving no matter what
        }
        // Force a hard navigation — guarantees clean slate
        window.location.replace('/#/portal/login')
    }

    const roleKey = isAdmin ? 'admin' : isEmployee ? 'employee' : isDoctor ? 'doctor' : isInstitution ? 'institution' : 'patient'
    const roleLabel = isAdmin ? 'Admin' : isEmployee ? 'Employee' : isDoctor ? 'Doctor' : isInstitution ? 'Institution' : 'Patient'
    const tabs = TABS[roleKey] || TABS.patient
    const initials = (profile.full_name || user.email || '?').split(' ').map(w => w[0]).join('').slice(0, 2)

    return (
        <div className="portal">
            <div className="portal__inner">
                <aside className="portal-sidebar">
                    <div className="portal-sidebar__user">
                        <div className="portal-sidebar__avatar">{initials}</div>
                        <div className="portal-sidebar__name">{profile.full_name || user.email}</div>
                        <span className={`portal-sidebar__role portal-sidebar__role--${roleKey}`}>{roleLabel}</span>
                    </div>
                    {tabs.map(tab => (
                        <button key={tab.id} className={`portal-sidebar__nav-item ${activeTab === tab.id ? 'portal-sidebar__nav-item--active' : ''}`} onClick={() => setActiveTab(tab.id)}>
                            <span className="portal-sidebar__nav-icon">{tab.icon}</span>{tab.label}
                        </button>
                    ))}
                    <div className="portal-sidebar__signout">
                        <button className="portal-sidebar__nav-item" onClick={handleSignOut}>
                            <span className="portal-sidebar__nav-icon">{ICONS.signOut}</span>Sign Out
                        </button>
                    </div>
                </aside>
                <main className="portal-main">
                    {isPatient && <PatientView tab={activeTab} user={user} profile={profile} />}
                    {isDoctor && <DoctorView tab={activeTab} user={user} profile={profile} />}
                    {isAdmin && <AdminView tab={activeTab} user={user} profile={profile} session={session} isAdminUser={true} />}
                    {isEmployee && !isAdmin && <EmployeeView tab={activeTab} user={user} profile={profile} />}
                    {isInstitution && <InstitutionView tab={activeTab} user={user} />}
                </main>
            </div>
        </div>
    )
}

/* =================== 3-DOT ACTION MENU (Fixed Positioning) =================== */
function ActionMenu({ onEdit, onDelete, onViewMore, onDisconnect }) {
    const [open, setOpen] = useState(false)
    const [pos, setPos] = useState({ top: 0, left: 0 })
    const wrapperRef = useRef(null)
    const triggerRef = useRef(null)
    const dropdownRef = useRef(null)

    useEffect(() => {
        if (!open) return
        function handleClickOutside(e) {
            const inWrapper = wrapperRef.current && wrapperRef.current.contains(e.target)
            const inDropdown = dropdownRef.current && dropdownRef.current.contains(e.target)
            if (!inWrapper && !inDropdown) {
                setOpen(false)
            }
        }
        document.addEventListener('mousedown', handleClickOutside)
        return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [open])

    function handleToggle() {
        if (!open && triggerRef.current) {
            const rect = triggerRef.current.getBoundingClientRect()
            setPos({ top: rect.bottom + 4, left: rect.right - 160 })
        }
        setOpen(!open)
    }

    return (
        <div className="action-menu" ref={wrapperRef}>
            <button className="action-menu__trigger" ref={triggerRef} onClick={handleToggle}>⋮</button>
            {open && createPortal(
                <div className="action-menu__dropdown action-menu__dropdown--fixed" ref={dropdownRef} style={{ top: pos.top, left: pos.left }}>
                    {onEdit && <button onClick={() => { setOpen(false); onEdit() }}>{ICONS.edit} Edit</button>}
                    {onViewMore && <button onClick={() => { setOpen(false); onViewMore() }}>{ICONS.eye} View Details</button>}
                    {onDelete && <button className="action-menu__danger" onClick={() => { setOpen(false); onDelete() }}>{ICONS.trash} Delete</button>}
                    {onDisconnect && <button className="action-menu__danger" onClick={() => { setOpen(false); onDisconnect() }}>{ICONS.xCircle} Disconnect</button>}
                </div>,
                document.body
            )}
        </div>
    )
}

/* =================== DELETE CONFIRMATION MODAL =================== */
function DeleteModal({ userName, onConfirm, onCancel, deleting }) {
    return (
        <div className="modal-overlay" onClick={onCancel}>
            <div className="modal modal--danger" onClick={e => e.stopPropagation()}>
                <div className="modal__icon">{ICONS.warning}</div>
                <h2 className="modal__title">Delete User</h2>
                <p className="modal__text">
                    Are you sure you want to permanently delete <strong>{userName}</strong>?
                    This will remove all their data, orders, reports, and account. <strong>This action cannot be undone.</strong>
                </p>
                <div className="modal__actions">
                    <button className="btn btn--sm btn--ghost" onClick={onCancel} disabled={deleting}>Cancel</button>
                    <button className="btn btn--sm btn--danger" onClick={onConfirm} disabled={deleting}>
                        {deleting ? 'Deleting...' : 'Yes, Delete User'}
                    </button>
                </div>
            </div>
        </div>
    )
}

/* =================== EDIT USER PAGE =================== */
function EditUserView({ userId, userType, onBack, onSaved }) {
    const [profileData, setProfileData] = useState(null)
    const [form, setForm] = useState({})
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [saved, setSaved] = useState(false)

    useEffect(() => {
        async function load() {
            const { data: prof } = await supabaseGeneSetu.from('evionex_profiles').select('*').eq('id', userId).single()
            let patientData = null
            let employeeData = null
            if (userType === 'Patient') {
                const { data: pat } = await supabaseGeneSetu.from('evionex_patients').select('*').eq('id', userId).single()
                patientData = pat
            }
            if (userType === 'Employee') {
                const { data: emp } = await supabaseGeneSetu.from('evionex_employees').select('*').eq('id', userId).single()
                employeeData = emp
            }
            setProfileData(prof)
            setForm({
                full_name: prof?.full_name || '',
                account_status: prof?.account_status || 'active',
                ...(patientData ? {
                    date_of_birth: patientData.date_of_birth || '',
                    gender: patientData.gender || '',
                    blood_group: patientData.blood_group || '',
                    address: patientData.address || '',
                } : {}),
                ...(userType === 'Employee' ? {
                    department: employeeData?.department || '',
                    sub_role: prof?.sub_role || 'full-time',
                } : {}),
            })
            setLoading(false)
        }
        load()
    }, [userId, userType])

    function handleChange(field, value) {
        setForm(f => ({ ...f, [field]: value }))
    }

    const [saveError, setSaveError] = useState('')

    async function handleSave() {
        setSaving(true); setSaved(false); setSaveError('')
        try {
            const profileUpdate = { full_name: form.full_name, account_status: form.account_status }
            if (userType === 'Employee') {
                profileUpdate.sub_role = form.sub_role
            }
            const { error: profileErr } = await supabaseGeneSetu.from('evionex_profiles').update(profileUpdate).eq('id', userId)
            if (profileErr) throw new Error('Profile: ' + profileErr.message)

            if (userType === 'Patient') {
                const { error: patErr } = await supabaseGeneSetu.from('evionex_patients').update({ date_of_birth: form.date_of_birth || null, gender: form.gender || null, blood_group: form.blood_group || null, address: form.address || null }).eq('id', userId)
                if (patErr) throw new Error('Patient details: ' + patErr.message)
            }
            if (userType === 'Employee') {
                const { error: empErr } = await supabaseGeneSetu.from('evionex_employees').update({ department: form.department || null }).eq('id', userId)
                if (empErr) throw new Error('Employee details: ' + empErr.message)
            }
            setSaving(false); setSaved(true)
            setTimeout(() => { setSaved(false); onSaved() }, 1200)
        } catch (err) {
            console.error('Save failed:', err)
            setSaveError(err.message || 'Failed to save changes. Please try again.')
            setSaving(false)
        }
    }

    if (loading) return <div className="loading-spinner"><div className="loading-spinner__ring" /></div>

    return (
        <>
            <div className="portal-main__header">
                <button className="btn btn--sm btn--ghost" onClick={onBack} style={{ marginBottom: 'var(--space-sm)' }}>← Back to All Users</button>
                <h1>Edit {userType}</h1>
                <p>Editing {profileData?.full_name || 'user'} · {profileData?.role}{profileData?.sub_role ? ' / ' + profileData.sub_role : ''}</p>
            </div>

            <div className="glass-card" style={{ marginBottom: 'var(--space-xl)' }}>
                <div className="glass-card__header"><h2>Profile Information</h2>{saved && <span className="save-indicator">✓ Saved</span>}</div>
                <div className="profile-grid">
                    <div className="form-group">
                        <label className="form-label">Full Name</label>
                        <input className="form-input" value={form.full_name} onChange={e => handleChange('full_name', e.target.value)} />
                    </div>
                    <div className="form-group">
                        <label className="form-label">Email</label>
                        <input className="form-input" value={profileData?.email || '—'} readOnly />
                    </div>
                    <div className="form-group">
                        <label className="form-label">Account Status</label>
                        <select className="form-select" value={form.account_status} onChange={e => handleChange('account_status', e.target.value)}>
                            <option value="active">Active</option><option value="suspended">Suspended</option><option value="pending">Pending</option>
                        </select>
                    </div>
                </div>
            </div>

            {userType === 'Patient' && (
                <div className="glass-card" style={{ marginBottom: 'var(--space-xl)' }}>
                    <div className="glass-card__header"><h2>Patient Details</h2></div>
                    <div className="profile-grid">
                        <div className="form-group">
                            <label className="form-label">Date of Birth</label>
                            <input className="form-input" type="date" value={form.date_of_birth} onChange={e => handleChange('date_of_birth', e.target.value)} />
                        </div>
                        <div className="form-group">
                            <label className="form-label">Gender</label>
                            <select className="form-select" value={form.gender} onChange={e => handleChange('gender', e.target.value)}>
                                <option value="">Select</option><option value="male">Male</option><option value="female">Female</option><option value="other">Other</option>
                            </select>
                        </div>
                        <div className="form-group">
                            <label className="form-label">Blood Group</label>
                            <select className="form-select" value={form.blood_group} onChange={e => handleChange('blood_group', e.target.value)}>
                                <option value="">Select</option>{['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map(bg => <option key={bg} value={bg}>{bg}</option>)}
                            </select>
                        </div>
                        <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                            <label className="form-label">Address</label>
                            <input className="form-input" value={form.address} onChange={e => handleChange('address', e.target.value)} placeholder="Enter address" />
                        </div>
                    </div>
                </div>
            )}

            {userType === 'Employee' && (
                <div className="glass-card" style={{ marginBottom: 'var(--space-xl)' }}>
                    <div className="glass-card__header">
                        <h2>Employment Details</h2>
                        <p style={{ margin: 0, fontSize: 'var(--text-xs)', color: 'var(--text-muted)' }}>Employee cannot change these fields</p>
                    </div>
                    <div className="profile-grid">
                        <div className="form-group">
                            <label className="form-label">Department</label>
                            <select className="form-select" value={form.department} onChange={e => handleChange('department', e.target.value)}>
                                <option value="">Select Department</option>
                                <option value="Software Development">Software Development</option>
                                <option value="Marketing">Marketing</option>
                                <option value="Management">Management</option>
                            </select>
                        </div>
                        <div className="form-group">
                            <label className="form-label">Employment Type</label>
                            <select className="form-select" value={form.sub_role} onChange={e => handleChange('sub_role', e.target.value)}>
                                <option value="full-time">Full-Time</option>
                                <option value="intern">Intern</option>
                            </select>
                        </div>
                    </div>
                </div>
            )}

            {saveError && <div className="auth-error" style={{ marginBottom: 'var(--space-md)' }}>{saveError}</div>}
            <div className="profile-actions">
                <button className="btn btn--sm btn--ghost" onClick={onBack}>Cancel</button>
                <button className="btn btn--sm btn-primary" onClick={handleSave} disabled={saving}>{saving ? 'Saving...' : 'Save Changes'}</button>
            </div>
        </>
    )
}

/* =================== USER DETAIL VIEW =================== */
function UserDetailView({ userId, userType, onBack }) {
    const [profileData, setProfileData] = useState(null)
    const [patientData, setPatientData] = useState(null)
    const [orders, setOrders] = useState([])
    const [reports, setReports] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        async function load() {
            const { data: prof } = await supabaseGeneSetu.from('evionex_profiles').select('*').eq('id', userId).single()
            setProfileData(prof)

            if (userType === 'patient') {
                const [{ data: pat }, { data: ord }, { data: rep }] = await Promise.all([
                    supabaseGeneSetu.from('evionex_patients').select('*').eq('id', userId).single(),
                    supabaseGeneSetu.from('evionex_wes_orders').select('*').eq('patient_id', userId).eq('payment_verified', true).order('created_at', { ascending: false }),
                    supabaseGeneSetu.from('evionex_medical_reports').select('*').eq('patient_id', userId).order('created_at', { ascending: false }),
                ])
                setPatientData(pat)
                setOrders(ord || [])
                setReports(rep || [])
            }
            setLoading(false)
        }
        load()
    }, [userId, userType])

    if (loading) return <div className="loading-spinner"><div className="loading-spinner__ring" /></div>

    return (
        <>
            <div className="portal-main__header">
                <button className="btn btn--sm btn--ghost" onClick={onBack} style={{ marginBottom: 'var(--space-sm)' }}>← Back to All Users</button>
                <h1>{profileData?.full_name || 'User Details'}</h1>
                <p>{userType.charAt(0).toUpperCase() + userType.slice(1)} · {profileData?.account_status}</p>
            </div>

            {/* Profile Info */}
            <div className="glass-card" style={{ marginBottom: 'var(--space-xl)' }}>
                <div className="glass-card__header"><h2>Profile Information</h2></div>
                <div className="profile-grid">
                    <div className="form-group"><label className="form-label">Full Name</label><input className="form-input" value={profileData?.full_name || '—'} readOnly /></div>
                    <div className="form-group"><label className="form-label">Email</label><input className="form-input" value={profileData?.email || '—'} readOnly /></div>
                    <div className="form-group"><label className="form-label">Role</label><input className="form-input" value={`${profileData?.role}${profileData?.sub_role ? ' / ' + profileData.sub_role : ''}`} readOnly /></div>
                    <div className="form-group"><label className="form-label">Account Status</label><input className="form-input" value={profileData?.account_status || '—'} readOnly /></div>
                    <div className="form-group"><label className="form-label">Created</label><input className="form-input" value={profileData?.created_at ? new Date(profileData.created_at).toLocaleDateString('en-IN') : '—'} readOnly /></div>
                </div>
            </div>

            {/* Patient-specific data */}
            {userType === 'patient' && patientData && (
                <>
                    <div className="glass-card" style={{ marginBottom: 'var(--space-xl)' }}>
                        <div className="glass-card__header"><h2>Patient Details</h2></div>
                        <div className="profile-grid">
                            <div className="form-group"><label className="form-label">Patient ID</label><input className="form-input" value={patientData.patient_id || '—'} readOnly /></div>
                            <div className="form-group"><label className="form-label">Date of Birth</label><input className="form-input" value={patientData.date_of_birth || '—'} readOnly /></div>
                            <div className="form-group"><label className="form-label">Gender</label><input className="form-input" value={patientData.gender || '—'} readOnly style={{ textTransform: 'capitalize' }} /></div>
                            <div className="form-group"><label className="form-label">Blood Group</label><input className="form-input" value={patientData.blood_group || '—'} readOnly /></div>
                            <div className="form-group" style={{ gridColumn: '1 / -1' }}><label className="form-label">Address</label><input className="form-input" value={patientData.address || '—'} readOnly /></div>
                        </div>
                    </div>

                    {/* Orders */}
                    <div className="glass-card glass-card--flush" style={{ marginBottom: 'var(--space-xl)' }}>
                        <div className="glass-card__header" style={{ padding: 'var(--space-lg) var(--space-xl) 0' }}><h2>Orders ({orders.length})</h2></div>
                        {orders.length === 0 ? (
                            <div className="empty-state"><div className="empty-state__icon">{ICONS.orders}</div><h3 className="empty-state__title">No orders</h3></div>
                        ) : (
                            <table className="portal-table"><thead><tr><th>Order ID</th><th>Email</th><th>Plan</th><th>Amount</th><th>Status</th><th>Date</th></tr></thead>
                                <tbody>{orders.map(o => (
                                    <tr key={o.id}><td className="portal-table__mono">{o.razorpay_order_id?.slice(0, 18) || o.id.slice(0, 8)}</td><td>{profileData?.email || '—'}</td><td>{o.plan_name || '—'}</td><td>₹{((o.amount || 0) / 100).toLocaleString('en-IN')}</td><td><span className={`status-badge status-badge--${o.order_status}`}>{o.order_status.replace(/_/g, ' ')}</span></td><td>{new Date(o.created_at).toLocaleDateString('en-IN')}</td></tr>
                                ))}</tbody>
                            </table>
                        )}
                    </div>

                    {/* Reports */}
                    <div className="glass-card glass-card--flush">
                        <div className="glass-card__header" style={{ padding: 'var(--space-lg) var(--space-xl) 0' }}><h2>Medical Reports ({reports.length})</h2></div>
                        {reports.length === 0 ? (
                            <div className="empty-state"><div className="empty-state__icon">{ICONS.reports}</div><h3 className="empty-state__title">No reports</h3></div>
                        ) : (
                            <table className="portal-table"><thead><tr><th>File</th><th>Type</th><th>Uploaded</th></tr></thead>
                                <tbody>{reports.map(r => (
                                    <tr key={r.id}><td>{r.file_name || '—'}</td><td>{r.report_type}</td><td>{new Date(r.created_at).toLocaleDateString('en-IN')}</td></tr>
                                ))}</tbody>
                            </table>
                        )}
                    </div>
                </>
            )}
        </>
    )
}


/* ===============================================
   PATIENT VIEW
   =============================================== */
function PatientView({ tab, user, profile }) {
    const [patient, setPatient] = useState(null)
    const [orders, setOrders] = useState([])
    const [reports, setReports] = useState([])
    const [loading, setLoading] = useState(true)
    const [editMode, setEditMode] = useState(false)
    const [saving, setSaving] = useState(false)
    const [saved, setSaved] = useState(false)
    const [uploading, setUploading] = useState(false)
    const [uploadProgress, setUploadProgress] = useState(0)
    const [viewingReport, setViewingReport] = useState(null)
    const [reportUrl, setReportUrl] = useState('')
    const [dragOver, setDragOver] = useState(false)
    const { fetchProfile } = useAuth()

    /* My Doctors state */
    const [connectedDoctors, setConnectedDoctors] = useState([])
    const [myRequests, setMyRequests] = useState([])
    const [searchResults, setSearchResults] = useState([])
    const [searching, setSearching] = useState(false)
    const [sendingRequest, setSendingRequest] = useState(null)
    const [searchForm, setSearchForm] = useState({ specialization: '', name: '', experience: '' })
    const [directDoctorId, setDirectDoctorId] = useState('')
    const [directIdError, setDirectIdError] = useState('')
    const [directIdSending, setDirectIdSending] = useState(false)

    /* Notifications state */
    const [notifications, setNotifications] = useState([])
    const [showNotifications, setShowNotifications] = useState(false)
    const unreadCount = notifications.filter(n => !n.is_read).length

    const [form, setForm] = useState({ full_name: '', date_of_birth: '', gender: '', blood_group: '', address: '' })

    async function loadDoctorData() {
        const [{ data: connected }, { data: requests }, { data: notifs }] = await Promise.all([
            supabaseGeneSetu.from('evionex_doctor_patients').select('*, evionex_doctors(doctor_id, specialization, experience_years, evionex_profiles(full_name))').eq('patient_id', user.id),
            supabaseGeneSetu.from('evionex_connection_requests').select('*, evionex_doctors(doctor_id, specialization, evionex_profiles(full_name))').eq('patient_id', user.id).order('created_at', { ascending: false }),
            supabaseGeneSetu.from('evionex_notifications').select('*').eq('user_id', user.id).order('created_at', { ascending: false }).limit(50),
        ])
        setConnectedDoctors(connected || [])
        setMyRequests(requests || [])
        setNotifications(notifs || [])
    }

    useEffect(() => {
        async function load() {
            const [{ data: pat }, { data: ord }, { data: rep }] = await Promise.all([
                supabaseGeneSetu.from('evionex_patients').select('*').eq('id', user.id).single(),
                supabaseGeneSetu.from('evionex_wes_orders').select('*').eq('patient_id', user.id).eq('payment_verified', true).order('created_at', { ascending: false }),
                supabaseGeneSetu.from('evionex_medical_reports').select('*').eq('patient_id', user.id).eq('visible_to_patient', true).order('created_at', { ascending: false }),
            ])
            setPatient(pat); setOrders(ord || []); setReports(rep || [])
            if (pat) setForm({ full_name: profile.full_name || '', date_of_birth: pat.date_of_birth || '', gender: pat.gender || '', blood_group: pat.blood_group || '', address: pat.address || '' })
            await loadDoctorData()
            setLoading(false)
        }
        load()
    }, [user.id, profile.full_name])

    async function saveProfile() {
        setSaving(true); setSaved(false)
        await supabaseGeneSetu.from('evionex_profiles').update({ full_name: form.full_name }).eq('id', user.id)
        await supabaseGeneSetu.from('evionex_patients').update({ date_of_birth: form.date_of_birth || null, gender: form.gender || null, blood_group: form.blood_group || null, address: form.address || null }).eq('id', user.id)
        await fetchProfile(user.id)
        setSaving(false); setSaved(true); setEditMode(false)
        setTimeout(() => setSaved(false), 3000)
    }

    async function handleFileUpload(file) {
        if (!file) return
        if (file.size > 20 * 1024 * 1024) { alert('File too large (max 20MB)'); return }
        const allowed = ['application/pdf', 'image/jpeg', 'image/png', 'image/webp']
        if (!allowed.includes(file.type)) { alert('Use PDF, JPG, PNG, or WebP.'); return }
        setUploading(true); setUploadProgress(10)
        // Security: Sanitize filename — strip path traversal, special chars, and limit length
        const sanitizedName = file.name
            .replace(/[^a-zA-Z0-9._-]/g, '_')  // Only allow safe chars
            .replace(/\.{2,}/g, '.')              // No consecutive dots
            .slice(0, 100)                        // Limit length
        const filePath = `${user.id}/${Date.now()}_${sanitizedName}`
        setUploadProgress(30)
        const { error: uploadErr } = await supabaseGeneSetu.storage.from('evionex-patient-reports').upload(filePath, file)
        setUploadProgress(70)
        if (uploadErr) { alert('Upload failed: ' + uploadErr.message); setUploading(false); return }
        const { data: inserted, error: insertErr } = await supabaseGeneSetu.from('evionex_medical_reports').insert({ patient_id: user.id, report_type: file.type === 'application/pdf' ? 'PDF Report' : 'Image Report', file_path: filePath, file_name: file.name, uploaded_by: user.id, visible_to_patient: true }).select().single()
        setUploadProgress(100)
        if (!insertErr && inserted) setReports(prev => [inserted, ...prev])
        setTimeout(() => { setUploading(false); setUploadProgress(0) }, 600)
    }

    async function viewReport(report) {
        setViewingReport(report)
        const { data } = await supabaseGeneSetu.storage.from('evionex-patient-reports').createSignedUrl(report.file_path, 3600)
        setReportUrl(data?.signedUrl || '')
    }

    async function searchDoctors() {
        setSearching(true)
        let query = supabaseGeneSetu.from('evionex_doctors').select('id, doctor_id, specialization, experience_years, evionex_profiles(full_name)')
        if (searchForm.specialization) query = query.ilike('specialization', `%${searchForm.specialization}%`)
        if (searchForm.name) query = query.ilike('evionex_profiles.full_name', `%${searchForm.name}%`)
        if (searchForm.experience) query = query.gte('experience_years', parseInt(searchForm.experience))
        const { data } = await query.limit(20)
        setSearchResults((data || []).filter(d => d.evionex_profiles !== null))
        setSearching(false)
    }

    async function sendConnectionRequest(doctorUuid) {
        setSendingRequest(doctorUuid)
        try {
            const { error } = await supabaseGeneSetu.from('evionex_connection_requests').insert({ patient_id: user.id, doctor_id: doctorUuid })
            if (error) {
                if (error.code === '23505') alert('You already have a pending request with this doctor.')
                else alert('Failed to send request: ' + error.message)
            } else { await loadDoctorData() }
        } catch (err) { alert('Error: ' + err.message) }
        setSendingRequest(null)
    }

    async function sendDirectRequest() {
        if (!directDoctorId.trim()) return
        setDirectIdSending(true); setDirectIdError('')
        const { data: doc } = await supabaseGeneSetu.from('evionex_doctors').select('id').eq('doctor_id', directDoctorId.trim()).single()
        if (!doc) { setDirectIdError('Doctor ID not found. Please check and try again.'); setDirectIdSending(false); return }
        await sendConnectionRequest(doc.id)
        setDirectDoctorId('')
        setDirectIdSending(false)
    }

    async function handleDisconnectDoctor(docUuid, doctorName) {
        if (!window.confirm(`Are you sure you want to disconnect from ${doctorName || 'this doctor'}?`)) return
        try {
            await supabaseGeneSetu.from('evionex_doctor_patients').delete().eq('patient_id', user.id).eq('doctor_id', docUuid)
            await loadDoctorData()
        } catch (e) { alert('Failed to disconnect: ' + e.message) }
    }

    async function markAsRead(notifId) {
        await supabaseGeneSetu.from('evionex_notifications').update({ is_read: true }).eq('id', notifId)
        setNotifications(prev => prev.map(n => n.id === notifId ? { ...n, is_read: true } : n))
    }

    async function markAllAsRead() {
        await supabaseGeneSetu.from('evionex_notifications').update({ is_read: true }).eq('user_id', user.id).eq('is_read', false)
        setNotifications(prev => prev.map(n => ({ ...n, is_read: true })))
    }

    function getRequestStatus(doctorUuid) {
        const existing = myRequests.find(r => r.doctor_id === doctorUuid)
        if (existing) return existing.status
        const connected = connectedDoctors.find(c => c.doctor_id === doctorUuid)
        if (connected) return 'connected'
        return null
    }

    if (loading) return <div className="loading-spinner"><div className="loading-spinner__ring" /></div>

    const NotificationBell = (
        <div className="notification-bell-wrapper">
            <button className="notification-bell" onClick={() => setShowNotifications(!showNotifications)} aria-label="Notifications">
                {ICONS.bell}
                {unreadCount > 0 && <span className="notification-badge">{unreadCount > 9 ? '9+' : unreadCount}</span>}
            </button>
            {showNotifications && (
                <div className="notification-dropdown">
                    <div className="notification-dropdown__header">
                        <h3>Notifications</h3>
                        {unreadCount > 0 && <button className="notification-dropdown__mark-all" onClick={markAllAsRead}>Mark all read</button>}
                    </div>
                    <div className="notification-dropdown__list">
                        {notifications.length === 0 ? (
                            <div className="notification-dropdown__empty">No notifications yet</div>
                        ) : notifications.map(n => (
                            <div className={`notification-item ${!n.is_read ? 'notification-item--unread' : ''}`} key={n.id} onClick={() => !n.is_read && markAsRead(n.id)}>
                                <div className={`notification-item__icon ${n.type === 'connection_accepted' ? 'notification-item__icon--success' : 'notification-item__icon--error'}`}>
                                    {n.type === 'connection_accepted' ? ICONS.check : ICONS.xCircle}
                                </div>
                                <div className="notification-item__content">
                                    <div className="notification-item__title">{n.title}</div>
                                    <div className="notification-item__message">{n.message}</div>
                                    <div className="notification-item__time">{new Date(n.created_at).toLocaleDateString('en-IN')} · {new Date(n.created_at).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}</div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    )

    if (tab === 'overview') return (
        <>
            <div className="portal-main__header" style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
                <div><h1>Welcome, {profile.full_name || 'Patient'}</h1><p>Here's your health dashboard overview</p></div>
                {NotificationBell}
            </div>
            <div className="stats-row">
                <div className="stat-card"><div className="stat-card__icon stat-card__icon--green">{ICONS.check}</div><div className="stat-card__info"><h3>{patient?.patient_id}</h3><p>Patient ID</p></div></div>
                <div className="stat-card"><div className="stat-card__icon stat-card__icon--cyan">{ICONS.dna}</div><div className="stat-card__info"><h3>{orders.length}</h3><p>WES Orders</p></div></div>
                <div className="stat-card"><div className="stat-card__icon stat-card__icon--purple">{ICONS.reports}</div><div className="stat-card__info"><h3>{reports.length}</h3><p>Medical Reports</p></div></div>
                <div className="stat-card"><div className="stat-card__icon stat-card__icon--blue">{ICONS.doctors}</div><div className="stat-card__info"><h3>{connectedDoctors.length}</h3><p>Connected Doctors</p></div></div>
            </div>
            <div className="glass-card glass-card--flush">
                <div className="glass-card__header" style={{ padding: 'var(--space-lg) var(--space-xl) 0' }}><h2>Recent Orders</h2></div>
                {orders.length === 0 ? <div className="empty-state"><div className="empty-state__icon">{ICONS.orders}</div><h3 className="empty-state__title">No orders yet</h3><p className="empty-state__text">Your WES orders will appear here after a verified payment.</p></div>
                    : <table className="portal-table"><thead><tr><th>Order ID</th><th>Plan</th><th>Amount</th><th>Status</th><th>Date</th></tr></thead><tbody>{orders.slice(0, 3).map(o => <tr key={o.id}><td className="portal-table__mono">{o.razorpay_order_id?.slice(0, 18) || o.id.slice(0, 8)}</td><td>{o.plan_name || '—'}</td><td>₹{((o.amount || 0) / 100).toLocaleString('en-IN')}</td><td><span className={`status-badge status-badge--${o.order_status}`}>{o.order_status.replace(/_/g, ' ')}</span></td><td>{new Date(o.created_at).toLocaleDateString('en-IN')}</td></tr>)}</tbody></table>}
            </div>
        </>
    )

    if (tab === 'profile') return (
        <>
            <div className="portal-main__header" style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
                <div><h1>My Profile</h1><p>View and update your personal information</p></div>
                {NotificationBell}
            </div>
            <div className="glass-card">
                <div className="glass-card__header"><h2>Personal Details</h2>{!editMode ? <button className="btn btn--sm btn-secondary" onClick={() => setEditMode(true)}>{ICONS.edit} Edit</button> : saved ? <span className="save-indicator">{ICONS.check} Saved</span> : null}</div>
                <div className="profile-grid">
                    <div className="form-group"><label className="form-label">Patient ID</label><input className="form-input" value={patient?.patient_id || ''} readOnly /></div>
                    <div className="form-group"><label className="form-label">Email</label><input className="form-input" value={user.email || ''} readOnly /></div>
                    <div className="form-group"><label className="form-label">Full Name</label><input className="form-input" value={form.full_name} readOnly={!editMode} onChange={e => setForm(f => ({ ...f, full_name: e.target.value }))} /></div>
                    <div className="form-group"><label className="form-label">Date of Birth</label><input className="form-input" type="date" value={form.date_of_birth} readOnly={!editMode} onChange={e => setForm(f => ({ ...f, date_of_birth: e.target.value }))} /></div>
                    <div className="form-group"><label className="form-label">Gender</label>{editMode ? <select className="form-select" value={form.gender} onChange={e => setForm(f => ({ ...f, gender: e.target.value }))}><option value="">Select</option><option value="male">Male</option><option value="female">Female</option><option value="other">Other</option></select> : <input className="form-input" value={form.gender || 'Not set'} readOnly />}</div>
                    <div className="form-group"><label className="form-label">Blood Group</label>{editMode ? <select className="form-select" value={form.blood_group} onChange={e => setForm(f => ({ ...f, blood_group: e.target.value }))}><option value="">Select</option>{['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map(bg => <option key={bg} value={bg}>{bg}</option>)}</select> : <input className="form-input" value={form.blood_group || 'Not set'} readOnly />}</div>
                    <div className="form-group" style={{ gridColumn: '1 / -1' }}><label className="form-label">Address</label><input className="form-input" value={form.address} readOnly={!editMode} placeholder={editMode ? 'Enter your address' : 'Not set'} onChange={e => setForm(f => ({ ...f, address: e.target.value }))} /></div>
                </div>
                {editMode && <div className="profile-actions"><button className="btn btn--sm btn--ghost" onClick={() => setEditMode(false)}>Cancel</button><button className="btn btn--sm btn-primary" onClick={saveProfile} disabled={saving}>{saving ? 'Saving...' : 'Save Changes'}</button></div>}
            </div>
        </>
    )

    if (tab === 'my_doctors') return (
        <>
            <div className="portal-main__header" style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
                <div><h1>My Doctors</h1><p>Search and connect with doctors</p></div>
                {NotificationBell}
            </div>

            {/* Direct Connect by Doctor ID */}
            <div className="glass-card" style={{ marginBottom: 'var(--space-xl)' }}>
                <div className="glass-card__header"><h2>Connect by Doctor ID</h2></div>
                <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text-muted)', marginBottom: 'var(--space-md)' }}>If your doctor shared their ID with you, enter it here to send a connection request instantly.</p>
                <div className="doctor-search__direct-connect">
                    <input className="form-input" placeholder="e.g. EVX-DOC-482391" value={directDoctorId} onChange={e => { setDirectDoctorId(e.target.value); setDirectIdError('') }} />
                    <button className="btn btn--sm btn-primary" onClick={sendDirectRequest} disabled={directIdSending || !directDoctorId.trim()}>
                        {directIdSending ? 'Sending...' : <>{ICONS.send} Send Request</>}
                    </button>
                </div>
                {directIdError && <p style={{ color: '#f87171', fontSize: 'var(--text-xs)', marginTop: 'var(--space-sm)' }}>{directIdError}</p>}
            </div>

            {/* Doctor Search */}
            <div className="glass-card" style={{ marginBottom: 'var(--space-xl)' }}>
                <div className="glass-card__header"><h2>Find a Doctor</h2></div>
                <div className="doctor-search">
                    <div className="doctor-search__field">
                        <label className="form-label">Specialization</label>
                        <input className="form-input" placeholder="e.g. Geneticist, Cardiologist" value={searchForm.specialization} onChange={e => setSearchForm(f => ({ ...f, specialization: e.target.value }))} />
                    </div>
                    <div className="doctor-search__field">
                        <label className="form-label">Doctor Name</label>
                        <input className="form-input" placeholder="e.g. Dr. Smith" value={searchForm.name} onChange={e => setSearchForm(f => ({ ...f, name: e.target.value }))} />
                    </div>
                    <div className="doctor-search__field">
                        <label className="form-label">Min. Experience (years)</label>
                        <input className="form-input" type="number" min="0" placeholder="e.g. 5" value={searchForm.experience} onChange={e => setSearchForm(f => ({ ...f, experience: e.target.value }))} />
                    </div>
                    <div className="doctor-search__field doctor-search__field--action">
                        <button className="btn btn-primary" onClick={searchDoctors} disabled={searching}>
                            {searching ? 'Searching...' : <>{ICONS.search} Search</>}
                        </button>
                    </div>
                </div>

                {searchResults.length > 0 && (
                    <div style={{ marginTop: 'var(--space-lg)', overflowX: 'auto' }}>
                        <table className="portal-table">
                            <thead><tr><th>Doctor ID</th><th>Name</th><th>Specialization</th><th>Experience</th><th>Action</th></tr></thead>
                            <tbody>
                                {searchResults.map(d => {
                                    const status = getRequestStatus(d.id)
                                    return (
                                        <tr key={d.id}>
                                            <td><span className="id-chip">{d.doctor_id}</span></td>
                                            <td>{d.evionex_profiles?.full_name || '—'}</td>
                                            <td style={{ textTransform: 'capitalize' }}>{d.specialization || '—'}</td>
                                            <td>{d.experience_years ? `${d.experience_years} yrs` : '—'}</td>
                                            <td>
                                                {status === 'connected' ? <span className="status-badge status-badge--completed">Connected</span>
                                                    : status === 'pending' ? <span className="status-badge status-badge--pending">Pending</span>
                                                        : status === 'accepted' ? <span className="status-badge status-badge--completed">Connected</span>
                                                            : status === 'rejected' ? <button className="btn btn--sm btn-primary" onClick={() => sendConnectionRequest(d.id)} disabled={sendingRequest === d.id}>{sendingRequest === d.id ? '...' : 'Resend'}</button>
                                                                : <button className="btn btn--sm btn-primary" onClick={() => sendConnectionRequest(d.id)} disabled={sendingRequest === d.id}>{sendingRequest === d.id ? '...' : <>{ICONS.send} Connect</>}</button>}
                                            </td>
                                        </tr>
                                    )
                                })}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* Connected Doctors */}
            <div className="glass-card glass-card--flush">
                <div className="glass-card__header" style={{ padding: 'var(--space-lg) var(--space-xl) 0' }}><h2>Connected Doctors ({connectedDoctors.length})</h2></div>
                {connectedDoctors.length === 0 ? <div className="empty-state"><div className="empty-state__icon">{ICONS.doctors}</div><h3 className="empty-state__title">No connected doctors</h3><p className="empty-state__text">Search for doctors above or use a Doctor ID to connect.</p></div>
                    : <table className="portal-table"><thead><tr><th>Doctor ID</th><th>Name</th><th>Specialization</th><th>Experience</th><th>Connected On</th><th></th></tr></thead><tbody>{connectedDoctors.map(c => <tr key={c.doctor_id}><td><span className="id-chip">{c.evionex_doctors?.doctor_id}</span></td><td>{c.evionex_doctors?.evionex_profiles?.full_name || '—'}</td><td style={{ textTransform: 'capitalize' }}>{c.evionex_doctors?.specialization || '—'}</td><td>{c.evionex_doctors?.experience_years ? `${c.evionex_doctors.experience_years} yrs` : '—'}</td><td>{new Date(c.assigned_at).toLocaleDateString('en-IN')}</td><td><ActionMenu onDisconnect={() => handleDisconnectDoctor(c.doctor_id, c.evionex_doctors?.evionex_profiles?.full_name)} /></td></tr>)}</tbody></table>}
            </div>

            {/* Pending Requests */}
            {myRequests.filter(r => r.status === 'pending').length > 0 && (
                <div className="glass-card" style={{ marginTop: 'var(--space-xl)' }}>
                    <div className="glass-card__header"><h2>Pending Requests</h2></div>
                    <div className="connection-requests-grid">
                        {myRequests.filter(r => r.status === 'pending').map(req => (
                            <div className="connection-request-card connection-request-card--patient" key={req.id}>
                                <div className="connection-request-card__info">
                                    <div className="connection-request-card__name">{req.evionex_doctors?.evionex_profiles?.full_name || 'Unknown Doctor'}</div>
                                    <div className="connection-request-card__id"><span className="id-chip">{req.evionex_doctors?.doctor_id}</span></div>
                                    <div className="connection-request-card__date">Sent {new Date(req.created_at).toLocaleDateString('en-IN')}</div>
                                </div>
                                <span className="status-badge status-badge--pending">Awaiting Response</span>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </>
    )

    if (tab === 'orders') return (
        <>
            <div className="portal-main__header" style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
                <div><h1>My Orders</h1><p>Track your WES testing orders</p></div>
                {NotificationBell}
            </div>
            <div className="glass-card glass-card--flush">
                {orders.length === 0 ? <div className="empty-state"><div className="empty-state__icon">{ICONS.orders}</div><h3 className="empty-state__title">No orders yet</h3></div>
                    : <table className="portal-table"><thead><tr><th>Order ID</th><th>Plan</th><th>Amount</th><th>Status</th><th>Date</th></tr></thead><tbody>{orders.map(o => <tr key={o.id}><td className="portal-table__mono">{o.razorpay_order_id?.slice(0, 22) || o.id.slice(0, 8)}</td><td>{o.plan_name || '—'}</td><td>₹{((o.amount || 0) / 100).toLocaleString('en-IN')}</td><td><span className={`status-badge status-badge--${o.order_status}`}>{o.order_status.replace(/_/g, ' ')}</span></td><td>{new Date(o.created_at).toLocaleDateString('en-IN')}</td></tr>)}</tbody></table>}
            </div>
        </>
    )

    if (tab === 'reports') return (
        <>
            <div className="portal-main__header" style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
                <div><h1>Medical Reports</h1><p>Upload and view your medical reports</p></div>
                {NotificationBell}
            </div>
            <div className="glass-card" style={{ marginBottom: 'var(--space-xl)' }}>
                <div className="glass-card__header"><h2>Upload Report</h2></div>
                <div className={`upload-zone ${dragOver ? 'upload-zone--drag' : ''}`} onDragOver={e => { e.preventDefault(); setDragOver(true) }} onDragLeave={() => setDragOver(false)} onDrop={e => { e.preventDefault(); setDragOver(false); handleFileUpload(e.dataTransfer.files[0]) }}>
                    <div className="upload-zone__icon">{ICONS.upload}</div>
                    <p className="upload-zone__text">Drag & drop a file, or <strong>click to browse</strong></p>
                    <p className="upload-zone__hint">PDF, JPG, PNG, or WebP — Max 20 MB</p>
                    <input type="file" accept=".pdf,.jpg,.jpeg,.png,.webp" onChange={e => handleFileUpload(e.target.files[0])} />
                </div>
                {uploading && <div className="upload-progress"><div className="upload-progress__bar"><div className="upload-progress__fill" style={{ width: `${uploadProgress}%` }} /></div><span className="upload-progress__text">{uploadProgress}%</span></div>}
            </div>
            <div className="glass-card">
                <div className="glass-card__header"><h2>Your Reports</h2></div>
                {reports.length === 0 ? <div className="empty-state"><div className="empty-state__icon">{ICONS.file}</div><h3 className="empty-state__title">No reports yet</h3></div>
                    : <div className="reports-grid">{reports.map(r => <div className="report-card" key={r.id} onClick={() => viewReport(r)}><div className="report-card__icon">{r.file_name?.endsWith('.pdf') ? ICONS.file : ICONS.image}</div><div className="report-card__name">{r.file_name || 'Report'}</div><div className="report-card__meta">{r.report_type} · {new Date(r.created_at).toLocaleDateString('en-IN')}</div></div>)}</div>}
            </div>
            {viewingReport && (
                <div className="report-viewer-overlay" onClick={() => { setViewingReport(null); setReportUrl('') }}>
                    <div className="report-viewer" onClick={e => e.stopPropagation()}>
                        <div className="report-viewer__header"><h3>{viewingReport.file_name}</h3><button className="report-viewer__close" onClick={() => { setViewingReport(null); setReportUrl('') }}>×</button></div>
                        <div className="report-viewer__body">
                            {!reportUrl ? <div className="loading-spinner"><div className="loading-spinner__ring" /></div>
                                : viewingReport.file_name?.endsWith('.pdf') ? <iframe src={reportUrl} title={viewingReport.file_name} /> : <img src={reportUrl} alt={viewingReport.file_name} />}
                        </div>
                    </div>
                </div>
            )}
        </>
    )
    return null
}


/* ===============================================
   ADMIN / EMPLOYEE VIEW
   =============================================== */
function AdminView({ tab, user, profile, session, isAdminUser }) {
    const [orders, setOrders] = useState([])
    const [patients, setPatients] = useState([])
    const [partners, setPartners] = useState([])
    const [employees, setEmployees] = useState([])
    const [loading, setLoading] = useState(true)
    const [updatingId, setUpdatingId] = useState(null)
    const [userSubTab, setUserSubTab] = useState('patients')

    // Action states
    const [editingUserId, setEditingUserId] = useState(null)
    const [editUserType, setEditUserType] = useState('')
    const [deletingUser, setDeletingUser] = useState(null)
    const [deleteUserName, setDeleteUserName] = useState('')
    const [isDeleting, setIsDeleting] = useState(false)
    const [viewingUserId, setViewingUserId] = useState(null)
    const [viewingUserType, setViewingUserType] = useState('')

    // Employee creation states
    const [showEmployeeForm, setShowEmployeeForm] = useState(false)
    const [creatingEmployee, setCreatingEmployee] = useState(false)
    const [employeeFormError, setEmployeeFormError] = useState('')
    const [employeeFormSuccess, setEmployeeFormSuccess] = useState('')
    const [employeeForm, setEmployeeForm] = useState({ fullName: '', email: '', password: '', subRole: 'full-time', department: 'Software Development' })

    async function handleCreateEmployee(e) {
        e.preventDefault()
        setEmployeeFormError(''); setEmployeeFormSuccess(''); setCreatingEmployee(true)
        try {
            const { data: { user: authUser }, error: authErr } = await supabaseGeneSetu.auth.getUser()
            if (authErr || !authUser) {
                setEmployeeFormError('Session expired. Please sign out and sign in again.')
                setCreatingEmployee(false)
                return
            }
            const { data: sessionData } = await supabaseGeneSetu.auth.getSession()
            const token = sessionData?.session?.access_token

            const { data: result, error: fnErr } = await supabaseGeneSetu.functions.invoke('evionex-create-employee', {
                body: employeeForm,
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
            if (fnErr) {
                let message = fnErr.message || 'Failed to create employee'
                try {
                    const errBody = fnErr.context ? await fnErr.context.json() : null
                    if (errBody?.error) message = errBody.error
                } catch {
                    // Keep default message if response body is not JSON.
                }
                setEmployeeFormError(message)
            } else {
                setEmployeeFormSuccess(result.message || 'Employee created successfully!')
                setEmployeeForm({ fullName: '', email: '', password: '', subRole: 'full-time', department: 'Software Development' })
                setShowEmployeeForm(false)
                await loadData()
            }
        } catch (err) {
            setEmployeeFormError('Failed: ' + err.message)
        }
        setCreatingEmployee(false)
    }

    useEffect(() => {
        loadData()
    }, [user.id])

    async function loadData() {
        setLoading(true)
        const [{ data: ord }, { data: pats }, { data: parts }, { data: emps }] = await Promise.all([
            supabaseGeneSetu.from('evionex_wes_orders').select('*, evionex_patients(patient_id)').eq('payment_verified', true).order('created_at', { ascending: false }),
            supabaseGeneSetu.from('evionex_patients').select('*, evionex_profiles(full_name, account_status)').order('created_at', { ascending: false }),
            supabaseGeneSetu.from('evionex_profiles').select('*').eq('role', 'partner').order('created_at', { ascending: false }),
            supabaseGeneSetu.from('evionex_profiles').select('*').eq('role', 'employee').order('created_at', { ascending: false }),
        ])
        setOrders(ord || []); setPatients(pats || []); setPartners(parts || []); setEmployees(emps || [])
        setLoading(false)
    }

    const statuses = ['pending', 'sample_collection', 'processing', 'sequencing', 'analysis', 'completed', 'cancelled']

    async function updateStatus(orderId, newStatus) {
        setUpdatingId(orderId)
        const { error } = await supabaseGeneSetu.from('evionex_wes_orders').update({ order_status: newStatus, status_updated_by: user.id }).eq('id', orderId)
        if (!error) setOrders(prev => prev.map(o => o.id === orderId ? { ...o, order_status: newStatus } : o))
        setUpdatingId(null)
    }

    // Edit handlers — open full page
    function handleEditPatient(p) { setEditingUserId(p.id); setEditUserType('Patient') }
    function handleEditPartner(p) { setEditingUserId(p.id); setEditUserType('Partner') }
    function handleEditEmployee(e) { setEditingUserId(e.id); setEditUserType('Employee') }

    function getInitials(name, fallback = '?') {
        const source = (name || '').trim()
        if (!source) return fallback
        const initials = source
            .split(/\s+/)
            .map(part => part[0])
            .join('')
            .slice(0, 2)
            .toUpperCase()
        return initials || fallback
    }

    function formatRoleLabel(value) {
        if (!value) return 'Unknown'
        return value.replace(/[-_]/g, ' ')
    }

    // Delete handler — admin only
    async function handleConfirmDelete() {
        if (!isAdminUser) { alert('Only admins can delete users.'); return }
        setIsDeleting(true)
        try {
            const { data: { user: authUser }, error: authErr } = await supabaseGeneSetu.auth.getUser()
            if (authErr || !authUser) {
                alert('Session expired. Please sign out and sign in again.')
                setIsDeleting(false)
                return
            }
            const { data: result, error: fnErr } = await supabaseGeneSetu.functions.invoke('evionex-delete-user', {
                body: { userId: deletingUser },
            })
            if (fnErr) {
                let message = fnErr.message || 'Unknown error'
                try {
                    const errBody = fnErr.context ? await fnErr.context.json() : null
                    if (errBody?.error) message = errBody.error
                } catch {
                    // Keep default message if response body is not JSON.
                }
                alert('Delete failed: ' + message)
            } else if (!result?.success) {
                alert('Delete failed: Unknown error')
            }
        } catch (err) { alert('Delete failed: ' + err.message) }
        setIsDeleting(false); setDeletingUser(null)
        await loadData()
    }

    if (loading) return <div className="loading-spinner"><div className="loading-spinner__ring" /></div>

    // If editing a user's data — dedicated page
    if (editingUserId) {
        return <EditUserView userId={editingUserId} userType={editUserType} onBack={() => { setEditingUserId(null); setEditUserType('') }} onSaved={() => { setEditingUserId(null); setEditUserType(''); loadData() }} />
    }

    // If viewing a user's detail page
    if (viewingUserId) {
        return <UserDetailView userId={viewingUserId} userType={viewingUserType} onBack={() => { setViewingUserId(null); setViewingUserType('') }} />
    }

    const completed = orders.filter(o => o.order_status === 'completed').length
    const inProgress = orders.filter(o => !['completed', 'cancelled'].includes(o.order_status)).length

    /* Overview */
    if (tab === 'overview') return (
        <>
            <div className="portal-main__header"><h1>{isAdminUser ? 'Admin Dashboard' : 'Employee Dashboard'}</h1><p>Manage orders</p></div>
            <div className="stats-row">
                <div className="stat-card"><div className="stat-card__icon stat-card__icon--cyan">{ICONS.users}</div><div className="stat-card__info"><h3>{patients.length}</h3><p>Patients</p></div></div>
                <div className="stat-card"><div className="stat-card__icon stat-card__icon--blue">{ICONS.orders}</div><div className="stat-card__info"><h3>{orders.length}</h3><p>Total Orders</p></div></div>
                <div className="stat-card"><div className="stat-card__icon stat-card__icon--green">{ICONS.check}</div><div className="stat-card__info"><h3>{completed}</h3><p>Completed</p></div></div>
                <div className="stat-card"><div className="stat-card__icon stat-card__icon--amber">{ICONS.clock}</div><div className="stat-card__info"><h3>{inProgress}</h3><p>In Progress</p></div></div>
            </div>
            <div className="glass-card glass-card--flush">
                <div className="glass-card__header" style={{ padding: 'var(--space-lg) var(--space-xl) 0' }}><h2>Recent Orders</h2></div>
                {orders.length === 0 ? <div className="empty-state"><div className="empty-state__icon">{ICONS.orders}</div><h3 className="empty-state__title">No orders</h3></div>
                    : <table className="portal-table"><thead><tr><th>Patient</th><th>Order</th><th>Plan</th><th>Amount</th><th>Status</th><th>Date</th></tr></thead><tbody>{orders.slice(0, 5).map(o => <tr key={o.id}><td><span className="id-chip">{o.evionex_patients?.patient_id || '—'}</span></td><td className="portal-table__mono">{o.razorpay_order_id?.slice(0, 16) || o.id.slice(0, 8)}</td><td>{o.plan_name || '—'}</td><td>₹{((o.amount || 0) / 100).toLocaleString('en-IN')}</td><td><span className={`status-badge status-badge--${o.order_status}`}>{o.order_status.replace(/_/g, ' ')}</span></td><td>{new Date(o.created_at).toLocaleDateString('en-IN')}</td></tr>)}</tbody></table>}
            </div>
        </>
    )

    /* Order Management */
    if (tab === 'orders') return (
        <>
            <div className="portal-main__header"><h1>Order Management</h1><p>Update order statuses and track progress</p></div>
            <div className="glass-card glass-card--flush">
                {orders.length === 0 ? <div className="empty-state"><div className="empty-state__icon">{ICONS.orders}</div><h3 className="empty-state__title">No orders</h3></div>
                    : <table className="portal-table"><thead><tr><th>Patient</th><th>Order ID</th><th>Plan</th><th>Amount</th><th>Status</th><th>Date</th><th>Update</th></tr></thead><tbody>{orders.map(o => <tr key={o.id}><td><span className="id-chip">{o.evionex_patients?.patient_id || '—'}</span></td><td className="portal-table__mono">{o.razorpay_order_id?.slice(0, 18) || o.id.slice(0, 8)}</td><td>{o.plan_name || '—'}</td><td>₹{((o.amount || 0) / 100).toLocaleString('en-IN')}</td><td><span className={`status-badge status-badge--${o.order_status}`}>{o.order_status.replace(/_/g, ' ')}</span></td><td>{new Date(o.created_at).toLocaleDateString('en-IN')}</td><td><select className="status-select" value={o.order_status} onChange={e => updateStatus(o.id, e.target.value)} disabled={updatingId === o.id}>{statuses.map(s => <option key={s} value={s}>{s.replace(/_/g, ' ')}</option>)}</select></td></tr>)}</tbody></table>}
            </div>
        </>
    )

    /* All Users with sub-tabs and action menus */
    if (tab === 'users') return (
        <>
            <div className="portal-main__header"><h1>All Users</h1><p>View and manage all registered users</p></div>
            <div className="glass-card glass-card--flush">
                <div className="subtab-bar" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ display: 'flex' }}>
                        {[{ id: 'patients', label: `Patients (${patients.length})` }, { id: 'partners', label: `Partners (${partners.length})` }, { id: 'employees', label: `Employees (${employees.length})` }].map(t => (
                            <button key={t.id} className={`subtab-bar__item ${userSubTab === t.id ? 'subtab-bar__item--active' : ''}`} onClick={() => setUserSubTab(t.id)}>{t.label}</button>
                        ))}
                    </div>
                    {userSubTab === 'employees' && isAdminUser && (
                        <button className="btn btn--sm btn-primary" style={{ marginRight: 'var(--space-md)', padding: 0, width: '32px', height: '32px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px', flexShrink: 0 }} onClick={() => { setShowEmployeeForm(!showEmployeeForm); setEmployeeFormError(''); setEmployeeFormSuccess('') }}>
                            {showEmployeeForm ? '×' : '+'}
                        </button>
                    )}
                </div>

                {/* Patients */}
                {userSubTab === 'patients' && (
                    patients.length === 0 ? <div className="empty-state"><div className="empty-state__icon">{ICONS.users}</div><h3 className="empty-state__title">No patients</h3></div>
                        : <table className="portal-table portal-table--accounts"><thead><tr><th>Patient Account</th><th>Blood Group</th><th>Status</th><th>Joined</th><th></th></tr></thead>
                            <tbody>{patients.map(p => (
                                <tr key={p.id}><td>
                                    <div className="account-cell">
                                        <div className="account-cell__avatar account-cell__avatar--patient">{getInitials(p.evionex_profiles?.full_name, 'PT')}</div>
                                        <div className="account-cell__content">
                                            <div className="account-cell__title">{p.evionex_profiles?.full_name || 'Unnamed Patient'}</div>
                                            <div className="account-cell__meta">
                                                <span className="id-chip">{p.patient_id || '—'}</span>
                                                <span className="account-cell__meta-sep">•</span>
                                                <span style={{ textTransform: 'capitalize' }}>{p.gender || 'Gender N/A'}</span>
                                            </div>
                                        </div>
                                    </div>
                                </td><td>{p.blood_group || '—'}</td><td><span className={`status-badge status-badge--${p.evionex_profiles?.account_status}`}>{p.evionex_profiles?.account_status || '—'}</span></td><td>{new Date(p.created_at).toLocaleDateString('en-IN')}</td>
                                    <td><ActionMenu onEdit={() => handleEditPatient(p)} onDelete={() => { setDeletingUser(p.id); setDeleteUserName(p.evionex_profiles?.full_name || p.patient_id) }} onViewMore={() => { setViewingUserId(p.id); setViewingUserType('patient') }} /></td>
                                </tr>
                            ))}</tbody></table>
                )}

                {/* Partners */}
                {userSubTab === 'partners' && (
                    partners.length === 0 ? <div className="empty-state"><div className="empty-state__icon">{ICONS.handshake}</div><h3 className="empty-state__title">No partners</h3></div>
                        : <table className="portal-table portal-table--accounts"><thead><tr><th>Partner Account</th><th>Type</th><th>Status</th><th>Joined</th><th></th></tr></thead>
                            <tbody>{partners.map(p => (
                                <tr key={p.id}><td>
                                    <div className="account-cell">
                                        <div className="account-cell__avatar account-cell__avatar--partner">{getInitials(p.full_name, 'PR')}</div>
                                        <div className="account-cell__content">
                                            <div className="account-cell__title">{p.full_name || 'Unnamed Partner'}</div>
                                            <div className="account-cell__meta">{p.email || 'No email available'}</div>
                                        </div>
                                    </div>
                                </td><td style={{ textTransform: 'capitalize' }}><span className={`status-badge status-badge--${p.sub_role === 'doctor' ? 'processing' : 'pending'}`}>{formatRoleLabel(p.sub_role)}</span></td><td><span className={`status-badge status-badge--${p.account_status}`}>{p.account_status}</span></td><td>{new Date(p.created_at).toLocaleDateString('en-IN')}</td>
                                    <td><ActionMenu onEdit={() => handleEditPartner(p)} onDelete={() => { setDeletingUser(p.id); setDeleteUserName(p.full_name || 'User') }} onViewMore={() => { setViewingUserId(p.id); setViewingUserType('partner') }} /></td>
                                </tr>
                            ))}</tbody></table>
                )}

                {/* Employees */}
                {userSubTab === 'employees' && (
                    <>
                        {showEmployeeForm ? (
                            <div style={{ padding: 'var(--space-xl)' }}>
                                <h2 style={{ marginBottom: 'var(--space-md)' }}>Create New Employee</h2>
                                {employeeFormSuccess && <div className="auth-success" style={{ marginBottom: 'var(--space-lg)' }}>{employeeFormSuccess}</div>}
                                {employeeFormError && <div className="auth-error" style={{ marginBottom: 'var(--space-lg)' }}>{employeeFormError}</div>}
                                <form onSubmit={handleCreateEmployee}>
                                    <div className="profile-grid" style={{ marginBottom: 'var(--space-lg)' }}>
                                        <div className="form-group">
                                            <label className="form-label">Full Name *</label>
                                            <input className="form-input" value={employeeForm.fullName} onChange={e => setEmployeeForm(f => ({ ...f, fullName: e.target.value }))} placeholder="e.g. John Doe" required />
                                        </div>
                                        <div className="form-group">
                                            <label className="form-label">Email Address *</label>
                                            <input className="form-input" type="email" value={employeeForm.email} onChange={e => setEmployeeForm(f => ({ ...f, email: e.target.value }))} placeholder="e.g. john@evionex.com" required />
                                        </div>
                                        <div className="form-group">
                                            <label className="form-label">Employment Type *</label>
                                            <select className="form-select" value={employeeForm.subRole} onChange={e => setEmployeeForm(f => ({ ...f, subRole: e.target.value }))} required>
                                                <option value="full-time">Full-Time</option>
                                                <option value="intern">Intern</option>
                                            </select>
                                        </div>
                                        <div className="form-group">
                                            <label className="form-label">Department *</label>
                                            <select className="form-select" value={employeeForm.department} onChange={e => setEmployeeForm(f => ({ ...f, department: e.target.value }))} required>
                                                <option value="Software Development">Software Development</option>
                                                <option value="Marketing">Marketing</option>
                                                <option value="Management">Management</option>
                                            </select>
                                        </div>
                                        <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                                            <label className="form-label">Temporary Password *</label>
                                            <input className="form-input" type="password" value={employeeForm.password} onChange={e => setEmployeeForm(f => ({ ...f, password: e.target.value }))} placeholder="Min. 8 characters" minLength={8} required />
                                        </div>
                                    </div>
                                    <div className="profile-actions" style={{ marginTop: 0 }}>
                                        <button type="button" className="btn btn--sm btn--ghost" onClick={() => setShowEmployeeForm(false)}>Cancel</button>
                                        <button type="submit" className="btn btn--sm btn-primary" disabled={creatingEmployee}>
                                            {creatingEmployee ? 'Creating...' : 'Create Employee'}
                                        </button>
                                    </div>
                                </form>
                            </div>
                        ) : (
                            employees.length === 0 ? <div className="empty-state"><div className="empty-state__icon">{ICONS.briefcase}</div><h3 className="empty-state__title">No employees</h3></div>
                                : <table className="portal-table portal-table--accounts"><thead><tr><th>Employee Account</th><th>Employment Type</th><th>Status</th><th>Joined</th><th></th></tr></thead>
                                    <tbody>{employees.map(e => (
                                        <tr key={e.id}><td>
                                            <div className="account-cell">
                                                <div className="account-cell__avatar account-cell__avatar--employee">{getInitials(e.full_name, 'EM')}</div>
                                                <div className="account-cell__content">
                                                    <div className="account-cell__title">{e.full_name || 'Unnamed Employee'}</div>
                                                    <div className="account-cell__meta">{e.email || 'No email available'}</div>
                                                </div>
                                            </div>
                                        </td><td style={{ textTransform: 'capitalize' }}><span className={`status-badge status-badge--${e.sub_role === 'admin' ? 'cancelled' : 'processing'}`}>{formatRoleLabel(e.sub_role)}</span></td><td><span className={`status-badge status-badge--${e.account_status}`}>{e.account_status}</span></td><td>{new Date(e.created_at).toLocaleDateString('en-IN')}</td>
                                            <td><ActionMenu onEdit={() => handleEditEmployee(e)} onDelete={() => { setDeletingUser(e.id); setDeleteUserName(e.full_name || 'User') }} onViewMore={() => { setViewingUserId(e.id); setViewingUserType('employee') }} /></td>
                                        </tr>
                                    ))}</tbody></table>
                        )}
                    </>
                )}
            </div>



            {/* Delete Confirmation Modal */}
            {deletingUser && <DeleteModal userName={deleteUserName} onConfirm={handleConfirmDelete} onCancel={() => setDeletingUser(null)} deleting={isDeleting} />}
        </>
    )

    /* Institutions — admin only */
    if (tab === 'institutions') {
        if (!isAdminUser) return <div className="empty-state"><div className="empty-state__icon">{ICONS.lock}</div><h3 className="empty-state__title">Access Denied</h3><p className="empty-state__text">Only admins can manage institutions.</p></div>
        return <InstitutionManager user={user} session={session} />
    }

    return null
}


/* =================== INSTITUTION MANAGER =================== */
function InstitutionManager({ user, session }) {
    const [institutions, setInstitutions] = useState([])
    const [loading, setLoading] = useState(true)
    const [creating, setCreating] = useState(false)
    const [showForm, setShowForm] = useState(false)
    const [success, setSuccess] = useState('')
    const [error, setError] = useState('')
    const [form, setForm] = useState({
        username: '', password: '', institutionName: '',
        address: '', phone: '', website: '',
    })

    useEffect(() => { loadInstitutions() }, [])

    async function loadInstitutions() {
        setLoading(true)
        const { data } = await supabaseGeneSetu
            .from('evionex_institutions')
            .select('*, evionex_profiles(full_name, account_status, email)')
            .order('created_at', { ascending: false })
        setInstitutions(data || [])
        setLoading(false)
    }

    function handleChange(field, value) {
        setForm(f => ({ ...f, [field]: value }))
    }

    async function handleCreate(e) {
        e.preventDefault()
        setError(''); setSuccess(''); setCreating(true)

        try {
            const { data: { user: authUser }, error: authErr } = await supabaseGeneSetu.auth.getUser()
            if (authErr || !authUser) {
                setError('Session expired. Please sign out and sign in again.')
                setCreating(false)
                return
            }
            const { data: sessionData } = await supabaseGeneSetu.auth.getSession()
            const token = sessionData?.session?.access_token

            const { data: result, error: fnErr } = await supabaseGeneSetu.functions.invoke('evionex-create-institution', {
                body: {
                    username: form.username,
                    password: form.password,
                    institutionName: form.institutionName,
                    address: form.address || undefined,
                    phone: form.phone || undefined,
                    website: form.website || undefined,
                },
            })
            if (fnErr) {
                let message = fnErr.message || 'Failed to create institution'
                try {
                    const errBody = fnErr.context ? await fnErr.context.json() : null
                    if (errBody?.error) message = errBody.error
                } catch {
                    // Keep default message if response body is not JSON.
                }
                setError(message)
            } else {
                setSuccess(result.message || 'Institution created successfully!')
                setForm({ username: '', password: '', institutionName: '', address: '', phone: '', website: '' })
                setShowForm(false)
                await loadInstitutions()
            }
        } catch (err) {
            setError('Failed: ' + err.message)
        }
        setCreating(false)
    }

    if (loading) return <div className="loading-spinner"><div className="loading-spinner__ring" /></div>

    return (
        <>
            <div className="portal-main__header">
                <h1>Institutions</h1>
                <p>Manage institution accounts</p>
            </div>

            {success && <div className="auth-success" style={{ marginBottom: 'var(--space-lg)' }}>{success}</div>}
            {error && <div className="auth-error" style={{ marginBottom: 'var(--space-lg)' }}>{error}</div>}

            {/* Create Institution form */}
            <div className="glass-card" style={{ marginBottom: 'var(--space-xl)' }}>
                <div className="glass-card__header">
                    <h2>{showForm ? 'New Institution' : 'Create Institution'}</h2>
                    <button className="btn btn--sm btn-primary" onClick={() => { setShowForm(!showForm); setError(''); setSuccess('') }}>
                        {showForm ? '× Cancel' : '+ Create New'}
                    </button>
                </div>

                {showForm && (
                    <form onSubmit={handleCreate}>
                        <div className="profile-grid" style={{ marginBottom: 'var(--space-lg)' }}>
                            <div className="form-group">
                                <label className="form-label">Institution Name *</label>
                                <input className="form-input" value={form.institutionName} onChange={e => handleChange('institutionName', e.target.value)} placeholder="e.g. AIIMS Delhi" required />
                            </div>
                            <div className="form-group">
                                <label className="form-label">Login Username *</label>
                                <input className="form-input" value={form.username} onChange={e => handleChange('username', e.target.value)} placeholder="e.g. aiims_delhi" pattern="[a-zA-Z0-9_]{3,30}" title="3-30 characters: letters, numbers, underscores" required />
                            </div>
                            <div className="form-group">
                                <label className="form-label">Login Password *</label>
                                <input className="form-input" type="password" value={form.password} onChange={e => handleChange('password', e.target.value)} placeholder="Min. 8 characters (with uppercase, number, special char)" minLength={8} required />
                            </div>
                            <div className="form-group">
                                <label className="form-label">Address</label>
                                <input className="form-input" value={form.address} onChange={e => handleChange('address', e.target.value)} placeholder="Institution address" />
                            </div>
                            <div className="form-group">
                                <label className="form-label">Phone</label>
                                <input className="form-input" type="tel" value={form.phone} onChange={e => handleChange('phone', e.target.value)} placeholder="+91 XXXXXXXXXX" />
                            </div>
                            <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                                <label className="form-label">Website</label>
                                <input className="form-input" type="url" value={form.website} onChange={e => handleChange('website', e.target.value)} placeholder="https://example.com" />
                            </div>
                        </div>
                        <div className="profile-actions">
                            <button type="button" className="btn btn--sm btn--ghost" onClick={() => setShowForm(false)}>Cancel</button>
                            <button type="submit" className="btn btn--sm btn-primary" disabled={creating}>
                                {creating ? 'Creating...' : 'Create Institution'}
                            </button>
                        </div>
                    </form>
                )}
            </div>

            {/* Existing Institutions list */}
            <div className="glass-card glass-card--flush">
                <div className="glass-card__header" style={{ padding: 'var(--space-lg) var(--space-xl) 0' }}>
                    <h2>All Institutions ({institutions.length})</h2>
                </div>
                {institutions.length === 0 ? (
                    <div className="empty-state"><div className="empty-state__icon">{ICONS.institutions}</div><h3 className="empty-state__title">No institutions yet</h3><p className="empty-state__text">Create your first institution using the form above.</p></div>
                ) : (
                    <table className="portal-table">
                        <thead><tr><th>Code</th><th>Name</th><th>Username</th><th>Status</th><th>Created</th></tr></thead>
                        <tbody>{institutions.map(inst => (
                            <tr key={inst.id}>
                                <td><span className="id-chip">{inst.institution_code}</span></td>
                                <td>{inst.name || '—'}</td>
                                <td><span className="portal-table__mono">{inst.username || '—'}</span></td>
                                <td><span className={`status-badge status-badge--${inst.evionex_profiles?.account_status}`}>{inst.evionex_profiles?.account_status || '—'}</span></td>
                                <td>{new Date(inst.created_at).toLocaleDateString('en-IN')}</td>
                            </tr>
                        ))}</tbody>
                    </table>
                )}
            </div>
        </>
    )
}


/* ===============================================
   DOCTOR VIEW
   =============================================== */
function DoctorView({ tab, user, profile }) {
    const [doctor, setDoctor] = useState(null)
    const [patients, setPatients] = useState([])
    const [connectionRequests, setConnectionRequests] = useState([])
    const [loading, setLoading] = useState(true)
    const [editMode, setEditMode] = useState(false)
    const [saving, setSaving] = useState(false)
    const [respondingId, setRespondingId] = useState(null)
    const [viewingPatientId, setViewingPatientId] = useState(null)
    const [form, setForm] = useState({ specialization: '', license_number: '', experience_years: '' })

    /* Institution connection state */
    const [institutionRequests, setInstitutionRequests] = useState([])
    const [connectedInstitutions, setConnectedInstitutions] = useState([])
    const [instSearchInput, setInstSearchInput] = useState('')
    const [instSearchError, setInstSearchError] = useState('')
    const [sendingInstRequest, setSendingInstRequest] = useState(false)

    async function loadData() {
        const [{ data: doc }, { data: assigned }, { data: requests }, { data: instReqs }] = await Promise.all([
            supabaseGeneSetu.from('evionex_doctors').select('*').eq('id', user.id).single(),
            supabaseGeneSetu.from('evionex_doctor_patients').select('*, evionex_patients(patient_id, gender, blood_group, evionex_profiles(full_name))').eq('doctor_id', user.id),
            supabaseGeneSetu.from('evionex_connection_requests').select('*, evionex_patients(patient_id, evionex_profiles(full_name))').eq('doctor_id', user.id).eq('status', 'pending').order('created_at', { ascending: false }),
            supabaseGeneSetu.from('evionex_doctor_institution_requests')
                .select('*, evionex_institutions(id, institution_code, institution_id, name, phone, website)')
                .eq('doctor_id', user.id)
                .order('created_at', { ascending: false }),
        ])
        setDoctor(doc); setPatients(assigned || []); setConnectionRequests(requests || [])
        const allInst = instReqs || []
        setInstitutionRequests(allInst)
        setConnectedInstitutions(allInst.filter(r => r.status === 'accepted'))
        if (doc) setForm({ specialization: doc.specialization || '', license_number: doc.license_number || '', experience_years: doc.experience_years || '' })
        setLoading(false)
    }

    useEffect(() => { loadData() }, [user.id])

    async function handleAccept(request) {
        setRespondingId(request.id)
        try {
            // 1. Update request status
            await supabaseGeneSetu.from('evionex_connection_requests').update({ status: 'accepted', responded_at: new Date().toISOString() }).eq('id', request.id)
            // 2. Insert into doctor_patients junction table
            await supabaseGeneSetu.from('evionex_doctor_patients').insert({ doctor_id: user.id, patient_id: request.patient_id })
            // 3. Create notification for the patient
            await supabaseGeneSetu.from('evionex_notifications').insert({
                user_id: request.patient_id,
                type: 'connection_accepted',
                title: 'Connection Accepted',
                message: `Dr. ${profile?.full_name || 'Your doctor'} accepted your connection request.`,
                metadata: { doctor_id: user.id, request_id: request.id },
            })
            await loadData()
        } catch (err) { console.error('Accept failed:', err) }
        setRespondingId(null)
    }

    async function handleReject(request) {
        setRespondingId(request.id)
        try {
            await supabaseGeneSetu.from('evionex_connection_requests').update({ status: 'rejected', responded_at: new Date().toISOString() }).eq('id', request.id)
            await supabaseGeneSetu.from('evionex_notifications').insert({
                user_id: request.patient_id,
                type: 'connection_rejected',
                title: 'Connection Declined',
                message: `Dr. ${profile?.full_name || 'The doctor'} declined your connection request.`,
                metadata: { doctor_id: user.id, request_id: request.id },
            })
            await loadData()
        } catch (err) { console.error('Reject failed:', err) }
        setRespondingId(null)
    }

    if (loading) return <div className="loading-spinner"><div className="loading-spinner__ring" /></div>

    if (viewingPatientId) {
        return <UserDetailView userId={viewingPatientId} userType="patient" onBack={() => setViewingPatientId(null)} />
    }

    async function handleDisconnectPatient(patUuid, patientName) {
        if (!window.confirm(`Are you sure you want to disconnect from ${patientName || 'this patient'}?`)) return
        try {
            await supabaseGeneSetu.from('evionex_doctor_patients').delete().eq('doctor_id', user.id).eq('patient_id', patUuid)
            await loadData()
        } catch (e) { alert('Failed to disconnect: ' + e.message) }
    }

    async function sendInstitutionRequest() {
        const input = instSearchInput.trim()
        if (!input) return
        setSendingInstRequest(true); setInstSearchError('')
        // Try by institution_code first (e.g. EVX-INST-XXXXX), then by institution_id field
        const { data: byCode } = await supabaseGeneSetu.from('evionex_institutions').select('id').eq('institution_code', input.toUpperCase()).single()
        const { data: byInstId } = !byCode ? await supabaseGeneSetu.from('evionex_institutions').select('id').eq('institution_id', input).single() : { data: null }
        const institution = byCode || byInstId
        if (!institution) {
            setInstSearchError('Institution not found. Please check the code or ID and try again.')
            setSendingInstRequest(false); return
        }
        const { error } = await supabaseGeneSetu.from('evionex_doctor_institution_requests').insert({ doctor_id: user.id, institution_id: institution.id })
        if (error) {
            if (error.code === '23505') setInstSearchError('You already have a pending or accepted connection with this institution.')
            else setInstSearchError('Failed to send request: ' + error.message)
        } else {
            setInstSearchInput('')
            await loadData()
        }
        setSendingInstRequest(false)
    }

    async function withdrawInstitutionRequest(requestId) {
        if (!window.confirm('Withdraw this connection request?')) return
        await supabaseGeneSetu.from('evionex_doctor_institution_requests').delete().eq('id', requestId)
        await loadData()
    }

    if (tab === 'overview') return (
        <>
            <div className="portal-main__header"><h1>Doctor Dashboard</h1><p>Manage your patients and profile</p></div>
            <div className="stats-row">
                <div className="stat-card"><div className="stat-card__icon stat-card__icon--cyan">{ICONS.doctors}</div><div className="stat-card__info"><h3>{doctor?.doctor_id || '—'}</h3><p>Doctor ID</p></div></div>
                <div className="stat-card"><div className="stat-card__icon stat-card__icon--blue">{ICONS.users}</div><div className="stat-card__info"><h3>{patients.length}</h3><p>Connected Patients</p></div></div>
                <div className="stat-card"><div className="stat-card__icon stat-card__icon--amber">{ICONS.mail}</div><div className="stat-card__info"><h3>{connectionRequests.length}</h3><p>Pending Requests</p></div></div>
                <div className="stat-card"><div className="stat-card__icon stat-card__icon--purple">{ICONS.microscope}</div><div className="stat-card__info"><h3>{doctor?.specialization || '—'}</h3><p>Specialization</p></div></div>
            </div>
        </>
    )

    if (tab === 'profile') return (
        <>
            <div className="portal-main__header"><h1>Doctor Profile</h1><p>Your professional details</p></div>
            <div className="glass-card">
                <div className="glass-card__header"><h2>Professional Details</h2>{!editMode && <button className="btn btn--sm btn-secondary" onClick={() => setEditMode(true)}>{ICONS.edit} Edit</button>}</div>
                <div className="profile-grid">
                    <div className="form-group"><label className="form-label">Doctor ID</label><input className="form-input" value={doctor?.doctor_id || ''} readOnly /></div>
                    <div className="form-group"><label className="form-label">Specialization</label><input className="form-input" value={form.specialization} readOnly={!editMode} onChange={e => setForm(f => ({ ...f, specialization: e.target.value }))} placeholder={editMode ? 'e.g. Geneticist' : 'Not set'} /></div>
                    <div className="form-group"><label className="form-label">License Number</label><input className="form-input" value={form.license_number} readOnly={!editMode} onChange={e => setForm(f => ({ ...f, license_number: e.target.value }))} placeholder={editMode ? 'Medical license' : 'Not set'} /></div>
                    <div className="form-group"><label className="form-label">Experience (years)</label><input className="form-input" type="number" value={form.experience_years} readOnly={!editMode} onChange={e => setForm(f => ({ ...f, experience_years: e.target.value }))} /></div>
                </div>
                {editMode && <div className="profile-actions"><button className="btn btn--sm btn--ghost" onClick={() => setEditMode(false)}>Cancel</button><button className="btn btn--sm btn-primary" disabled={saving} onClick={async () => { setSaving(true); await supabaseGeneSetu.from('evionex_doctors').update({ specialization: form.specialization || null, license_number: form.license_number || null, experience_years: form.experience_years ? parseInt(form.experience_years) : null }).eq('id', user.id); setSaving(false); setEditMode(false) }}>{saving ? 'Saving...' : 'Save Changes'}</button></div>}
            </div>
        </>
    )

    if (tab === 'patients') return (
        <>
            <div className="portal-main__header"><h1>My Patients</h1><p>{patients.length} patients connected · {connectionRequests.length} pending requests</p></div>

            {/* Connection Requests Section */}
            {connectionRequests.length > 0 && (
                <div className="glass-card" style={{ marginBottom: 'var(--space-xl)' }}>
                    <div className="glass-card__header"><h2>Connection Requests ({connectionRequests.length})</h2></div>
                    <div className="connection-requests-grid">
                        {connectionRequests.map(req => (
                            <div className="connection-request-card" key={req.id}>
                                <div className="connection-request-card__info">
                                    <div className="connection-request-card__name">{req.evionex_patients?.evionex_profiles?.full_name || 'Unknown Patient'}</div>
                                    <div className="connection-request-card__id"><span className="id-chip">{req.evionex_patients?.patient_id}</span></div>
                                    <div className="connection-request-card__date">Requested {new Date(req.created_at).toLocaleDateString('en-IN')}</div>
                                </div>
                                <div className="connection-actions">
                                    <button className="btn btn--sm btn-primary connection-actions__accept" onClick={() => handleAccept(req)} disabled={respondingId === req.id}>
                                        {respondingId === req.id ? '...' : <>{ICONS.check} Accept</>}
                                    </button>
                                    <button className="btn btn--sm btn--ghost connection-actions__reject" onClick={() => handleReject(req)} disabled={respondingId === req.id}>
                                        {ICONS.xCircle} Decline
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Existing Patients Table */}
            <div className="glass-card glass-card--flush">
                <div className="glass-card__header" style={{ padding: 'var(--space-lg) var(--space-xl) 0' }}><h2>Connected Patients ({patients.length})</h2></div>
                {patients.length === 0 ? <div className="empty-state"><div className="empty-state__icon">{ICONS.users}</div><h3 className="empty-state__title">No patients connected</h3><p className="empty-state__text">Patients can find you and send connection requests.</p></div>
                    : <table className="portal-table"><thead><tr><th>Patient ID</th><th>Name</th><th>Gender</th><th>Blood Group</th><th>Connected On</th><th></th></tr></thead><tbody>{patients.map(a => <tr key={a.patient_id}><td><span className="id-chip">{a.evionex_patients?.patient_id}</span></td><td>{a.evionex_patients?.evionex_profiles?.full_name || '—'}</td><td style={{ textTransform: 'capitalize' }}>{a.evionex_patients?.gender || '—'}</td><td>{a.evionex_patients?.blood_group || '—'}</td><td>{new Date(a.assigned_at).toLocaleDateString('en-IN')}</td><td><ActionMenu onViewMore={() => setViewingPatientId(a.patient_id)} onDisconnect={() => handleDisconnectPatient(a.patient_id, a.evionex_patients?.evionex_profiles?.full_name)} /></td></tr>)}</tbody></table>}
            </div>
        </>
    )

    if (tab === 'institutions') return (
        <>
            <div className="portal-main__header">
                <h1>My Institutions</h1>
                <p>Connect with healthcare institutions</p>
            </div>

            {/* Connect by Institution Code or ID */}
            <div className="glass-card" style={{ marginBottom: 'var(--space-xl)' }}>
                <div className="glass-card__header"><h2>Connect to Institution</h2></div>
                <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text-muted)', marginBottom: 'var(--space-md)' }}>
                    Enter the institution's code (e.g. EVX-INST-XXXXX) or institution ID to send a connection request.
                </p>
                <div className="doctor-search__direct-connect">
                    <input
                        className="form-input"
                        placeholder="e.g. EVX-INST-482391"
                        value={instSearchInput}
                        onChange={e => { setInstSearchInput(e.target.value); setInstSearchError('') }}
                    />
                    <button
                        className="btn btn--sm btn-primary"
                        onClick={sendInstitutionRequest}
                        disabled={sendingInstRequest || !instSearchInput.trim()}
                    >
                        {sendingInstRequest ? 'Sending...' : <>{ICONS.send} Send Request</>}
                    </button>
                </div>
                {instSearchError && (
                    <p style={{ color: '#f87171', fontSize: 'var(--text-xs)', marginTop: 'var(--space-sm)' }}>{instSearchError}</p>
                )}
            </div>

            {/* Connected Institutions */}
            <div className="glass-card glass-card--flush" style={{ marginBottom: 'var(--space-xl)' }}>
                <div className="glass-card__header" style={{ padding: 'var(--space-lg) var(--space-xl) 0' }}>
                    <h2>Connected Institutions ({connectedInstitutions.length})</h2>
                </div>
                {connectedInstitutions.length === 0 ? (
                    <div className="empty-state">
                        <div className="empty-state__icon">{ICONS.institutions}</div>
                        <h3 className="empty-state__title">No connected institutions</h3>
                        <p className="empty-state__text">Enter an institution code or ID above to send a connection request.</p>
                    </div>
                ) : (
                    <table className="portal-table">
                        <thead><tr><th>Code</th><th>Name</th><th>Phone</th><th>Website</th><th>Connected On</th></tr></thead>
                        <tbody>
                            {connectedInstitutions.map(r => (
                                <tr key={r.id}>
                                    <td><span className="id-chip">{r.evionex_institutions?.institution_code}</span></td>
                                    <td>{r.evionex_institutions?.name || '—'}</td>
                                    <td>{r.evionex_institutions?.phone || '—'}</td>
                                    <td>
                                        {r.evionex_institutions?.website
                                            ? <a href={r.evionex_institutions.website} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--accent)' }}>{r.evionex_institutions.website}</a>
                                            : '—'}
                                    </td>
                                    <td>{new Date(r.responded_at || r.created_at).toLocaleDateString('en-IN')}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>

            {/* Pending Requests */}
            {institutionRequests.filter(r => r.status === 'pending').length > 0 && (
                <div className="glass-card">
                    <div className="glass-card__header"><h2>Pending Requests</h2></div>
                    <div className="connection-requests-grid">
                        {institutionRequests.filter(r => r.status === 'pending').map(req => (
                            <div className="connection-request-card connection-request-card--patient" key={req.id}>
                                <div className="connection-request-card__info">
                                    <div className="connection-request-card__name">{req.evionex_institutions?.name || 'Unknown Institution'}</div>
                                    <div className="connection-request-card__id"><span className="id-chip">{req.evionex_institutions?.institution_code}</span></div>
                                    <div className="connection-request-card__date">Sent {new Date(req.created_at).toLocaleDateString('en-IN')}</div>
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-sm)' }}>
                                    <span className="status-badge status-badge--pending">Awaiting Response</span>
                                    <button className="btn btn--sm btn--ghost" style={{ fontSize: 'var(--text-xs)' }} onClick={() => withdrawInstitutionRequest(req.id)}>
                                        {ICONS.xCircle} Withdraw
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </>
    )

    return null
}


/* ===============================================
   INSTITUTION VIEW
   =============================================== */
function InstitutionView({ tab, user }) {
    const [institution, setInstitution] = useState(null)
    const [pendingRequests, setPendingRequests] = useState([])  // incoming requests awaiting response
    const [connectedDoctors, setConnectedDoctors] = useState([])  // accepted via new system
    const [patientCounts, setPatientCounts] = useState({})
    const [loading, setLoading] = useState(true)
    const [respondingId, setRespondingId] = useState(null)
    const [viewingDoctorId, setViewingDoctorId] = useState(null)

    async function loadData() {
        const [{ data: inst }, { data: allReqs }] = await Promise.all([
            supabaseGeneSetu.from('evionex_institutions').select('*').eq('id', user.id).single(),
            supabaseGeneSetu.from('evionex_doctor_institution_requests')
                .select('*, evionex_doctors(id, doctor_id, specialization, experience_years, license_number, evionex_profiles(full_name))')
                .eq('institution_id', user.id)
                .order('created_at', { ascending: false }),
        ])
        setInstitution(inst)
        const reqs = allReqs || []
        setPendingRequests(reqs.filter(r => r.status === 'pending'))
        const accepted = reqs.filter(r => r.status === 'accepted')
        setConnectedDoctors(accepted)

        // Fetch patient counts for connected doctors
        const allDoctorIds = accepted.map(r => r.doctor_id).filter(Boolean)

        if (allDoctorIds.length > 0) {
            const { data: patRows } = await supabaseGeneSetu
                .from('evionex_doctor_patients')
                .select('doctor_id')
                .in('doctor_id', allDoctorIds)
            const counts = {}
                ; (patRows || []).forEach(row => {
                    counts[row.doctor_id] = (counts[row.doctor_id] || 0) + 1
                })
            setPatientCounts(counts)
        }
        setLoading(false)
    }

    useEffect(() => { loadData() }, [user.id])

    async function handleAcceptDoctor(req) {
        setRespondingId(req.id)
        try {
            await supabaseGeneSetu
                .from('evionex_doctor_institution_requests')
                .update({ status: 'accepted', responded_at: new Date().toISOString() })
                .eq('id', req.id)
            // Notify the doctor
            await supabaseGeneSetu.from('evionex_notifications').insert({
                user_id: req.doctor_id,
                type: 'connection_accepted',
                title: 'Institution Connection Accepted',
                message: `${institution?.name || 'An institution'} accepted your connection request.`,
                metadata: { institution_id: user.id, request_id: req.id },
            })
            await loadData()
        } catch (err) { console.error('Accept failed:', err) }
        setRespondingId(null)
    }

    async function handleRejectDoctor(req) {
        setRespondingId(req.id)
        try {
            await supabaseGeneSetu
                .from('evionex_doctor_institution_requests')
                .update({ status: 'rejected', responded_at: new Date().toISOString() })
                .eq('id', req.id)
            await supabaseGeneSetu.from('evionex_notifications').insert({
                user_id: req.doctor_id,
                type: 'connection_rejected',
                title: 'Institution Connection Declined',
                message: `${institution?.name || 'An institution'} declined your connection request.`,
                metadata: { institution_id: user.id, request_id: req.id },
            })
            await loadData()
        } catch (err) { console.error('Reject failed:', err) }
        setRespondingId(null)
    }

    if (loading) return <div className="loading-spinner"><div className="loading-spinner__ring" /></div>

    if (viewingDoctorId) {
        return <UserDetailView userId={viewingDoctorId} userType="partner" onBack={() => setViewingDoctorId(null)} />
    }

    const totalConnectedDoctors = connectedDoctors.length

    if (tab === 'overview') return (
        <>
            <div className="portal-main__header"><h1>Institution Dashboard</h1><p>Manage your institution and doctors</p></div>
            <div className="stats-row">
                <div className="stat-card"><div className="stat-card__icon stat-card__icon--cyan">{ICONS.institutions}</div><div className="stat-card__info"><h3>{institution?.institution_id || '—'}</h3><p>Institution ID</p></div></div>
                <div className="stat-card"><div className="stat-card__icon stat-card__icon--blue">{ICONS.doctors}</div><div className="stat-card__info"><h3>{totalConnectedDoctors}</h3><p>Connected Doctors</p></div></div>
                <div className="stat-card"><div className="stat-card__icon stat-card__icon--amber">{ICONS.mail}</div><div className="stat-card__info"><h3>{pendingRequests.length}</h3><p>Pending Requests</p></div></div>
                <div className="stat-card"><div className="stat-card__icon stat-card__icon--green">{ICONS.key}</div><div className="stat-card__info"><h3>{institution?.institution_code || '—'}</h3><p>Code</p></div></div>
            </div>
        </>
    )

    if (tab === 'profile') return (
        <>
            <div className="portal-main__header"><h1>Institution Details</h1><p>Your institution information</p></div>
            <div className="glass-card">
                <div className="glass-card__header"><h2>Details</h2></div>
                <div className="profile-grid">
                    <div className="form-group"><label className="form-label">Institution ID</label><input className="form-input" value={institution?.institution_id || ''} readOnly /></div>
                    <div className="form-group"><label className="form-label">Code</label><input className="form-input" value={institution?.institution_code || ''} readOnly /></div>
                    <div className="form-group"><label className="form-label">Name</label><input className="form-input" value={institution?.name || '—'} readOnly /></div>
                    <div className="form-group"><label className="form-label">Email</label><input className="form-input" value={institution?.email || 'Not set'} readOnly /></div>
                    <div className="form-group"><label className="form-label">Website</label><input className="form-input" value={institution?.website || 'Not set'} readOnly /></div>
                    <div className="form-group"><label className="form-label">Phone</label><input className="form-input" value={institution?.phone || 'Not set'} readOnly /></div>
                </div>
            </div>
        </>
    )

    if (tab === 'doctors') return (
        <>
            <div className="portal-main__header">
                <h1>Doctors</h1>
                <p>{totalConnectedDoctors} connected · {pendingRequests.length} pending requests</p>
            </div>

            {/* Incoming Connection Requests */}
            {pendingRequests.length > 0 && (
                <div className="glass-card" style={{ marginBottom: 'var(--space-xl)' }}>
                    <div className="glass-card__header"><h2>Connection Requests ({pendingRequests.length})</h2></div>
                    <div className="connection-requests-grid">
                        {pendingRequests.map(req => {
                            const doc = req.evionex_doctors
                            const patCount = patientCounts[req.doctor_id] || 0
                            return (
                                <div className="connection-request-card" key={req.id}>
                                    <div className="connection-request-card__info">
                                        <div className="connection-request-card__name">{doc?.evionex_profiles?.full_name || 'Unknown Doctor'}</div>
                                        <div className="connection-request-card__id"><span className="id-chip">{doc?.doctor_id}</span></div>
                                        <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)', marginTop: 'var(--space-xs)' }}>
                                            {doc?.specialization && <span style={{ textTransform: 'capitalize', marginRight: 'var(--space-sm)' }}>{doc.specialization}</span>}
                                            {doc?.experience_years && <span>{doc.experience_years} yrs exp</span>}
                                        </div>
                                        <div className="connection-request-card__date">
                                            <span style={{ color: 'var(--accent)' }}>{patCount} patient{patCount !== 1 ? 's' : ''} managed</span>
                                            &nbsp;·&nbsp;Requested {new Date(req.created_at).toLocaleDateString('en-IN')}
                                        </div>
                                    </div>
                                    <div className="connection-actions">
                                        <button className="btn btn--sm btn-primary connection-actions__accept" onClick={() => handleAcceptDoctor(req)} disabled={respondingId === req.id}>
                                            {respondingId === req.id ? '...' : <>{ICONS.check} Accept</>}
                                        </button>
                                        <button className="btn btn--sm btn--ghost connection-actions__reject" onClick={() => handleRejectDoctor(req)} disabled={respondingId === req.id}>
                                            {ICONS.xCircle} Decline
                                        </button>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                </div>
            )}

            {/* Connected Doctors */}
            <div className="glass-card glass-card--flush" style={{ marginBottom: 'var(--space-xl)' }}>
                <div className="glass-card__header" style={{ padding: 'var(--space-lg) var(--space-xl) 0' }}>
                    <h2>Connected Doctors ({connectedDoctors.length})</h2>
                </div>
                {connectedDoctors.length === 0 ? (
                    <div className="empty-state">
                        <div className="empty-state__icon">{ICONS.doctors}</div>
                        <h3 className="empty-state__title">No connected doctors</h3>
                        <p className="empty-state__text">Doctors will appear here once they send and you accept connection requests above.</p>
                    </div>
                ) : (
                    <table className="portal-table">
                        <thead><tr><th>Doctor ID</th><th>Name</th><th>Specialization</th><th>License</th><th>Experience</th><th>Patients</th><th></th></tr></thead>
                        <tbody>
                            {connectedDoctors.map(r => {
                                const doc = r.evionex_doctors
                                return (
                                    <tr key={r.id}>
                                        <td><span className="id-chip">{doc?.doctor_id}</span></td>
                                        <td>{doc?.evionex_profiles?.full_name || '—'}</td>
                                        <td style={{ textTransform: 'capitalize' }}>{doc?.specialization || '—'}</td>
                                        <td>{doc?.license_number || '—'}</td>
                                        <td>{doc?.experience_years ? `${doc.experience_years} yrs` : '—'}</td>
                                        <td><span className="status-badge status-badge--completed">{patientCounts[r.doctor_id] || 0} patients</span></td>
                                        <td><ActionMenu onViewMore={() => setViewingDoctorId(r.doctor_id)} /></td>
                                    </tr>
                                )
                            })}
                        </tbody>
                    </table>
                )}
            </div>
        </>
    )
    return null
}

/* ===============================================
   EMPLOYEE VIEW
   Personal portal — employees can view their
   company-assigned info (read-only) and manage
   their own personal details.
   =============================================== */
function EmployeeView({ tab, user, profile }) {
    const [employeeDetails, setEmployeeDetails] = useState(null)
    const [loading, setLoading] = useState(true)
    const [editMode, setEditMode] = useState(false)
    const [saving, setSaving] = useState(false)
    const [saved, setSaved] = useState(false)
    const [showPasswordChange, setShowPasswordChange] = useState(false)
    const [form, setForm] = useState({ aadhaar_encrypted: '', pan_encrypted: '', phone: '', personal_email: '' })
    const [passwordForm, setPasswordForm] = useState({ newPassword: '', confirmPassword: '' })
    const [changingPassword, setChangingPassword] = useState(false)
    const [passwordError, setPasswordError] = useState('')
    const [passwordSuccess, setPasswordSuccess] = useState('')

    async function loadDetails() {
        const { data } = await supabaseGeneSetu
            .from('evionex_employees')
            .select('*')
            .eq('id', user.id)
            .single()
        setEmployeeDetails(data)
        if (data) {
            setForm({
                aadhaar_encrypted: data.aadhaar_encrypted || '',
                pan_encrypted: data.pan_encrypted || '',
                phone: data.phone || '',
                personal_email: data.personal_email || '',
            })
        }
        setLoading(false)
    }

    useEffect(() => { loadDetails() }, [user.id])

    /* Require password change when no details row exists yet (brand-new employee)
       OR when first_login_complete is explicitly false (row exists but password not changed yet) */
    const requiresPasswordChange = !employeeDetails || !employeeDetails.first_login_complete

    async function handleSave() {
        setSaving(true); setSaved(false)
        await supabaseGeneSetu.from('evionex_employees').update({
            aadhaar_encrypted: form.aadhaar_encrypted || null,
            pan_encrypted: form.pan_encrypted || null,
            phone: form.phone || null,
            personal_email: form.personal_email || null,
        }).eq('id', user.id)
        setSaving(false); setSaved(true); setEditMode(false)
        setTimeout(() => setSaved(false), 3000)
    }

    async function handlePasswordChange() {
        setPasswordError(''); setPasswordSuccess(''); setChangingPassword(true)
        if (passwordForm.newPassword.length < 8) {
            setPasswordError('Password must be at least 8 characters.')
            setChangingPassword(false); return
        }
        if (passwordForm.newPassword !== passwordForm.confirmPassword) {
            setPasswordError('Passwords do not match.')
            setChangingPassword(false); return
        }
        const { error } = await supabaseGeneSetu.auth.updateUser({ password: passwordForm.newPassword })
        if (error) {
            setPasswordError(error.message)
        } else {
            // Mark first login complete — password has been changed once
            await supabaseGeneSetu.from('evionex_employees').update({
                first_login_complete: true,
            }).eq('id', user.id)
            setEmployeeDetails(prev => ({ ...(prev || {}), first_login_complete: true }))
            setPasswordSuccess('Password changed successfully!')
            setPasswordForm({ newPassword: '', confirmPassword: '' })
            setTimeout(() => { setShowPasswordChange(false); setPasswordSuccess('') }, 1500)
        }
        setChangingPassword(false)
    }

    if (loading) return <div className="loading-spinner"><div className="loading-spinner__ring" /></div>

    /* ---- First-login: force password change before anything else ---- */
    if (requiresPasswordChange || showPasswordChange) {
        return (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '70vh' }}>
                <div className="glass-card" style={{ maxWidth: 460, width: '100%' }}>
                    <div className="glass-card__header" style={{ flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: 'var(--space-sm)' }}>
                        <div style={{ color: 'var(--accent)' }}>{ICONS.lock}</div>
                        <h2 style={{ marginTop: 'var(--space-xs)' }}>
                            {requiresPasswordChange ? 'Welcome to Evionex!' : 'Change Password'}
                        </h2>
                        {requiresPasswordChange && (
                            <p style={{ color: 'var(--text-muted)', fontSize: 'var(--text-sm)', margin: 0 }}>
                                A temporary password was set for you. Please create a new password to continue.<br />
                                <strong>This can only be done once.</strong>
                            </p>
                        )}
                    </div>
                    {passwordError && <div className="auth-error" style={{ marginBottom: 'var(--space-md)' }}>{passwordError}</div>}
                    {passwordSuccess && <div className="auth-success" style={{ marginBottom: 'var(--space-md)' }}>{passwordSuccess}</div>}
                    <div className="profile-grid" style={{ paddingTop: 'var(--space-md)' }}>
                        <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                            <label className="form-label">New Password</label>
                            <input
                                className="form-input"
                                type="password"
                                value={passwordForm.newPassword}
                                onChange={e => setPasswordForm(f => ({ ...f, newPassword: e.target.value }))}
                                placeholder="Minimum 8 characters"
                                minLength={8}
                            />
                        </div>
                        <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                            <label className="form-label">Confirm Password</label>
                            <input
                                className="form-input"
                                type="password"
                                value={passwordForm.confirmPassword}
                                onChange={e => setPasswordForm(f => ({ ...f, confirmPassword: e.target.value }))}
                                placeholder="Re-enter your password"
                            />
                        </div>
                    </div>
                    <div className="profile-actions">
                        {!requiresPasswordChange && (
                            <button className="btn btn--sm btn--ghost" onClick={() => setShowPasswordChange(false)}>Cancel</button>
                        )}
                        <button className="btn btn--sm btn-primary" onClick={handlePasswordChange} disabled={changingPassword}>
                            {changingPassword ? 'Setting...' : 'Set New Password'}
                        </button>
                    </div>
                </div>
            </div>
        )
    }

    const employmentLabel = profile.sub_role === 'intern' ? 'Intern' : 'Full-Time Employee'

    /* ---- Overview ---- */
    if (tab === 'overview') return (
        <>
            <div className="portal-main__header">
                <h1>Welcome, {profile.full_name || 'Employee'}</h1>
                <p>Your Evionex employee portal</p>
            </div>
            <div className="stats-row">
                <div className="stat-card">
                    <div className="stat-card__icon stat-card__icon--blue">{ICONS.briefcase}</div>
                    <div className="stat-card__info"><h3 style={{ fontSize: 'var(--text-base)' }}>{employmentLabel}</h3><p>Employment Type</p></div>
                </div>
                <div className="stat-card">
                    <div className="stat-card__icon stat-card__icon--purple">{ICONS.users}</div>
                    <div className="stat-card__info"><h3 style={{ fontSize: 'var(--text-base)' }}>{employeeDetails?.department || '—'}</h3><p>Department</p></div>
                </div>
            </div>
            <div className="glass-card">
                <div className="glass-card__header"><h2>Your Details</h2></div>
                <div className="profile-grid">
                    <div className="form-group"><label className="form-label">Full Name</label><input className="form-input" value={profile.full_name || ''} readOnly /></div>
                    <div className="form-group"><label className="form-label">Work Email</label><input className="form-input" value={user.email || ''} readOnly /></div>
                    <div className="form-group"><label className="form-label">Phone</label><input className="form-input" value={employeeDetails?.phone || 'Not set'} readOnly /></div>
                    <div className="form-group"><label className="form-label">Personal Email</label><input className="form-input" value={employeeDetails?.personal_email || 'Not set'} readOnly /></div>
                </div>
            </div>
        </>
    )

    /* ---- Profile ---- */
    if (tab === 'profile') return (
        <>
            <div className="portal-main__header"><h1>My Profile</h1><p>View and manage your details</p></div>

            {/* Company Information — read-only, admin-controlled */}
            <div className="glass-card" style={{ marginBottom: 'var(--space-xl)' }}>
                <div className="glass-card__header">
                    <h2>Company Information</h2>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-xs)', color: 'var(--text-muted)', fontSize: 'var(--text-xs)' }}>
                        {ICONS.lock} <span>Managed by Admin</span>
                    </div>
                </div>
                <div className="profile-grid">
                    <div className="form-group">
                        <label className="form-label">Full Name</label>
                        <input className="form-input" value={profile.full_name || ''} readOnly />
                    </div>
                    <div className="form-group">
                        <label className="form-label">Work Email</label>
                        <input className="form-input" value={user.email || ''} readOnly />
                    </div>
                    <div className="form-group">
                        <label className="form-label">Department</label>
                        <input className="form-input" value={employeeDetails?.department || '—'} readOnly />
                    </div>
                    <div className="form-group">
                        <label className="form-label">Employment Type</label>
                        <input className="form-input" value={employmentLabel} readOnly />
                    </div>
                </div>
            </div>

            {/* Personal Details — editable by the employee */}
            <div className="glass-card" style={{ marginBottom: 'var(--space-xl)' }}>
                <div className="glass-card__header">
                    <h2>Personal Details</h2>
                    {!editMode ? (
                        <button className="btn btn--sm btn-secondary" onClick={() => setEditMode(true)}>{ICONS.edit} Edit</button>
                    ) : saved ? (
                        <span className="save-indicator">{ICONS.check} Saved</span>
                    ) : null}
                </div>
                <div className="profile-grid">
                    <div className="form-group">
                        <label className="form-label">Phone Number</label>
                        <input
                            className="form-input"
                            value={form.phone}
                            readOnly={!editMode}
                            onChange={e => setForm(f => ({ ...f, phone: e.target.value }))}
                            placeholder={editMode ? '+91 XXXXXXXXXX' : 'Not set'}
                        />
                    </div>
                    <div className="form-group">
                        <label className="form-label">Personal Email</label>
                        <input
                            className="form-input"
                            type={editMode ? 'email' : 'text'}
                            value={form.personal_email}
                            readOnly={!editMode}
                            onChange={e => setForm(f => ({ ...f, personal_email: e.target.value }))}
                            placeholder={editMode ? 'your@personal.com' : 'Not set'}
                        />
                    </div>
                    <div className="form-group">
                        <label className="form-label">Aadhaar Card Number</label>
                        <input
                            className="form-input"
                            value={form.aadhaar_encrypted}
                            readOnly={!editMode}
                            onChange={e => setForm(f => ({ ...f, aadhaar_encrypted: e.target.value }))}
                            placeholder={editMode ? 'XXXX XXXX XXXX' : 'Not set'}
                            maxLength={14}
                        />
                    </div>
                    <div className="form-group">
                        <label className="form-label">PAN Card Number</label>
                        <input
                            className="form-input"
                            value={form.pan_encrypted}
                            readOnly={!editMode}
                            onChange={e => setForm(f => ({ ...f, pan_encrypted: e.target.value.toUpperCase() }))}
                            placeholder={editMode ? 'ABCDE1234F' : 'Not set'}
                            maxLength={10}
                            style={{ textTransform: form.pan_encrypted ? 'uppercase' : 'none' }}
                        />
                    </div>
                </div>
                {editMode && (
                    <div className="profile-actions">
                        <button className="btn btn--sm btn--ghost" onClick={() => setEditMode(false)}>Cancel</button>
                        <button className="btn btn--sm btn-primary" onClick={handleSave} disabled={saving}>
                            {saving ? 'Saving...' : 'Save Changes'}
                        </button>
                    </div>
                )}
            </div>
        </>
    )

    return null
}