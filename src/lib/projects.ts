import { cacheLife } from "next/cache";
import Papa from "papaparse";
import { fallbackProjects } from "./fallback";
import type { Project } from "./types";

// Nama kolom spreadsheet yang dikenali. Huruf besar/kecil dan spasi diabaikan.
// Kalau kolom Anda bernama lain, tambahkan ke daftar yang sesuai.
const ALIASES = {
  title: ["title", "judul", "nama", "namaproject", "project", "name"],
  description: ["description", "deskripsi", "desc", "keterangan", "ringkasan"],
  tech: ["tech", "teknologi", "stack", "techstack", "tools", "bahasa"],
  demoUrl: ["demo", "demourl", "link", "url", "website", "live", "linkdemo"],
  repoUrl: ["repo", "repourl", "github", "source", "linkrepo", "linkgithub"],
  image: ["image", "gambar", "foto", "thumbnail", "cover", "screenshot"],
  category: ["category", "kategori", "type", "jenis", "tipe"],
  year: ["year", "tahun", "date", "tanggal"],
  status: ["status", "kondisi", "condition", "state", "progress"],
} as const;

type Field = keyof typeof ALIASES;

function normalize(text: string) {
  return text.toLowerCase().replace(/[^a-z0-9]/g, "");
}

// Cari nilai di satu baris berdasarkan nama kolom yang cocok
function pick(row: Record<string, string>, field: Field): string | undefined {
  const names: readonly string[] = ALIASES[field];
  for (const [key, value] of Object.entries(row)) {
    if (names.includes(normalize(key)) && value?.trim()) return value.trim();
  }
  return undefined;
}

function slugify(text: string, index: number) {
  const base = text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
  return `${base || "project"}-${index}`;
}

function toProject(row: Record<string, string>, index: number): Project | null {
  // Kalau tidak ada kolom judul yang dikenali, pakai kolom pertama sebagai judul
  const title = pick(row, "title") ?? Object.values(row)[0]?.trim();
  if (!title) return null;

  return {
    slug: slugify(title, index),
    title,
    description: pick(row, "description"),
    tech: (pick(row, "tech") ?? "")
      .split(/[,;|]/)
      .map((t) => t.trim())
      .filter(Boolean),
    demoUrl: pick(row, "demoUrl"),
    repoUrl: pick(row, "repoUrl"),
    image: pick(row, "image"),
    category: pick(row, "category"),
    year: pick(row, "year"),
    status: pick(row, "status"),
  };
}

export async function getProjects(): Promise<Project[]> {
  "use cache"; // hasil disimpan supaya CSV tidak diambil di setiap kunjungan
  cacheLife("hours"); // lalu diperbarui otomatis tiap beberapa jam

  const url = process.env.SHEET_CSV_URL;
  if (!url) return fallbackProjects;

  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);

    const { data } = Papa.parse<Record<string, string>>(await res.text(), {
      header: true, // baris pertama dianggap nama kolom
      skipEmptyLines: true,
    });

    const projects = data
      .map(toProject)
      .filter((p): p is Project => p !== null);

    return projects.length > 0 ? projects : fallbackProjects;
  } catch (error) {
    console.error("Gagal membaca spreadsheet, memakai data cadangan:", error);
    return fallbackProjects;
  }
}