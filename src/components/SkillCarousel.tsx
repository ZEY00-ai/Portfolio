import type { SkillGroup } from "@/lib/types";

export default function SkillCarousel({ groups }: { groups: SkillGroup[] }) {
  if (groups.length === 0) {
    return (
      <p className="skills-empty">
        Belum ada teknologi di spreadsheet. Tambahkan baris dengan kolom{" "}
        <strong>title</strong> dan <strong>items</strong>.
      </p>
    );
  }

  return (
    <div className="skill-grid">
      {groups.map((group, index) => (
        <article className="skill-card" key={group.title}>
          <p className="skill-card-index">{String(index + 1).padStart(2, "0")}</p>
          <h3>{group.title}</h3>
          <ul className="tags">
            {group.items.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </article>
      ))}
    </div>
  );
}
