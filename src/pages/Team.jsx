import GlareHover from '../components/ui/GlareHover/GlareHover'
import kedarPhoto from '../assets/images/team/kedar.jpeg'
import mrunalPhoto from '../assets/images/team/mrunal.png'
import atharvaPhoto from '../assets/images/team/atharva.png'
import dhrumilPhoto from '../assets/images/team/dhrumil.png'
import usePageMetadata from '../lib/usePageMetadata'
import './Team.css'
import teamHero from '../assets/images/company/team-hero.webp'

const teamMembers = [
    {
        name: 'Atharva Shinde',
        title: 'CEO & Founder',
        bio: 'Technology architect and product strategist with a passion for building scalable solutions. Atharva leads the development of Evionex\'s platforms, focusing on user experience, performance, and security.',
        photo: atharvaPhoto,
        gradient: 'linear-gradient(135deg, #00D4C8, #0D9488)',
        linkedin: 'https://www.linkedin.com/in/atharva-shinde-9b33ba172/',
    },
    {
        name: 'Kedar Navsariwala',
        title: 'CTO & Co-Founder',
        bio: 'Visionary leader with deep expertise in AI and machine learning. Kedar drives the technical strategy at Evionex, ensuring our products are up to date with the latest technology to deliver real impact.',
        photo: kedarPhoto,
        gradient: 'linear-gradient(135deg, #6366f1, #4f46e5)',
        linkedin: 'https://www.linkedin.com/in/kedar-navsariwala-5150041b7',
    },
    {
        name: 'Mrunal Samant',
        title: 'COO & Co-Founder',
        bio: 'Domain expert in research and education technology. Mrunal shapes the product vision at Evionex, ensuring our solutions address real challenges faced by institutions and researchers across India.',
        photo: mrunalPhoto,
        gradient: 'linear-gradient(135deg, #f472b6, #ec4899)',
        linkedin: 'https://www.linkedin.com/in/mrunal-samant-86b877259/',
    },
    {
        name: 'Dhrumil Agarwal',
        title: 'CMO & Co-Founder',
        bio: 'Expert in Market analysis and strategy. Dhrumil helps Evionex understand and respond to market trends to ensure we stay ahead of the competition.',
        photo: dhrumilPhoto,
        gradient: 'linear-gradient(135deg, #f59e0b, #d97706)',
        linkedin: 'https://www.linkedin.com/in/dhrumil-agrawal-540381267/',
    },
]

export default function Team() {
    const defaultOgImage = new URL('../assets/images/logo/evionex-logo.png', import.meta.url).href

    usePageMetadata({
        title: 'Evionex Leadership Team',
        description: 'Meet the Evionex founding team leading AI innovation across research, education, and healthcare.',
        canonicalPath: '/team',
        image: defaultOgImage,
    })

    return (
        <div className="team-page">
            <section className="page-hero team-hero">
                <div className="team-hero__bg" style={{ backgroundImage: `url(${teamHero})` }}></div>
                <div className="team-hero__overlay"></div>
                <div className="container">
                    <div className="section-header animate-fade-in-up">
                        <span className="tag">Our Team</span>
                        <h1>Meet The <span className="text-gradient">Visionaries</span></h1>
                        <p>The passionate founders driving innovation at Evionex</p>
                    </div>
                </div>
            </section>

            <section className="section">
                <div className="container">
                    <div className="team-grid">
                        {teamMembers.map((member, i) => (
                            <GlareHover
                                key={i}
                                width="100%"
                                height="auto"
                                background="var(--bg-card-surface)"
                                borderRadius="var(--radius-xl)"
                                borderColor="rgba(255,255,255,0.06)"
                                glareColor={member.gradient.includes('#00D4C8') ? '#00D4C8' : member.gradient.includes('#6366f1') ? '#6366f1' : member.gradient.includes('#f472b6') ? '#f472b6' : '#f59e0b'}
                                glareOpacity={0.15}
                                glareAngle={-30}
                                transitionDuration={800}
                                className={`team-glare-card animate-fade-in-up animate-delay-${i + 1}`}
                            >
                                <div className="team-card__glow" style={{ background: member.gradient }}></div>
                                <div className="team-card__photo">
                                    <img src={member.photo} alt={member.name} width="300" height="300" loading="lazy" />
                                </div>
                                <div className="team-card__inner">
                                    <h3 className="team-card__name">{member.name}</h3>
                                    <p className="team-card__title">{member.title}</p>
                                    <p className="team-card__bio">{member.bio}</p>
                                    <div className="team-card__socials">
                                        <a href={member.linkedin} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
                                            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" /></svg>
                                        </a>
                                    </div>
                                </div>
                            </GlareHover>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    )
}
