import { Link } from 'react-router-dom'
import genesetuLogo from '../assets/images/products/genesetu-logo.png'
import './ProductDetail.css'

const accentColor = '#00bafd'

const overview = [
    {
        icon: '🧬',
        title: 'What is Gene Setu?',
        text: 'Gene Setu is an AI-enabled Electronic Health Record (EHR) platform that leverages Whole Exome Sequencing (WES) data to analyze over 6,000 genetic diseases in newborns, prenatal infants, and adults. It serves as a complete life-record management system — storing, analyzing, and surfacing actionable health insights from birth through adulthood.'
    },
    {
        icon: '💡',
        title: 'Why did we build Gene Setu?',
        text: 'India diagnoses over 1.7 million children with birth defects annually, yet early genetic screening remains inaccessible for the vast majority. We built Gene Setu to bridge the gap between genomic science and everyday healthcare — giving hospitals an affordable, AI-powered tool that detects genetic conditions early, tracks biomarkers lifelong, and empowers clinicians with predictive diagnostics.'
    },
    {
        icon: '🏥',
        title: 'Who is it for?',
        text: 'Gene Setu is designed for hospitals, diagnostic centers, neonatal intensive care units (NICUs), pediatric clinics, and public health programs. It is purpose-built for healthcare institutions in India and emerging markets looking to integrate genomic screening into standard patient care workflows.'
    },
    {
        icon: '🌍',
        title: 'Total Addressable Market',
        text: 'The global EHR market is valued at over $29 billion and is projected to reach $47 billion by 2030. The clinical genomics market adds another $9 billion globally. In India alone, the digital health market is expected to reach $37 billion by 2030, driven by government initiatives like the Ayushman Bharat Digital Mission and rising adoption of AI in diagnostics.'
    },
]

const features = [
    { title: 'WES Data Analysis', desc: 'Gene Setu processes Whole Exome Sequencing data to screen for over 6,000 genetic conditions in a single test. The platform ingests raw sequencing data, runs variant calling pipelines, and surfaces clinically relevant mutations — enabling doctors to detect hereditary diseases, carrier status, and pharmacogenomic markers without needing bioinformatics expertise.', media: { src: '/media/genesetu/wes-results.mp4', type: 'video' } },
    { title: 'Biomarker Tracking', desc: 'Continuously monitor patient biomarkers throughout their lifetime. Gene Setu tracks lab values, vital signs, and genetic markers over time, generating trend charts and automated alerts when values drift outside healthy ranges. This longitudinal view helps clinicians catch developing conditions before they become critical.', media: { src: '/media/genesetu/biomarker-tracking.mp4', type: 'video' } },
    { title: 'Life Record Management', desc: 'Maintain a complete, unified health record from birth through life. Gene Setu consolidates prescriptions, lab results, imaging, vaccinations, and genetic data into a single timeline. Records are securely stored and instantly accessible across departments, enabling seamless continuity of care.', media: { src: '/media/genesetu/ehr-repository.jpeg', type: 'image' } },
    { title: 'AI Diagnostics', desc: 'Machine learning models trained on millions of clinical data points power Gene Setu\'s predictive diagnostics engine. The system identifies early disease patterns, suggests differential diagnoses, and flags high-risk patients — supporting clinicians with evidence-based decision-making in real time.', media: { src: '/media/genesetu/live-diagnostics.mp4', type: 'video' } },
    { title: 'Medication Tracking', desc: 'Track every prescription across a patient\'s care journey with automatic reminders, dosage schedules, drug-interaction warnings, and refill notifications. Gene Setu ensures medication adherence while alerting physicians to potential pharmacogenomic conflicts identified through the patient\'s genetic profile.', media: { src: '/media/genesetu/medication-tracking.mp4', type: 'video' } },
    { title: 'NutriLogging', desc: 'Track nutrition and dietary patterns with AI-powered insights. Patients can log meals while the system analyzes macro and micronutrient intake against their genetic profile and health objectives. Clinicians receive nutritional summaries that inform diet-related treatment plans and wellness recommendations.', media: { src: '/media/genesetu/nutrilogging.mp4', type: 'video' } },
]

export default function GeneSetuDetail() {
    return (
        <div className="product-detail">
            {/* Hero */}
            <section className="product-detail__hero">
                <div className="container" style={{ textAlign: 'center' }}>
                    <img src={genesetuLogo} alt="Gene Setu" className="product-detail__hero-logo" style={{ '--logo-glow': accentColor }} />
                    <h1 className="product-detail__hero-title">Gene Setu</h1>
                    <span className="product-detail__hero-type" style={{ color: accentColor, borderColor: accentColor + '40', background: accentColor + '15', border: `1px solid ${accentColor}40` }}>
                        Healthcare Solution
                    </span>
                    <p className="product-detail__hero-desc">
                        An AI-enabled Electronic Health Record platform that leverages Whole Exome Sequencing data to analyze 6,000+ diseases in newborn, prenatal infants and adults, along with maintaining their complete life records.
                    </p>
                </div>
            </section>

            {/* Overview */}
            <section className="product-detail__overview">
                <div className="container">
                    <div className="section-header" style={{ textAlign: 'center', marginBottom: '2rem' }}>
                        <h2 style={{ fontSize: '2.2rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                            About <span style={{ color: accentColor }}>Gene Setu</span>
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
            </section>

            {/* Bottom CTA */}
            <section className="product-detail__cta">
                <div className="container">
                    <div className="product-detail__cta-box" style={{ borderColor: accentColor + '20' }}>
                        <h2>Ready to Transform Your Healthcare?</h2>
                        <p>Get started with Gene Setu and bring genomic intelligence to your patients.</p>
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
