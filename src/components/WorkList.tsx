"use client";

import { useMemo, useState } from "react";
import type { Project } from "@/lib/types";

const PAGE_SIZE = 6;

export default function WorkList({ projects }: { projects: Project[] }) {
  const [category, setCategory] = useState("Semua");
  const [visible, setVisible] = useState(PAGE_SIZE);

  const categories = useMemo(() => {
    const set = new Set(projects.map((p) => p.category).filter(Boolean));
    return set.size > 1 ? ["Semua", ...(set as Set<string>)] : [];
  }, [projects]);

  const filtered = projects.filter(
    (p) => category === "Semua" || p.category === category,
  );
  const shown = filtered.slice(0, visible);

  return (
    <div>
      {categories.length > 0 && (
        <div className="chips">
          {categories.map((c) => (
            <button
              key={c}
              type="button"
              className={`chip ${c === category ? "chip-on" : ""}`}
              onClick={() => {
                setCategory(c);
                setVisible(PAGE_SIZE);
              }}
            >
              {c}
            </button>
          ))}
        </div>
      )}

      <ol className="work-list">
        {shown.map((p, i) => (
          <li key={p.slug} className="work-row">
            <span className="work-idx">{String(i + 1).padStart(2, "0")}</span>

            <div className="work-main">
              <h3 className="work-title">{p.title}</h3>
              {p.description && <p className="work-desc">{p.description}</p>}
              {p.tech.length > 0 && (
                <ul className="tags">
                  {p.tech.map((t) => (
                    <li key={t}>{t}</li>
                  ))}
                </ul>
              )}
            </div>

            <div className="work-side">
              {(p.category || p.year) && (
                <span className="work-meta">
                  {[p.category, p.year].filter(Boolean).join(" · ")}
                </span>
              )}
              <span className="work-links">
                {p.demoUrl && (
                  <a href={p.demoUrl} target="_blank" rel="noopener noreferrer">
                    Demo ↗
                  </a>
                )}
                {p.repoUrl && (
                  <a href={p.repoUrl} target="_blank" rel="noopener noreferrer">
                    Kode ↗
                  </a>
                )}
              </span>
            </div>

            {p.image && (
              // eslint-disable-next-line @next/next/no-img-element
              <img className="work-img" src={p.image} alt={p.title} loading="lazy" />
            )}
          </li>
        ))}
      </ol>

      {filtered.length > visible && (
        <button
          type="button"
          className="more-btn"
          onClick={() => setVisible((v) => v + PAGE_SIZE)}
        >
          Tampilkan {Math.min(PAGE_SIZE, filtered.length - visible)} lagi
        </button>
      )}
    </div>
  );
}