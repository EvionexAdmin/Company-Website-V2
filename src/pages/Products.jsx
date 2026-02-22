import { useRef } from 'react'
import { Link } from 'react-router-dom'
import MagicBento from '../components/ui/MagicBento/MagicBento'
import evinoteIcon from '../assets/images/products/evinote-icon.png'
import luminaryLogo from '../assets/images/products/luminary-logo.png'
import genesetuLogo from '../assets/images/products/genesetu-logo.png'
import './Products.css'

// Convert hex color to RGB string for MagicBento glowColor prop
const hexToRgb = (hex) => {
    const r = parseInt(hex.slice(1, 3), 16)
    const g = parseInt(hex.slice(3, 5), 16)
    const b = parseInt(hex.slice(5, 7), 16)
    return `${r}, ${g}, ${b}`
}

const products = [
    {
        id: 'genesetu',
        name: 'Gene Setu',
        type: 'Healthcare Solution',
        tagColor: '#00bafd',
        description: 'An AI-enabled Electronic Health Record platform that leverages Whole Exome Sequencing (WES) data to analyze 6,000+ diseases in newborn, prenatal infants and adults, along with maintaining their complete life records.',
        logo: genesetuLogo,
        features: [
            { title: 'WES Data Analysis', desc: 'Whole Exome Sequencing analysis covering 6,000+ genetic conditions.', media: { src: '/media/genesetu/wes-results.mp4', type: 'video' } },
            { title: 'Biomarker Tracking', desc: 'Track biomarkers throughout life to monitor health.', media: { src: '/media/genesetu/biomarker-tracking.mp4', type: 'video' } },
            { title: 'Life Record Management', desc: 'Maintain complete health records from birth through life with secure, accessible storage.', media: { src: '/media/genesetu/ehr-repository.jpeg', type: 'image' } },
            { title: 'AI Diagnostics', desc: 'Machine learning models for early disease detection and predictive health analytics.', media: { src: '/media/genesetu/live-diagnostics.mp4', type: 'video' } },
            { title: 'Medication Tracking', desc: 'Track medications and prescriptions with reminders and dosage tracking.', media: { src: '/media/genesetu/medication-tracking.mp4', type: 'video' } },
            { title: 'NutriLogging', desc: 'Track nutrition and diet with AI-powered insights.', media: { src: '/media/genesetu/nutrilogging.mp4', type: 'video' } },
        ],
        learnMorePath: '/products/genesetu',
    },
    {
        id: 'evinote',
        name: 'EviNote',
        type: 'Research Solution',
        tagColor: '#00D4C8',
        description: 'A comprehensive electronic lab notebook solution designed to streamline research workflows, manage lab resources, and ensure data security across your entire research organization.',
        logo: evinoteIcon,
        features: [
            { title: 'Electronic Lab Notebook', desc: 'Digital documentation of experiments with rich media support, templates, and version control.', media: { src: '/media/evinote/electronic-lab-notebook.mp4', type: 'video' } },
            { title: 'Scientific Illustrator', desc: 'Create high-quality scientific illustrations and diagrams with ease.', media: { src: '/media/evinote/scientific-illustrator.mp4', type: 'video' } },
            { title: 'Resource Management', desc: 'Manage lab resources, equipment, and supplies efficiently.', media: { src: '/media/evinote/equipment-management.mp4', type: 'video' } },
            { title: 'Lab Duties', desc: 'Manage lab duties and responsibilities with ease.', media: { src: '/media/evinote/lab-duties.mp4', type: 'video' } },
            { title: 'Budget Tracking', desc: 'Never lose track of your lab expenses again.', media: { src: '/media/evinote/budget-tracking.mp4', type: 'video' } },
            { title: 'Project Tracker', desc: 'Always stay updated with the latest updates of your project.', media: { src: '/media/evinote/project-tracker.mp4', type: 'video' } },
        ],
        learnMorePath: '/products/evinote',
        demoLink: 'https://youtu.be/KbUlFY_-5qI?si=PrKlyMIIZDdWoIcP',
    },
    {
        id: 'luminary',
        name: 'Luminary',
        type: 'Education Solution',
        tagColor: '#ffae00',
        description: 'An AI-powered learning platform that transforms education through personalized quizzes, intelligent analytics, and collaborative tools designed for modern institutions.',
        logo: luminaryLogo,
        features: [
            { title: 'Digital Journals', desc: 'Interactive student journals with AI-assisted note-taking and knowledge organization.', media: { src: '/media/luminary/add-subjects.mp4', type: 'video' } },
            { title: 'AI-Driven Quizzes', desc: 'Adaptive assessments that adjust difficulty based on student performance and learning patterns.', media: { src: '/media/luminary/ai-quizzes.mp4', type: 'video' } },
            { title: 'Interview Practice', desc: 'AI-powered mock interviews with real-time feedback for placement preparation.', media: { src: '/media/luminary/interview-prep.mp4', type: 'video' } },
            { title: 'Comprehensive Tests', desc: 'Create and take tests with ease.', media: { src: '/media/luminary/conduct-tests.mp4', type: 'video' } },
            { title: 'Performance Based Leaderboards', desc: 'Track student progress and engagement with real-time leaderboards.', media: { src: '/media/luminary/competitive-leaderboard.mp4', type: 'video' } },
            { title: 'Competitive Exam Prep', desc: 'Prepare for competitive exams with AI-powered adaptive learning and personalized feedback.', media: { src: '/media/luminary/national-exams-prep.mp4', type: 'video' } },
        ],
        learnMorePath: '/products/luminary',
        demoLink: 'https://youtu.be/r-hpIGB21W4?si=F9r1VhG7QW0S2tlw',
    },
]

export default function Products() {
    const videoRef = useRef(null)

    const handleMouseEnter = () => {
        if (videoRef.current) {
            videoRef.current.play().catch(e => console.log("Video play failed", e))
        }
    }

    const handleMouseLeave = () => {
        if (videoRef.current) {
            videoRef.current.pause()
        }
    }

    return (
        <div className="products-page">
            {/* Header */}
            {/* Header */}
            <section
                className="page-hero"
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
            >
                <div className="hero__video-bg">
                    <video
                        ref={videoRef}
                        loop
                        muted
                        playsInline
                        className="hero__video"
                    >
                        <source src="/media/happy-family.mp4" type="video/mp4" />
                    </video>
                    <div className="hero__video-overlay"></div>
                </div>
                <div className="container" style={{ position: 'relative', zIndex: 2 }}>
                    <div className="section-header animate-fade-in-up">
                        <span className="tag">Our Products</span>
                        <h1>Solutions That <span className="text-gradient">Transform</span></h1>
                        <p>Three powerful platforms built to revolutionize research, education, and healthcare</p>
                    </div>
                </div>
            </section>

            {/* Product Sections */}
            {products.map((product, index) => (
                <section key={product.id} className={`section product-section ${index % 2 !== 0 ? 'product-section--alt' : ''}`}>
                    <div className="container">
                        {/* Product Header */}
                        <div className="product-header animate-fade-in-up">
                            <span className="tag" style={{ color: product.tagColor, borderColor: product.tagColor + '40', background: product.tagColor + '15' }}>
                                {product.type}
                            </span>
                            <div className="product-title-row" style={{ display: 'flex', alignItems: 'center', gap: '1rem', justifyContent: 'center' }}>
                                <img src={product.logo} alt={`${product.name} Logo`} style={{ height: '48px', width: '48px', objectFit: 'contain', filter: 'drop-shadow(0 0 12px ' + product.tagColor + '50)' }} />
                                <h2 className="product-title" style={{ margin: 0 }}>{product.name}</h2>
                            </div>
                            <p className="product-desc">{product.description}</p>
                        </div>

                        {/* Features Bento Grid */}
                        <MagicBento
                            cards={product.features.map((feature) => ({
                                color: '#0a1628',
                                title: feature.title,
                                description: feature.desc,
                                label: feature.icon,
                                titleColor: product.tagColor,
                                ...(feature.media && { media: feature.media }),
                            }))}
                            glowColor={hexToRgb(product.tagColor)}
                            enableSpotlight={true}
                            enableBorderGlow={true}
                            enableStars={true}
                            enableTilt={false}
                            enableMagnetism={true}
                            clickEffect={true}
                        />

                        {/* CTAs */}
                        <div className="product-ctas animate-fade-in-up">
                            <Link to={product.learnMorePath} className="btn btn-primary btn-large" style={{ background: product.tagColor }}>
                                Learn More
                            </Link>
                            {product.demoLink && (
                                <a
                                    href={product.demoLink}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="btn btn-secondary btn-large"
                                    style={{ textDecoration: 'none', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}
                                >
                                    Watch a Demo
                                </a>
                            )}
                        </div>
                    </div>
                </section>
            ))}

            {/* CTA */}
            <section className="section">
                <div className="container">
                    <div className="cta-box" style={{ textAlign: 'center' }}>
                        <h2>Find the Right Plan for Your Institution</h2>
                        <p>Flexible pricing options designed for organizations of all sizes</p>
                        <Link to="/pricing" className="btn btn-primary btn-large">View Pricing →</Link>
                    </div>
                </div>
            </section>
        </div>
    )
}
