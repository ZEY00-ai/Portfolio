import { Suspense } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { LocalizedText } from "@/components/LanguageProvider";
import SiteHeader from "@/components/SiteHeader";
import ThemeToggle from "@/components/ThemeToggle";
import { getProjects } from "@/lib/projects";
import type { Project } from "@/lib/types";
import ProjectDriveGallery from "@/components/ProjectDriveGallery";

type VideoSource =
  | { type: "embed"; url: string }
  | { type: "file"; url: string }
  | { type: "link"; url: string };

function getVideoSource(value?: string): VideoSource | null {
  if (!value) return null;

  let url: URL;
  try {
    url = new URL(value);
  } catch {
    return null;
  }

  if (url.protocol !== "https:" && url.protocol !== "http:") return null;

  const hostname = url.hostname.toLowerCase().replace(/^www\./, "");
  const pathParts = url.pathname.split("/").filter(Boolean);

  if (hostname === "youtu.be" || hostname === "youtube.com" || hostname === "m.youtube.com" || hostname === "youtube-nocookie.com") {
    const videoId = hostname === "youtu.be"
      ? pathParts[0]
      : url.searchParams.get("v") ?? pathParts[pathParts.length - 1];
    if (videoId && /^[\w-]{11}$/.test(videoId)) {
      return { type: "embed", url: `https://www.youtube-nocookie.com/embed/${videoId}` };
    }
  }

  if (hostname === "drive.google.com") {
    const fileId = url.pathname.match(/^\/file\/d\/([\w-]+)/)?.[1];
    if (fileId) return { type: "embed", url: `https://drive.google.com/file/d/${fileId}/preview` };
  }

  if (hostname === "vimeo.com" || hostname === "player.vimeo.com") {
    const videoId = pathParts.find((part) => /^\d+$/.test(part));
    if (videoId) {
      const embedUrl = new URL(`https://player.vimeo.com/video/${videoId}`);
      const privateHash = pathParts.find((part) => /^[\da-f]{8,}$/i.test(part));
      if (privateHash) embedUrl.searchParams.set("h", privateHash);
      return { type: "embed", url: embedUrl.toString() };
    }
  }

  if (/\.(mp4|webm|ogg)$/i.test(url.pathname)) {
    return { type: "file", url: url.toString() };
  }

  return { type: "link", url: url.toString() };
}

function getDocumentationUrl(value?: string) {
  if (!value) return undefined;
  try {
    const url = new URL(value);
    return url.protocol === "https:" || url.protocol === "http:" ? url.toString() : undefined;
  } catch {
    return undefined;
  }
}

export async function generateStaticParams() {
  const projects = await getProjects();
  return projects.map((project) => ({ slug: project.slug }));
}

export default function ProjectDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  return (
    <>
      <SiteHeader active="project" />
      <main className="project-detail-page">
        <Suspense fallback={<ProjectDetailLoading />}>
          <ProjectDetailContent params={params} />
        </Suspense>
      </main>
      <ThemeToggle />
    </>
  );
}

async function ProjectDetailContent({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const projects = await getProjects();
  const project = projects.find((item) => item.slug === slug);

  if (!project) notFound();

  return <ProjectDetails project={project} />;
}

function ProjectDetailLoading() {
  return (
    <section className="project-detail">
      <div className="wrap">
        <p className="project-detail-empty" role="status">
          <LocalizedText id="Memuat detail project..." en="Loading project details..." />
        </p>
      </div>
    </section>
  );
}

function ProjectDetails({ project }: { project: Project }) {
  const video = getVideoSource(project.videoUrl);
  const documentationUrl =
    getDocumentationUrl(project.documentationUrl) ?? getDocumentationUrl(project.documentation);
  const documentationText = getDocumentationUrl(project.documentation)
    ? undefined
    : project.documentation;

  return (
    <section className="project-detail">
      <div className="wrap">
        <Link className="project-back-link" href="/#work">
          <span aria-hidden="true">←</span>
          <LocalizedText id="Kembali ke project" en="Back to projects" />
        </Link>

        <header className="project-detail-heading">
          <p className="eyebrow">
            <LocalizedText id="RINCIAN PROJECT" en="PROJECT DETAILS" />
          </p>
          <h1>{project.title}</h1>
          {project.description && <p className="project-detail-description">{project.description}</p>}
          <div className="project-detail-meta">
            {[project.category, project.year, project.status].filter(Boolean).map((item) => (
              <span key={item}>{item}</span>
            ))}
          </div>
        </header>

        {project.image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img className="project-detail-image" src={project.image} alt={project.title} />
        ) : (
          <div className="project-detail-art" aria-hidden="true">
            <span>PROJECT</span>
          </div>
        )}

        <div className="project-detail-information">
          {project.tech.length > 0 && (
            <section className="project-detail-block">
              <h2><LocalizedText id="Teknologi" en="Technologies" /></h2>
              <ul className="project-tech-list">
                {project.tech.map((technology) => <li key={technology}>{technology}</li>)}
              </ul>
            </section>
          )}
          {(project.demoUrl || project.repoUrl) && (
            <section className="project-detail-block">
              <h2><LocalizedText id="Tautan project" en="Project links" /></h2>
              <div className="project-detail-links">
                {project.demoUrl && (
                  <a href={project.demoUrl} target="_blank" rel="noopener noreferrer">
                    Demo <span aria-hidden="true">↗</span>
                  </a>
                )}
                {project.repoUrl && (
                  <a href={project.repoUrl} target="_blank" rel="noopener noreferrer">
                    <LocalizedText id="Source code" en="Source code" /> <span aria-hidden="true">↗</span>
                  </a>
                )}
              </div>
            </section>
          )}
        </div>

        <section className="project-detail-section">
          <h2><LocalizedText id="Dokumentasi" en="Documentation" /></h2>
          {documentationText && <p className="project-documentation">{documentationText}</p>}
          {documentationUrl && (
            <a className="project-documentation-link" href={documentationUrl} target="_blank" rel="noopener noreferrer">
              <LocalizedText id="Buka dokumentasi" en="Open documentation" /> <span aria-hidden="true">↗</span>
            </a>
          )}
          {!documentationText && !documentationUrl && (
            <p className="project-detail-empty">
              <LocalizedText id="Dokumentasi belum tersedia." en="Documentation is not available yet." />
            </p>
          )}
        </section>

        <section className="project-detail-section">
          <h2><LocalizedText id="Video demo" en="Demo video" /></h2>
          {video?.type === "embed" && (
            <div className="project-video-frame">
              <iframe
                src={video.url}
                title={`${project.title} demo video`}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                referrerPolicy="strict-origin-when-cross-origin"
                allowFullScreen
              />
            </div>
          )}
          {video?.type === "file" && (
            <video className="project-video-frame" controls preload="metadata">
              <source src={video.url} />
              <LocalizedText id="Browser Anda tidak mendukung pemutar video." en="Your browser does not support video playback." />
            </video>
          )}
          {video?.type === "link" && (
            <a className="project-detail-links project-video-link" href={video.url} target="_blank" rel="noopener noreferrer">
              <LocalizedText id="Putar video demo" en="Play demo video" /> <span aria-hidden="true">↗</span>
            </a>
          )}
          {!video && (
            <p className="project-detail-empty">
              <LocalizedText id="Video demo belum tersedia." en="Demo video is not available yet." />
            </p>
          )}
                  {project.driveId && (
          <Suspense
            fallback={
              <p className="project-detail-empty" role="status">
                <LocalizedText id="Memuat galeri..." en="Loading gallery..." />
              </p>
            }
          >
            <ProjectDriveGallery
              driveId={project.driveId}
              driveUrl={project.driveUrl}
              title={project.title}
            />
          </Suspense>
        )}
        </section>
      </div>
    </section>
  );
}
