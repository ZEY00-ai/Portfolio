import Carousel from "@/components/Carousel";
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
    <Carousel
      label="skill"
      items={groups.map((group) => ({
        id: group.title,
        label: group.title,
        content: (
          <article className="skill-card">
            <p className="skill-card-index">KEAHLIAN</p>
            <h3>{group.title}</h3>
            <ul className="tags">
              {group.items.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </article>
        ),
      }))}
    />
  );
}
