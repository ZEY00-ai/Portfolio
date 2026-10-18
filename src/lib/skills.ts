import { cacheLife } from "next/cache";
import Papa from "papaparse";
import type { SkillGroup } from "./types";

function normalize(text: string) {
  return text.toLowerCase().replace(/[^a-z0-9]/g, "");
}

export async function getSkillGroups(): Promise<SkillGroup[]> {
  const url = process.env.SKILLS_CSV_URL?.trim();
  if (!url) {
    console.warn("SKILLS_CSV_URL belum diatur, daftar teknologi tidak dimuat.");
    return [];
  }

  return getSkillGroupsFromUrl(url);
}

async function getSkillGroupsFromUrl(url: string): Promise<SkillGroup[]> {
  "use cache";
  cacheLife("hours");

  try {
    const res = await fetch(url, { cache: "no-store" });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);

    const { data } = Papa.parse<Record<string, string>>(await res.text(), {
      header: true,
      skipEmptyLines: true,
    });

    const categoryAliases = ["kategori", "category", "grup", "group", "title"];
    const skillAliases = ["skill", "keahlian", "teknologi", "nama", "item", "items"];
    const groups = new Map<string, string[]>();
    for (const row of data) {
      let category = "";
      let skill = "";
      for (const [key, value] of Object.entries(row)) {
        const k = normalize(key);
        if (categoryAliases.includes(k)) category = value?.trim() ?? "";
        if (skillAliases.includes(k)) skill = value?.trim() ?? "";
      }
      if (!category || !skill) continue;
      groups.set(category, [...(groups.get(category) ?? []), skill]);
    }

    return [...groups].map(([title, items]) => ({ title, items }));
  } catch (error) {
    console.error("Gagal membaca sheet skill:", error);
    throw error;
  }
}