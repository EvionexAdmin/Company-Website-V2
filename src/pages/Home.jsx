import { Link } from 'react-router-dom'
import { useEffect, useRef } from 'react'
import GradientText from '../components/ui/GradientText/GradientText'
import usePageMetadata from '../lib/usePageMetadata'
import './Home.css'

export default function Home() {
    const homeRef = useRef(null)
    const defaultOgImage = new URL('../assets/images/logo/evionex-logo.png', import.meta.url).href

    usePageMetadata({
        title: 'Evionex — Transforming Research, Education & Healthcare with AI',
        description: 'Evionex builds AI-powered platforms for research labs (EviNote), universities (Luminary), and healthcare facilities (Gene Setu). Headquartered in India and serving institutions globally.',
        canonicalPath: '/',
        image: defaultOgImage,
    })

    useEffect(() => {
        const homeElement = homeRef.current
        if (!homeElement) return

        let frameRequested = false

        const updateVideoState = () => {
            frameRequested = false

            const scrollTop = window.scrollY || window.pageYOffset || 0
            const scrollRange = Math.max(window.innerHeight * 1.2, 1)
            const blurProgress = Math.min(scrollTop / scrollRange, 1)
            const blurAmount = blurProgress * 14

            const footer = document.querySelector('.footer')
            let footerPush = 0

            if (footer) {
                const footerTop = footer.getBoundingClientRect().top
                footerPush = Math.min(Math.max(window.innerHeight - footerTop, 0), window.innerHeight)
            }

            homeElement.style.setProperty('--home-video-blur', `${blurAmount.toFixed(2)}px`)
            homeElement.style.setProperty('--home-video-offset-y', `-${footerPush.toFixed(2)}px`)
        }

        const handleViewportChange = () => {
            if (frameRequested) return
            frameRequested = true
            requestAnimationFrame(updateVideoState)
        }

        window.addEventListener('scroll', handleViewportChange, { passive: true })
        window.addEventListener('resize', handleViewportChange)
        updateVideoState()

        return () => {
            window.removeEventListener('scroll', handleViewportChange)
            window.removeEventListener('resize', handleViewportChange)
        }
    }, [])

    return (
        <div className="home" ref={homeRef}>
            <div className="home__video-shell" aria-hidden="true">
                <video
                    autoPlay
                    loop
                    muted
                    playsInline
                    preload="none"
                    className="home__video"
                >
                    <source src="/DNA Hero bg.mp4" type="video/mp4" />
                </video>
                <div className="home__video-overlay"></div>
            </div>

            <div className="home__content-layer">
                {/* Hero Section */}
                <section className="hero">
                    <div className="hero__bg-glow"></div>
                    <div className="container hero__container">
                        <div className="hero__content">
                            <h1 className="hero-display hero__headline">
                                <span className="hero-transforming">Transforming</span>
                                <GradientText
                                    colors={['#FFFFFF', '#F5F8FF', '#FFFFFF', '#EEF4FF']}
                                    animationSpeed={4}
                                    className="hero-gradient-text hero-headline-line-two"
                                >
                                    Research, Education & Healthcare
                                </GradientText>
                            </h1>
                            <p className="hero__subtitle hero__subtitle--intro">
                                Strengthening Research, Accelerating Education and Securing Families in the era of Artificial Intelligence.
                            </p>
                            <div className="btn-group" style={{ marginBottom: '3rem' }}>
                                <Link to="/products" className="btn btn-primary btn-large hero-cta-primary">
                                    Explore Our Products
                                    <span className="btn-arrow">→</span>
                                </Link>
                                <Link to="/contact" className="btn btn-secondary btn-large hero-cta-secondary">
                                    Partner With Us
                                </Link>
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
        </div>
    )
}
