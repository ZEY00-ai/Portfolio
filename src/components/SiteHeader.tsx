"use client";

import { site } from "@/lib/site";
import { LocalizedText, useLanguage } from "@/components/LanguageProvider";

type SiteHeaderProps = {
  active?: "gallery";
};

export default function SiteHeader({ active }: SiteHeaderProps) {
  const { language, setLanguage } = useLanguage();
  const isGallery = active === "gallery";
  const sectionLink = (section: string) =>
    isGallery ? `/#${section}` : `#${section}`;

  return (
    <header className="nav">
      <div className="wrap nav-inner">
        <a href={sectionLink("top")} className="brand">{site.name}</a>
        <nav className="nav-links" aria-label={language === "id" ? "Navigasi utama" : "Main navigation"}>
          <a href={sectionLink("top")}><LocalizedText id="Beranda" en="Home" /></a>
          <a href={sectionLink("about")}><LocalizedText id="Tentang" en="About" /></a>
          <a href={sectionLink("work")}>Project</a>
          <a href={sectionLink("contact")}><LocalizedText id="Kontak" en="Contact" /></a>
          <a href="/gallery" aria-current={isGallery ? "page" : undefined}><LocalizedText id="Galeri" en="Gallery" /></a>
        </nav>
        <div className="nav-tools">
          {site.resumeUrl && <a className="nav-resume" href={site.resumeUrl}>CV <span aria-hidden="true">↗</span></a>}
          <button
            type="button"
            className="nav-language"
            onClick={() => setLanguage(language === "id" ? "en" : "id")}
            aria-label={language === "id" ? "Switch language to English" : "Ganti bahasa ke Indonesia"}
            aria-pressed={language === "id"}
            lang={language}
          >
            {language === "id" ? "ID" : "EN"}
          </button>
        </div>
      </div>
    </header>
  );
}
