type EducationEntry = {
  level: string;
  institution: string;
  period: string;
  current?: boolean;
};

const education: EducationEntry[] = [
  { level: "TK", institution: "TK Aisyiyah BA Pakan Sinayan", period: "2011–2012" },
  { level: "SD", institution: "SDN 18 Koto Tangah", period: "2012–2018" },
  { level: "SMP", institution: "SMPN 1 Tilatang Kamang", period: "2018–2021" },
  { level: "SMA", institution: "SMAN 1 Kamang Magek", period: "2021–2024" },
  {
    level: "Kuliah",
    institution: "Politeknik Negeri Padang",
    period: "2024–sekarang",
    current: true,
  },
];

export const site = {
    name: "Daffa Abrar",
    role: "Full Stack Developer -ongoing-",
    location: "Kecamatan Tilatang Kamang, Kabupaten Agam, Provinsi Sumatera Barat, Indonesia.",
    headline: "Membangun aplikasi web yang rapi, cepat, dan berguna.",
    intro:  "Mahasiswa Politeknik Negeri padang",
    email: "daffaabrar630@gmail.com",
    github: "https://github.com/ZEY00-ai",
    linkedin: "https://www.linkedin.com/in/daffa-abrar-77bb29323/",
    resumeUrl: "/cv-daffa-abrar.pdf",
    about: [
    "Saya Daffa, mahasiswa politeknik di Indonesia. Selain mengerjakan tugas kuliah, saya membangun project web pribadi sebagai pembelajaran.",
    "saya biasanya menggunakan framework laravel, dan saya sedang belajar flutter, vue.js, next.js, reach.",
  ],
    education,
    interests: [
      "Bermain Game",
      "beberapa olahraga",
    ],
}
