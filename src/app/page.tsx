import Image from "next/image";
import ThemeToggle from "@/components/ThemeToggle";
import WorkList from "@/components/WorkList";
import SkillCarousel from "@/components/SkillCarousel";
import AboutPortrait from "@/components/AboutPortrait";
import { getProjects } from "@/lib/projects";
import { getSkillGroups } from "@/lib/skills";
import { site } from "@/lib/site";

const contactImages = [
  "/forKontak/foto-daffa.jpg",
  "/forKontak/1729416146088.jpg",
  "/forKontak/1729416146078.jpg",
  "/forKontak/1729416145117.jpg",
];

export default async function Home() {
  // Dua sheet diambil bersamaan
  const [projects, skillGroups] = await Promise.all([
    getProjects(),
    getSkillGroups(),
  ]);

  return (
    <>
      <header className="nav">
        <div className="wrap nav-inner">
          <a href="#top" className="brand">{site.name}</a>
          <nav className="nav-links" aria-label="Navigasi utama">
            <a href="#about">Tentang</a>
            <a href="#work">Project</a>
            <a href="#skills">Skill</a>
            <a href="#contact">Kontak</a>
          </nav>
          <ThemeToggle />
        </div>
      </header>

      <main id="top">
        <section className="wrap hero">
          <h1 className="hero-title">{site.name}</h1>
          <ul className="hero-roles" aria-label="Peran">
            <li>Mahasiswa Sistem Informasi</li>
            <li>Web Developer</li>
            <li>Mobile Developer(ongoing)</li>
          </ul>
          <p className="hero-headline">{site.headline}</p>
          <p className="hero-intro">{site.intro}</p>
          <div className="hero-cta">
            <a className="btn btn-solid" href="#contact">Hubungi saya</a>
            {site.resumeUrl && <a className="btn" href={site.resumeUrl}>Unduh CV</a>}
            {site.github && (
              <a className="btn" href={site.github} target="_blank" rel="noopener noreferrer">
                GitHub
              </a>
            )}
          </div>
          <a className="hero-scroll" href="#about">
            <span>Scroll untuk menjelajah</span>
            <span className="hero-scroll-arrow" aria-hidden="true">↓</span>
          </a>
        </section>

        <section id="about" className="wrap section about">
          <header className="about-heading">
            <p className="eyebrow">01</p>
            <div>
              <h2 className="section-title">Profil</h2>
            </div>
          </header>
          <div className="about-layout">
            <AboutPortrait
              location={site.location}
              focus={site.role}
            />
            <div className="about-copy">
              {site.about.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
              {site.education.length > 0 && (
                <div className="education-history">
                  <h3>Riwayat Pendidikan</h3>
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
          </div>
        </section>

        <section id="work" className="wrap section showcase">
          <p className="eyebrow">Project</p>
          <h2 className="section-title">Karya Yang Pernah Saya Kerjakan</h2>
          <WorkList projects={projects} />
          <div id="skills" className="showcase-skills">
            <p className="eyebrow">Skill</p>
            <h2 className="section-title">Teknologi yang saya pakai</h2>
            <SkillCarousel groups={skillGroups} />
          </div>
        </section>

        <section id="contact" className="wrap section contact">
          <div className="contact-collage" aria-hidden="true" inert>
            {Array.from({ length: 10 }, (_, index) => (
              <div className="contact-collage-photo" key={index}>
                <Image
                  src={contactImages[index % contactImages.length]}
                  alt=""
                  fill
                  sizes="(max-width: 640px) 28vw, 18vw"
                />
              </div>
            ))}
          </div>
          <p className="eyebrow">Kontak</p>
          <h2 className="section-title">Mari bekerja sama</h2>
          <p className="section-sub">
            Punya ide, butuh website, atau mau ngobrol soal project? Kirim pesan saja.
          </p>
          <div className="hero-cta">
            {site.email && (
              <a className="btn btn-solid" href={`mailto:${site.email}`}>{site.email}</a>
            )}
            {site.linkedin && (
              <a className="btn" href={site.linkedin} target="_blank" rel="noopener noreferrer">
                LinkedIn
              </a>
            )}
            {site.github && (
              <a className="btn" href={site.github} target="_blank" rel="noopener noreferrer">
                GitHub
              </a>
            )}
          </div>
        </section>
      </main>

      <footer className="wrap footer">
        <span>© {site.name} · {site.location}</span>
        <a href="#top">Kembali ke atas ↑</a>
      </footer>
    </>
  );
}