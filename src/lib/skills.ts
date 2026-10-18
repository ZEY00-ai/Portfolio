import { cacheLife } from "next/cache";
import Papa from "papaparse";
import { skillGroups as fallbackGroups } from "./site";
import type { SkillGroup } from "./types";

function normalize(text: string) {
  return text.toLowerCase().replace(/[^a-z0-9]/g, "");
}

export async function getSkillGroups(): Promise<SkillGroup[]> {
  "use cache";
  cacheLife("hours");

  const url = process.env.SKILLS_CSV_URL;
  if (!url) return fallbackGroups;

  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);

    const { data } = Papa.parse<Record<string, string>>(await res.text(), {
      header: true,
      skipEmptyLines: true,
    });

    // Kelompokkan skill berdasarkan kategori
    const groups = new Map<string, string[]>();
    for (const row of data) {
      let category = "";
      let skill = "";
      for (const [key, value] of Object.entries(row)) {
        const k = normalize(key);
        if (["kategori", "category", "grup", "group"].includes(k)) category = value.trim();
        if (["skill", "keahlian", "teknologi", "nama", "item"].includes(k)) skill = value.trim();
      }
      if (!category || !skill) continue;
      groups.set(category, [...(groups.get(category) ?? []), skill]);
    }

    const result = [...groups].map(([title, items]) => ({ title, items }));
    return result.length > 0 ? result : fallbackGroups;
  } catch (error) {
    console.error("Gagal membaca sheet skill, memakai data cadangan:", error);
    return fallbackGroups;
  }
}