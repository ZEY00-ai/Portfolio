import ThemeToggle from "@/components/ThemeToggle";
import WorkList from "@/components/WorkList";
import { getProjects } from "@/lib/projects";
import { getSkillGroups } from "@/lib/skills";
import { site } from "@/lib/site";

export default async function Home() {
  // Dua sheet diambil bersamaan
  const [projects, skillGroups] = await Promise.all([
    getProjects(),
    getSkillGroups(),
  ]);

  // Angka statistik dihitung dari spreadsheet
  const techCount = new Set(projects.flatMap((p) => p.tech)).size;
  const demoCount = projects.filter((p) => p.demoUrl).length;

  const stats = [
    { value: projects.length, label: "Project" },
    { value: techCount, label: "Teknologi dipakai" },
    { value: demoCount, label: "Live demo" },
  ];

  return (
    <>
      <header className="nav">
        <div className="wrap nav-inner">
          <a href="#top" className="brand">{site.name}</a>
          <nav className="nav-links" aria-label="Navigasi utama">
            <a href="#work">Project</a>
            <a href="#skills">Skill</a>
            <a href="#contact">Kontak</a>
          </nav>
          <ThemeToggle />
        </div>
      </header>

      <main id="top">
        <section className="wrap hero">
          <p className="eyebrow">{site.role}</p>
          <h1 className="hero-title">{site.name}</h1>
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

          <dl className="stats">
            {stats.map((s) => (
              <div key={s.label} className="stat">
                <dd className="stat-value">{s.value}</dd>
                <dt className="stat-label">{s.label}</dt>
              </div>
            ))}
          </dl>
        </section>

        <section id="work" className="wrap section">
          <p className="eyebrow">Project</p>
          <h2 className="section-title">Karya terpilih</h2>
          <p className="section-sub">
            Daftar ini dibaca langsung dari spreadsheet, jadi selalu mengikuti data terbaru.
          </p>
          <WorkList projects={projects} />
        </section>

        <section id="skills" className="wrap section">
          <p className="eyebrow">Skill</p>
          <h2 className="section-title">Teknologi yang saya pakai</h2>
          <div className="skill-grid">
            {skillGroups.map((g) => (
              <div key={g.title} className="skill-card">
                <h3>{g.title}</h3>
                <ul className="tags">
                  {g.items.map((i) => (
                    <li key={i}>{i}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        <section id="contact" className="wrap section contact">
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