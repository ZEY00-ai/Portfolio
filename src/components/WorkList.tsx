"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { LocalizedText, useLanguage } from "@/components/LanguageProvider";
import type { Project } from "@/lib/types";

const PAGE_SIZE = 4;

export default function WorkList({ projects }: { projects: Project[] }) {
  const { language } = useLanguage();
  const [category, setCategory] = useState("Semua");
  const [tech, setTech] = useState("Semua");
  const [page, setPage] = useState(0);

  const categories = useMemo(() => {
    const set = new Set(projects.map((project) => project.category).filter(Boolean));
    return set.size > 1 ? ["Semua", ...(set as Set<string>)] : [];
  }, [projects]);

  const techs = useMemo(() => {
    const set = new Set(projects.flatMap((project) => project.tech));
    return [...set].sort((a, b) => a.localeCompare(b));
  }, [projects]);

  const filtered = projects.filter(
    (project) =>
      (category === "Semua" || project.category === category) &&
      (tech === "Semua" || project.tech.includes(tech)),
  );
  const pageCount = Math.ceil(filtered.length / PAGE_SIZE);
  const visibleProjects = filtered.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE);
  const firstItem = page * PAGE_SIZE + 1;
  const lastItem = Math.min((page + 1) * PAGE_SIZE, filtered.length);

  return (
    <div className="work-wrap">
      {(categories.length > 0 || techs.length > 0) && (
        <div className="chips">
          {categories.map((item) => (
            <button
              key={item}
              type="button"
              className={`chip ${item === category ? "chip-on" : ""}`}
              onClick={() => {
                setCategory(item);
                setPage(0);
              }}
            >
              {item === "Semua" && language === "en" ? "All" : item}
            </button>
          ))}

          {techs.length > 0 && (
            <select
              className={`chip chip-select ${tech !== "Semua" ? "chip-on" : ""}`}
              value={tech}
              onChange={(event) => {
                setTech(event.target.value);
                setPage(0);
              }}
              aria-label={language === "id" ? "Filter berdasarkan teknologi" : "Filter by technology"}
            >
              <option value="Semua">{language === "id" ? "Semua Tech" : "All technologies"}</option>
              {techs.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          )}
        </div>
      )}

      {filtered.length > 0 ? (
        <div className="work-list" aria-label={language === "id" ? "Daftar project" : "Project list"}>
          {visibleProjects.map((project, index) => (
            <article
              className={`work-card ${project.demoUrl || project.repoUrl ? "work-card-with-links" : ""}`}
              key={project.slug}
            >
              <Link className="work-card-link" href={`/projects/${project.slug}`}>
                {project.image ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img className="work-img" src={project.image} alt={project.title} loading="lazy" />
                ) : (
                  <div className="work-art">
                    <span className="work-art-index" aria-hidden="true">
                      {String(page * PAGE_SIZE + index + 1).padStart(2, "0")}
                    </span>
                    <span className="work-art-label">PROJECT</span>
                  </div>
                )}
                <div className="work-card-content">
                  <div className="work-row-meta">
                    {[project.category, project.year].filter(Boolean).join(" · ")}
                    {project.status && <span>{project.status}</span>}
                  </div>
                  <h3 className="work-title">{project.title}</h3>
                  {project.description && <p className="work-desc">{project.description}</p>}
                  {project.tech.length > 0 && (
                    <p className="work-tech" aria-label="Teknologi">
                      {project.tech.map((technology, techIndex) => (
                        <span key={technology}>
                          {techIndex > 0 && <span className="work-tech-separator" aria-hidden="true">·</span>}
                          {technology}
                        </span>
                      ))}
                    </p>
                  )}
                </div>
              </Link>
              {(project.demoUrl || project.repoUrl) && (
                <div className="work-links">
                  {project.demoUrl && (
                    <a href={project.demoUrl} target="_blank" rel="noopener noreferrer">
                      Demo <span aria-hidden="true">↗</span>
                    </a>
                  )}
                  {project.repoUrl && (
                    <a href={project.repoUrl} target="_blank" rel="noopener noreferrer">
                      <LocalizedText id="Source" en="Source" /> <span aria-hidden="true">↗</span>
                    </a>
                  )}
                </div>
              )}
            </article>
          ))}
        </div>
      ) : (
        <p className="empty-note"><LocalizedText id="Belum ada project untuk filter ini." en="No projects match this filter." /></p>
      )}
      {pageCount > 1 && (
        <nav className="gallery-pagination" aria-label={language === "id" ? "Halaman project" : "Project pages"}>
          <p aria-live="polite">
            <span className="gallery-pagination-label">{language === "id" ? "MENAMPILKAN" : "SHOWING"}</span>
            <strong>{String(firstItem).padStart(2, "0")}–{String(lastItem).padStart(2, "0")}</strong>
            <span className="gallery-pagination-total">/ {String(filtered.length).padStart(2, "0")} {language === "id" ? "PROJECT" : "PROJECTS"}</span>
          </p>
          <div className="gallery-pagination-controls">
            <button
              type="button"
              onClick={() => setPage(page - 1)}
              disabled={page === 0}
              aria-label={language === "id" ? "Halaman sebelumnya" : "Previous page"}
            >
              <span aria-hidden="true">←</span>
            </button>
            <div className="gallery-pagination-pages" aria-label={language === "id" ? "Pilih halaman" : "Choose page"}>
              {Array.from({ length: pageCount }, (_, index) => (
                <button
                  className="gallery-page-number"
                  type="button"
                  key={index}
                  onClick={() => setPage(index)}
                  aria-label={`${language === "id" ? "Halaman" : "Page"} ${index + 1}`}
                  aria-current={page === index ? "page" : undefined}
                >
                  {index + 1}
                </button>
              ))}
            </div>
            <button
              type="button"
              onClick={() => setPage(page + 1)}
              disabled={page === pageCount - 1}
              aria-label={language === "id" ? "Halaman berikutnya" : "Next page"}
            >
              <span aria-hidden="true">→</span>
            </button>
          </div>
        </nav>
      )}
    </div>
  );
}