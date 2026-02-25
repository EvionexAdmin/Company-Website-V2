import { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { initiatePayment } from '../utils/razorpay'
import './Pricing.css'

const plans = [
    {
        product: 'Gene Setu',
        tagColor: '#00bafd',
        target: 'For Hospitals & Healthcare Facilities',
        tiers: [
            {
                name: 'Gentic Testing Package',
                razorpayButtonId: 'pl_SKHB6XogP0LeER',
                price: '16,999',
                priceAmount: 1699900,
                period: '',
                description: 'For Individual',
                features: [
                    'Expert Personalized Counselling',
                    'WES Data Analysis',
                    'Neonatal Screening',
                    '6,000+ Disease Panel',
                    '24/7 Support',
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
            },
            {
                name: 'Health Network',
                price: 'Custom',
                priceAmount: 0,
                period: '',
                description: 'For hospital chains and health networks',
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
                name: 'Starter',
                price: '4,999',
                priceAmount: 499900,
                period: '/month',
                description: 'Perfect for small research labs getting started',
                features: [
                    'Up to 10 researchers',
                    'Electronic Lab Notebook',
                    'Basic Budget Tracking',
                    'Lab Calendar',
                    '5 GB Storage',
                    'Email Support',
                ],
                highlighted: false,
            },
            {
                name: 'Professional',
                price: '14,999',
                priceAmount: 1499900,
                period: '/month',
                description: 'Ideal for growing research organizations',
                features: [
                    'Up to 50 researchers',
                    'All Starter features',
                    'Advanced Analytics',
                    'Resource Booking',
                    'Lab Chat',
                    '50 GB Storage',
                    'Priority Support',
                    'Data Export & API',
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
                    'All Professional features',
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
                name: 'Basic',
                price: '2,999',
                priceAmount: 299900,
                period: '/month',
                description: 'Great for individual classrooms',
                features: [
                    'Up to 100 students',
                    'Digital Journals',
                    'AI-Driven Quizzes',
                    'Basic Analytics',
                    '10 GB Storage',
                    'Email Support',
                ],
                highlighted: false,
            },
            {
                name: 'Institution',
                price: '9,999',
                priceAmount: 999900,
                period: '/month',
                description: 'Complete solution for schools & colleges',
                features: [
                    'Up to 500 students',
                    'All Basic features',
                    'Interview Practice',
                    'Assignment Management',
                    'Performance Analytics',
                    'Collaboration Tools',
                    '100 GB Storage',
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

function RazorpayButton({ buttonId, highlighted, tagColor }) {
    const containerRef = useRef(null)

    useEffect(() => {
        if (!containerRef.current) return
        // Clear any previous content
        containerRef.current.innerHTML = ''
        const form = document.createElement('form')
        const script = document.createElement('script')
        script.src = 'https://checkout.razorpay.com/v1/payment-button.js'
        script.setAttribute('data-payment_button_id', buttonId)
        script.async = true
        form.appendChild(script)
        containerRef.current.appendChild(form)

        return () => {
            if (containerRef.current) {
                containerRef.current.innerHTML = ''
            }
        }
    }, [buttonId])

    return (
        <div
            ref={containerRef}
            className={`razorpay-btn-container ${highlighted ? 'razorpay-btn-highlighted' : ''}`}
            style={highlighted ? { '--rp-accent': tagColor } : {}}
        />
    )
}

export default function Pricing() {
    const [activeProduct, setActiveProduct] = useState(0)

    const handleSubscribe = (tierName, priceAmount, productName) => {
        if (priceAmount === 0) {
            // Enterprise - redirect to contact
            window.location.hash = '/contact'
            return
        }
        initiatePayment({
            planName: `${productName} - ${tierName}`,
            amount: priceAmount,
            onSuccess: (response) => {
                alert('Payment successful! Your subscription is now active.')
            },
            onFailure: (error) => {
                console.log('Payment failed or cancelled:', error)
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
                        <p>Flexible plans designed for organizations of all sizes. All plans include a 14-day free trial.</p>
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
                                    ) : (
                                        <>
                                            <span className="pricing-card__currency">₹</span>
                                            <span className="pricing-card__amount">{tier.price}</span>
                                            <span className="pricing-card__period">{tier.period}</span>
                                        </>
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
                                {tier.razorpayButtonId ? (
                                    <RazorpayButton
                                        buttonId={tier.razorpayButtonId}
                                        highlighted={tier.highlighted}
                                        tagColor={currentPlan.tagColor}
                                    />
                                ) : (
                                    <button
                                        className={`btn ${tier.highlighted ? 'btn-primary' : 'btn-secondary'} pricing-card__btn`}
                                        style={tier.highlighted ? { background: currentPlan.tagColor } : {}}
                                        onClick={() => handleSubscribe(tier.name, tier.priceAmount, currentPlan.product)}
                                    >
                                        {tier.isEnterprise ? 'Contact Sales' : 'Continue'}
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
