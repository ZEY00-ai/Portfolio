import Image from "next/image";
import ImageAssetPreloader from "@/components/ImageAssetPreloader";
import { LocalizedText } from "@/components/LanguageProvider";
import ScrollReveal from "@/components/ScrollReveal";
import SiteHeader from "@/components/SiteHeader";
import ThemeToggle from "@/components/ThemeToggle";
import WorkList from "@/components/WorkList";
import { getProjects } from "@/lib/projects";
import { site } from "@/lib/site";

const aboutEnglish = [
  "Hi! I'm Daffa.",
  "My daily formula: 70% backend, 30% frontend, a little AI help when the logic gets stuck, and the rest is mastering the art of making the most of my downtime.",
  "As a software development enthusiast, I enjoy working on data architecture and the systems behind the scenes.",
  "I still make sure the visuals stay clean and easy to use.",
  "This portfolio features some of the projects I've worked on. Feel free to explore, and send me a message if you'd like to collaborate!",
];

export default async function Home() {
  const projects = await getProjects();
  const currentEducation = site.education.find((item) => item.current);

  return (
    <>
      <ImageAssetPreloader
        sources={[
          "/foto-daffa.jpg",
          ...projects.flatMap((project) => (project.image ? [project.image] : [])),
        ]}
        readyAttribute="data-portfolio-assets-ready"
      />
      <SiteHeader />

      <main id="top">
        <section className="hero">
          <div className="hero-inner wrap">
            <div className="hero-copy">
              <p className="hero-greeting"><span className="hero-greeting-mark" aria-hidden="true" /><LocalizedText id={`Halo, saya ${site.name}`} en={`Hi, I'm ${site.name}`} /></p>
              <h1 className="hero-title">
                <span><LocalizedText id="Mahasiswa" en="Information Systems" /></span>
                <span><LocalizedText id="Sistem Informasi" en="Student" /></span>
                <span className="hero-title-last"><span className="hero-title-join"><LocalizedText id="dan" en="and" /></span> <span className="hero-title-accent">Web Developer</span></span>
              </h1>
              <p className="hero-intro"><LocalizedText id={site.headline} en="Building web applications that are clean, fast, and useful." /></p>
              <div className="hero-actions">
                <a className="hero-primary-link" href="#work">
                  <LocalizedText id="Lihat project" en="View projects" /> <span aria-hidden="true">↘</span>
                </a>
                <a className="hero-secondary-link" href="#about"><LocalizedText id="Kenali saya" en="Get to know me" /></a>
              </div>
              <p className="hero-index"><span>01</span> <LocalizedText id="PORTFOLIO PERSONAL" en="PERSONAL PORTFOLIO" /></p>
            </div>

            <div className="hero-portrait">
              <Image
                className="hero-portrait-img"
                src="/foto-daffa.jpg"
                alt={`Potret ${site.name}`}
                width={600}
                height={800}
                sizes="(max-width: 760px) 42vw, 36vw"
                loading="eager"
              />
              <div className="hero-photo-caption">
                <span><LocalizedText id="BERBASIS DI" en="BASED IN" /></span>
                <p>{site.location}</p>
              </div>
              <span className="hero-photo-index" aria-hidden="true">DA</span>
            </div>

            <a className="hero-scroll" href="#about">
              <span><LocalizedText id="JELAJAHI PORTFOLIO" en="EXPLORE THE PORTFOLIO" /></span>
              <span aria-hidden="true">↓</span>
            </a>
          </div>
        </section>

        <section id="about" className="section about">
          <div className="wrap about-layout">
            <ScrollReveal className="about-copy">
              <header className="about-heading">
                <p className="eyebrow"><span>02</span> <LocalizedText id="TENTANG SAYA" en="ABOUT ME" /></p>
                <h2 className="section-title"><LocalizedText id="Ngoding & Proses" en="Code & Process" /></h2>
              </header>
              <div className="about-story">
                {site.about.map((paragraph, index) => (
                  <p key={paragraph}><LocalizedText id={paragraph} en={aboutEnglish[index] ?? paragraph} /></p>
                ))}
              </div>
              <div className="profile-interests">
                <div className="profile-interests-heading">
                  <h3><LocalizedText id="Minat & Aktivitas" en="Interests & Activities" /></h3>
                  <span><LocalizedText id="DI LUAR KULIAH" en="OUTSIDE OF CLASS" /></span>
                </div>
                <ul className="interest-list">
                  {site.interests.map((interest, index) => (
                    <li key={interest}>
                      <span className="interest-index" aria-hidden="true">
                        {String(index + 1).padStart(2, "0")}
                      </span>
                      <span><LocalizedText id={interest} en={interest === "Bermain Game" ? "Gaming" : "Various sports"} /></span>
                    </li>
                  ))}
                </ul>
              </div>
            </ScrollReveal>

            <ScrollReveal className="education-panel" delay={140}>
              {site.education.length > 0 && (
                <div className="education-history">
                  <div className="education-heading">
                    <p className="eyebrow"><LocalizedText id="LANGKAH DEMI LANGKAH" en="STEP BY STEP" /></p>
                    <h3><LocalizedText id="Riwayat pendidikan" en="Education" /></h3>
                  </div>
                  <div className="education-table-wrap">
                    <table className="education-table">
                      <thead>
                        <tr>
                          <th scope="col"><LocalizedText id="Tingkatan" en="Level" /></th>
                          <th scope="col"><LocalizedText id="Nama Sekolah" en="School" /></th>
                          <th scope="col"><LocalizedText id="Tahun" en="Year" /></th>
                        </tr>
                      </thead>
                      <tbody>
                        {site.education.map((item) => (
                          <tr
                            key={`${item.level}-${item.institution}`}
                            className={item.current ? "education-row-current" : undefined}
                          >
                            <td><LocalizedText id={item.level} en={item.level === "Kuliah" ? "College" : item.level} /></td>
                            <td>{item.institution}</td>
                            <td>{item.period}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
              {currentEducation && (
                <p className="education-note">
                  <span aria-hidden="true">↗</span>
                  <LocalizedText
                    id={`Saat ini menempuh pendidikan di ${currentEducation.institution}.`}
                    en={`Currently studying at ${currentEducation.institution}.`}
                  />
                </p>
              )}
            </ScrollReveal>
          </div>
        </section>

        <section id="work" className="section showcase">
          <div className="wrap">
            <ScrollReveal className="showcase-heading">
              <div>
                <p className="eyebrow"><span>03</span> <LocalizedText id="Developer Logs" en="Developer Logs" /></p>
                <h2 className="section-title"><LocalizedText id="Project Saya." en="My Projects." /></h2>
              </div>
            </ScrollReveal>
            <ScrollReveal className="work-reveal" delay={120}>
              <WorkList projects={projects} />
            </ScrollReveal>
          </div>
        </section>

        <section id="contact" className="contact">
          <div className="wrap contact-inner">
            <ScrollReveal className="contact-copy">
              <p className="eyebrow"><span>04</span> <LocalizedText id="LANGKAH SELANJUTNYA" en="WHAT'S NEXT" /></p>
              <h2 className="section-title"><LocalizedText id="kontak Saya?" en="Get in touch?" /><br/></h2>
              <p className="section-sub"><LocalizedText id="Selalu Senang Diajak Diskusi Pengerjaan Project, atau Sekedar Sharing." en="I'm always happy to discuss a project or simply share ideas." /></p>
            </ScrollReveal>
            <ScrollReveal className="contact-panel" delay={140}>
              <span className="contact-panel-label"><LocalizedText id="TEMUKAN SAYA DI" en="FIND ME ON" /></span>
              <div className="contact-links">
                {site.email && <a className="contact-link contact-link-email" href={`mailto:${site.email}`}><span>Email</span><strong>{site.email}</strong><span className="contact-link-arrow" aria-hidden="true">↗</span></a>}
                {site.linkedin && <a className="contact-link" href={site.linkedin} target="_blank" rel="noopener noreferrer"><span>LinkedIn</span><strong><LocalizedText id="Terhubung di LinkedIn" en="Connect on LinkedIn" /></strong><span className="contact-link-arrow" aria-hidden="true">↗</span></a>}
                {site.github && <a className="contact-link" href={site.github} target="_blank" rel="noopener noreferrer"><span>GitHub</span><strong><LocalizedText id="Lihat project di GitHub" en="View projects on GitHub" /></strong><span className="contact-link-arrow" aria-hidden="true">↗</span></a>}
              </div>
            </ScrollReveal>
          </div>
          <footer className="wrap footer">
            <span><span className="footer-mark" aria-hidden="true">+</span> {site.name} · <LocalizedText id="Portfolio Indonesia" en="Portfolio" /></span>
            <span className="footer-location">{site.location}</span>
            <a href="#top"><LocalizedText id="Kembali ke atas" en="Back to top" /> ↑</a>
          </footer>
        </section>
      </main>

      <ThemeToggle />
    </>
  );
}