import { site } from "@/lib/site";

type SiteHeaderProps = {
  active?: "gallery";
};

export default function SiteHeader({ active }: SiteHeaderProps) {
  const isGallery = active === "gallery";
  const sectionLink = (section: string) =>
    isGallery ? `/#${section}` : `#${section}`;

  return (
    <header className="nav">
      <div className="wrap nav-inner">
        <a href={sectionLink("top")} className="brand">{site.name}</a>
        <nav className="nav-links" aria-label="Navigasi utama">
          <a href={sectionLink("top")}>Beranda</a>
          <a href={sectionLink("about")}>Tentang</a>
          <a href={sectionLink("work")}>Project</a>
          <a href={sectionLink("contact")}>Kontak</a>
          <a href="/gallery" aria-current={isGallery ? "page" : undefined}>Galeri</a>
        </nav>
        {site.resumeUrl && <a className="nav-resume" href={site.resumeUrl}>CV <span aria-hidden="true">↗</span></a>}
      </div>
    </header>
  );
}
