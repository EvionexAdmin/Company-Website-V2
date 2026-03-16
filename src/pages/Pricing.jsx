import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { initiatePayment } from '../utils/razorpay'
import './Pricing.css'

const plans = [
    {
        product: 'Gene Setu',
        tagColor: '#00bafd',
        target: 'For Individual, Families & Healthcare Providers',
        tiers: [
            {
                name: 'Genetic Testing Package',
                price: '19,500',
                originalPrice: '24,000',
                priceAmount: 1950000,
                period: '/person',
                description: 'One Package, life long benefits',
                features: [
                    'Expert Personalized Counselling',
                    'In-depth WES Data Analysis',
                    'Neonatal and Adult Screening',
                    '6,000+ Disease Panel',
                    'Nutrigenomic Profile',
                    'Pharmacogenomic Profile',
                    'Chronic Disease Risk Prediction',
                    'Geneticist Certified Report',
                    'Gene Setu+ Platform Access upto 1 year',
                ],
                highlighted: true,
            },
            {
                name: 'Blood Report Analysis',
                price: 'FREE',
                priceAmount: 0,
                period: '(Coming Soon)',
                description: 'Advance Blood Report Analysis With our State of the Art Expert AI Models',
                features: [
                    'Advanced AI/ML Report Analysis',
                    'Comprehensive Biomarker Insights',
                    'AI-Powered Health Diagnostics',
                    'Advanced Trend Analytics',
                    'HIPAA & DISHA Compliance',
                    'Gene Setu App Integration',

                ],
                highlighted: false,
                hideButton: true,
            },
            {
                name: 'Health Network',
                price: 'Custom',
                priceAmount: 0,
                period: '',
                description: 'For hospital chains and clinics',
                features: [
                    'Unlimited patient records',
                    'All Hospital features',
                    'Multi-facility management',
                    'Cross-facility analytics',
                    'Custom AI models',
                    'On-premise option',
                    '24/7 Support',
                    'Dedicated team',
                ],
                highlighted: false,
                isEnterprise: true,
            },
        ],
    },
    {
        product: 'EviNote',
        tagColor: '#00D4C8',
        target: 'For Research Labs & Institutions',
        tiers: [
            {
                name: 'Individual Labs',
                price: '700',
                priceAmount: 70000,
                period: '/user/month',
                description: 'Perfect for small research labs getting started',
                features: [
                    'Up to 10 Researchers',
                    'Electronic Lab Notebook',
                    'Basic Budget Tracking',
                    'Lab Calendar',
                    '5 GB Storage',
                    'Email Support',
                ],
                highlighted: true,
            },
            {
                name: 'Enterprise',
                price: 'Custom',
                priceAmount: 0,
                period: '',
                description: 'For large institutions with custom needs',
                features: [
                    'Unlimited researchers',
                    'AI Features',
                    'All Individual Lab features',
                    'Custom integrations',
                    'Dedicated account manager',
                    'On-premise deployment option',
                    'Unlimited Storage',
                    '24/7 Support',
                    'SLA guarantee',
                ],
                highlighted: false,
                isEnterprise: true,
            },
        ],
    },
    {
        product: 'Luminary',
        tagColor: '#ffae00',
        target: 'For Educational Institutions',
        tiers: [
            {
                name: 'Study Companion Pack',
                price: 'FREE',
                priceAmount: 0,
                period: '',
                description: 'Great for students trying out our product',
                features: [
                    'Smart Learning Techniques',
                    'Digital Journal Writing',
                    'AI-Driven Quizzes',
                    'National Exam Preparation',
                    'Basic Storage',
                    'Socratic AI',
                ],
                highlighted: false,
            },
            {
                name: 'Educator Pack',
                price: '300',
                priceAmount: 30000,
                period: '/student/month',
                description: 'Complete solution for clasrooms & tuitions',
                features: [
                    'Up to 150 students',
                    'All Basic features',
                    'Interview Practice',
                    'Subject Management',
                    'Assignment & Journal Management',
                    'Performance Analytics',
                    'Collaboration Tools',
                    '10 GB Storage/student',
                    'Priority Support',
                ],
                highlighted: true,
            },
            {
                name: 'University',
                price: 'Custom',
                priceAmount: 0,
                period: '',
                description: 'For universities and large institutions',
                features: [
                    'Unlimited students',
                    'All Institution features',
                    'Multi-department support',
                    'LMS integration',
                    'Custom branding',
                    'Unlimited Storage',
                    '24/7 Support',
                    'Dedicated success manager',
                ],
                highlighted: false,
                isEnterprise: true,
            },
        ],
    },
]


export default function Pricing() {
    const [activeProduct, setActiveProduct] = useState(0)

    const navigate = useNavigate()

    const handlePayOrQuote = (tierName, priceAmount, productName, isEnterprise) => {
        // Enterprise tiers and non-Gene Setu products -> contact page
        if (isEnterprise || productName !== 'Gene Setu') {
            navigate('/contact')
            return
        }

        // Gene Setu one-time payment via Razorpay
        initiatePayment({
            planName: `${productName} - ${tierName}`,
            amount: priceAmount,
            onSuccess: (response) => {
                alert(
                    `✅ Payment Successful!\n\n` +
                    `Your ${tierName} plan for ${productName} is now active.\n` +
                    `Payment ID: ${response.razorpay_payment_id}\n\n` +
                    `Our team will reach out to you shortly with onboarding details.`
                )
            },
            onFailure: (error) => {
                if (error.message !== 'Payment cancelled') {
                    console.error('Payment failed:', error)
                }
            },
        })
    }

    const currentPlan = plans[activeProduct]

    return (
        <div className="pricing-page">
            <section className="page-hero">
                <div className="container">
                    <div className="section-header animate-fade-in-up">
                        <span className="tag">Pricing</span>
                        <h1>Choose the Right <span className="text-gradient">Solution</span></h1>
                        <p>Flexible plans which we can proudly say are the best in the market</p>
                    </div>
                </div>
            </section>

            <section className="section">
                <div className="container">
                    {/* Product Tabs */}
                    <div className="pricing-tabs animate-fade-in-up">
                        {plans.map((plan, i) => (
                            <button
                                key={i}
                                className={`pricing-tab ${activeProduct === i ? 'pricing-tab--active' : ''}`}
                                onClick={() => setActiveProduct(i)}
                                style={activeProduct === i ? { borderColor: plan.tagColor, color: plan.tagColor } : {}}
                            >
                                <span className="pricing-tab__dot" style={{ background: plan.tagColor }}></span>
                                {plan.product}
                            </button>
                        ))}
                    </div>

                    {/* Target Audience */}
                    <p className="pricing-target animate-fade-in-up">{currentPlan.target}</p>

                    {/* Pricing Cards */}
                    <div className="pricing-grid animate-fade-in-up">
                        {currentPlan.tiers.map((tier, i) => (
                            <div
                                key={i}
                                className={`pricing-card ${tier.highlighted ? 'pricing-card--highlighted' : ''}`}
                                style={tier.highlighted ? { borderColor: currentPlan.tagColor + '60' } : {}}
                            >
                                {tier.highlighted && (
                                    <div className="pricing-card__badge" style={{ background: currentPlan.tagColor }}>
                                        Most Popular
                                    </div>
                                )}
                                <div className="pricing-card__header">
                                    <h3>{tier.name}</h3>
                                    <p className="pricing-card__desc">{tier.description}</p>
                                </div>
                                <div className="pricing-card__price">
                                    {tier.price === 'Custom' ? (
                                        <span className="pricing-card__amount">Custom</span>
                                    ) : tier.price === 'FREE' ? (
                                        <>
                                            <span className="pricing-card__amount">FREE</span>
                                            <span className="pricing-card__period">{tier.period}</span>
                                        </>
                                    ) : (
                                        <div className="pricing-card__price-stack">
                                            {tier.originalPrice && (
                                                <span className="pricing-card__original-price">₹{tier.originalPrice}</span>
                                            )}
                                            <div className="pricing-card__price-row">
                                                <span className="pricing-card__currency">₹</span>
                                                <span className="pricing-card__amount">{tier.price}</span>
                                                <span className="pricing-card__period">{tier.period}</span>
                                            </div>
                                        </div>
                                    )}
                                </div>
                                <ul className="pricing-card__features">
                                    {tier.features.map((feature, fi) => (
                                        <li key={fi}>
                                            <span className="pricing-check" style={{ color: currentPlan.tagColor }}>✓</span>
                                            {feature}
                                        </li>
                                    ))}
                                </ul>
                                {!tier.hideButton && (
                                    <button
                                        className={`btn ${tier.highlighted ? 'btn-primary' : 'btn-secondary'} pricing-card__btn`}
                                        style={tier.highlighted ? { background: currentPlan.tagColor } : {}}
                                        onClick={() => handlePayOrQuote(tier.name, tier.priceAmount, currentPlan.product, tier.isEnterprise)}
                                    >
                                        {tier.isEnterprise
                                            ? 'Contact Sales'
                                            : currentPlan.product === 'Gene Setu'
                                                ? 'Pay Now'
                                                : 'Get Quote'}
                                    </button>
                                )}
                            </div>
                        ))}
                    </div>

                    {/* FAQ / Info */}
                    <div className="pricing-info animate-fade-in-up">
                        <div className="cta-box" style={{ textAlign: 'center' }}>
                            <h3>Need a Custom Solution?</h3>
                            <p>
                                We offer tailored packages for institutions with unique needs.
                                Get in touch to discuss custom pricing, bulk discounts, and enterprise deployments.
                            </p>
                            <Link to="/contact" className="btn btn-primary btn-large">Contact Sales</Link>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    )
}
