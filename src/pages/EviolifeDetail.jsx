import { useState, useRef, useMemo } from 'react'
import { Link } from 'react-router-dom'
import eviolifeMockup from '../assets/images/products/eviolife-mockup.png'
import defaultBg from '../assets/images/auth/login-background.webp'
import ehrRepositoryImage from '../assets/images/products/ehr-repository.jpeg'
import usePageMetadata from '../lib/usePageMetadata'
import { isSouthAsiaByTimezone, PLAN_CATALOG } from '../lib/pricing'
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
        <svg width="22" height="22" viewBox="0 0 512 512" aria-hidden="true" focusable="false">
            <path
                fill="#00F076"
                d="M325.3 234.3L10.6 51.9C6.4 57.5 4 64.6 4 72.3v367.4c0 7.7 2.4 14.8 6.6 20.4l314.7-225.8z"
            />
            <path
                fill="#00D2FF"
                d="M407.2 292.8l-81.9-58.5L10.6 459.7c3.9 4.3 9.4 7.3 15.6 7.3 4.2 0 8.2-1.3 11.6-3.7l369.4-210.5z"
            />
            <path
                fill="#FF3A44"
                d="M407.2 219.2L37.8 8.9C34.4 6.5 30.4 5.2 26.2 5.2c-6.2 0-11.7 3-15.6 7.3l314.7 225.8 81.9-19.1z"
            />
            <path
                fill="#FFC400"
                d="M470.5 242.9l-63.3-36.1-81.9 27.5 81.9 58.5 63.3-36.1c9.4-5.4 15.5-15.4 15.5-26.9s-6.1-21.5-15.5-26.9z"
            />
        </svg>
    )
}

function buildEviolifePlans(currency) {
    const isINR = currency === 'INR'
    const sym = isINR ? '₹' : '$'
    const catalog = PLAN_CATALOG[currency]
    const weeklyRef = catalog.monthly.weeklyReference
    const yearlyAmt = catalog.yearly.amount / 100
    const lifetimeAmt = catalog.lifetime.amount / 100
    const lifetimeOriginal = catalog.lifetime.originalAmount ? catalog.lifetime.originalAmount / 100 : null
    const lifetimeDiscountBadge = catalog.lifetime.discountBadge || null

    return [
        {
            name: 'Free Starter',
            badge: 'Get Started',
            price: `${sym}0`,
            billing: 'Free forever · 14-day full premium trial',
            description: 'Instant access upon downloading the app. Start logging, tracking, and exploring your health baseline today.',
            isFree: true,
            features: [
                '14 Days Free Premium Trial included on login',
                'Smart NutriLogging (Indian & international meals, calories, macros & micros)',
                'Biomarker & Lab Report upload with trend tracking',
                'Medication & Supplement reminders with adherence logs',
                'Wearable & Smartwatch connection (Fitbit, Apple Watch & more)',
                'AI Nutrition & Workout assistant guidance',
                'Digital Twin health baseline preview & live vitals monitoring',
                'One Health Record repository for all medical documents',
            ],
            ctaText: 'Download on Google Play',
            ctaLink: PLAY_STORE_URL,
            external: true,
        },
        {
            name: 'Weekly Premium',
            badge: 'Most Flexible',
            price: `${sym}${weeklyRef}/week`,
            billing: isINR ? `billed monthly (~${sym}${Math.round(weeklyRef * 4.33)}/mo)` : `billed monthly (~${sym}${(weeklyRef * 4.33).toFixed(2)}/mo)`,
            description: 'Complete AI health assistance and unlimited monitoring for active individuals.',
            isFree: false,
            features: [
                'All Free tier features included',
                'Continuous AI Health Insights and early drift detection',
                'Nutrition label scanner for packaged foods',
                'Doctor Connect — share records directly for consultations',
                'Advanced exercise filtering & personalized progression',
                'Unlimited medical records storage & instant export',
                'Priority support',
            ],
            ctaText: 'Start Premium',
            ctaLink: '/subscribe/eviolife',
            external: false,
        },
        {
            name: 'Yearly Premium',
            badge: 'Save ~20%',
            price: `${sym}${isINR ? Math.round(yearlyAmt) : yearlyAmt.toFixed(2)}`,
            billing: `per year (less than ${sym}${isINR ? Math.round(yearlyAmt / 12) : (yearlyAmt / 12).toFixed(2)}/month)`,
            description: 'The best value plan for individuals & families serious about proactive longevity.',
            isFree: false,
            features: [
                'All Weekly Premium features included',
                'Full year of continuous health tracking & AI biomarker trends',
                'Family monitoring for up to 7 members (8% off each extra seat)',
                'Parent Mode & growth milestones tracking',
                'Health Marketplace priority booking & verified clinic discounts',
                '256-bit encrypted secure cloud backup',
                'Priority 24/7 customer & clinician support',
            ],
            ctaText: 'Get Yearly Plan',
            ctaLink: '/subscribe/eviolife',
            external: false,
        },
        {
            name: 'Lifetime Premium',
            badge: lifetimeDiscountBadge || 'Best Deal',
            price: `${sym}${isINR ? Math.round(lifetimeAmt) : lifetimeAmt.toFixed(2)}`,
            originalPrice: lifetimeOriginal ? `${sym}${lifetimeOriginal.toFixed(2)}` : null,
            discountBadge: lifetimeDiscountBadge,
            billing: 'Pay once · premium for 50 years',
            description: 'One payment, decades of health intelligence. Never worry about renewals again.',
            isFree: false,
            features: [
                'All Yearly Premium features included',
                'Lifetime premium access — 50 years guaranteed',
                'All future feature updates included',
                'Family monitoring for up to 7 members',
                'Priority lifetime support',
                'Locked in at today\'s price forever',
            ],
            ctaText: 'Get Lifetime Access',
            ctaLink: '/subscribe/eviolife',
            external: false,
        },
    ]
}

export default function EviolifeDetail() {
    const [openFaqIndex, setOpenFaqIndex] = useState(null)
    const [hoveredFeature, setHoveredFeature] = useState(null)
    const progressRef = useRef(null)

    const currency = useMemo(() => isSouthAsiaByTimezone() ? 'INR' : 'USD', [])
    const eviolifePlans = useMemo(() => buildEviolifePlans(currency), [currency])

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

    const scrollToPlans = (e) => {
        e.preventDefault()
        const plansSection = document.querySelector('#pricing-plans-section')
        if (plansSection) {
            plansSection.scrollIntoView({ behavior: 'smooth' })
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
                            style={{ background: accentColor, display: 'inline-flex', alignItems: 'center', gap: '0.65rem' }}
                        >
                            <PlayStoreIcon />
                            Get it on Google Play
                        </a>
                        <a
                            href="#pricing-plans-section"
                            onClick={scrollToPlans}
                            className="btn btn-secondary btn-large"
                        >
                            View Plans
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

            {/* Plans & Pricing */}
            <section className="product-detail__plans" id="pricing-plans-section">
                <div className="container">
                    <div className="section-header" style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
                        <span className="product-detail__faq-label" style={{ color: accentColor }}>Transparent Pricing</span>
                        <h2 className="product-detail__features-title">
                            Simple Plans <span style={{ color: accentColor }}>for Every Health Goal</span>
                        </h2>
                        <p className="product-detail__faq-subtitle" style={{ marginBottom: 0 }}>
                            Get started free with a 14-day trial of all premium features included upon sign-in. Upgrade anytime for deeper continuous analytics and family sharing.
                        </p>
                    </div>

                    <div className="product-detail__plans-grid">
                        {eviolifePlans.map((plan) => (
                            <div
                                key={plan.name}
                                className={`product-detail__plan-card ${plan.isFree ? 'product-detail__plan-card--free' : ''}`}
                            >
                                <div className="product-detail__plan-badge">{plan.badge}</div>
                                <h3 className="product-detail__plan-name">{plan.name}</h3>
                                <div className="product-detail__plan-price-wrap">
                                    {plan.originalPrice && (
                                        <span className="product-detail__plan-original-price">{plan.originalPrice}</span>
                                    )}
                                    {plan.discountBadge && (
                                        <span className="product-detail__plan-discount-badge">{plan.discountBadge}</span>
                                    )}
                                    <span className="product-detail__plan-price">{plan.price}</span>
                                    <span className="product-detail__plan-billing">{plan.billing}</span>
                                </div>
                                <p className="product-detail__plan-desc">{plan.description}</p>

                                <div className="product-detail__plan-features-header">
                                    {plan.isFree ? 'Included Free Benefits & Trial:' : 'Features & Benefits:'}
                                </div>
                                <ul className="product-detail__plan-features">
                                    {plan.features.map((feat, idx) => (
                                        <li key={idx} className="product-detail__plan-feature-item">
                                            <span className="product-detail__plan-feature-icon" aria-hidden="true">✓</span>
                                            <span>{feat}</span>
                                        </li>
                                    ))}
                                </ul>

                                <div className="product-detail__plan-action">
                                    {plan.external ? (
                                        <a
                                            href={plan.ctaLink}
                                            target="_blank"
                                            rel="noreferrer"
                                            className="btn btn-primary btn-large product-detail__plan-btn"
                                            style={{ background: accentColor, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '0.6rem', width: '100%' }}
                                        >
                                            <PlayStoreIcon />
                                            {plan.ctaText}
                                        </a>
                                    ) : (
                                        <Link
                                            to={plan.ctaLink}
                                            className="btn btn-secondary btn-large product-detail__plan-btn"
                                            style={{ width: '100%', textAlign: 'center' }}
                                        >
                                            {plan.ctaText} →
                                        </Link>
                                    )}
                                </div>
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
