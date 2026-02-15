import { useState } from 'react'
import './Contact.css'

export default function Contact() {
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        interest: '',
        message: '',
    })
    const [submitted, setSubmitted] = useState(false)

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value })
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        // Form submission logic will be added later
        console.log('Form submitted:', formData)
        setSubmitted(true)
        setTimeout(() => setSubmitted(false), 4000)
    }

    return (
        <div className="contact-page">
            <section className="page-hero">
                <div className="container">
                    <div className="section-header animate-fade-in-up">
                        <span className="tag">Contact Us</span>
                        <h1>Get in <span className="text-gradient">Touch</span></h1>
                        <p>We'd love to hear from you. Let's discuss how Evionex can transform your institution.</p>
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
                                        <p>Evionex Private Limited<br />Mumbai, Maharashtra, India</p>
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
                                            placeholder="John"
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
                                            placeholder="Doe"
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="form-group">
                                    <label className="form-label" htmlFor="email">Email Address</label>
                                    <input
                                        className="form-input"
                                        type="email"
                                        id="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        placeholder="john@institution.com"
                                        required
                                    />
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
                                        placeholder="Tell us about your institution and how we can help..."
                                        required
                                    ></textarea>
                                </div>

                                <button type="submit" className="btn btn-primary btn-large" style={{ width: '100%' }}>
                                    {submitted ? '✓ Message Sent!' : 'Send Message'}
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    )
}
