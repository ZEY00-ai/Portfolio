"use client";

import { useMemo, useState } from "react";
import { LocalizedText, useLanguage } from "@/components/LanguageProvider";
import type { Project } from "@/lib/types";

export default function WorkList({ projects }: { projects: Project[] }) {
  const { language } = useLanguage();
  const [category, setCategory] = useState("Semua");
  const [tech, setTech] = useState("Semua");

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

  return (
    <div className="work-wrap">
      {(categories.length > 0 || techs.length > 0) && (
        <div className="chips">
          {categories.map((item) => (
            <button
              key={item}
              type="button"
              className={`chip ${item === category ? "chip-on" : ""}`}
              onClick={() => setCategory(item)}
            >
              {item === "Semua" && language === "en" ? "All" : item}
            </button>
          ))}

          {techs.length > 0 && (
            <select
              className={`chip chip-select ${tech !== "Semua" ? "chip-on" : ""}`}
              value={tech}
              onChange={(event) => setTech(event.target.value)}
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
          {filtered.map((project, index) => (
            <article className="work-card" key={project.slug}>
              {project.image ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img className="work-img" src={project.image} alt={project.title} loading="lazy" />
              ) : (
                <div className="work-art">
                  <span className="work-art-index" aria-hidden="true">
                    {String(index + 1).padStart(2, "0")}
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
              </div>
            </article>
          ))}
        </div>
      ) : (
        <p className="empty-note"><LocalizedText id="Belum ada project untuk filter ini." en="No projects match this filter." /></p>
      )}
    </div>
  );
}