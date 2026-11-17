export type Project = {
  slug: string;
  title: string;
  description?: string;
  documentation?: string;
  documentationUrl?: string;
  videoUrl?: string;
  driveUrl?: string;
  driveId?: string;
  tech: string[];
  demoUrl?: string;
  repoUrl?: string;
  image?: string;
  category?: string;
  year?: string;
  status?: string;
};

export type ProjectFile = {
  id: string;
  name: string;
  type: "image" | "video" | "other";
};

export type SkillGroup = {
  title: string;
  items: string[];
};