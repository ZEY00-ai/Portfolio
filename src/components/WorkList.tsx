"use client";

import { useMemo, useState } from "react";
import type { Project } from "@/lib/types";

export default function WorkList({ projects }: { projects: Project[] }) {
  const [category, setCategory] = useState("Semua");

  const categories = useMemo(() => {
    const set = new Set(projects.map((project) => project.category).filter(Boolean));
    return set.size > 1 ? ["Semua", ...(set as Set<string>)] : [];
  }, [projects]);
  const filtered = projects.filter(
    (project) => category === "Semua" || project.category === category,
  );

  return (
    <div className="work-wrap">
      {categories.length > 0 && (
        <div className="chips">
          {categories.map((item) => (
            <button
              key={item}
              type="button"
              className={`chip ${item === category ? "chip-on" : ""}`}
              onClick={() => setCategory(item)}
            >
              {item}
            </button>
          ))}
        </div>
      )}

      {filtered.length > 0 ? (
        <div className="work-list" aria-label="Daftar project">
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
                      Source <span aria-hidden="true">↗</span>
                    </a>
                  )}
                </div>
              </div>
            </article>
          ))}
        </div>
      ) : (
        <p className="empty-note">Belum ada project di kategori ini.</p>
      )}
    </div>
  );
}
