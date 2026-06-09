import { useState, useRef } from 'react'
import { Link } from 'react-router-dom'
import evinoteMockup from '../assets/images/products/evinote-mockup.png'
import defaultBg from '../assets/images/auth/login-background.webp'
import usePageMetadata from '../lib/usePageMetadata'
import './ProductDetail.css'

const accentColor = '#00D4C8'

const overview = [
    {
        icon: '📓',
        title: 'What is EviNote?',
        text: 'EviNote is a comprehensive Electronic Lab Notebook (ELN) platform built for modern research institutions. It digitizes every aspect of laboratory workflows — from experiment documentation and data management to resource scheduling, budgeting, and team collaboration — all within a single, secure ecosystem designed for scientific rigor.'
    },
    {
        icon: '💡',
        title: 'Why did we build EviNote?',
        text: 'Indian research institutions manage thousands of experiments annually, yet most still rely on paper notebooks and fragmented tools. Data loss, compliance issues, and collaboration bottlenecks slow down discovery. We built EviNote to give researchers a modern, integrated platform that ensures reproducibility, simplifies administration, and lets scientists focus on what matters — breakthrough research.'
    },
    {
        icon: '🔬',
        title: 'Who is it for?',
        text: 'EviNote serves university research departments, government labs (CSIR, ICAR, DBT-funded institutes), pharmaceutical R&D teams, biotech startups, and private research organizations. It is built for principal investigators, research scholars, lab managers, and institutional administrators who need a unified platform for managing complex research operations.'
    },
    {
        icon: '🌍',
        title: 'Total Addressable Market',
        text: 'The global Electronic Lab Notebook market is valued at ₹590 million and is projected to exceed ₹1.3 billion by 2030, growing at 11% CAGR. India\'s research infrastructure is expanding rapidly — with over 1,000 universities and 3,000+ research labs, the domestic digital research tools market is poised for significant growth as institutions modernize under the National Education Policy and National Research Foundation initiatives.'
    },
]

const features = [
    { title: 'Electronic Lab Notebook', desc: 'Document every experiment with rich-text editing, embedded media, structured templates, and full version history. EviNote\'s ELN captures protocols, observations, results, and conclusions in a searchable, auditable format — replacing paper notebooks with a system built for reproducibility, compliance, and collaboration across research teams.', media: { src: '/media/evinote/electronic-lab-notebook.mp4', type: 'video' } },
    { title: 'Scientific Illustrator', desc: 'Create publication-ready scientific diagrams, molecular structures, lab schematics, and data visualizations directly inside EviNote. The built-in illustrator provides templates for charts, flowcharts, apparatus diagrams, and more — eliminating the need for external design tools and keeping all assets linked to their experiments.', media: { src: '/media/evinote/scientific-illustrator.mp4', type: 'video' } },
    { title: 'Resource Management', desc: 'Track equipment availability, schedule instrument sessions, manage consumable inventory, and monitor maintenance cycles. EviNote provides a centralized resource management dashboard that prevents double-bookings, reduces equipment downtime, and ensures every team member has visibility into shared lab resources.', media: { src: '/media/evinote/equipment-management.mp4', type: 'video' } },
    { title: 'Lab Duties', desc: 'Assign, track, and manage lab responsibilities across team members with clear ownership and deadlines. From routine maintenance tasks to safety checks and sample processing schedules, the Lab Duties module ensures accountability and keeps your lab running smoothly without manual coordination overhead.', media: { src: '/media/evinote/lab-duties.mp4', type: 'video' } },
    { title: 'Budget Tracking', desc: 'Monitor research grant allocations, track expenditures, and forecast budget utilization in real time. EviNote breaks down spending by project, grant, category, and team member — providing principal investigators and administrators with financial clarity and helping institutions maintain compliance with funding agency requirements.', media: { src: '/media/evinote/budget-tracking.mp4', type: 'video' } },
    { title: 'Project Tracker', desc: 'Stay updated with a bird\'s-eye view of every research project\'s progress. Track milestones, deliverables, team contributions, and timelines in one dashboard. The Project Tracker integrates with ELN entries and resource bookings so you always know where a project stands — from initial proposal to publication.', media: { src: '/media/evinote/project-tracker.mp4', type: 'video' } },
]

const eviNoteOgImage = new URL('../assets/images/products/evinote-icon.png', import.meta.url).href

const eviNoteProductLd = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'EviNote',
    applicationCategory: 'BusinessApplication',
    operatingSystem: 'Web',
    url: 'https://www.evionex.com/products/evinote',
    image: eviNoteOgImage,
    description: 'Comprehensive electronic lab notebook with resource scheduling, budget tracking, and collaboration for research institutions.',
    offers: {
        '@type': 'Offer',
        price: '700',
        priceCurrency: 'INR',
        priceSpecification: {
            '@type': 'UnitPriceSpecification',
            price: '700',
            priceCurrency: 'INR',
            unitText: 'per user per month',
        },
        url: 'https://www.evionex.com/products/evinote',
    },
    brand: {
        '@type': 'Brand',
        name: 'Evionex',
    },
}

export default function EviNoteDetail() {
    const [hoveredFeature, setHoveredFeature] = useState(null)
    const progressRef = useRef(null)
    usePageMetadata({
        title: 'EviNote — Electronic Lab Notebook & Lab Management | Evionex',
        description: 'Digitize research workflows with EviNote: ELN, scientific illustrator, resource scheduling, budget tracking, and project management for modern labs.',
        canonicalPath: '/products/evinote',
        image: eviNoteOgImage,
        ogType: 'product',
        jsonLd: [eviNoteProductLd],
    })

    return (
        <div className="product-detail">
            {/* Hero */}
            <section className="product-detail__hero">
                <div className="product-detail__hero-bg" style={{ backgroundImage: `url(${evinoteMockup})` }}></div>
                <div className="product-detail__hero-overlay"></div>
                <div className="container" style={{ textAlign: 'center' }}>
                    <h1 className="product-detail__hero-title">EviNote</h1>
                    <span className="product-detail__hero-type" style={{ color: accentColor, borderColor: accentColor + '40', background: accentColor + '15', border: `1px solid ${accentColor}40` }}>
                        Research Solution
                    </span>
                    <p className="product-detail__hero-desc">
                        A comprehensive electronic lab notebook solution designed to streamline research workflows, manage lab resources, and ensure data security across your entire research organization.
                    </p>
                </div>
            </section>

            {/* Overview */}
            <section className="product-detail__overview">
                <div className="container">
                    <div className="section-header" style={{ textAlign: 'center', marginBottom: '2rem' }}>
                        <h2 style={{ fontSize: '2.2rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                            About <span style={{ color: accentColor }}>EviNote</span>
                        </h2>
                    </div>
                    <div className="product-detail__overview-grid">
                        {overview.map((item, i) => (
                            <div key={i} className="product-detail__overview-card">
                                <span className="product-detail__overview-icon">{item.icon}</span>
                                <h3>{item.title}</h3>
                                <p>{item.text}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Features */}
            <section className="product-detail__features">
                <div className="container">
                    <h2 className="product-detail__features-title">
                        Powerful <span style={{ color: accentColor }}>Features</span>
                    </h2>
                    
                    {/* Desktop Version */}
                    <div className="accordion-features-desktop accordion-features__container">
                        <div className="accordion-features__media" style={{ borderColor: accentColor + '20' }}>
                                {hoveredFeature !== null && features[hoveredFeature].media.type === 'video' ? (
                                    <>
                                        <video
                                            key={hoveredFeature}
                                            className="accordion-features__video"
                                            autoPlay
                                            loop
                                            muted
                                            playsInline
                                            preload="metadata"
                                            onTimeUpdate={(e) => {
                                                if (progressRef.current) {
                                                    const progress = (e.target.currentTime / e.target.duration) * 100;
                                                    progressRef.current.style.width = `${progress}%`;
                                                }
                                            }}
                                        >
                                            <source src={features[hoveredFeature].media.src} type="video/mp4" />
                                        </video>
                                        <div className="accordion-features__progress-bar-container">
                                            <div 
                                                ref={progressRef}
                                                className="accordion-features__progress-bar"
                                                style={{ backgroundColor: accentColor, opacity: 0.8 }}
                                            />
                                        </div>
                                    </>
                                ) : hoveredFeature !== null && features[hoveredFeature].media.type === 'image' ? (
                                    <img src={features[hoveredFeature].media.src} alt={features[hoveredFeature].title} className="accordion-features__image" />
                                ) : (
                                    <img src={defaultBg} alt="Default Feature" className="accordion-features__image" />
                                )}
                            </div>
                        <div className="accordion-features__list">
                            {features.map((feature, i) => (
                                <div
                                    key={i}
                                    className={`accordion-features__item ${hoveredFeature === i ? 'active' : ''}`}
                                    onMouseEnter={() => setHoveredFeature(i)}
                                    onMouseLeave={() => setHoveredFeature(null)}
                                >
                                    <div className="accordion-features__item-header">
                                        <span className="accordion-features__item-num" style={{ color: accentColor }}>{String(i + 1).padStart(2, '0')}</span>
                                        <h3 className="accordion-features__item-title">{feature.title}</h3>
                                    </div>
                                    <div
                                        className="accordion-features__item-content"
                                        style={{
                                            maxHeight: hoveredFeature === i ? '200px' : '0',
                                            opacity: hoveredFeature === i ? 1 : 0,
                                            overflow: 'hidden',
                                            transition: 'all 0.3s ease-in-out'
                                        }}
                                    >
                                        <p className="accordion-features__item-desc">{feature.desc}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Mobile Version (Old Style) */}
                    <div className="features-mobile-old">
                        {features.map((feature, i) => (
                            <div key={i} className={`product-detail__feature ${i % 2 !== 0 ? 'product-detail__feature--reverse' : ''}`}>
                                <div className="product-detail__feature-video-wrap" style={{ borderColor: accentColor + '20' }}>
                                    {feature.media.type === 'video' ? (
                                        <video
                                            className="product-detail__feature-video"
                                            controls
                                            muted
                                            playsInline
                                            preload="metadata"
                                        >
                                            <source src={feature.media.src} type="video/mp4" />
                                        </video>
                                    ) : (
                                        <img src={feature.media.src} alt={feature.title} className="product-detail__feature-image" />
                                    )}
                                </div>
                                <div className="product-detail__feature-content">
                                    <span className="product-detail__feature-num" style={{ color: accentColor }}>Feature {String(i + 1).padStart(2, '0')}</span>
                                    <h3 className="product-detail__feature-title">{feature.title}</h3>
                                    <p className="product-detail__feature-desc">{feature.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Bottom CTA */}
            <section className="product-detail__cta">
                <div className="container">
                    <div className="product-detail__cta-box" style={{ borderColor: accentColor + '20' }}>
                        <h2>Ready to Modernize Your Research?</h2>
                        <p>Get started with EviNote and transform how your institution manages research.</p>
                        <div className="product-detail__cta-buttons">
                            <Link to="/pricing" className="btn btn-primary btn-large" style={{ background: accentColor }}>
                                View Pricing
                            </Link>
                            <Link to="/contact" className="btn btn-secondary btn-large">
                                Book a FREE Trial
                            </Link>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    )
}
