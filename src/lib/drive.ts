import { cacheLife } from "next/cache";
import type { ProjectFile } from "./types";

const ID_PATTERN = /^[\w-]+$/;

export async function getProjectFiles(folderId: string): Promise<ProjectFile[]> {
  const base = process.env.APPS_SCRIPT_URL?.trim();
  if (!base || !ID_PATTERN.test(folderId)) return [];

  try {
    return await fetchFiles(base, folderId);
  } catch (error) {
    console.error("Gagal membaca folder Drive:", error);
    return [];
  }
}

// Error dilempar (bukan dikembalikan) supaya hasil gagal tidak ikut tersimpan di cache.
async function fetchFiles(base: string, folderId: string): Promise<ProjectFile[]> {
  "use cache";
  cacheLife({ stale: 60, revalidate: 60, expire: 600 });

  const url = new URL(base);
  url.searchParams.set("sheet", "files");
  url.searchParams.set("folderId", folderId);

  const res = await fetch(url, { cache: "no-store" });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);

  const json = await res.json();
  if (!json.ok) throw new Error(json.error ?? "Respons tidak valid");

  return (json.data as Array<Record<string, unknown>>)
    .filter((f) => typeof f.id === "string" && ID_PATTERN.test(f.id))
    .map((f) => ({
      id: f.id as string,
      name: String(f.name ?? ""),
      type: f.type === "image" || f.type === "video" ? f.type : "other",
    }));
}