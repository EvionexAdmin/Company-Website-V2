import { Link } from 'react-router-dom'
import './Careers.css'

export default function Careers() {
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
                                <a href="mailto:evionex.info@gmail.com" className="btn btn-primary btn-large">
                                    Send Us Your Resume
                                    <span className="btn-arrow">→</span>
                                </a>
                                <Link to="/contact" className="btn btn-secondary btn-large">
                                    Contact Us
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    )
}
