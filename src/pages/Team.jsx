import GlareHover from '../components/ui/GlareHover/GlareHover'
import './Team.css'

const teamMembers = [
    {
        name: 'Atharva Shinde',
        title: 'Director & Co-Founder',
        bio: 'Visionary leader with deep expertise in AI and machine learning. Atharva drives the technical strategy at Evionex, ensuring our products leverage cutting-edge technology to deliver real impact in research and education.',
        initial: 'AS',
        gradient: 'linear-gradient(135deg, #00D4C8, #0D9488)',
    },
    {
        name: 'Kedar Navsariwala',
        title: 'Director & Co-Founder',
        bio: 'Technology architect and product strategist with a passion for building scalable solutions. Kedar leads the development of Evionex\'s platforms, focusing on user experience, performance, and security.',
        initial: 'KN',
        gradient: 'linear-gradient(135deg, #7C5CFF, #6D28D9)',
    },
    {
        name: 'Mrunal Samant',
        title: 'Director & Co-Founder',
        bio: 'Domain expert in research and education technology. Mrunal shapes the product vision at Evionex, ensuring our solutions address real challenges faced by institutions and researchers across India.',
        initial: 'MS',
        gradient: 'linear-gradient(135deg, #FF6B6B, #DC2626)',
    },
]

export default function Team() {
    return (
        <div className="team-page">
            <section className="page-hero">
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
                                glareColor={member.gradient.includes('#00D4C8') ? '#00D4C8' : member.gradient.includes('#7C5CFF') ? '#7C5CFF' : '#FF6B6B'}
                                glareOpacity={0.15}
                                glareAngle={-30}
                                transitionDuration={800}
                                className={`team-glare-card animate-fade-in-up animate-delay-${i + 1}`}
                            >
                                <div className="team-card__glow" style={{ background: member.gradient }}></div>
                                <div className="team-card__inner">
                                    <div className="team-card__avatar" style={{ background: member.gradient }}>
                                        <span>{member.initial}</span>
                                    </div>
                                    <h3 className="team-card__name">{member.name}</h3>
                                    <p className="team-card__title">{member.title}</p>
                                    <p className="team-card__bio">{member.bio}</p>
                                    <div className="team-card__socials">
                                        <a href="#" aria-label="LinkedIn">
                                            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" /></svg>
                                        </a>
                                        <a href="#" aria-label="Twitter">
                                            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" /></svg>
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
