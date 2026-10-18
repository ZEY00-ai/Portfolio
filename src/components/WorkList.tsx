"use client";

import { useMemo, useState } from "react";
import Carousel from "@/components/Carousel";
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
        <Carousel
          key={category}
          label="proyek"
          items={filtered.map((project, index) => ({
            id: project.slug,
            label: project.title,
            content: (
              <article className="work-card">
                <div className="work-card-heading">
                  <span className="work-idx">{String(index + 1).padStart(2, "0")}</span>
                  <div className="work-card-meta">
                    {(project.category || project.year) && (
                      <span className="work-meta">
                        {[project.category, project.year].filter(Boolean).join(" · ")}
                      </span>
                    )}
                    {project.status && (
                      <span
                        className={`work-status ${
                          /complete|selesai/i.test(project.status)
                            ? "work-status-complete"
                            : /ongoing|on.?going|progress|berjalan/i.test(project.status)
                              ? "work-status-ongoing"
                              : ""
                        }`}
                      >
                        <span aria-hidden="true" />
                        {project.status}
                      </span>
                    )}
                  </div>
                </div>
                <h3 className="work-title">{project.title}</h3>
                {project.description && <p className="work-desc">{project.description}</p>}
                {project.tech.length > 0 && (
                  <ul className="tags">
                    {project.tech.map((technology) => (
                      <li key={technology}>{technology}</li>
                    ))}
                  </ul>
                )}
                {project.image && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img className="work-img" src={project.image} alt={project.title} loading="lazy" />
                )}
                {(project.demoUrl || project.repoUrl) && (
                  <div className="work-links">
                    {project.demoUrl && (
                      <a href={project.demoUrl} target="_blank" rel="noopener noreferrer">
                        Demo <span aria-hidden="true">↗</span>
                      </a>
                    )}
                    {project.repoUrl && (
                      <a href={project.repoUrl} target="_blank" rel="noopener noreferrer">
                        Kode <span aria-hidden="true">↗</span>
                      </a>
                    )}
                  </div>
                )}
              </article>
            ),
          }))}
        />
      ) : (
        <p className="skills-empty">Belum ada proyek untuk kategori ini.</p>
      )}
    </div>
  );
}
