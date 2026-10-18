export type Project = {
  slug: string;
  title: string;
  description?: string;
  tech: string[];
  demoUrl?: string;
  repoUrl?: string;
  image?: string;
  category?: string;
  year?: string;
  status?: string;
};

export type SkillGroup = {
  title: string;
  items: string[];
};