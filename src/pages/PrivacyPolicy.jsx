import './PrivacyPolicy.css'

export default function PrivacyPolicy() {
    return (
        <div className="privacy-policy">
            {/* Hero Section */}
            <section className="privacy-hero">
                <div className="container">
                    <div className="section-header animate-fade-in-up">
                        <span className="tag">Legal</span>
                        <h1>Privacy <span className="text-gradient">Policy</span></h1>
                        <p>Last Updated: March 2026 &nbsp;|&nbsp; Version 1.0</p>
                    </div>
                </div>
            </section>

            {/* Policy Content */}
            <section className="privacy-content">
                <div className="container">

                    {/* 1. Introduction */}
                    <div className="policy-section">
                        <h2 className="policy-section__title">
                            <span className="policy-number">1</span>
                            Introduction and Overview
                        </h2>

                        <h3 className="policy-subsection__title">1.1 About This Policy</h3>
                        <p>
                            This Privacy Policy ("Policy") is published by <strong>Evionex Private Limited</strong> (CIN: U62011PN2025PTC246808),
                            having its registered office at DP Road, Aundh, Haveli, Pune – 411007, Maharashtra, India
                            (hereinafter referred to as "Evionex", "we", "us", or "our"), in accordance with:
                        </p>
                        <ul>
                            <li>The Information Technology Act, 2000 and rules thereunder</li>
                            <li>The Information Technology (Reasonable Security Practices and Procedures and Sensitive Personal Data or Information) Rules, 2011 ("IT-SPDI Rules")</li>
                            <li>The Digital Personal Data Protection Act, 2023 ("DPDP Act") and all rules and regulations issued thereunder</li>
                            <li>The General Data Protection Regulation (EU) 2016/679 ("GDPR") – applicable to users in the European Economic Area</li>
                            <li>All other applicable Indian and international data protection laws and regulations</li>
                        </ul>
                        <p>This Policy describes how we collect, use, store, share, and protect your personal data when you:</p>
                        <ul>
                            <li>Visit and use our website at <a href="https://www.evionex.com" target="_blank" rel="noopener noreferrer">https://www.evionex.com</a> ("Website")</li>
                            <li>Use our healthcare platform <strong>Gene Setu</strong> (for patients, doctors, and healthcare institutions)</li>
                            <li>Use our research and laboratory management platform <strong>EviNote</strong> (for research bodies, laboratories, and principal investigators)</li>
                            <li>Use our educational platform <strong>Luminary</strong> (for universities and academic institutions)</li>
                            <li>Avail our genetic testing and genomic analysis services</li>
                            <li>Interact with any of our products, services, or communications (collectively, "Services")</li>
                        </ul>

                        <h3 className="policy-subsection__title">1.2 Scope and Applicability</h3>
                        <p>This Policy applies to:</p>
                        <ul>
                            <li>Patients and their authorized guardians or legal representatives using Gene Setu</li>
                            <li>Healthcare professionals (doctors, clinicians, genetic counselors) using Gene Setu</li>
                            <li>Healthcare institutions and clinical partners collaborating with Evionex</li>
                            <li>Researchers, scientists, and principal investigators using EviNote</li>
                            <li>Laboratories and research organizations using EviNote</li>
                            <li>University students, educators, and academic administrators using Luminary</li>
                            <li>Visitors to our Website</li>
                            <li>Any person interacting with Evionex in any capacity</li>
                        </ul>

                        <h3 className="policy-subsection__title">1.3 Acceptance of This Policy</h3>
                        <p>
                            By accessing our Website, registering an account, using any of our platforms or applications,
                            or availing our Services, you acknowledge that you have read, understood, and consent to the
                            practices described in this Privacy Policy. If you do not agree with this Policy, you must
                            immediately discontinue the use of our Services.
                        </p>
                        <div className="policy-highlight">
                            <p>
                                <strong>Note for Minors:</strong> For users who are minors or lack legal capacity (including patients
                                undergoing testing as newborns or children), consent shall be provided by a parent, legal guardian,
                                or authorized representative. By providing consent on behalf of a minor or legally incapacitated
                                individual, the guardian represents and warrants that they are legally authorized to do so.
                            </p>
                        </div>
                    </div>

                    {/* 2. Data We Collect */}
                    <div className="policy-section">
                        <h2 className="policy-section__title">
                            <span className="policy-number">2</span>
                            Data We Collect
                        </h2>

                        <h3 className="policy-subsection__title">2.1 Categories of Personal Data</h3>
                        <p>We collect the following categories of personal data depending on the Services you use:</p>

                        <p className="policy-category">A. Account and Identity Information</p>
                        <ul>
                            <li>Full name, username, date of birth, age, gender (optional)</li>
                            <li>Email address, phone number, residential address</li>
                            <li>Profile photo (optional)</li>
                            <li>Organization name, designation, professional registration number (for healthcare professionals and researchers)</li>
                            <li>Government-issued identification (where required by law or for regulatory compliance)</li>
                        </ul>

                        <p className="policy-category">B. Health and Medical Data (Sensitive Personal Data)</p>
                        <p>Collected primarily through Gene Setu and our genetic testing services:</p>
                        <ul>
                            <li>Genetic and genomic data, including raw sequencing data, variant reports, and interpreted results</li>
                            <li>Medical history, family medical history, and clinical information</li>
                            <li>Diagnostic records, laboratory reports, and medical imaging</li>
                            <li>Prescription and medication history</li>
                            <li>Blood group, biometric data, and physical health parameters</li>
                            <li>Nutrigenomic and pharmacogenomic profiles</li>
                            <li>Clinical indication, diagnosis, and physician notes</li>
                            <li>Patient-provided health tracking data (nutrition, lifestyle, supplements, medications)</li>
                        </ul>

                        <p className="policy-category">C. Research Data</p>
                        <p>Collected through EviNote:</p>
                        <ul>
                            <li>Experimental data, protocols, and laboratory notebooks</li>
                            <li>Research project details, datasets, and publications</li>
                            <li>Institutional and funding information</li>
                            <li>Collaboration and team member information</li>
                        </ul>

                        <p className="policy-category">D. Educational Data</p>
                        <p>Collected through Luminary:</p>
                        <ul>
                            <li>Academic records, enrollment details, course progress</li>
                            <li>Learning analytics and assessment data</li>
                            <li>Institutional affiliation</li>
                        </ul>

                        <p className="policy-category">E. Financial and Transactional Data</p>
                        <ul>
                            <li>Payment transaction details processed through Razorpay (our PCI-DSS compliant payment gateway)</li>
                            <li>Invoice and billing information</li>
                            <li>Subscription plan details</li>
                        </ul>
                        <div className="policy-highlight">
                            <p>
                                <strong>Note:</strong> Evionex does not store your complete card numbers, CVV, or UPI PINs.
                                All payment processing is handled by Razorpay under their privacy and security policies.
                            </p>
                        </div>

                        <p className="policy-category">F. Technical and Usage Data</p>
                        <ul>
                            <li>IP address, device type, operating system, browser type and version</li>
                            <li>App version, session duration, pages or features accessed</li>
                            <li>Error logs, crash reports, and diagnostic data</li>
                            <li>Cookies and similar tracking technologies (see Clause 7)</li>
                            <li>Log-in timestamps and access records</li>
                        </ul>

                        <p className="policy-category">G. Communication Data</p>
                        <ul>
                            <li>Emails and messages sent to our support team</li>
                            <li>Feedback, survey responses, and testimonials</li>
                            <li>Notifications sent for authentication, order tracking, and service updates</li>
                        </ul>

                        <h3 className="policy-subsection__title">2.2 Data We Do Not Collect</h3>
                        <p>We do not collect:</p>
                        <ul>
                            <li>Financial account credentials, full payment card numbers, or CVV codes</li>
                            <li>Passwords (we store only cryptographically hashed versions)</li>
                            <li>Any data that is not necessary for the purpose declared at the time of collection</li>
                        </ul>

                        <h3 className="policy-subsection__title">2.3 Data Collected from Minors and Guardians</h3>
                        <p>
                            For patients who are minors (below 18 years of age) or newborns (including those undergoing
                            newborn genetic screening), we collect data from and with the documented consent of a parent,
                            legal guardian, or authorized representative. The guardian is responsible for providing accurate
                            information and for maintaining the confidentiality of account access. We will not process a
                            minor's sensitive health or genetic data without verifiable guardian consent.
                        </p>
                    </div>

                    {/* 3. How We Collect Your Data */}
                    <div className="policy-section">
                        <h2 className="policy-section__title">
                            <span className="policy-number">3</span>
                            How We Collect Your Data
                        </h2>
                        <p>We collect personal data through the following means:</p>
                        <ul>
                            <li><strong>Direct submission:</strong> When you register an account, complete forms, submit test orders, upload records, or communicate with us</li>
                            <li><strong>Clinical Partner submissions:</strong> When a healthcare institution or doctor submits your information on your behalf for genetic testing, with your prior informed consent</li>
                            <li><strong>Our applications:</strong> When you interact with Gene Setu, EviNote, or Luminary</li>
                            <li><strong>Automated collection:</strong> Through cookies, server logs, and similar technologies when you use our Website or applications</li>
                            <li><strong>Payment processors:</strong> Transaction metadata from Razorpay upon completion of payments</li>
                            <li><strong>Third-party integrations:</strong> With your explicit authorization, from connected health devices or healthcare information systems</li>
                        </ul>
                    </div>

                    {/* 4. How We Use Your Data */}
                    <div className="policy-section">
                        <h2 className="policy-section__title">
                            <span className="policy-number">4</span>
                            How We Use Your Data
                        </h2>
                        <p>We use your personal data only for the specific, lawful purposes described below:</p>

                        <h3 className="policy-subsection__title">4.1 Gene Setu – Healthcare Platform</h3>
                        <div className="policy-table-wrapper">
                            <table className="policy-table">
                                <thead>
                                    <tr>
                                        <th>Purpose</th>
                                        <th>Legal Basis</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr><td>Creating and managing your patient or healthcare professional account</td><td>Consent / Contract</td></tr>
                                    <tr><td>Processing genetic test orders and sample logistics</td><td>Contract performance</td></tr>
                                    <tr><td>Conducting genetic analysis and generating clinical-grade reports</td><td>Consent / Contract</td></tr>
                                    <tr><td>Sharing reports with your designated doctor or clinical partner</td><td>Consent</td></tr>
                                    <tr><td>Providing genetic counseling services (if opted)</td><td>Consent / Contract</td></tr>
                                    <tr><td>Enabling post-report consultation between patient and healthcare provider</td><td>Consent</td></tr>
                                    <tr><td>Maintaining your health records and test history</td><td>Consent / Legal obligation</td></tr>
                                    <tr><td>Sending order status updates and report delivery notifications</td><td>Contract performance</td></tr>
                                </tbody>
                            </table>
                        </div>

                        <h3 className="policy-subsection__title">4.2 EviNote – Research Platform</h3>
                        <div className="policy-table-wrapper">
                            <table className="policy-table">
                                <thead>
                                    <tr>
                                        <th>Purpose</th>
                                        <th>Legal Basis</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr><td>Managing research accounts for PIs, researchers, and lab personnel</td><td>Contract</td></tr>
                                    <tr><td>Facilitating collaboration on research projects and data sharing</td><td>Consent / Contract</td></tr>
                                    <tr><td>Storing and organizing experimental data, protocols, and publications</td><td>Contract performance</td></tr>
                                    <tr><td>Providing analytics and insights on research productivity</td><td>Legitimate interest</td></tr>
                                </tbody>
                            </table>
                        </div>

                        <h3 className="policy-subsection__title">4.3 Luminary – Educational Platform</h3>
                        <div className="policy-table-wrapper">
                            <table className="policy-table">
                                <thead>
                                    <tr>
                                        <th>Purpose</th>
                                        <th>Legal Basis</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr><td>Managing student and educator accounts</td><td>Contract</td></tr>
                                    <tr><td>Delivering educational content and tracking course progress</td><td>Contract performance</td></tr>
                                    <tr><td>Conducting assessments and providing certifications</td><td>Contract performance</td></tr>
                                    <tr><td>Analyzing learning outcomes and platform engagement</td><td>Legitimate interest</td></tr>
                                </tbody>
                            </table>
                        </div>

                        <h3 className="policy-subsection__title">4.4 General Business Purposes</h3>
                        <p>We use your data for:</p>
                        <ul>
                            <li><strong>Customer support:</strong> Responding to inquiries, troubleshooting issues, and providing technical assistance</li>
                            <li><strong>Service improvement:</strong> Analyzing usage patterns to enhance user experience, develop new features, and improve platform performance</li>
                            <li><strong>Security and fraud prevention:</strong> Monitoring for suspicious activity, preventing unauthorized access, and ensuring platform security</li>
                            <li><strong>Legal compliance:</strong> Complying with applicable laws, regulations, court orders, and regulatory requirements</li>
                            <li><strong>Communication:</strong> Sending service-related updates, security alerts, and essential notifications (you cannot opt out of these)</li>
                            <li><strong>Marketing (with consent):</strong> Sending promotional emails about new features, services, or offers (you may opt out at any time)</li>
                            <li><strong>Research and development:</strong> Using anonymized or de-identified data for scientific research, algorithm improvement, and innovation (with appropriate consent where required)</li>
                        </ul>
                    </div>

                    {/* 5. Data Sharing and Disclosure */}
                    <div className="policy-section">
                        <h2 className="policy-section__title">
                            <span className="policy-number">5</span>
                            Data Sharing and Disclosure
                        </h2>

                        <h3 className="policy-subsection__title">5.1 When We Share Your Data</h3>
                        <p>We share your personal data only in the following circumstances:</p>

                        <p className="policy-category">A. With Your Consent</p>
                        <ul>
                            <li>Sharing genetic test reports with your designated healthcare provider or clinical partner</li>
                            <li>Sharing anonymized data with research collaborators (only with your explicit research consent)</li>
                            <li>Any other sharing explicitly authorized by you</li>
                        </ul>

                        <p className="policy-category">B. Service Providers and Processors</p>
                        <p>We engage trusted third-party service providers who process data on our behalf under strict confidentiality and data protection agreements:</p>
                        <ul>
                            <li><strong>Cloud infrastructure:</strong> Supabase (database services, located in Tokyo, Japan; stores encrypted patient login and authentication information)</li>
                            <li><strong>Payment processing:</strong> Razorpay (payment gateway for transaction processing)</li>
                            <li><strong>Email services:</strong> For authentication, order tracking, and service notifications (may be used for promotional communications with consent)</li>
                            <li><strong>Logistics partners:</strong> For sample collection and transportation (receive only necessary shipment details, not full medical records)</li>
                            <li><strong>Sequencing and analysis partners:</strong> Accredited laboratories for genetic testing (under data processing agreements)</li>
                        </ul>
                        <p>All third-party processors are contractually obligated to:</p>
                        <ul>
                            <li>Process data only as instructed by Evionex</li>
                            <li>Implement appropriate security measures</li>
                            <li>Maintain confidentiality</li>
                            <li>Delete or return data upon request</li>
                        </ul>

                        <p className="policy-category">C. Healthcare and Clinical Partners</p>
                        <p>With your consent, we share genetic test results and relevant clinical information with your referring doctor, hospital, or clinic to facilitate your medical care.</p>

                        <p className="policy-category">D. Research Collaborators</p>
                        <p>Only with your separate, explicit research consent, we may share anonymized or de-identified genetic data with:</p>
                        <ul>
                            <li>Research institutions and universities</li>
                            <li>Pharmaceutical or biotech companies for drug development</li>
                            <li>Scientific collaborators for publications or studies</li>
                        </ul>
                        <div className="policy-highlight">
                            <p><strong>Note:</strong> Anonymized data cannot be traced back to you individually.</p>
                        </div>

                        <p className="policy-category">E. Legal and Regulatory Requirements</p>
                        <p>We may disclose your data when required by law:</p>
                        <ul>
                            <li>In response to court orders, subpoenas, or legal processes</li>
                            <li>To comply with regulatory investigations or audits</li>
                            <li>To report adverse events or safety information to health authorities</li>
                            <li>To enforce our Terms of Service or protect our legal rights</li>
                            <li>To prevent fraud, security threats, or illegal activities</li>
                        </ul>

                        <p className="policy-category">F. Business Transfers</p>
                        <p>In the event of a merger, acquisition, reorganization, or sale of assets, your data may be transferred to the successor entity, subject to the same privacy protections.</p>

                        <h3 className="policy-subsection__title">5.2 We Do NOT Sell Your Data</h3>
                        <div className="policy-highlight">
                            <p>
                                <strong>Evionex does not sell, rent, or trade your personal data</strong> to any third party for
                                commercial purposes. Your genetic information, health records, and personal data are never sold
                                or used for advertising targeting.
                            </p>
                        </div>

                        <h3 className="policy-subsection__title">5.3 International Data Transfers</h3>
                        <ul>
                            <li>Our primary servers are located in <strong>India</strong>.</li>
                            <li>Our database infrastructure (Supabase) is located in <strong>Tokyo, Japan</strong>, with encrypted patient authentication data.</li>
                            <li>If you are located outside India or Japan, your data may be transferred to and processed in these jurisdictions.</li>
                            <li>We ensure that any international data transfer complies with applicable data protection laws, including implementing Standard Contractual Clauses (SCCs) or other approved mechanisms where required.</li>
                        </ul>
                    </div>

                    {/* 6. Data Retention and Deletion */}
                    <div className="policy-section">
                        <h2 className="policy-section__title">
                            <span className="policy-number">6</span>
                            Data Retention and Deletion
                        </h2>

                        <h3 className="policy-subsection__title">6.1 How Long We Keep Your Data</h3>
                        <p>We retain your personal data for as long as necessary to fulfill the purposes outlined in this Policy, comply with legal obligations, or until you request deletion.</p>

                        <p className="policy-category">A. Active Subscription Period</p>
                        <ul>
                            <li><strong>Genetic data and test results:</strong> Retained for the duration of your active subscription or account</li>
                            <li><strong>Account information:</strong> Retained while your account is active</li>
                            <li><strong>Transaction records:</strong> Retained for tax and accounting compliance (minimum 7 years as per Indian law)</li>
                        </ul>

                        <p className="policy-category">B. After Subscription Ends or Account Closure</p>
                        <ul>
                            <li><strong>Genetic data:</strong> May be deleted upon request or after subscription ends, unless legally required to retain</li>
                            <li><strong>De-identified data:</strong> May be retained indefinitely for research purposes (cannot be traced back to you)</li>
                            <li><strong>Legal and regulatory records:</strong> Retained for the period mandated by applicable laws</li>
                        </ul>

                        <p className="policy-category">C. Research Data Retention</p>
                        <p>If you consented to research use of your anonymized data, such data may be retained indefinitely for scientific research, as it cannot identify you personally.</p>

                        <h3 className="policy-subsection__title">6.2 Your Right to Request Deletion</h3>
                        <p>You have the right to request deletion of your personal data. To exercise this right:</p>
                        <ul>
                            <li>Email us at <a href="mailto:contact@evionex.com">contact@evionex.com</a> with your deletion request</li>
                            <li>We will process your request within 30 days</li>
                            <li>Some data may be retained if required by law or for legitimate business purposes (e.g., fraud prevention, legal compliance)</li>
                            <li>Deletion is irreversible – you will lose access to your test results and health records</li>
                        </ul>

                        <h3 className="policy-subsection__title">6.3 Exceptions to Deletion</h3>
                        <p>We may retain certain data even after a deletion request if:</p>
                        <ul>
                            <li>Required by law (e.g., medical records retention requirements, tax records)</li>
                            <li>Necessary for legal proceedings or regulatory investigations</li>
                            <li>Needed to complete a pending transaction or fulfill a contractual obligation</li>
                            <li>Already anonymized or de-identified (cannot identify you)</li>
                        </ul>
                    </div>

                    {/* 7. Cookies and Tracking Technologies */}
                    <div className="policy-section">
                        <h2 className="policy-section__title">
                            <span className="policy-number">7</span>
                            Cookies and Tracking Technologies
                        </h2>

                        <h3 className="policy-subsection__title">7.1 What Are Cookies?</h3>
                        <p>Cookies are small text files stored on your device when you visit our Website. We currently do not use extensive analytics or tracking cookies, but may implement them in the future.</p>

                        <h3 className="policy-subsection__title">7.2 Types of Cookies We May Use</h3>
                        <p className="policy-category">A. Essential Cookies (Always Active)</p>
                        <ul>
                            <li><strong>Authentication cookies:</strong> To keep you logged in securely</li>
                            <li><strong>Security cookies:</strong> To detect and prevent fraudulent activity</li>
                            <li><strong>Session cookies:</strong> To remember your preferences during a browsing session</li>
                        </ul>

                        <p className="policy-category">B. Optional Cookies (Requiring Consent)</p>
                        <ul>
                            <li><strong>Analytics cookies:</strong> To understand how users interact with our platform and improve user experience (may be enabled in the future)</li>
                            <li><strong>Marketing cookies:</strong> To measure the effectiveness of our campaigns (only with your consent, if implemented)</li>
                        </ul>

                        <h3 className="policy-subsection__title">7.3 Managing Cookies</h3>
                        <p>You can control cookies through your browser settings:</p>
                        <ul>
                            <li>Most browsers allow you to block or delete cookies</li>
                            <li>Blocking essential cookies may affect platform functionality</li>
                            <li>You can opt out of analytics cookies if we implement them in the future</li>
                        </ul>

                        <h3 className="policy-subsection__title">7.4 Third-Party Cookies</h3>
                        <p>Third-party services we use (e.g., Razorpay for payments) may set their own cookies. We do not control these cookies. Please review the privacy policies of these third parties.</p>
                    </div>

                    {/* 8. Data Security */}
                    <div className="policy-section">
                        <h2 className="policy-section__title">
                            <span className="policy-number">8</span>
                            Data Security
                        </h2>

                        <h3 className="policy-subsection__title">8.1 Our Security Measures</h3>
                        <p>We implement industry-standard technical, organizational, and physical security measures to protect your data:</p>

                        <p className="policy-category">Technical Safeguards</p>
                        <ul>
                            <li><strong>Encryption:</strong> All data transmitted over the internet is encrypted using TLS/SSL protocols</li>
                            <li><strong>Database encryption:</strong> Sensitive data (including patient authentication information) is encrypted at rest</li>
                            <li><strong>Access controls:</strong> Role-based access controls (RBAC) ensure only authorized personnel can access specific data</li>
                            <li><strong>Secure authentication:</strong> Multi-factor authentication (MFA) for healthcare professionals and administrators</li>
                            <li><strong>Regular security audits:</strong> Vulnerability assessments and penetration testing</li>
                        </ul>

                        <p className="policy-category">Organizational Safeguards</p>
                        <ul>
                            <li><strong>Employee training:</strong> All employees undergo data protection and security awareness training</li>
                            <li><strong>Confidentiality agreements:</strong> All staff, contractors, and partners are bound by strict confidentiality obligations</li>
                            <li><strong>Data minimization:</strong> We collect only the data necessary for the stated purposes</li>
                            <li><strong>Incident response plan:</strong> Procedures in place to detect, respond to, and mitigate data breaches</li>
                        </ul>

                        <p className="policy-category">Physical Safeguards</p>
                        <ul>
                            <li><strong>Secure data centers:</strong> Our cloud infrastructure providers maintain certified, physically secured facilities</li>
                            <li><strong>Restricted access:</strong> Physical access to servers and facilities is restricted and monitored</li>
                        </ul>

                        <h3 className="policy-subsection__title">8.2 Your Responsibility</h3>
                        <p>You play a critical role in protecting your data:</p>
                        <ul>
                            <li><strong>Keep your password secure:</strong> Use strong, unique passwords and do not share them</li>
                            <li><strong>Enable MFA:</strong> If available, enable multi-factor authentication on your account</li>
                            <li><strong>Log out:</strong> Log out of your account when using shared or public devices</li>
                            <li><strong>Report suspicious activity:</strong> Notify us immediately if you suspect unauthorized access to your account</li>
                            <li><strong>Keep software updated:</strong> Use updated browsers and operating systems with the latest security patches</li>
                        </ul>

                        <h3 className="policy-subsection__title">8.3 Data Breach Notification</h3>
                        <p>In the unlikely event of a data breach that poses a risk to your rights and freedoms:</p>
                        <ul>
                            <li>We will notify you within <strong>72 hours</strong> of becoming aware of the breach</li>
                            <li>We will inform relevant regulatory authorities as required by law</li>
                            <li>We will take immediate steps to mitigate the breach and prevent recurrence</li>
                            <li>We will provide guidance on steps you can take to protect yourself</li>
                        </ul>

                        <h3 className="policy-subsection__title">8.4 Limitations</h3>
                        <p>While we implement robust security measures, no system is 100% secure. We cannot guarantee absolute security, but we continuously work to improve our protections.</p>
                    </div>

                    {/* 9. Your Rights and Choices */}
                    <div className="policy-section">
                        <h2 className="policy-section__title">
                            <span className="policy-number">9</span>
                            Your Rights and Choices
                        </h2>
                        <p>You have the following rights regarding your personal data:</p>

                        <h3 className="policy-subsection__title">9.1 Right to Access</h3>
                        <p>You have the right to:</p>
                        <ul>
                            <li>Access your personal data that we hold</li>
                            <li>Obtain a copy of your genetic test results and health records</li>
                            <li>Request information about how your data is being processed</li>
                        </ul>
                        <p><strong>How to exercise:</strong> Log in to your account or email <a href="mailto:contact@evionex.com">contact@evionex.com</a></p>

                        <h3 className="policy-subsection__title">9.2 Right to Rectification</h3>
                        <p>You have the right to:</p>
                        <ul>
                            <li>Correct inaccurate or incomplete personal data</li>
                            <li>Update your contact information, medical history, or other details</li>
                        </ul>
                        <p><strong>How to exercise:</strong> Update your profile in your account settings or contact us at <a href="mailto:contact@evionex.com">contact@evionex.com</a></p>

                        <h3 className="policy-subsection__title">9.3 Right to Deletion (Right to be Forgotten)</h3>
                        <p>You have the right to:</p>
                        <ul>
                            <li>Request deletion of your personal data (subject to legal and contractual obligations)</li>
                            <li>Withdraw consent for data processing (where consent is the legal basis)</li>
                        </ul>
                        <p><strong>How to exercise:</strong> Email <a href="mailto:contact@evionex.com">contact@evionex.com</a> with your deletion request</p>
                        <div className="policy-highlight">
                            <p><strong>Note:</strong> Deletion may not be possible if we are legally required to retain data (e.g., medical records retention laws, tax compliance).</p>
                        </div>

                        <h3 className="policy-subsection__title">9.4 Right to Data Portability</h3>
                        <p>You have the right to:</p>
                        <ul>
                            <li>Receive your personal data in a structured, commonly used, machine-readable format</li>
                            <li>Transfer your data to another service provider</li>
                        </ul>
                        <p><strong>How to exercise:</strong> Request a data export by emailing <a href="mailto:contact@evionex.com">contact@evionex.com</a></p>

                        <h3 className="policy-subsection__title">9.5 Right to Object</h3>
                        <p>You have the right to:</p>
                        <ul>
                            <li>Object to processing of your data for direct marketing purposes (opt out at any time)</li>
                            <li>Object to processing based on legitimate interests (subject to our compelling legitimate grounds)</li>
                        </ul>
                        <p><strong>How to exercise:</strong> Click "unsubscribe" in marketing emails or contact <a href="mailto:contact@evionex.com">contact@evionex.com</a></p>

                        <h3 className="policy-subsection__title">9.6 Right to Restrict Processing</h3>
                        <p>You have the right to request restriction of processing in certain circumstances (e.g., while we verify data accuracy).</p>
                        <p><strong>How to exercise:</strong> Email <a href="mailto:contact@evionex.com">contact@evionex.com</a> with your request</p>

                        <h3 className="policy-subsection__title">9.7 Right to Withdraw Consent</h3>
                        <p>You have the right to withdraw consent at any time (where processing is based on consent).</p>
                        <div className="policy-highlight">
                            <p><strong>Note:</strong> Withdrawal does not affect the lawfulness of processing prior to withdrawal.</p>
                        </div>
                        <p><strong>How to exercise:</strong> Email <a href="mailto:contact@evionex.com">contact@evionex.com</a> or manage consent preferences in your account settings</p>

                        <h3 className="policy-subsection__title">9.8 Right to Complain</h3>
                        <p>You have the right to lodge a complaint with the appropriate data protection authority if you believe your rights have been violated:</p>
                        <ul>
                            <li>In India, you may contact the <strong>Data Protection Board of India</strong> (once established under the DPDP Act)</li>
                            <li>EU residents may contact their local supervisory authority</li>
                        </ul>

                        <h3 className="policy-subsection__title">9.9 Exercising Your Rights</h3>
                        <p>To exercise any of these rights:</p>
                        <ul>
                            <li>Email us at <a href="mailto:contact@evionex.com">contact@evionex.com</a> with your request</li>
                            <li>Include your full name, email address, and account details</li>
                            <li>Specify which right(s) you wish to exercise</li>
                            <li>We will respond within <strong>30 days</strong> (may be extended by 60 additional days for complex requests)</li>
                            <li>We may request additional information to verify your identity before processing your request</li>
                        </ul>
                    </div>

                    {/* 10. Children's Privacy */}
                    <div className="policy-section">
                        <h2 className="policy-section__title">
                            <span className="policy-number">10</span>
                            Children's Privacy
                        </h2>

                        <h3 className="policy-subsection__title">10.1 Age Restrictions</h3>
                        <p>Our Services are not directed to children under 18 years of age, except for genetic testing services (including newborn screening) provided under parental or guardian consent. We do not knowingly collect personal data from minors without verifiable parental or guardian consent.</p>

                        <h3 className="policy-subsection__title">10.2 Parental/Guardian Consent</h3>
                        <ul>
                            <li>For genetic testing of minors (including newborns), a parent or legal guardian must provide documented consent.</li>
                            <li>The guardian is responsible for managing the minor's account and data.</li>
                            <li>The guardian may exercise all rights on behalf of the minor, including access, rectification, and deletion requests.</li>
                        </ul>

                        <h3 className="policy-subsection__title">10.3 Guardian Responsibilities</h3>
                        <p>Parents and guardians must:</p>
                        <ul>
                            <li>Ensure the accuracy of information provided on behalf of the minor</li>
                            <li>Maintain the confidentiality of account credentials</li>
                            <li>Monitor the minor's use of our Services</li>
                            <li>Notify us immediately if they believe we have inadvertently collected data from a minor without proper consent</li>
                        </ul>

                        <h3 className="policy-subsection__title">10.4 Reporting Concerns</h3>
                        <p>If you believe we have collected data from a minor without proper consent, please contact us immediately at <a href="mailto:contact@evionex.com">contact@evionex.com</a>. We will take prompt steps to delete such data.</p>
                    </div>

                    {/* 11. Consent for Research Use */}
                    <div className="policy-section">
                        <h2 className="policy-section__title">
                            <span className="policy-number">11</span>
                            Consent for Research Use
                        </h2>

                        <h3 className="policy-subsection__title">11.1 Separate Research Consent</h3>
                        <p>In addition to consent for genetic testing and healthcare services, we seek separate, explicit consent for research use of your anonymized genetic data.</p>

                        <h3 className="policy-subsection__title">11.2 What Research Consent Covers</h3>
                        <p>If you consent to research use, we may:</p>
                        <ul>
                            <li>Use your anonymized or de-identified genetic data for scientific research</li>
                            <li>Share anonymized data with research collaborators (universities, research institutions, biotech companies)</li>
                            <li>Publish research findings in scientific journals (without identifying you)</li>
                            <li>Use data for algorithm development and bioinformatics tool improvement</li>
                            <li>Contribute anonymized data to scientific databases or biobanks</li>
                        </ul>

                        <h3 className="policy-subsection__title">11.3 Anonymization and De-identification</h3>
                        <ul>
                            <li>Anonymized data cannot be traced back to you individually</li>
                            <li>We remove all identifying information (name, contact details, identification numbers)</li>
                            <li>Genetic data is de-identified using industry-standard techniques</li>
                            <li>Re-identification is not reasonably possible with anonymized data</li>
                        </ul>

                        <h3 className="policy-subsection__title">11.4 Voluntary and Revocable</h3>
                        <ul>
                            <li>Research consent is completely voluntary</li>
                            <li>You can decline research consent and still receive all genetic testing services</li>
                            <li>You can withdraw research consent at any time by emailing <a href="mailto:contact@evionex.com">contact@evionex.com</a></li>
                            <li>Withdrawal will not affect data already used in completed research studies or published findings</li>
                            <li>New use of your data for research will cease upon withdrawal</li>
                        </ul>

                        <h3 className="policy-subsection__title">11.5 No Direct Benefit</h3>
                        <p>You acknowledge that:</p>
                        <ul>
                            <li>Research use of your data may not provide direct personal benefit to you</li>
                            <li>Research findings may contribute to scientific knowledge and future medical advances</li>
                            <li>You will not receive financial compensation for research use of your anonymized data</li>
                        </ul>
                    </div>

                    {/* 12. Compliance with Regulations */}
                    <div className="policy-section">
                        <h2 className="policy-section__title">
                            <span className="policy-number">12</span>
                            Compliance with Regulations
                        </h2>

                        <h3 className="policy-subsection__title">12.1 Indian Data Protection Laws</h3>
                        <p>We comply with:</p>
                        <ul>
                            <li>Information Technology Act, 2000 and all amendments</li>
                            <li>IT-SPDI Rules, 2011 for handling sensitive personal data</li>
                            <li>Digital Personal Data Protection Act, 2023 and forthcoming rules</li>
                            <li>Pre-Conception and Pre-Natal Diagnostic Techniques (PCPNDT) Act, 1994 (for prenatal testing)</li>
                            <li>Clinical Establishments Act, 2010 and state-specific rules</li>
                            <li>Biomedical Waste Management Rules, 2016</li>
                        </ul>

                        <h3 className="policy-subsection__title">12.2 International Compliance</h3>
                        <p>For users in the European Economic Area:</p>
                        <ul>
                            <li>We comply with GDPR requirements</li>
                            <li>Data transfers to India and Japan are governed by appropriate safeguards (Standard Contractual Clauses)</li>
                            <li>You have all rights under GDPR, including data portability and the right to lodge complaints with supervisory authorities</li>
                        </ul>

                        <h3 className="policy-subsection__title">12.3 Healthcare and Laboratory Standards</h3>
                        <p>We are committed to obtaining certifications and accreditations, including:</p>
                        <ul>
                            <li>ISO/IEC 27001 (Information Security Management)</li>
                            <li>CAP/CLIA accreditation (for laboratory operations) or equivalent Indian accreditations</li>
                            <li>NABH/NABL accreditation (as applicable)</li>
                        </ul>
                    </div>

                    {/* 13. Changes to This Privacy Policy */}
                    <div className="policy-section">
                        <h2 className="policy-section__title">
                            <span className="policy-number">13</span>
                            Changes to This Privacy Policy
                        </h2>

                        <h3 className="policy-subsection__title">13.1 Policy Updates</h3>
                        <p>We may update this Privacy Policy from time to time to reflect changes in our practices, technologies, legal requirements, or for other operational reasons. The "Last Updated" date at the top of this Policy indicates when it was last revised.</p>

                        <h3 className="policy-subsection__title">13.2 Notification of Changes</h3>
                        <p><strong>Material changes:</strong> If we make significant changes that affect your rights, we will notify you by:</p>
                        <ul>
                            <li>Email to your registered email address (at least 30 days before the changes take effect)</li>
                            <li>Prominent notice on our Website</li>
                            <li>In-app notification (if you use our applications)</li>
                        </ul>
                        <p><strong>Minor changes:</strong> Non-material updates may be posted without prior notice. We encourage you to review this Policy periodically.</p>

                        <h3 className="policy-subsection__title">13.3 Continued Use After Changes</h3>
                        <p>Your continued use of our Services after the effective date of the updated Policy constitutes your acceptance of the changes. If you do not agree with the updated Policy, you must discontinue use of our Services and may request deletion of your data.</p>
                    </div>

                    {/* 14. Contact Us */}
                    <div className="policy-section">
                        <h2 className="policy-section__title">
                            <span className="policy-number">14</span>
                            Contact Us
                        </h2>

                        <h3 className="policy-subsection__title">14.1 Privacy Inquiries</h3>
                        <p>If you have questions, concerns, or requests regarding this Privacy Policy or our data practices, please contact us:</p>

                        <div className="policy-contact-card">
                            <h3>Evionex Private Limited</h3>
                            <p><strong>Email:</strong> <a href="mailto:contact@evionex.com">contact@evionex.com</a></p>
                            <p><strong>Phone:</strong> <a href="tel:+919309019537">+91 9309019537</a></p>
                            <p><strong>Address:</strong> DP Road, Aundh, Haveli, Pune – 411007, Maharashtra, India</p>
                            <p><strong>Website:</strong> <a href="https://www.evionex.com" target="_blank" rel="noopener noreferrer">https://www.evionex.com</a></p>
                        </div>

                        <h3 className="policy-subsection__title">14.2 Data Protection Officer</h3>
                        <p>While we currently do not have a designated Data Protection Officer (DPO), all privacy and data protection inquiries should be directed to the contact information above. If and when we appoint a DPO in the future, their contact details will be updated in this Policy.</p>

                        <h3 className="policy-subsection__title">14.3 Response Time</h3>
                        <p>We will respond to your privacy inquiries and data rights requests within:</p>
                        <ul>
                            <li><strong>30 days</strong> for most requests</li>
                            <li><strong>60 additional days</strong> for complex requests (we will notify you of the extension and reasons)</li>
                        </ul>

                        <h3 className="policy-subsection__title">14.4 Regulatory Authorities</h3>
                        <p>If you are not satisfied with our response to your privacy concerns, you have the right to contact the appropriate data protection authority:</p>
                        <ul>
                            <li><strong>India:</strong> Data Protection Board of India (once established under DPDP Act)</li>
                            <li><strong>EU/EEA:</strong> Your local supervisory authority under GDPR</li>
                        </ul>
                    </div>

                    {/* 15. Definitions and Interpretation */}
                    <div className="policy-section">
                        <h2 className="policy-section__title">
                            <span className="policy-number">15</span>
                            Definitions and Interpretation
                        </h2>
                        <p>For the purposes of this Privacy Policy:</p>
                        <ul>
                            <li><strong>"Personal Data"</strong> means any information relating to an identified or identifiable natural person</li>
                            <li><strong>"Sensitive Personal Data"</strong> includes genetic data, health information, biometric data, and other categories defined under applicable law</li>
                            <li><strong>"Processing"</strong> means any operation performed on data, including collection, storage, use, disclosure, or deletion</li>
                            <li><strong>"Anonymized Data"</strong> means data that cannot reasonably be used to identify an individual</li>
                            <li><strong>"Consent"</strong> means a freely given, specific, informed, and unambiguous indication of agreement to data processing</li>
                            <li><strong>"Data Subject"</strong> means the individual to whom personal data relates</li>
                            <li><strong>"Controller"</strong> means Evionex, which determines the purposes and means of processing personal data</li>
                            <li><strong>"Processor"</strong> means any third party that processes data on behalf of Evionex</li>
                        </ul>
                    </div>

                    {/* 16. Acknowledgment and Consent */}
                    <div className="policy-section">
                        <h2 className="policy-section__title">
                            <span className="policy-number">16</span>
                            Acknowledgment and Consent
                        </h2>
                        <p>By using our Services, you acknowledge that:</p>
                        <ul>
                            <li>You have read and understood this Privacy Policy in its entirety</li>
                            <li>You consent to the collection, use, storage, and sharing of your personal data as described in this Policy</li>
                            <li>You understand your rights and how to exercise them</li>
                            <li>You agree to the transfer of your data to India and Japan (where applicable)</li>
                            <li>For minors: The parent/guardian providing consent is legally authorized to do so and will manage the minor's account responsibly</li>
                        </ul>
                    </div>

                    {/* Footer */}
                    <div className="policy-divider"></div>
                    <div className="policy-footer">
                        <p>For any questions or to exercise your data rights, please contact us at <a href="mailto:contact@evionex.com">contact@evionex.com</a></p>
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
