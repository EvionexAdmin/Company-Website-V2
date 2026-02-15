import './WhoWeAre.css'

export default function WhoWeAre() {
    return (
        <div className="who-we-are">
            {/* Hero Section */}
            <section className="page-hero">
                <div className="container">
                    <div className="section-header animate-fade-in-up">
                        <span className="tag">About Evionex</span>
                        <h1>Democratizing AI for <span className="text-gradient">Scientific Progress</span></h1>
                        <p>We are building the future of research, education, and healthcare technology</p>
                    </div>
                </div>
            </section>

            {/* Who We Are */}
            <section className="section">
                <div className="container">
                    <div className="split-content">
                        <div className="split-content__text animate-fade-in-up">
                            <span className="tag">Who We Are</span>
                            <h2>A Technology Startup with a Mission</h2>
                            <p>
                                Evionex Private Limited is an innovative technology startup committed to transforming
                                how research institutions, educational organizations, and healthcare facilities operate
                                in the digital age. Founded by a team of passionate technologists and domain experts,
                                we develop AI-powered platforms that simplify complex workflows and unlock new
                                possibilities for discovery and learning.
                            </p>
                            <p>
                                Our solutions are designed from the ground up to meet the unique challenges of Indian
                                institutions while maintaining global standards of excellence in data security,
                                compliance, and user experience.
                            </p>
                        </div>
                        <div className="split-content__visual animate-fade-in-up animate-delay-2">
                            <div className="about-visual">
                                <div className="about-visual__grid">
                                    <div className="about-visual__block about-visual__block--1"></div>
                                    <div className="about-visual__block about-visual__block--2"></div>
                                    <div className="about-visual__block about-visual__block--3"></div>
                                    <div className="about-visual__block about-visual__block--4"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Mission */}
            <section className="section mission-section">
                <div className="container">
                    <div className="section-header animate-fade-in-up">
                        <span className="tag">Our Mission</span>
                        <h2>Empowering Communities Through Technology</h2>
                        <p>
                            Our mission is the empowerment of research and education communities through
                            intelligent, accessible, and compliant technology solutions that drive meaningful progress.
                        </p>
                    </div>
                </div>
            </section>

            {/* Goals */}
            <section className="section">
                <div className="container">
                    <div className="section-header animate-fade-in-up">
                        <span className="tag">Our Goals</span>
                        <h2>Three Pillars of <span className="text-gradient">Innovation</span></h2>
                    </div>

                    <div className="grid-3">
                        {[
                            {
                                icon: '🔬',
                                title: 'Accelerate Research',
                                description: 'Provide researchers with intelligent tools that streamline experiment documentation, data analysis, and collaboration across laboratories.'
                            },
                            {
                                icon: '📚',
                                title: 'Transform Learning',
                                description: 'Create personalized, AI-driven educational experiences that adapt to each student\'s unique learning style and pace.'
                            },
                            {
                                icon: '🌐',
                                title: 'Digital Accessibility',
                                description: 'Bridge the technology gap for institutions of all sizes, ensuring world-class digital tools are accessible and affordable for everyone.'
                            }
                        ].map((goal, i) => (
                            <div key={i} className={`card goal-card animate-fade-in-up animate-delay-${i + 1}`}>
                                <div className="feature-icon">{goal.icon}</div>
                                <h3>{goal.title}</h3>
                                <p>{goal.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Stats */}
            <section className="section stats-section">
                <div className="container">
                    <div className="stats-grid">
                        {[
                            { number: '3+', label: 'Flagship Products' },
                            { number: '100%', label: 'Indian Compliance' },
                            { number: 'AI', label: 'Powered Platform' },
                            { number: '24/7', label: 'Support Available' }
                        ].map((stat, i) => (
                            <div key={i} className="stat-item animate-fade-in-up">
                                <div className="stat-number">{stat.number}</div>
                                <div className="stat-label">{stat.label}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    )
}
