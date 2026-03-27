import { Link } from 'react-router-dom'
import luminaryLogo from '../assets/images/products/luminary-logo.png'
import usePageMetadata from '../lib/usePageMetadata'
import './ProductDetail.css'

const accentColor = '#ffae00'

const overview = [
    {
        icon: '📚',
        title: 'What is Luminary?',
        text: 'Luminary is an AI-powered learning platform that transforms education through personalized assessments, intelligent analytics, and collaborative tools. From AI-generated quizzes and competitive exam preparation to interview practice and performance leaderboards, Luminary equips students and institutions with the tools to achieve academic excellence.'
    },
    {
        icon: '💡',
        title: 'Why did we build Luminary?',
        text: 'India\'s education system serves over 250 million students, yet personalized learning remains a privilege of the few. Most institutions rely on one-size-fits-all curricula that fail to address individual learning gaps. We built Luminary to democratize adaptive learning — using AI to create assessments that evolve with each student, practice tools that build real-world readiness, and analytics that empower educators with actionable insights.'
    },
    {
        icon: '🎓',
        title: 'Who is it for?',
        text: 'Luminary is designed for colleges, universities, coaching institutes, and K-12 schools. It serves educators who want data-driven insights into student performance, administrators seeking unified academic management, and students preparing for competitive exams (GATE, NET, NEET, JEE) and campus placements.'
    },
    {
        icon: '🌍',
        title: 'Total Addressable Market',
        text: 'The global EdTech market is valued at over $340 billion and is expected to reach $605 billion by 2027. India\'s online education market alone is projected to reach $30 billion by 2030, fueled by the National Education Policy 2020, increasing smartphone penetration, and growing demand for competitive exam preparation and skill development platforms.'
    },
]

const features = [
    { title: 'Digital Journals', desc: 'Luminary\'s Digital Journals give students an AI-assisted space to organize course materials, take structured notes, and build personal knowledge bases. Subjects and topics are organized hierarchically, making revision efficient. Educators can push reference materials directly into student journals, creating a seamless bridge between classroom teaching and self-study.', media: { src: '/media/luminary/add-subjects.mp4', type: 'video' } },
    { title: 'AI-Driven Quizzes', desc: 'Assessments that adapt in real time. Luminary\'s AI engine generates quizzes tailored to each student\'s proficiency level, adjusting difficulty dynamically as they answer. The system identifies weak areas, reinforces concepts through targeted repetition, and provides detailed performance breakdowns — making every quiz a personalized learning experience rather than a static test.', media: { src: '/media/luminary/ai-quizzes.mp4', type: 'video' } },
    { title: 'Interview Practice', desc: 'Prepare students for campus placements and professional interviews with AI-powered mock sessions. Luminary simulates real interview scenarios — technical, HR, and domain-specific — providing real-time feedback on answer quality, communication clarity, and confidence. Students can practice repeatedly, track improvement over time, and walk into interviews fully prepared.', media: { src: '/media/luminary/interview-prep.mp4', type: 'video' } },
    { title: 'Comprehensive Tests', desc: 'Create, distribute, and evaluate tests with ease. Luminary\'s test engine supports multiple question types — MCQs, descriptive, numerical, and case-study based — with configurable time limits, section-wise marking, and automated grading. Educators can build question banks, randomize papers, and instantly generate performance reports across batches.', media: { src: '/media/luminary/conduct-tests.mp4', type: 'video' } },
    { title: 'Performance Leaderboards', desc: 'Gamify the learning experience with real-time performance leaderboards. Students see where they stand relative to peers across quizzes, tests, and practice sessions — fostering healthy competition and sustained engagement. Educators get aggregated views to identify top performers, at-risk students, and overall class trends.', media: { src: '/media/luminary/competitive-leaderboard.mp4', type: 'video' } },
    { title: 'Competitive Exam Prep', desc: 'Purpose-built tools for national competitive exam preparation. Luminary offers curated question banks for GATE, NET, NEET, JEE, and other major exams, with previous-year papers, topic-wise practice, timed mock tests, and AI-generated difficulty progression. The platform tracks readiness scores and suggests personalized study plans to maximize performance on exam day.', media: { src: '/media/luminary/national-exams-prep.mp4', type: 'video' } },
]

const luminaryOgImage = new URL('../assets/images/products/luminary-logo.png', import.meta.url).href

const luminaryProductLd = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'Luminary',
    applicationCategory: 'EducationalApplication',
    operatingSystem: 'Web',
    url: 'https://www.evionex.com/products/luminary',
    image: luminaryOgImage,
    description: 'AI-powered learning platform with adaptive quizzes, digital journals, interview practice, and competitive exam preparation.',
    offers: {
        '@type': 'Offer',
        price: '300',
        priceCurrency: 'INR',
        priceSpecification: {
            '@type': 'UnitPriceSpecification',
            price: '300',
            priceCurrency: 'INR',
            unitText: 'per student per month',
        },
        url: 'https://www.evionex.com/products/luminary',
    },
    brand: {
        '@type': 'Brand',
        name: 'Evionex',
    },
}

export default function LuminaryDetail() {
    usePageMetadata({
        title: 'Luminary — AI-Powered Learning Enhancement System | Evionex',
        description: 'Personalized AI-driven quizzes, digital journals, interview practice, and competitive exam preparation for universities and institutes.',
        canonicalPath: '/products/luminary',
        image: luminaryOgImage,
        ogType: 'product',
        jsonLd: [luminaryProductLd],
    })

    return (
        <div className="product-detail">
            {/* Hero */}
            <section className="product-detail__hero">
                <div className="container" style={{ textAlign: 'center' }}>
                    <img src={luminaryLogo} alt="Luminary" className="product-detail__hero-logo" style={{ '--logo-glow': accentColor }} />
                    <h1 className="product-detail__hero-title">Luminary</h1>
                    <span className="product-detail__hero-type" style={{ color: accentColor, borderColor: accentColor + '40', background: accentColor + '15', border: `1px solid ${accentColor}40` }}>
                        Education Solution
                    </span>
                    <p className="product-detail__hero-desc">
                        An AI-powered learning platform that transforms education through personalized quizzes, intelligent analytics, and collaborative tools designed for modern institutions.
                    </p>
                </div>
            </section>

            {/* Overview */}
            <section className="product-detail__overview">
                <div className="container">
                    <div className="section-header" style={{ textAlign: 'center', marginBottom: '2rem' }}>
                        <h2 style={{ fontSize: '2.2rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                            About <span style={{ color: accentColor }}>Luminary</span>
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
                                <video
                                    className="product-detail__feature-video"
                                    controls
                                    muted
                                    playsInline
                                    preload="metadata"
                                >
                                    <source src={feature.media.src} type="video/mp4" />
                                </video>
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
                        <h2>Ready to Transform Education?</h2>
                        <p>Get started with Luminary and unlock the full potential of your students.</p>
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
