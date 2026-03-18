import { Link } from 'react-router-dom'
import GradientText from '../components/ui/GradientText/GradientText'
import StarBorder from '../components/ui/StarBorder/StarBorder'
import Orb from '../components/ui/Orb/Orb'
import './Home.css'

export default function Home() {
    return (
        <div className="home">
            {/* Hero Section */}
            <section className="hero">
                <div className="hero__video-bg">
                    <video
                        autoPlay
                        loop
                        muted
                        playsInline
                        className="hero__video"
                    >
                        <source src="/hero-bg.mp4" type="video/mp4" />
                    </video>
                    <div className="hero__video-overlay"></div>
                </div>
                <div className="hero__bg-glow"></div>
                <div className="container hero__container">
                    <div className="hero__content animate-fade-in-up">
                        <h1 className="hero-display">
                            Transforming<br />
                            <GradientText
                                colors={['#00D4C8', '#1FC7BE', '#00E5D4', '#00D4C8']}
                                animationSpeed={4}
                                className="hero-gradient-text"
                            >
                                Research, Education & Healthcare
                            </GradientText>
                        </h1>
                        <p className="hero__subtitle">
                            Strengthening Research, Accelerating Education and Securing Families in the era of Artificial Intelligence.
                        </p>
                        <div className="btn-group" style={{ marginBottom: '3rem' }}>
                            <StarBorder as="div" color="#00D4C8" speed="5s" className="star-cta-wrapper">
                                <Link to="/products" className="btn btn-primary btn-large star-btn">
                                    Explore Our Products
                                    <span className="btn-arrow">→</span>
                                </Link>
                            </StarBorder>
                            <Link to="/contact" className="btn btn-secondary btn-large">
                                Partner With Us
                            </Link>
                        </div>
                    </div>
                    <div className="hero__visual animate-fade-in-up animate-delay-2">
                        <div className="hero__orb-wrapper">
                            <Orb
                                hue={0}
                                hoverIntensity={0.25}
                                rotateOnHover={true}
                                forceHoverState={false}
                                backgroundColor="#0a1628"
                            />
                        </div>
                    </div>
                </div>
            </section>

            {/* Advantage Section */}
            <section className="section advantage">
                <div className="container">
                    <div className="section-header animate-fade-in-up">
                        <span className="tag">Why Evionex</span>
                        <h2>The Evionex <span className="text-gradient">Advantage</span></h2>
                        <p>Bringing state-of-the-art solutions to your life</p>
                    </div>

                    <div className="grid-3">
                        {[
                            {
                                icon: '🧠',
                                title: 'AI-Powered Insights',
                                description: 'Leverage advanced artificial intelligence to extract actionable insights from complex research data, accelerating discovery and innovation.'
                            },
                            {
                                icon: '🛡️',
                                title: 'Regulatory Compliance',
                                description: 'Stay ahead with built-in compliance frameworks designed for Indian regulatory standards, ensuring your institution meets all requirements effortlessly.'
                            },
                            {
                                icon: '⚡',
                                title: 'Unified Management',
                                description: 'Streamline operations with a single platform that integrates lab management, learning tools, and health records into one cohesive ecosystem.'
                            }
                        ].map((item, i) => (
                            <div key={i} className={`card advantage__card animate-fade-in-up animate-delay-${i + 1}`}>
                                <div className="feature-icon">{item.icon}</div>
                                <h3>{item.title}</h3>
                                <p>{item.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Products Preview */}
            <section className="section products-preview">
                <div className="container">
                    <div className="section-header animate-fade-in-up">
                        <span className="tag">Our Solutions</span>
                        <h2>Products Built for <span className="text-gradient">Impact</span></h2>
                        <p>Three powerful platforms addressing research, education, and healthcare</p>
                    </div>

                    <div className="grid-3">
                        {[
                            {
                                name: 'EviNote',
                                type: 'Research Solution',
                                description: 'Not your ordinary ELN, EviNote is a complete end-to-end Laboratory Management Platform with the power of Artificial Intelligence.',
                                color: '#00D4C8'
                            },
                            {
                                name: 'Luminary',
                                type: 'Education Solution',
                                description: 'World\'s first AI-powered Learning Enhancement System (AILES), built in India for universities everywhere.',
                                color: '#ffae00'
                            },
                            {
                                name: 'Gene Setu',
                                type: 'Healthcare Solution',
                                description: '6000+ Diseases, Nutrigenomic and Pharmacogenomic Profile, all through a single test, and that\'s just the beginning.',
                                color: '#00bafd'
                            }
                        ].map((product, i) => (
                            <div key={i} className="card product-preview__card">
                                <div className="product-preview__badge" style={{ color: product.color, borderColor: product.color + '40', background: product.color + '15' }}>
                                    {product.type}
                                </div>
                                <h3>{product.name}</h3>
                                <p>{product.description}</p>
                                <Link to="/products" className="product-preview__link" style={{ color: product.color }}>
                                    Learn more →
                                </Link>
                            </div>
                        ))}
                    </div>

                    <div className="products-preview__cta animate-fade-in-up">
                        <Link to="/pricing" className="btn btn-primary btn-large">View Pricing Plans</Link>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="section cta-section">
                <div className="container">
                    <div className="cta-box">
                        <h2>Ready to Transform Your Life?</h2>
                        <p>Partner with Evionex and experience the future of research, education, and healthcare technology.</p>
                        <div className="btn-group" style={{ justifyContent: 'center' }}>
                            <Link to="/contact" className="btn btn-primary btn-large">Get Started Today</Link>
                            <Link to="/who-we-are" className="btn btn-secondary btn-large">Learn About Us</Link>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    )
}
