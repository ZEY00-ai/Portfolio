import type { SkillGroup } from "./types"

export const site = {
    name: "Daffa Abrar",
    role: "Web Developer",
    location: "Kecamatan Tilatang Kamang, Kabupaten Agam, Provinsi Sumatera Barat, Indonesia.",
    headline: "Membangun aplikasi web yang rapi, cepat, dan berguna.",
    intro:  "Mahasiswa Politeknik Negeri padang",
    email: "daffaabrar630@gmail.com",
    github: "https://github.com/ZEY00-ai",
    linkedin: "https://www.linkedin.com/in/daffa-abrar-77bb29323/",
    resumeUrl: "",
    about: [
    "Saya Daffa, mahasiswa politeknik di Indonesia. Selain mengerjakan tugas kuliah, saya membangun project web pribadi sebagai pembelajaran.",
    "saya biasanya memekai framework laravel, dan saya sedang belajar flutter, vue.js, next.js, reach.",
  ],
}

export const skillGroups: SkillGroup[] = [
  { title: "Backend", items: ["Laravel", "CodeIgniter 4", "PHP", "Node.js"] },
  { title: "Frontend", items: ["React", "Vue.js", "Inertia.js", "Tailwind CSS"] },
  { title: "Database", items: ["MySQL"] },
  { title: "Deploy", items: ["Vercel", "AWS EC2", "Docker"] },
];

