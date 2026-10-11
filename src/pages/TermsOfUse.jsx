import usePageMetadata from '../lib/usePageMetadata'
import './PrivacyPolicy.css'

const LAST_UPDATED = 'April 21, 2026'

export default function TermsOfUse() {
    usePageMetadata({
        title: 'Terms of Use — Eviolife | Evionex',
        description:
            'The terms governing your use of the Eviolife application, including teleconsultation, payments, and healthcare provider listings.',
        canonicalPath: '/terms',
    })

    return (
        <div className="privacy-policy">
            {/* Hero Section */}
            <section className="privacy-hero">
                <div className="container">
                    <div className="section-header animate-fade-in-up">
                        <span className="tag">Legal</span>
                        <h1>Terms of <span className="text-gradient">Use</span></h1>
                        <p>Last Updated: {LAST_UPDATED}</p>
                    </div>
                </div>
            </section>

            {/* Terms Content */}
            <section className="privacy-content">
                <div className="container">

                    {/* 1. Acceptance of Terms */}
                    <div className="policy-section">
                        <h2 className="policy-section__title">
                            <span className="policy-number">1</span>
                            Acceptance of Terms
                        </h2>
                        <p>
                            By accessing or using the Eviolife mobile application (&quot;App&quot;), you agree to be
                            bound by these Terms of Use. If you do not agree to these terms, please do not use the App.
                        </p>
                    </div>

                    {/* 2. Description of Service */}
                    <div className="policy-section">
                        <h2 className="policy-section__title">
                            <span className="policy-number">2</span>
                            Description of Service
                        </h2>
                        <p>
                            Eviolife provides a biological monitoring and health analysis platform. The insights
                            provided, including the &quot;Bio-Report,&quot; &quot;Recovery Score,&quot; and
                            &quot;Cardiac Efficiency,&quot; are for informational and educational purposes only.
                        </p>
                    </div>

                    {/* 3. Not Medical Advice */}
                    <div className="policy-section">
                        <h2 className="policy-section__title">
                            <span className="policy-number">3</span>
                            Not Medical Advice
                        </h2>
                        <div className="policy-highlight">
                            <p>
                                <strong>CRITICAL: THE APP DOES NOT PROVIDE MEDICAL ADVICE.</strong>
                            </p>
                        </div>
                        <p>
                            The App is not intended to be a substitute for professional medical advice, diagnosis, or
                            treatment. Always seek the advice of your physician or other qualified health provider with
                            any questions you may have regarding a medical condition. Never disregard professional
                            medical advice or delay in seeking it because of something you have read on the App.
                        </p>
                    </div>

                    {/* 4. User Responsibilities */}
                    <div className="policy-section">
                        <h2 className="policy-section__title">
                            <span className="policy-number">4</span>
                            User Responsibilities
                        </h2>
                        <ul>
                            <li>You must be at least 18 years of age to use this App.</li>
                            <li>You are responsible for maintaining the confidentiality of your account credentials.</li>
                            <li>You agree to provide accurate information for use in health calculations.</li>
                        </ul>
                    </div>

                    {/* 5. Biometric Data Integration */}
                    <div className="policy-section">
                        <h2 className="policy-section__title">
                            <span className="policy-number">5</span>
                            Biometric Data Integration
                        </h2>
                        <p>
                            By enabling Health Connect integration, you authorize the App to read specific biometric
                            data points. The accuracy of the App&apos;s insights depends on the quality of the data
                            provided by your wearable devices and Health Connect.
                        </p>
                    </div>

                    {/* 6. Teleconsultation and Payments */}
                    <div className="policy-section">
                        <h2 className="policy-section__title">
                            <span className="policy-number">6</span>
                            Teleconsultation and Payments
                        </h2>
                        <p>
                            Teleconsultation services are provided by independent, verified medical practitioners.
                            Eviolife acts solely as a technology platform and payment facilitator.
                        </p>
                        <ul>
                            <li>
                                Consultation fees are collected by Eviolife and held in escrow until the consultation
                                is confirmed as completed through the App.
                            </li>
                            <li>
                                Once a consultation is confirmed, the fee is released to the practitioner, less the
                                applicable platform commission.
                            </li>
                            <li>Refunds are issued where a consultation does not take place through the App.</li>
                            <li>
                                Eviolife does not practise medicine and is not responsible for the clinical advice
                                given by a practitioner.
                            </li>
                        </ul>
                    </div>

                    {/* 7. Healthcare Provider Listings and Advertising */}
                    <div className="policy-section">
                        <h2 className="policy-section__title">
                            <span className="policy-number">7</span>
                            Healthcare Provider Listings and Advertising
                        </h2>
                        <p>
                            Healthcare providers may advertise their products and services on the platform. All
                            providers are manually verified before their listing is published. Eviolife does not
                            endorse, and is not responsible for, any product or service offered by a third-party
                            provider. Advertising content must comply with applicable law and must not make
                            unsubstantiated medical claims.
                        </p>
                    </div>

                    {/* 8. Intellectual Property */}
                    <div className="policy-section">
                        <h2 className="policy-section__title">
                            <span className="policy-number">8</span>
                            Intellectual Property
                        </h2>
                        <p>
                            All content, features, and functionality of the App are the exclusive property of Eviolife
                            and its licensors and are protected by international copyright, trademark, and other
                            intellectual property laws.
                        </p>
                    </div>

                    {/* 9. Limitation of Liability */}
                    <div className="policy-section">
                        <h2 className="policy-section__title">
                            <span className="policy-number">9</span>
                            Limitation of Liability
                        </h2>
                        <p>
                            To the maximum extent permitted by law, Eviolife shall not be liable for any indirect,
                            incidental, special, consequential, or punitive damages, or any loss of profits or
                            revenues.
                        </p>
                    </div>

                    {/* 10. Changes to Terms */}
                    <div className="policy-section">
                        <h2 className="policy-section__title">
                            <span className="policy-number">10</span>
                            Changes to Terms
                        </h2>
                        <p>
                            We reserve the right to modify these terms at any time. We will provide notice of
                            significant changes by posting the new terms on the App.
                        </p>
                    </div>

                    {/* 11. Governing Law */}
                    <div className="policy-section">
                        <h2 className="policy-section__title">
                            <span className="policy-number">11</span>
                            Governing Law
                        </h2>
                        <p>
                            These terms shall be governed by and construed in accordance with the laws of India, and
                            the courts of Pune, Maharashtra shall have exclusive jurisdiction.
                        </p>
                    </div>

                    {/* 12. Contact Information */}
                    <div className="policy-section">
                        <h2 className="policy-section__title">
                            <span className="policy-number">12</span>
                            Contact Information
                        </h2>
                        <p>For any questions regarding these Terms, please contact us:</p>

                        <div className="policy-contact-card">
                            <h3>Evionex Private Limited</h3>
                            <p><strong>Email:</strong> <a href="mailto:contact@evionex.com">contact@evionex.com</a></p>
                            <p><strong>Phone:</strong> <a href="tel:+919309019537">+91 9309019537</a></p>
                            <p><strong>Address:</strong> DP Road, Aundh, Haveli, Pune – 411007, Maharashtra, India</p>
                            <p><strong>Website:</strong> <a href="https://www.evionex.com" target="_blank" rel="noopener noreferrer">https://www.evionex.com</a></p>
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="policy-divider"></div>
                    <div className="policy-footer">
                        <p>
                            For any questions regarding these Terms, please contact us at{' '}
                            <a href="mailto:contact@evionex.com">contact@evionex.com</a>
                        </p>
                        <div className="policy-company-info">
                            <p>
                                <strong>Evionex Private Limited</strong><br />
                                CIN: U62011PN2025PTC246808<br />
                                DP Road, Aundh, Haveli, Pune – 411007, Maharashtra, India<br />
                                Website: <a href="https://www.evionex.com" target="_blank" rel="noopener noreferrer">https://www.evionex.com</a>
                            </p>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    )
}
