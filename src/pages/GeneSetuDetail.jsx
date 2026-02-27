import { useState } from 'react'
import { Link } from 'react-router-dom'
import genesetuLogo from '../assets/images/products/genesetu-logo.png'
import './ProductDetail.css'

const accentColor = '#00bafd'

const overview = [
    {
        icon: '👶',
        title: 'What Does Gene Setu Do?',
        text: 'Gene Setu is a platform that screens an individual\'s DNA to check for over 6,000 inherited conditions from metabolic disorders to rare genetic diseases using a simple sample. You get a clear, certified report reviewed by a human geneticist.'
    },
    {
        icon: '💡',
        title: 'Why Early Screening Matters',
        text: 'Millions in India are affected by genetic conditions every year yet most are diagnosed years too late. Early detection means early action. Gene Setu puts that power in your hands from day one.'
    },
    {
        icon: '🏠',
        title: 'How Does It Work?',
        text: 'Order online. We will reach out and guide you to your nearest collection clinic. Your results reviewed by a geneticist are delivered within 3-4 weeks, along with 1 year of access to the Gene Setu health platform.'
    },
    {
        icon: '🤝',
        title: 'For Healthcare Professionals',
        text: 'Gene Setu is also built for doctors and clinics who want to offer genomic screening to their patients. Integrate Gene Setu into your care workflow.',
        link: { label: 'Contact us for integration →', to: '/contact' }
    },
]

const features = [
    { title: 'Screen for 6,000+ Conditions in One Test', desc: 'A single DNA sample screens for over 6,000 inherited conditions metabolic, neurological, cardiac, and more. No repeat tests. No guesswork. Results are reviewed by a certified geneticist and surfaced in plain language.', media: { src: '/media/genesetu/wes-results.mp4', type: 'video' } },
    { title: 'Know When Something Is Off Before It Becomes Serious', desc: 'Gene Setu tracks lab values, growth markers, and vital signs over time. Automated alerts notify you when anything drifts outside the healthy range, so you and your doctor can act early.', media: { src: '/media/genesetu/biomarker-tracking.mp4', type: 'video' } },
    { title: 'One Place for an Entire Health Story', desc: 'Vaccinations, prescriptions, lab reports, genetic data all in one secure timeline. Accessible instantly from any device, and shareable with any doctor in seconds.', media: { src: '/media/genesetu/ehr-repository.jpeg', type: 'image' } },
    { title: 'AI That Supports Your Doctor, Not Replaces Them', desc: 'Our AI flags early risk patterns and suggests possible conditions based on health data giving your doctor a head start. All findings are reviewed by clinicians before reaching you.', media: { src: '/media/genesetu/live-diagnostics.mp4', type: 'video' } },
    { title: 'Never Miss a Dose or a Dangerous Interaction', desc: 'Log every medication prescribed. Gene Setu sends reminders, tracks dosage history, and cross-checks against the genetic profile to flag any pharmacogenomic risks.', media: { src: '/media/genesetu/medication-tracking.mp4', type: 'video' } },
    { title: 'Eat Right Backed by DNA', desc: 'Log meals and feeding patterns and let Gene Setu\'s AI analyze nutrient intake against the genetic profile and health needs. Get personalised dietary guidance informed by real biology.', media: { src: '/media/genesetu/nutrilogging.mp4', type: 'video' } },
]

const featureLabels = [
    'WES Data Analysis',
    'Biomarker Tracking',
    'Life Record Management',
    'AI Diagnostics',
    'Medication Tracking',
    'NutriLogging',
]

const faqCategories = [
    {
        category: 'What is the Process?',
        icon: '🔬',
        faqs: [
            {
                q: 'What exactly happens after I place my order?',
                a: 'Once you place your order for the Gene Setu Genetic Testing Package, our team will reach out to you within 24 hours to schedule a convenient sample collection appointment. The sample will be collected at a clinic and that\'s it from your side. From there, the sample is securely transported to our own accredited laboratory where Whole Exome Sequencing (WES) is performed, and the genetic data is analyzed by us and reviewed by a qualified geneticist before the final report is delivered to you.'
            },
            {
                q: 'How is the genetic sample collected - is it a blood test, saliva swab, or something else?',
                a: 'The sample collection process is gentle and minimally invasive. Depending on the individual\'s age, a small blood or saliva sample is collected. For infants, a simple heel prick is used. The procedure takes just a few seconds, and we ensure that the process is as comfortable as possible.'
            },
            {
                q: 'Can the sample be collected at home or do I need to visit a collection center?',
                a: 'With our widespread network of doctors across India, we will make sure that you don\'t have to travel too far to secure health for you or your family.'
            },
            {
                q: 'Which certified labs process the WES (Whole Exome Sequencing) data?',
                a: 'Your sample is processed at our own laboratory which is NABL-accredited and follows stringent international quality standards. We use next-generation sequencing platforms to perform Whole Exome Sequencing with industry-leading accuracy. Every step from DNA extraction to variant analysis is carried out under strict quality controls to ensure reliable and reproducible results.'
            },
            {
                q: 'How long does it take to receive the results?',
                a: 'From the time your sample reaches the laboratory, you can expect to receive your Geneticist Certified Report within 3-4 Weeks (or earlier in some cases) after sample collection. We know the waiting period can feel anxious, so our team will keep you updated on the progress of your report and you will be able to track its progress through the Gene Setu app and our website. Once ready, you will receive a notification and can access the full report through the Gene Setu+ platform along with a downloadable PDF.'
            },
        ]
    },
    {
        category: 'What Do I Get?',
        icon: '📋',
        faqs: [
            {
                q: 'What does the Geneticist Certified Report include?',
                a: 'The report is a comprehensive, easy-to-understand document that covers the results of the Whole Exome Sequencing analysis across 6,000+ genetic conditions. It includes a summary of any identified genetic variants, their clinical significance, carrier status information, and pharmacogenomic insights that may be relevant to future health. The report is reviewed and certified by a qualified geneticist to ensure medical accuracy before it reaches you. From there on you will be guided by your doctor, who will assist you in understanding the report and provide you with the best possible care.'
            },
            {
                q: 'Who is the geneticist reviewing the report what are their qualifications?',
                a: 'Every Gene Setu report is reviewed by a board-certified clinical geneticist with a specialization in medical genetics and genomics. Our geneticists hold qualifications such as MD/DNB in Medical Genetics or equivalent credentials recognized by Indian medical bodies. They bring years of experience in interpreting next-generation sequencing data, ensuring that every flagged variant is clinically validated and contextualized for the individual\'s health profile.'
            },
            {
                q: 'What does "6,000+ diseases screened" mean in practice will I receive results for all of them?',
                a: 'When we say 6,000+ diseases screened, it means our AI and sequencing pipeline analyzes the exome data against a database of over 6,000 known genetic conditions. Your final report will highlight only the findings that are clinically significant meaning conditions where a disease-causing or carrier variant has been identified. You will not receive 6,000 separate results; instead, you get a focused, meaningful report that tells you exactly what matters for health.'
            },
            {
                q: 'What is the Gene Setu+ platform and what can I do with it during my 1-year access?',
                a: 'Gene Setu+ is a personal digital health companion. During your 1-year access, you can view the full genetic report, track health milestones and biomarkers, log vaccinations and medications, and receive AI-powered health insights personalized to the genetic profile. Think of it as a secure, intelligent health diary that grows with you and keeps you aware of any potential health issues. Should you choose to extend your access, the medical reports you process and submit through the Gene Setu+ platform will be continually analysed and we will provide you with relevant health insights and recommendations.'
            },
        ]
    },
    {
        category: 'Is It Safe and Private?',
        icon: '🔒',
        faqs: [
            {
                q: 'How is the genomic data stored and protected?',
                a: 'The genomic data is encrypted both in transit and at rest using industry-standard AES-256 encryption, the same level of security used by leading banks and healthcare institutions worldwide. Access to the data is strictly controlled through multi-factor authentication and role-based permissions. Our servers are hosted in secure, compliant data centres, and no one not even our own team can access the raw genetic data without your explicit consent.'
            },
            {
                q: 'Is Gene Setu compliant with India\'s DISHA (Digital Information Security in Healthcare Act)?',
                a: 'Gene Setu is designed with privacy-first architecture and is built to comply with India\'s emerging Digital Information Security in Healthcare Act (DISHA) framework, as well as existing IT Act provisions related to sensitive personal data. We follow the highest standards of data governance, including purpose limitation, data minimization, and consent-based processing. As DISHA regulations continue to evolve, we are committed to meeting and exceeding every requirement to protect your family\'s data.'
            },
            {
                q: 'Will the genetic data ever be shared with third parties?',
                a: 'Absolutely not, the genetic data will never be shared with any third party without your explicit consent and even then we do not sell, trade, or share personal genomic data with insurance companies, employers, pharmaceutical firms, or any other external entity. Your data belongs to you and your family alone. If there is ever a research opportunity that could benefit public health, we will always seek your informed consent separately before any anonymized data is considered.'
            },
            {
                q: 'What happens to my data after the 1-year platform access expires?',
                a: 'After your 1-year Gene Setu+ access period ends, you will have the option to renew your subscription to continue enjoying the full platform features. If you choose not to renew, your genetic report and key health records will remain available for download for export indefinitely but will not be analysed further. You may also request a complete data export or permanent deletion at any time we believe you should have full control over your family\'s health data.'
            },
        ]
    },
    {
        category: 'Is This Medically Credible?',
        icon: '🏅',
        faqs: [
            {
                q: 'Is Gene Setu approved or recognized by any Indian medical body (ICMR, NMC, NABL)?',
                a: 'Our own laboratories are NABL-accredited, which is the gold standard for clinical laboratories in India. Our platform and processes are developed in alignment with ICMR guidelines for genomic research and diagnostics. While genetic screening platforms in India do not currently require a separate NMC approval, Gene Setu adheres to all applicable regulatory frameworks and industry best practices to ensure clinical credibility and patient safety.'
            },
            {
                q: 'Are the labs used for WES NABL-accredited or internationally certified (CLIA/CAP)?',
                a: 'Yes, our own laboratory is NABL-accredited, ensuring it meets rigorous national quality benchmarks. We also hold international certifications such as CAP (College of American Pathologists) and CLIA (Clinical Laboratory Improvement Amendments), which are recognized globally as markers of laboratory excellence. This means the sample is processed to the same standards followed by world-class genomics labs.'
            },
            {
                q: 'What clinical evidence supports the accuracy of Gene Setu\'s AI diagnostics?',
                a: 'Gene Setu\'s AI is used strictly to monitor and process the downstream metrics from our WES results, not for raw data processing. Our variant interpretation pipeline follows the guidelines set by the American College of Medical Genetics and Genomics (ACMG), which is the international benchmark for clinical variant classification. Every flagged finding is additionally reviewed by a human geneticist, ensuring a dual layer of accuracy before any result reaches you.'
            },
        ]
    },
    {
        category: 'Counselling and Follow-Up',
        icon: '🤝',
        faqs: [
            {
                q: 'What does the "Expert Personalized Counselling" include who provides it and when?',
                a: 'Once the Geneticist Certified Report is ready, you will receive a one-on-one genetic counselling session with a doctor. During this session, the doctor will walk you through the report findings in simple, non-technical language, answer all your questions, and help you understand what the results mean for health. The session is typically conducted either physically or over a video call at a time that suits you, and there is no additional charge for this consultation.'
            },
            {
                q: 'What do I do if the report flags a genetic condition?',
                a: 'First, please know that a flagged finding does not necessarily mean the individual will develop a condition it means that you still have time to take appropriate measures. You will be referred by a doctor to a geneticist who will explain the specific finding in detail and recommend appropriate next steps, which may include confirmatory testing, specialist referrals, or simply monitoring. Gene Setu is designed to catch potential issues early so that you and your doctor can take timely, informed action in the best window for intervention.'
            },
            {
                q: 'Does Gene Setu connect me with doctors or specialists for follow-up care?',
                a: 'Yes, if the report identifies a finding that requires specialist attention, our care coordination team will help connect you with relevant specialists, clinical geneticists, or metabolic disorder experts in your city. We maintain a referral network of trusted healthcare professionals across India who are experienced in managing genetic conditions. Our goal is to ensure that you are never left navigating the next steps alone.'
            },
        ]
    },
    {
        category: 'Pricing and Logistics',
        icon: '💰',
        faqs: [
            {
                q: 'Is the ₹16,999 a one-time fee or are there hidden costs?',
                a: 'The ₹16,999 is a single, all-inclusive fee with absolutely no hidden charges. This price covers everything home sample collection, Whole Exome Sequencing, AI-powered analysis, the Geneticist Certified Report, one personalized genetic counselling session, and 1 year of access to the Gene Setu+ platform. There are no surprise add-ons, lab fees, or consultation charges beyond what is included in the package.'
            },
            {
                q: 'What is included in the 1-year Gene Setu+ platform access?',
                a: 'Your 1-year Gene Setu+ subscription gives you full access to a digital health profile, including the detailed genetic report, biomarker tracking dashboard, vaccination and medication logs, nutritional insights, and AI-powered health recommendations. You can also securely share the report with your doctor or specialist directly from the platform. After the first year, you may choose to renew the subscription to continue using all platform features.'
            },
            {
                q: 'Can I get a refund if I change my mind before the test is conducted?',
                a: 'Yes, we offer a full refund if you cancel your order before the sample has been collected and dispatched to the laboratory. Once the sample reaches the lab and processing begins, cancellation is no longer possible due to the nature of genomic sequencing. If you have any concerns or second thoughts, we encourage you to speak with our care team they are happy to address any questions before you proceed.'
            },
            {
                q: 'Is this available across all cities in India or only in select locations?',
                a: 'Gene Setu is currently available in Mumbai, Delhi, Bangalore, Hyderabad, Chennai, Pune, Kolkata, Ahmedabad and is expanding rapidly to Tier-2 and Tier-3 cities. If your city is not yet covered, you can still access the service by visiting one of our NABL-accredited laboratories near you. Please check with our care team for the latest availability in your area.'
            },
        ]
    },
]

const trustBarItems = [
    { icon: '🏥', label: 'NABL-Accredited Labs' },
    { icon: '📋', label: 'Geneticist-Certified Reports' },
    { icon: '🔒', label: 'DISHA Compliant' },
    { icon: '🧬', label: '6,000+ Diseases Screened' },
]

export default function GeneSetuDetail() {
    const [openFaqIndex, setOpenFaqIndex] = useState(null)

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
                <div className="container" style={{ textAlign: 'center' }}>
                    <img src={genesetuLogo} alt="Gene Setu" className="product-detail__hero-logo" style={{ '--logo-glow': accentColor }} />
                    <h1 className="product-detail__hero-title">Gene Setu</h1>
                    <span className="product-detail__hero-type" style={{ color: accentColor, borderColor: accentColor + '40', background: accentColor + '15', border: `1px solid ${accentColor}40` }}>
                        Healthcare Solution
                    </span>
                    <p className="product-detail__hero-desc">
                        Give yourself or your family the most complete health start possible. We screen for 6,000+ genetic conditions using advanced DNA analysis and keep the complete health record safe for life.
                    </p>

                    {/* CTA Buttons */}
                    <div className="product-detail__hero-buttons">
                        <Link to="/pricing" className="btn btn-primary btn-large" style={{ background: accentColor }}>
                            I'm Interested
                        </Link>
                        <a href="#features" onClick={scrollToFeatures} className="btn btn-secondary btn-large">
                            See How It Works ↓
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
                            About <span style={{ color: accentColor }}>Gene Setu</span>
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
                        Everything Gene Setu Does <span style={{ color: accentColor }}>For individuals of all ages</span>
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
                                <span className="product-detail__feature-num" style={{ color: accentColor }}>Feature {String(i + 1).padStart(2, '0')} {featureLabels[i]}</span>
                                <h3 className="product-detail__feature-title">{feature.title}</h3>
                                <p className="product-detail__feature-desc">{feature.desc}</p>
                            </div>
                        </div>
                    ))}
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
                            Everything you need to know about the Gene Setu Genetic Testing Package. We've answered the most common questions from people just like you.
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
                                Are you a clinician or hospital looking to integrate Gene Setu? Contact our team.
                            </p>
                            <Link to="/contact" className="btn btn-primary" style={{ background: accentColor, fontSize: '0.95rem', padding: '0.7rem 1.75rem' }}>
                                Integrate With Us →
                            </Link>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    )
}
