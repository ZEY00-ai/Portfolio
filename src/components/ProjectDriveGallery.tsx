import { LocalizedText } from "@/components/LanguageProvider";
import { getProjectFiles } from "@/lib/drive";

export default async function ProjectDriveGallery({
  driveId,
  driveUrl,
  title,
}: {
  driveId: string;
  driveUrl?: string;
  title: string;
}) {
  const files = await getProjectFiles(driveId);
  const images = files.filter((f) => f.type === "image");
  const videos = files.filter((f) => f.type === "video");
  const others = files.filter((f) => f.type === "other");

  return (
    <section className="project-detail-section">
      <h2><LocalizedText id="Galeri" en="Gallery" /></h2>

      {files.length === 0 && (
        <p className="project-detail-empty">
          <LocalizedText id="Foto dan video belum tersedia." en="Photos and videos are not available yet." />
        </p>
      )}

      {images.length > 0 && (
        <div className="drive-gallery">
          {images.map((f) => (
            <a
              key={f.id}
              href={`https://drive.google.com/file/d/${f.id}/view`}
              target="_blank"
              rel="noopener noreferrer"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={`https://drive.google.com/thumbnail?id=${f.id}&sz=w1000`}
                alt={`${title} - ${f.name}`}
                loading="lazy"
                referrerPolicy="no-referrer"
              />
            </a>
          ))}
        </div>
      )}

      {videos.length > 0 && (
        <div className="drive-gallery drive-gallery-video">
          {videos.map((f) => (
            <iframe
              key={f.id}
              src={`https://drive.google.com/file/d/${f.id}/preview`}
              title={`${title} - ${f.name}`}
              allow="autoplay; fullscreen"
              loading="lazy"
              allowFullScreen
            />
          ))}
        </div>
      )}

      {others.length > 0 && (
        <ul className="drive-files">
          {others.map((f) => (
            <li key={f.id}>
              <a href={`https://drive.google.com/file/d/${f.id}/view`} target="_blank" rel="noopener noreferrer">
                {f.name} <span aria-hidden="true">↗</span>
              </a>
            </li>
          ))}
        </ul>
      )}

      {driveUrl && (
        <a className="project-documentation-link" href={driveUrl} target="_blank" rel="noopener noreferrer">
          <LocalizedText id="Buka semua di Drive" en="Open all in Drive" /> <span aria-hidden="true">↗</span>
        </a>
      )}
    </section>
  );
}