import { useState } from 'react'
import { supabase } from '../lib/supabaseClient'
import usePageMetadata from '../lib/usePageMetadata'
import doctorBg from '../assets/images/company/doctor-handshake.jpg'
import './Contact.css'

export default function Contact() {
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        designation: '',
        phone: '',
        interest: '',
        message: '',
    })
    const [submitStatus, setSubmitStatus] = useState({ loading: false, error: null, success: false })
    const defaultOgImage = new URL('../assets/images/logo/evionex-logo.png', import.meta.url).href

    usePageMetadata({
        title: 'Contact Evionex — Partnerships, Demos, Support',
        description: 'Get in touch with Evionex for product demos, partnerships, or support across Gene Setu, EviNote, and Luminary.',
        canonicalPath: '/contact',
        image: defaultOgImage,
    })

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value })
    }

    const handleSubmit = async (e) => {
        e.preventDefault()

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!formData.email || !emailRegex.test(formData.email)) {
            alert('Please enter a valid e-mail');
            return;
        }

        const phoneRegex = /^\+?[0-9\s\-()]{7,15}$/;
        if (!formData.phone || !phoneRegex.test(formData.phone)) {
            alert('Please enter a valid phone number');
            return;
        }

        if (!formData.message || formData.message.trim() === '') {
            alert('Please enter a message');
            return;
        }

        if (formData.message.length > 200) {
            alert('Message cannot exceed 200 characters');
            return;
        }

        setSubmitStatus({ loading: true, error: null, success: false })

        try {
            // Save to Supabase
            const { error: dbError } = await supabase
                .from('contact_messages')
                .insert([
                    {
                        first_name: formData.firstName.trim(),
                        last_name: formData.lastName.trim(),
                        email: formData.email.trim(),
                        designation: formData.designation.trim(), // Kept existing field
                        phone_number: formData.phone.trim(),     // Kept existing field
                        interest: formData.interest.trim(),       // Kept existing field
                        message: formData.message.trim(),
                    }
                ])

            if (dbError) throw dbError

            // Send Email Notification via Edge Function
            const { error: fnError } = await supabase.functions.invoke('process-contact', {
                body: {
                    firstName: formData.firstName.trim(),
                    lastName: formData.lastName.trim(),
                    email: formData.email.trim(),
                    designation: formData.designation.trim(), // Kept existing field
                    phone: formData.phone.trim(),             // Kept existing field
                    interest: formData.interest.trim(),       // Kept existing field
                    message: formData.message.trim(),
                }
            })

            if (fnError) {
                console.error("Email sending failed:", fnError);
                // We won't throw because the message was saved successfully.
                // But in a stricter system, you could alert the user.
            }

            setSubmitStatus({ loading: false, error: null, success: true })
            setFormData({
                firstName: '',
                lastName: '',
                email: '',
                designation: '',
                phone: '',
                interest: '',
                message: '',
            })
            setTimeout(() => setSubmitStatus({ loading: false, error: null, success: false }), 4000)
        } catch (error) {
            console.error('Error submitting form:', error)
            setSubmitStatus({ loading: false, error: 'Failed to send message. Please try again later.', success: false })
        }
    }

    return (
        <div className="contact-page">
            <section className="contact-hero">
                <div className="contact-hero__bg" style={{ backgroundImage: `url(${doctorBg})` }}></div>
                <div className="contact-hero__overlay"></div>
                <div className="container">
                    <div className="section-header animate-fade-in-up">
                        <span className="tag">Contact Us</span>
                        <h1>Get in <span className="text-gradient">Touch</span></h1>
                        <p>We'd love to hear from you. Let's discuss how Evionex can transform your life.</p>
                    </div>
                </div>
            </section>

            <section className="section">
                <div className="container">
                    <div className="contact-grid">
                        {/* Contact Info */}
                        <div className="contact-info animate-fade-in-up">
                            <div className="contact-info__card">
                                <div className="contact-info__item">
                                    <div className="feature-icon">📍</div>
                                    <div>
                                        <h4>Registered Office</h4>
                                        <p>Evionex Private Limited<br />Pune, Maharashtra, India</p>
                                    </div>
                                </div>

                                <div className="contact-info__item">
                                    <div className="feature-icon">✉️</div>
                                    <div>
                                        <h4>Email</h4>
                                        <a href="mailto:evionex.info@gmail.com">evionex.info@gmail.com</a>
                                    </div>
                                </div>

                                <div className="contact-info__item">
                                    <div className="feature-icon">🕐</div>
                                    <div>
                                        <h4>Business Hours</h4>
                                        <p>Monday – Friday<br />9:00 AM – 6:00 PM IST</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Contact Form */}
                        <div className="contact-form-wrapper animate-fade-in-up animate-delay-2">
                            <form className="contact-form" onSubmit={handleSubmit}>
                                <div className="form-row">
                                    <div className="form-group">
                                        <label className="form-label" htmlFor="firstName">First Name</label>
                                        <input
                                            className="form-input"
                                            type="text"
                                            id="firstName"
                                            name="firstName"
                                            value={formData.firstName}
                                            onChange={handleChange}
                                            placeholder="Your First Name"
                                            required
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label className="form-label" htmlFor="lastName">Last Name</label>
                                        <input
                                            className="form-input"
                                            type="text"
                                            id="lastName"
                                            name="lastName"
                                            value={formData.lastName}
                                            onChange={handleChange}
                                            placeholder="Your Surname"
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="form-group">
                                    <label className="form-label" htmlFor="email">Email Address</label>
                                    <input
                                        className="form-input"
                                        type="text"
                                        id="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        placeholder="Please enter your Email Address"
                                    />
                                </div>

                                <div className="form-row">
                                    <div className="form-group">
                                        <label className="form-label" htmlFor="designation">Designation</label>
                                        <input
                                            className="form-input"
                                            type="text"
                                            id="designation"
                                            name="designation"
                                            value={formData.designation}
                                            onChange={handleChange}
                                            placeholder="Parent, Director, Teacher, etc."
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label className="form-label" htmlFor="phone">Phone No.</label>
                                        <input
                                            className="form-input"
                                            type="tel"
                                            id="phone"
                                            name="phone"
                                            value={formData.phone}
                                            onChange={handleChange}
                                            placeholder="Enter your Phone Number"
                                        />
                                    </div>
                                </div>

                                <div className="form-group">
                                    <label className="form-label" htmlFor="interest">I'm Interested In</label>
                                    <select
                                        className="form-select"
                                        id="interest"
                                        name="interest"
                                        value={formData.interest}
                                        onChange={handleChange}
                                        required
                                    >
                                        <option value="" disabled>Select an option</option>
                                        <option value="evinote">EviNote – Research Solution</option>
                                        <option value="luminary">Luminary – Education Solution</option>
                                        <option value="genesetu">Gene Setu – Healthcare Solution</option>
                                        <option value="partnership">Partnership / Other</option>
                                    </select>
                                </div>

                                <div className="form-group">
                                    <label className="form-label" htmlFor="message">Message</label>
                                    <textarea
                                        className="form-textarea"
                                        id="message"
                                        name="message"
                                        value={formData.message}
                                        onChange={handleChange}
                                        placeholder="Tell us about your needs and how we can help..."
                                        maxLength={200}
                                    ></textarea>
                                    <div style={{ textAlign: 'right', fontSize: '0.875rem', color: '#666', marginTop: '4px' }}>
                                        {formData.message.length}/200
                                    </div>
                                </div>

                                <button type="submit" className="btn btn-primary btn-large" style={{ width: '100%' }} disabled={submitStatus.loading}>
                                    {submitStatus.loading ? 'Sending...' : submitStatus.success ? '✓ Message Sent!' : 'Send Message'}
                                </button>
                                {submitStatus.error && (
                                    <p className="error-message" style={{ color: '#ef4444', marginTop: '10px', textAlign: 'center', fontSize: '0.875rem' }}>
                                        {submitStatus.error}
                                    </p>
                                )}
                            </form>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    )
}
