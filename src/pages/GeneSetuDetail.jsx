import { useState } from 'react'
import { Link } from 'react-router-dom'
import genesetuLogo from '../assets/images/products/genesetu-logo.png'
import './ProductDetail.css'

const accentColor = '#00bafd'

const overview = [
    {
        icon: '👶',
        title: 'What Does Gene Setu Do?',
        text: 'Gene Setu is a platform that screens your baby\'s DNA to check for over 6,000 inherited conditions from metabolic disorders to rare genetic diseases using a simple sample collected from your newborn. You get a clear, certified report reviewed by a human geneticist.'
    },
    {
        icon: '💡',
        title: 'Why Early Screening Matters',
        text: 'Over 1.7 million children in India are born with genetic conditions every year yet most are diagnosed years too late. Early detection means early action. Gene Setu puts that power in your hands from day one.'
    },
    {
        icon: '🏠',
        title: 'How Does It Work?',
        text: 'Order online. A certified technician visits your home to collect a small sample. Your results reviewed by a geneticist are delivered within 21 working days, along with 1 year of access to the Gene Setu health platform.'
    },
    {
        icon: '🤝',
        title: 'Are You a Doctor or Clinic?',
        text: 'Gene Setu is also built for pediatricians, OB-GYNs, and neonatal clinics who want to offer genomic screening to their patients. Partner with us to integrate Gene Setu into your care workflow.',
        link: { label: 'Learn about our partner program →', to: '/contact' }
    },
]

const features = [
    { title: 'Screen for 6,000+ Conditions in One Test', desc: 'A single DNA sample from your baby screens for over 6,000 inherited conditions metabolic, neurological, cardiac, and more. No repeat tests. No guesswork. Results are reviewed by a certified geneticist and surfaced in plain language.', media: { src: '/media/genesetu/wes-results.mp4', type: 'video' } },
    { title: 'Know When Something Is Off Before It Becomes Serious', desc: 'Gene Setu tracks your baby\'s lab values, growth markers, and vital signs over time. Automated alerts notify you when anything drifts outside the healthy range, so you and your doctor can act early.', media: { src: '/media/genesetu/biomarker-tracking.mp4', type: 'video' } },
    { title: 'One Place for Your Baby\'s Entire Health Story', desc: 'Vaccinations, prescriptions, lab reports, genetic data all in one secure timeline from birth. Accessible instantly from any device, and shareable with any doctor in seconds.', media: { src: '/media/genesetu/ehr-repository.jpeg', type: 'image' } },
    { title: 'AI That Supports Your Doctor, Not Replaces Them', desc: 'Our AI flags early risk patterns and suggests possible conditions based on your baby\'s data giving your doctor a head start. All findings are reviewed by clinicians before reaching you.', media: { src: '/media/genesetu/live-diagnostics.mp4', type: 'video' } },
    { title: 'Never Miss a Dose or a Dangerous Interaction', desc: 'Log every medication your baby is prescribed. Gene Setu sends reminders, tracks dosage history, and cross-checks against your baby\'s genetic profile to flag any pharmacogenomic risks.', media: { src: '/media/genesetu/medication-tracking.mp4', type: 'video' } },
    { title: 'Feed Your Baby Right Backed by Their DNA', desc: 'Log meals and feeding patterns and let Gene Setu\'s AI analyze nutrient intake against your baby\'s genetic profile and health needs. Get personalised dietary guidance informed by real biology.', media: { src: '/media/genesetu/nutrilogging.mp4', type: 'video' } },
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
                a: 'Once you place your order for the Gene Setu Genetic Testing Package, our team will reach out to you within 24 hours to schedule a convenient sample collection appointment. The sample will be collected at your family doctor\'s clinic/lab and that\'s it from your side. From there, the sample is then securely transported to our certified laboratory where Whole Exome Sequencing (WES) is performed, and your baby\'s genetic data is analyzed by our AI platform and reviewed by a qualified geneticist before the final report is delivered to you.'
            },
            {
                q: 'How is the genetic sample collected from my baby is it a blood test, saliva swab, or something else?',
                a: 'The sample collection process is gentle and minimally invasive. For newborns, a small blood sample is typically collected via a simple heel prick similar to what hospitals already do for standard newborn screenings. The procedure takes just a few seconds, and most babies barely notice it. Our trained collection professionals are experienced in working with infants and will ensure the process is as comfortable as possible for both you and your baby.'
            },
            {
                q: 'Can the sample be collected at home or do I need to visit a lab?',
                a: 'We understand that stepping out with a newborn can be stressful, so Gene Setu offers complimentary home sample collection in most major Indian cities. A certified phlebotomist will arrive at your doorstep at a time that works for you. If you prefer, you can also visit one of our NABL-accredited partner labs. During booking, our care coordinator will help you choose whichever option feels most comfortable.'
            },
            {
                q: 'Which certified labs process the WES (Whole Exome Sequencing) data?',
                a: 'Your baby\'s sample is processed at our partner facility in Navi Mumbai, which is NABL-accredited and follow stringent international quality standards. These laboratories use next-generation sequencing platforms like Illumina HiSeq to perform Whole Exome Sequencing with industry-leading accuracy. Every step from DNA extraction to variant analysis is carried out under strict quality controls to ensure reliable and reproducible results.'
            },
            {
                q: 'How long does it take to receive the results?',
                a: 'From the time your baby\'s sample reaches the laboratory, you can expect to receive your Geneticist Certified Report within 3-4 Weeks (or earlier in some cases) after sample collection. We know the waiting period can feel anxious, so our team will keep you updated on the progress of your report and you will be able to track its progress through the Gene Setu app and our website. Once ready, you will receive a notification and can access the full report through the Gene Setu+ platform along with a downloadable PDF.'
            },
        ]
    },
    {
        category: 'What Do I Get?',
        icon: '📋',
        faqs: [
            {
                q: 'What does the Geneticist Certified Report include?',
                a: 'Your report is a comprehensive, easy-to-understand document that covers the results of your baby\'s Whole Exome Sequencing analysis across 6,000+ genetic conditions. It includes a summary of any identified genetic variants, their clinical significance, carrier status information, and pharmacogenomic insights that may be relevant to your child\'s future health. The report is reviewed and certified by a qualified geneticist to ensure medical accuracy before it reaches you. From there on you will be guided by your family doctor affiliated with Gene Setu, who will assist you in understanding the report and provide you with the best possible care.'
            },
            {
                q: 'Who is the geneticist reviewing my baby\'s report what are their qualifications?',
                a: 'Every Gene Setu report is reviewed by a board-certified clinical geneticist with a specialization in medical genetics and genomics. Our geneticists hold qualifications such as MD/DNB in Medical Genetics or equivalent credentials recognized by Indian medical bodies. They bring years of experience in interpreting next-generation sequencing data, ensuring that every flagged variant is clinically validated and contextualized for your baby\'s health profile.'
            },
            {
                q: 'What does "6,000+ diseases screened" mean in practice will I receive results for all of them?',
                a: 'When we say 6,000+ diseases screened, it means our AI and sequencing pipeline analyzes your baby\'s exome data against a database of over 6,000 known genetic conditions. Your final report will highlight only the findings that are clinically significant meaning conditions where a disease-causing or carrier variant has been identified. You will not receive 6,000 separate results; instead, you get a focused, meaningful report that tells you exactly what matters for your child\'s health.'
            },
            {
                q: 'What is the Gene Setu+ platform and what can I do with it during my 1-year access?',
                a: 'Gene Setu+ is your baby\'s personal digital health companion. During your 1-year access, you can view the full genetic report, track your baby\'s health milestones and biomarkers, log vaccinations and medications, and receive AI-powered health insights personalized to your child\'s genetic profile. Think of it as a secure, intelligent health diary that grows with your baby and keeps you aware of any potential health issues. Should you choose to extend your access, the medical reports you process and submit through the Gene Setu+ platform will be continually analysed and we will provide you with relevant healthinsights and recommendations.'
            },
        ]
    },
    {
        category: 'Is It Safe and Private?',
        icon: '🔒',
        faqs: [
            {
                q: 'How is my baby\'s genomic data stored and protected?',
                a: 'Your baby\'s genomic data is encrypted both in transit and at rest using industry-standard AES-256 encryption, the same level of security used by leading banks and healthcare institutions worldwide. Access to the data is strictly controlled through multi-factor authentication and role-based permissions. Our servers are hosted in secure, compliant data centres, and no one not even our own team can access your baby\'s raw genetic data without your explicit consent.'
            },
            {
                q: 'Is Gene Setu compliant with India\'s DISHA (Digital Information Security in Healthcare Act)?',
                a: 'Gene Setu is designed with privacy-first architecture and is built to comply with India\'s emerging Digital Information Security in Healthcare Act (DISHA) framework, as well as existing IT Act provisions related to sensitive personal data. We follow the highest standards of data governance, including purpose limitation, data minimization, and consent-based processing. As DISHA regulations continue to evolve, we are committed to meeting and exceeding every requirement to protect your family\'s data.'
            },
            {
                q: 'Will my baby\'s genetic data ever be shared with third parties?',
                a: 'Absolutely not, your baby\'s genetic data will never be shared with any third party without your explicit consent and even then we do not sell, trade, or share personal genomic data with insurance companies, employers, pharmaceutical firms, or any other external entity. Your data belongs to you and your family alone. If there is ever a research opportunity that could benefit public health, we will always seek your informed consent separately before any anonymized data is considered.'
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
                a: 'Gene Setu\'s laboratory partners are NABL-accredited, which is the gold standard for clinical laboratories in India. Our platform and processes are developed in alignment with ICMR guidelines for genomic research and diagnostics. While genetic screening platforms in India do not currently require a separate NMC approval, Gene Setu adheres to all applicable regulatory frameworks and industry best practices to ensure clinical credibility and patient safety.'
            },
            {
                q: 'Are the labs used for WES NABL-accredited or internationally certified (CLIA/CAP)?',
                a: 'Yes, the laboratories we partner with for Whole Exome Sequencing are NABL-accredited, ensuring they meet rigorous national quality benchmarks. Several of our partner labs also hold international certifications such as CAP (College of American Pathologists) and CLIA (Clinical Laboratory Improvement Amendments), which are recognized globally as markers of laboratory excellence. This means your baby\'s sample is processed to the same standards followed by world-class genomics labs.'
            },
            {
                q: 'What clinical evidence supports the accuracy of Gene Setu\'s AI diagnostics?',
                a: 'Gene Setu\'s AI diagnostic engine has been trained and validated on thousands of clinically annotated and publicially available Indian genomic datasets. Our variant interpretation pipeline follows the guidelines set by the American College of Medical Genetics and Genomics (ACMG), which is the international benchmark for clinical variant classification. Every AI-flagged finding is additionally reviewed by a human geneticist, ensuring a dual layer of accuracy before any result reaches you.'
            },
        ]
    },
    {
        category: 'Counselling and Follow-Up',
        icon: '🤝',
        faqs: [
            {
                q: 'What does the "Expert Personalized Counselling" include who provides it and when?',
                a: 'Once your baby\'s Geneticist Certified Report is ready, you will receive a one-on-one genetic counselling session with a our partner doctor. During this session, the doctor will walk you through the report findings in simple, non-technical language, answer all your questions, and help you understand what the results mean for your baby\'s health. The session is typically conducted either physically or over a video call at a time that suits you, and there is no additional charge for this consultation.'
            },
            {
                q: 'What do I do if my baby\'s report flags a genetic condition?',
                a: 'First, please know that a flagged finding does not necessarily mean your baby will develop a condition it means that you still have time to take appropriate measures. You will be referred by your family doctor affiliated with us, to a geneticist who will explain the specific finding in detail and recommend appropriate next steps, which may include confirmatory testing, specialist referrals, or simply monitoring. Gene Setu is designed to catch potential issues early so that you and your paediatrician can take timely, informed action while your baby is still in the best window for intervention.'
            },
            {
                q: 'Does Gene Setu connect me with doctors or specialists for follow-up care?',
                a: 'Yes, if your baby\'s report identifies a finding that requires specialist attention, our care coordination team will help connect you with relevant paediatric specialists, clinical geneticists, or metabolic disorder experts in your city. We maintain a referral network of trusted healthcare professionals across India who are experienced in managing genetic conditions. Our goal is to ensure that you are never left navigating the next steps alone.'
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
                a: 'Your 1-year Gene Setu+ subscription gives you full access to your baby\'s digital health profile, including the detailed genetic report, biomarker tracking dashboard, vaccination and medication logs, nutritional insights, and AI-powered health recommendations. You can also securely share the report with your paediatrician or specialist directly from the platform. After the first year, you may choose to renew the subscription to continue using all platform features.'
            },
            {
                q: 'Can I get a refund if I change my mind before the test is conducted?',
                a: 'Yes, we offer a full refund if you cancel your order before the sample has been collected and dispatched to the laboratory. Once the sample reaches the lab and processing begins, cancellation is no longer possible due to the nature of genomic sequencing. If you have any concerns or second thoughts, we encourage you to speak with our care team they are happy to address any questions before you proceed.'
            },
            {
                q: 'Is this available across all cities in India or only in select locations?',
                a: 'Gene Setu is currently available in Mumbai, Delhi, Bangalore, Hyderabad, Chennai, Pune, Kolkata, Ahmedabad and is expanding rapidly to Tier-2 and Tier-3 cities. If your city is not yet covered, you can still access the service by visiting one of our NABL-accredited partner labs near you. Please check with our care team for the latest availability in your area.'
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
                        Give your baby the most complete health start possible. We screen your newborn for 6,000+ genetic conditions using advanced DNA analysis and keep their complete health record safe for life.
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
                        Everything Gene Setu Does <span style={{ color: accentColor }}>For Your Baby</span>
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
                        <span className="product-detail__faq-label" style={{ color: accentColor }}>For Parents</span>
                        <h2 className="product-detail__faq-title">
                            Frequently Asked <span style={{ color: accentColor }}>Questions</span>
                        </h2>
                        <p className="product-detail__faq-subtitle">
                            Everything you need to know about the Gene Setu Genetic Testing Package. We've answered the most common questions from parents just like you.
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
                                Are you a clinician or hospital looking to integrate Gene Setu? Visit our partner program page.
                            </p>
                            <Link to="/contact" className="btn btn-primary" style={{ background: accentColor, fontSize: '0.95rem', padding: '0.7rem 1.75rem' }}>
                                Partner With Us →
                            </Link>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    )
}
