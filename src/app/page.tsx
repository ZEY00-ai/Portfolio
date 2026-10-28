import Image from "next/image";
import ThemeToggle from "@/components/ThemeToggle";
import WorkList from "@/components/WorkList";
import { getProjects } from "@/lib/projects";
import { site } from "@/lib/site";

export default async function Home() {
  const projects = await getProjects();
  const currentEducation = site.education.find((item) => item.current);

  return (
    <>
      <header className="nav">
        <div className="wrap nav-inner">
          <a href="#top" className="brand">{site.name}</a>
          <nav className="nav-links" aria-label="Navigasi utama">
            <a href="#top">Beranda</a>
            <a href="#about">Tentang</a>
            <a href="#work">Project</a>
            <a href="#contact">Kontak</a>
          </nav>
          {site.resumeUrl && <a className="nav-resume" href={site.resumeUrl}>CV <span aria-hidden="true">↗</span></a>}
        </div>
      </header>

      <main id="top">
        <section className="hero">
          <div className="hero-inner wrap">
            <div className="hero-copy">
              <p className="hero-greeting"><span className="hero-greeting-mark" aria-hidden="true" />Halo, saya {site.name}</p>
              <h1 className="hero-title">
                <span>Mahasiswa</span>
                <span>Sistem Informasi</span>
                <span className="hero-title-last"><span className="hero-title-join">dan</span> <span className="hero-title-accent">Web Developer</span></span>
              </h1>
              <p className="hero-intro">{site.headline}</p>
              <div className="hero-actions">
                <a className="hero-primary-link" href="#work">
                  Lihat project <span aria-hidden="true">↘</span>
                </a>
                <a className="hero-secondary-link" href="#about">Kenali saya</a>
              </div>
              <p className="hero-index"><span>01</span> PORTFOLIO PERSONAL</p>
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
                <span>BERBASIS DI</span>
                <p>{site.location}</p>
              </div>
              <span className="hero-photo-index" aria-hidden="true">DA</span>
            </div>

            <a className="hero-scroll" href="#about">
              <span>JELAJAHI PORTFOLIO</span>
              <span aria-hidden="true">↓</span>
            </a>
          </div>
        </section>

        <section id="about" className="section about">
          <div className="wrap about-layout">
            <div className="about-copy">
              <header className="about-heading">
                <p className="eyebrow"><span>02</span> TENTANG SAYA</p>
                <h2 className="section-title">Belajar lewat karya.</h2>
              </header>
              <div className="about-story">
                {site.about.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
              </div>
              <div className="profile-interests">
                <div className="profile-interests-heading">
                  <h3>Minat &amp; Aktivitas</h3>
                  <span>DI LUAR KULIAH</span>
                </div>
                <ul className="interest-list">
                  {site.interests.map((interest, index) => (
                    <li key={interest}>
                      <span className="interest-index" aria-hidden="true">
                        {String(index + 1).padStart(2, "0")}
                      </span>
                      <span>{interest}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="education-panel">
              {site.education.length > 0 && (
                <div className="education-history">
                  <div className="education-heading">
                    <p className="eyebrow">LANGKAH DEMI LANGKAH</p>
                    <h3>Riwayat pendidikan</h3>
                  </div>
                  <div className="education-table-wrap">
                    <table className="education-table">
                      <thead>
                        <tr>
                          <th scope="col">Tingkatan</th>
                          <th scope="col">Nama Sekolah</th>
                          <th scope="col">Tahun</th>
                        </tr>
                      </thead>
                      <tbody>
                        {site.education.map((item) => (
                          <tr
                            key={`${item.level}-${item.institution}`}
                            className={item.current ? "education-row-current" : undefined}
                          >
                            <td>{item.level}</td>
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
                  Saat ini menempuh pendidikan di {currentEducation.institution}.
                </p>
              )}
            </div>
          </div>
        </section>

        <section id="work" className="section showcase">
          <div className="wrap">
            <div className="showcase-heading">
              <div>
                <p className="eyebrow"><span>03</span> DARI MEJA BELAJAR</p>
                <h2 className="section-title">Project yang punya cerita.</h2>
              </div>
              <p className="showcase-note">Kumpulan karya dari proses belajar dan eksplorasi saya.</p>
            </div>
            <WorkList projects={projects} />
          </div>
        </section>

        <section id="contact" className="contact">
          <div className="wrap contact-inner">
            <div className="contact-copy">
              <p className="eyebrow"><span>04</span> LANGKAH SELANJUTNYA</p>
              <h2 className="section-title">Ada ide?<br />Mari ngobrol.</h2>
              <p className="section-sub">Terbuka untuk bertukar ide, belajar bersama, atau membahas project.</p>
            </div>
            <div className="contact-panel">
              <span className="contact-panel-label">TEMUKAN SAYA DI</span>
              <div className="contact-links">
                {site.email && <a className="contact-link contact-link-email" href={`mailto:${site.email}`}><span>Email</span><strong>{site.email}</strong><span className="contact-link-arrow" aria-hidden="true">↗</span></a>}
                {site.linkedin && <a className="contact-link" href={site.linkedin} target="_blank" rel="noopener noreferrer"><span>LinkedIn</span><strong>Terhubung di LinkedIn</strong><span className="contact-link-arrow" aria-hidden="true">↗</span></a>}
                {site.github && <a className="contact-link" href={site.github} target="_blank" rel="noopener noreferrer"><span>GitHub</span><strong>Lihat project di GitHub</strong><span className="contact-link-arrow" aria-hidden="true">↗</span></a>}
              </div>
            </div>
          </div>
          <footer className="wrap footer">
            <span><span className="footer-mark" aria-hidden="true">+</span> {site.name} · Portfolio Indonesia</span>
            <span className="footer-location">{site.location}</span>
            <a href="#top">Kembali ke atas ↑</a>
          </footer>
        </section>
      </main>

      <ThemeToggle />
    </>
  );
}