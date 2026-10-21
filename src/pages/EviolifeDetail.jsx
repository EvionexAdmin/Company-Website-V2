import { useState, useRef } from 'react'
import { Link } from 'react-router-dom'
import eviolifeMockup from '../assets/images/products/eviolife-mockup.png'
import defaultBg from '../assets/images/auth/login-background.webp'
import ehrRepositoryImage from '../assets/images/products/ehr-repository.jpeg'
import usePageMetadata from '../lib/usePageMetadata'
import './ProductDetail.css'

const accentColor = '#00bafd'

// Evio Life on Google Play. The campaign id keeps installs coming from the
// website grouped in the Play Console.
const PLAY_STORE_URL =
    'https://play.google.com/store/apps/details?id=com.evionex.genesetu&pcampaignid=web_share'

const overview = [
    {
        icon: '🩺',
        title: 'What Is Eviolife?',
        text: 'Eviolife is your personal health app. It turns the data you already generate every day — meals, workouts, lab values, scans, medicines — into one readable picture of your health, and tells you what to do next.',
    },
    {
        icon: '💡',
        title: 'Why It Matters',
        text: 'Health data is scattered across lab PDFs, chat threads and memory. Eviolife keeps it in one timeline, spots the drift early, and keeps your doctor in the loop instead of waiting for the annual check-up.',
    },
    {
        icon: '📱',
        title: 'How Does It Work?',
        text: 'Download the app, sign in with Google, and start logging. The AI assistants learn your baseline, the trackers fill themselves in, and every report, prescription and scan ends up in one secure repository.',
    },
    {
        icon: '🤝',
        title: 'For Healthcare Professionals',
        text: 'Eviolife gives clinics a way to follow up between visits: patients keep their logs up to date and share the records you need, so consultations start with the full picture.',
        link: { label: 'Contact us for integration →', to: '/contact' },
    },
]

const features = [
    {
        title: 'Smart NutriLogging That Actually Knows Your Kitchen',
        desc: 'Log a meal in seconds and Eviolife works out the calories, macros and micronutrients against your goal — across Indian and international foods, home recipes and restaurant dishes. The nutrition assistant explains what the numbers mean for you and what to change next.',
        media: { src: '/media/eviolife/nutrilogging.mp4', type: 'video' },
    },
    {
        title: 'Biomarkers You Can See Over Time',
        desc: 'Upload a blood report and Eviolife reads the values, files them in your timeline and tracks every biomarker as a trend instead of a single number. When something drifts outside the healthy range, you find out in days instead of years.',
        media: { src: '/media/eviolife/biomarker-tracking.mp4', type: 'video' },
    },
    {
        title: 'AI Insights Your Doctor Can Use',
        desc: 'The AI layer reads across your logs — food, movement, sleep, vitals, labs — and surfaces the patterns that matter: early risk signals, possible interactions, and the questions worth raising at your next consultation. Nothing reaches you before a clinician has reviewed it.',
        media: { src: '/media/eviolife/live-diagnostics.mp4', type: 'video' },
    },
    {
        title: 'Meds & Supplements, Under Control',
        desc: 'Prescriptions, supplements and schedules in one place, with reminders that actually fire, an adherence history you can show your doctor, and cross-checks against the rest of your health data for risky combinations.',
        media: { src: '/media/eviolife/medication-tracking.mp4', type: 'video' },
    },
    {
        title: 'One Health Record for Your Whole Life',
        desc: 'Vaccinations, lab reports, scans, prescriptions, genetic results and appointments in a single secure timeline — readable in seconds, exportable whenever you need it, and shareable with any doctor in a click.',
        media: { src: ehrRepositoryImage, type: 'image' },
    },
    {
        title: 'Genetic Risk Assessment, When You Want It',
        desc: 'Optional Whole Exome Sequencing screening reads your DNA for 6,000+ inherited conditions and turns the findings into plain-language guidance, reviewed by a geneticist and folded into the same record as everything else. It is one module of the app, not the whole product.',
        media: { src: '/media/eviolife/wes-results.mp4', type: 'video' },
    },
]

const featureLabels = [
    'Smart NutriLogging',
    'Biomarker Tracking',
    'AI Health Insights',
    'Meds & Supplements',
    'Health Record',
    'Genetic Risk',
]

// Every module that ships in the app. This is the product today — the genetic
// test is one of these, not the headline.
const appModules = [
    { icon: '📊', name: 'Dashboard', desc: 'Your health nerve centre: live stats, streaks and what needs attention today.' },
    { icon: '🥗', name: 'Nutrition Log', desc: 'Meals, macros, calories, recipes and an AI nutrition coach that knows your goal.' },
    { icon: '🏋️', name: 'Training Zone', desc: 'Workouts built for the muscle groups you want, with AI suggestions and progression charts.' },
    { icon: '🧩', name: 'Game Zone', desc: 'Daily logic puzzles and brain games to keep your cognitive health in shape.' },
    { icon: '🩸', name: 'Blood Reports', desc: 'Upload a report, read it in plain language, and follow every biomarker as a trend.' },
    { icon: '🩻', name: 'MRI Insights', desc: 'AI-assisted observations on your MRI and CT scans, ready to discuss with your doctor.' },
    { icon: '💊', name: 'Meds & Sups', desc: 'Reminders, adherence history and interaction checks for every prescription and supplement.' },
    { icon: '🧬', name: 'Genetic Risk', desc: 'Optional WES screening for 6,000+ conditions with a geneticist-certified report.' },
    { icon: '🛒', name: 'Health Marketplace', desc: 'Book tests, panels and scans, and consult verified doctors and hospitals near you.' },
    { icon: '👶', name: 'Parent Mode', desc: 'Prenatal and postnatal tracking plus growth milestones for your child.' },
    { icon: '👨‍👩‍👧', name: 'Health Monitor', desc: 'Family groups and controlled sharing of records with the people you trust.' },
    { icon: '🗂️', name: 'Repository', desc: 'Every medical document you own, filed, searchable and shareable in seconds.' },
]

const overviewFaqs = [
    {
        q: 'What is Eviolife?',
        a: 'Eviolife is a personal health app that brings your everyday health data into one place: what you eat, how you train, your lab values, your scans, your medicines and — if you want it — your genetic risk profile. The AI layer reads across all of it and turns it into guidance you can act on today, while every record stays in a single secure repository for you and your doctor.',
    },
    {
        q: 'Who is it for?',
        a: 'Anyone who wants a clear picture of their own health: people managing a chronic condition, people who want to start exercising or eating better, busy parents tracking their children, and anyone who has ever been handed a lab report and had no idea what it meant. Families share one account with separate, permissioned profiles through Health Monitor and Parent Mode.',
    },
    {
        q: 'Is Eviolife a medical device or a replacement for my doctor?',
        a: 'No. Eviolife is a health companion and a record-keeping system, not a diagnostic device and not a replacement for medical care. Its AI surfaces patterns and prompts; it does not diagnose. Anything clinical — lab interpretation, imaging observations, genetic findings — is reviewed by qualified clinicians before it reaches you, and your doctor still makes every decision about your care.',
    },
    {
        q: 'Do I need a subscription to use it?',
        a: 'You can download the app and start using the core trackers straight away. Premium unlocks the AI assistants, deeper analysis, unlimited family seats and marketplace benefits. Plans are billed through the app or on the website, and you can cancel whenever you like.',
    },
]

const gettingStartedFaqs = [
    {
        q: 'How do I get Eviolife?',
        a: 'Download Eviolife from the Google Play Store onto your Android phone, then sign in with the Google account you already use. The whole set-up takes a couple of minutes: pick your goal, tell the app a little about yourself, and the trackers, assistants and reminders start working from there.',
    },
    {
        q: 'What should I do in the first week?',
        a: 'Start with one habit, not ten. Log your meals for a few days so the nutrition assistant can learn your baseline, add one or two blood reports if you have them, and connect a wearable if you own one. Eviolife fills in the trends from there — the more it knows, the more useful the advice becomes.',
    },
    {
        q: 'Can I use Eviolife with my family?',
        a: 'Yes. Parent Mode gives you a dedicated view for your child, including prenatal and postnatal tracking and growth milestones. Health Monitor lets you group family members and decide exactly who can see which records — sharing is always permissioned, never automatic.',
    },
]

const insideFaqs = [
    {
        q: 'What can the AI assistants actually do?',
        a: 'The nutrition assistant reads your food log, your goal and your recent activity, then tells you what to change and why. The workout assistant builds sessions around the muscle groups you want to work and adapts as your progression changes. Both run on-device where the hardware allows it, so your raw health data does not need to leave your phone for routine use.',
    },
    {
        q: 'How does the blood report and MRI analysis work?',
        a: 'You upload a photo or a PDF. Eviolife extracts the values, files them in your timeline and highlights what is outside the reference range and how it compares with your previous results. For MRI and CT scans you get AI-assisted observations that are meant to support — never replace — the radiologist and your doctor.',
    },
    {
        q: 'What is Genetic Risk Assessment and do I need it?',
        a: 'It is the optional genetics module. A sample is analysed with Whole Exome Sequencing and screened against more than 6,000 inherited conditions; a geneticist reviews the findings and the results are folded into your record so the rest of the app can work with them. Plenty of people use Eviolife happily without it — nutrition, training, labs, scans and medicines work on their own.',
    },
    {
        q: 'Can I book doctors, tests and scans from the app?',
        a: 'Yes. The Health Marketplace lets you browse health tests, blood panels and MRI scans, and consult verified doctors and hospitals near you, including teleconsultations. Appointments, prescriptions and results all land back in your repository, so nothing gets lost in a chat thread.',
    },
]

const privacyFaqs = [
    {
        q: 'How is my health data protected?',
        a: 'Your records are encrypted in transit and at rest, access is controlled by role and permission, and your family sharing is explicit rather than implicit. The AI layer is built so that routine analysis can run on your device, and your genomic data is never sold, traded or shared with insurers, employers or advertisers.',
    },
    {
        q: 'Is Eviolife compliant with Indian health data rules?',
        a: 'Eviolife is designed around the Digital Information Security in Healthcare Act (DISHA) framework and the existing IT Act provisions for sensitive personal data, with purpose limitation, data minimisation and consent-based processing built into the product.',
    },
    {
        q: 'Who can see my records?',
        a: 'By default, only you. You decide when to share: with a family member through Health Monitor, with a doctor through the marketplace, or by exporting a summary for any consultation. Sharing can be withdrawn at any time, and the repository always keeps an audit trail of what was shared and when.',
    },
]

const pricingFaqs = [
    {
        q: 'Is the app free?',
        a: 'The core experience is free to download and use. Premium plans unlock the AI assistants, deeper analytics, the health marketplace benefits and additional family seats. You can see the current plans on the website or inside the app before you commit to anything.',
    },
    {
        q: 'What happens if I cancel?',
        a: 'Your data stays yours. Your records remain in the repository and you can export them at any time; the premium features simply stop. There is no lock-in and no deletion of your history because you did not renew.',
    },
    {
        q: 'Is it available outside India?',
        a: 'The app is built for a global audience — the nutrition database covers international as well as Indian foods, the app speaks English, Hindi and Marathi, and the marketplace is expanding beyond the cities it serves today.',
    },
]

const faqCategories = [
    { category: 'What Is Eviolife?', icon: '🩺', faqs: overviewFaqs },
    { category: 'Getting Started', icon: '📱', faqs: gettingStartedFaqs },
    { category: 'Inside the App', icon: '⚙️', faqs: insideFaqs },
    { category: 'Privacy & Data Safety', icon: '🔒', faqs: privacyFaqs },
    { category: 'Plans & Pricing', icon: '💳', faqs: pricingFaqs },
]

const trustBarItems = [
    { icon: '🤖', label: 'AI Health Assistants' },
    { icon: '📱', label: 'Available on Google Play' },
    { icon: '🔒', label: 'Encrypted Health Records' },
    { icon: '🧬', label: '6,000+ Conditions Screened' },
]

const eviolifeOgImage = new URL('../assets/images/products/eviolife-logo.png', import.meta.url).href

// The structured data is built from the same questions the page shows, so the
// two never drift apart.
const eviolifeProductLd = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'Eviolife',
    applicationCategory: 'HealthApplication',
    operatingSystem: 'Android',
    url: 'https://www.evionex.com/products/eviolife',
    image: eviolifeOgImage,
    description:
        'Eviolife is a personal health app that brings nutrition, training, blood reports, MRI insights, medication reminders, genetic risk assessment, family health and a doctor marketplace into one secure record, with AI assistants that turn your own data into guidance you can act on.',
    downloadUrl: PLAY_STORE_URL,
    installUrl: PLAY_STORE_URL,
    offers: {
        '@type': 'Offer',
        price: '0',
        priceCurrency: 'INR',
        availability: 'https://schema.org/InStock',
        url: PLAY_STORE_URL,
    },
    aggregateRating: undefined,
    brand: {
        '@type': 'Brand',
        name: 'Evionex',
    },
}

const eviolifeFaqLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqCategories.flatMap((category) =>
        category.faqs.map((faq) => ({
            '@type': 'Question',
            name: faq.q,
            acceptedAnswer: {
                '@type': 'Answer',
                text: faq.a,
            },
        }))
    ),
}

function PlayStoreIcon() {
    return (
        <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
            <path
                fill="currentColor"
                d="M5 17.66 8.41 12.8 3 5.27v13.32c0 .39.31.7.71.7L5 17.66Zm.84.88 3.24-3.7h4.79L7.47 20.5c-.85.45-1.65.3-1.63-1.96Zm3.23-4.74 1.63-1.86 5.66 1.86H9.07Zm11.45-6.17-4.36-2.53-3.46 3.77 1.63 1.86 6.19-3.1ZM7.47 3.5l6.44 3.69-3.21 3.66L7.47 3.5Zm-1.63 1.96c-.02-2.26.78-3.41 1.63-2.96l3.7 4.24-3.7 4.86-1.63-6.14Z"
            />
        </svg>
    )
}

export default function EviolifeDetail() {
    const [openFaqIndex, setOpenFaqIndex] = useState(null)
    const [hoveredFeature, setHoveredFeature] = useState(null)
    const progressRef = useRef(null)

    usePageMetadata({
        title: 'Eviolife — Your Personal Health App | Evionex',
        description:
            'Eviolife is a personal health app: smart nutrition logging, AI training plans, blood report and MRI insights, medication reminders, genetic risk assessment, family health and a doctor marketplace — all in one secure record.',
        canonicalPath: '/products/eviolife',
        image: eviolifeOgImage,
        ogType: 'product',
        jsonLd: [eviolifeProductLd, eviolifeFaqLd],
    })

    const toggleFaq = (categoryIdx, faqIdx) => {
        const key = `${categoryIdx}-${faqIdx}`
        setOpenFaqIndex(prev => prev === key ? null : key)
    }

    const scrollToFeatures = (e) => {
        e.preventDefault()
        const featuresSection = document.querySelector('.product-detail__features')
        if (featuresSection) {
            featuresSection.scrollIntoView({ behavior: 'smooth' })
        }
    }

    return (
        <div className="product-detail">
            {/* Hero */}
            <section className="product-detail__hero">
                <div className="product-detail__hero-bg" style={{ backgroundImage: `url(${eviolifeMockup})` }}></div>
                <div className="product-detail__hero-overlay"></div>
                <div className="container" style={{ textAlign: 'center' }}>
                    <h1 className="product-detail__hero-title">Eviolife</h1>
                    <span className="product-detail__hero-type" style={{ color: accentColor, borderColor: accentColor + '40', background: accentColor + '15', border: `1px solid ${accentColor}40` }}>
                        Healthcare Solution
                    </span>
                    <p className="product-detail__hero-desc">
                        Your personal health app. Log what you eat, how you train, your labs, your scans and your
                        medicines — Eviolife puts them in one secure record and turns them into guidance you can
                        act on today.
                    </p>

                    {/* CTA Buttons */}
                    <div className="product-detail__hero-buttons">
                        <a
                            href={PLAY_STORE_URL}
                            target="_blank"
                            rel="noreferrer"
                            className="btn btn-primary btn-large"
                            style={{ background: accentColor, display: 'inline-flex', alignItems: 'center', gap: '0.6rem' }}
                        >
                            <PlayStoreIcon />
                            Get it on Google Play
                        </a>
                        <a href="#features" onClick={scrollToFeatures} className="btn btn-secondary btn-large">
                            See What's Inside ↓
                        </a>
                    </div>

                    {/* Trust Bar */}
                    <div className="product-detail__trust-bar">
                        {trustBarItems.map((item, i) => (
                            <span key={i} className="product-detail__trust-item">
                                <span className="product-detail__trust-icon">{item.icon}</span>
                                {item.label}
                            </span>
                        ))}
                    </div>
                </div>
            </section>

            {/* Overview */}
            <section className="product-detail__overview">
                <div className="container">
                    <div className="section-header" style={{ textAlign: 'center', marginBottom: '2rem' }}>
                        <h2 style={{ fontSize: '2.2rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                            About <span style={{ color: accentColor }}>Eviolife</span>
                        </h2>
                    </div>
                    <div className="product-detail__overview-grid">
                        {overview.map((item, i) => (
                            <div key={i} className="product-detail__overview-card">
                                <span className="product-detail__overview-icon">{item.icon}</span>
                                <h3>{item.title}</h3>
                                <p>{item.text}</p>
                                {item.link && (
                                    <Link to={item.link.to} className="product-detail__card-link" style={{ color: accentColor }}>
                                        {item.link.label}
                                    </Link>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Features */}
            <section className="product-detail__features" id="features-section">
                <div className="container">
                    <h2 className="product-detail__features-title">
                        Powerful Features <span style={{ color: accentColor }}>For individuals of all ages</span>
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
                                    <span className="product-detail__feature-num" style={{ color: accentColor }}>Feature {String(i + 1).padStart(2, '0')} {featureLabels[i]}</span>
                                    <h3 className="product-detail__feature-title">{feature.title}</h3>
                                    <p className="product-detail__feature-desc">{feature.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Everything in the app */}
            <section className="product-detail__modules" id="modules-section">
                <div className="container">
                    <div className="section-header" style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
                        <span className="product-detail__faq-label" style={{ color: accentColor }}>One App</span>
                        <h2 className="product-detail__features-title">
                            Everything <span style={{ color: accentColor }}>inside Eviolife</span>
                        </h2>
                        <p className="product-detail__faq-subtitle" style={{ marginBottom: 0 }}>
                            Every module shares the same record, so a lab result changes your nutrition advice and a
                            training streak shows up in your next consultation.
                        </p>
                    </div>
                    <div className="product-detail__modules-grid">
                        {appModules.map((module) => (
                            <div key={module.name} className="product-detail__module-card">
                                <span className="product-detail__module-icon">{module.icon}</span>
                                <h3>{module.name}</h3>
                                <p>{module.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* FAQ Section */}
            <section className="product-detail__faq">
                <div className="container">
                    <div className="product-detail__faq-header">
                        <span className="product-detail__faq-label" style={{ color: accentColor }}>For Individuals & Families</span>
                        <h2 className="product-detail__faq-title">
                            Frequently Asked <span style={{ color: accentColor }}>Questions</span>
                        </h2>
                        <p className="product-detail__faq-subtitle">
                            Everything you need to know before you start tracking your health with Eviolife. We've
                            answered the most common questions from people just like you.
                        </p>
                    </div>

                    <div className="product-detail__faq-categories">
                        {faqCategories.map((cat, catIdx) => (
                            <div key={catIdx} className="product-detail__faq-category">
                                <div className="product-detail__faq-category-header">
                                    <span className="product-detail__faq-category-icon">{cat.icon}</span>
                                    <h3 className="product-detail__faq-category-title">{cat.category}</h3>
                                </div>
                                <div className="product-detail__faq-list">
                                    {cat.faqs.map((faq, faqIdx) => {
                                        const isOpen = openFaqIndex === `${catIdx}-${faqIdx}`
                                        return (
                                            <div
                                                key={faqIdx}
                                                className={`product-detail__faq-item ${isOpen ? 'product-detail__faq-item--open' : ''}`}
                                            >
                                                <button
                                                    className="product-detail__faq-question"
                                                    onClick={() => toggleFaq(catIdx, faqIdx)}
                                                    aria-expanded={isOpen}
                                                    style={{ '--faq-accent': accentColor }}
                                                >
                                                    <span className="product-detail__faq-q-text">{faq.q}</span>
                                                    <span className={`product-detail__faq-chevron ${isOpen ? 'product-detail__faq-chevron--open' : ''}`}>
                                                        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                                                            <path d="M5 7.5L10 12.5L15 7.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                                        </svg>
                                                    </span>
                                                </button>
                                                <div
                                                    className="product-detail__faq-answer-wrap"
                                                    style={{
                                                        maxHeight: isOpen ? '500px' : '0',
                                                        opacity: isOpen ? 1 : 0,
                                                    }}
                                                >
                                                    <p className="product-detail__faq-answer">{faq.a}</p>
                                                </div>
                                            </div>
                                        )
                                    })}
                                </div>
                            </div>
                        ))}

                        {/* FOR DOCTORS Partner CTA Block */}
                        <div className="product-detail__faq-doctor-block">
                            <span className="product-detail__faq-label product-detail__faq-label--doctor" style={{ color: accentColor }}>For Doctors</span>
                            <p className="product-detail__faq-doctor-text">
                                Are you a clinician or hospital looking to bring your patients' data into one place? Contact our team.
                            </p>
                            <Link to="/contact" className="btn btn-primary" style={{ background: accentColor, fontSize: '0.95rem', padding: '0.7rem 1.75rem' }}>
                                Integrate With Us →
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* Bottom CTA */}
            <section className="product-detail__cta">
                <div className="container">
                    <div className="product-detail__cta-box" style={{ borderColor: accentColor + '20' }}>
                        <h2>Start Tracking Your Health Today</h2>
                        <p>
                            Download Eviolife, sign in with Google and let your own data start working for you — or
                            talk to us about bringing it to your patients.
                        </p>
                        <div className="product-detail__cta-buttons">
                            <a
                                href={PLAY_STORE_URL}
                                target="_blank"
                                rel="noreferrer"
                                className="btn btn-primary btn-large"
                                style={{ background: accentColor, display: 'inline-flex', alignItems: 'center', gap: '0.6rem' }}
                            >
                                <PlayStoreIcon />
                                Get Eviolife on Google Play
                            </a>
                            <Link to="/subscribe/eviolife" className="btn btn-secondary btn-large">
                                View Plans
                            </Link>
                            <Link to="/contact" className="btn btn-secondary btn-large">
                                Talk to Us
                            </Link>
                        </div>
                        <p className="product-detail__cta-micro-trust">
                            Free to download · Works with your Google account · Your data stays yours
                        </p>
                    </div>
                </div>
            </section>
        </div>
    )
}
