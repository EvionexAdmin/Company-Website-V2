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
        id: 'evinote',
        name: 'EviNote',
        type: 'Research Solution',
        tagColor: '#00D4C8',
        description: 'A comprehensive electronic lab notebook solution designed to streamline research workflows, manage lab resources, and ensure data security across your entire research organization.',
        logo: evinoteIcon,
        features: [
            { icon: '📓', title: 'Electronic Lab Notebook', desc: 'Digital documentation of experiments with rich media support, templates, and version control.' },
            { icon: '💰', title: 'Budget Tracking', desc: 'Monitor research grants, expenditures, and allocations with real-time financial dashboards.' },
            { icon: '📅', title: 'Lab Calendar', desc: 'Coordinate schedules, deadlines, and milestones with integrated lab-wide calendaring.' },
            { icon: '🔧', title: 'Resource Booking', desc: 'Reserve equipment, lab space, and shared resources with automated conflict detection.' },
            { icon: '💬', title: 'Lab Chat', desc: 'Secure, real-time communication channels designed for research team collaboration.' },
            { icon: '🔒', title: 'Data Security', desc: 'End-to-end encryption, audit trails, and compliance with Indian data protection standards.' },
        ],
        ctaPrimary: 'Request a Demo',
        ctaSecondary: 'Watch Demo',
    },
    {
        id: 'luminary',
        name: 'Luminary',
        type: 'Education Solution',
        tagColor: '#7C5CFF',
        description: 'An AI-powered learning platform that transforms education through personalized quizzes, intelligent analytics, and collaborative tools designed for modern institutions.',
        logo: luminaryLogo,
        features: [
            { icon: '📖', title: 'Digital Journals', desc: 'Interactive student journals with AI-assisted note-taking and knowledge organization.' },
            { icon: '🧩', title: 'AI-Driven Quizzes', desc: 'Adaptive assessments that adjust difficulty based on student performance and learning patterns.' },
            { icon: '🎤', title: 'Interview Practice', desc: 'AI-powered mock interviews with real-time feedback for placement preparation.' },
            { icon: '📝', title: 'Assignment Management', desc: 'Streamlined creation, submission, and grading of assignments with plagiarism detection.' },
            { icon: '📊', title: 'Performance Analytics', desc: 'Comprehensive dashboards tracking student progress, engagement, and learning outcomes.' },
            { icon: '🤝', title: 'Collaboration Tools', desc: 'Group projects, peer reviews, and discussion forums for collaborative learning.' },
        ],
        ctaPrimary: 'Get Started',
        ctaSecondary: 'Watch Demo',
    },
    {
        id: 'genesetu',
        name: 'Gene Setu',
        type: 'Healthcare Solution',
        tagColor: '#FF6B6B',
        description: 'An AI-enabled Electronic Health Record platform that leverages Whole Exome Sequencing (WES) data to analyze 7,000+ diseases in newborn and prenatal infants and maintain their complete life records.',
        logo: genesetuLogo,
        features: [
            { icon: '🧬', title: 'WES Data Analysis', desc: 'Advanced Whole Exome Sequencing analysis covering 7,000+ genetic conditions in newborns.' },
            { icon: '👶', title: 'Neonatal Screening', desc: 'Comprehensive newborn and prenatal screening with AI-powered risk assessment algorithms.' },
            { icon: '📋', title: 'Life Record Management', desc: 'Maintain complete health records from birth through life with secure, accessible storage.' },
            { icon: '🤖', title: 'AI Diagnostics', desc: 'Machine learning models for early disease detection and predictive health analytics.' },
            { icon: '🏥', title: 'Hospital Integration', desc: 'Seamless integration with existing hospital management and laboratory information systems.' },
            { icon: '🔐', title: 'HIPAA & Indian Compliance', desc: 'Full compliance with healthcare data regulations including DISHA and international standards.' },
        ],
        ctaPrimary: 'Request a Demo',
        ctaSecondary: 'Learn More',
    },
]

export default function Products() {
    return (
        <div className="products-page">
            {/* Header */}
            <section className="page-hero">
                <div className="container">
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
                            <Link to="/contact" className="btn btn-primary btn-large" style={{ background: product.tagColor }}>
                                {product.ctaPrimary}
                            </Link>
                            <button className="btn btn-secondary btn-large">
                                {product.ctaSecondary}
                            </button>
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
