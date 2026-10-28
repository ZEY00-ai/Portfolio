import type { Metadata } from "next";
import { Suspense } from "react";
import { connection } from "next/server";
import GalleryPhotoGrid from "@/components/GalleryPhotoGrid";
import ImageAssetPreloader from "@/components/ImageAssetPreloader";
import ScrollReveal from "@/components/ScrollReveal";
import SiteHeader from "@/components/SiteHeader";
import ThemeToggle from "@/components/ThemeToggle";
import { getGallery, type GalleryCollection } from "@/lib/gallery";

export const metadata: Metadata = {
  title: "Galeri",
  description: "Galeri foto dari Google Drive.",
};

export default function GalleryPage() {
  return (
    <>
      <SiteHeader active="gallery" />
      <main className="gallery-page">
        <section className="gallery-intro wrap">
          <p className="eyebrow"><span>05</span> GALERI</p>
          <div className="gallery-heading">
            <h1>Potongan cerita.</h1>
          </div>
        </section>
        <Suspense fallback={<GalleryLoading />}>
          <GalleryContent />
        </Suspense>
      </main>
      <ThemeToggle />
    </>
  );
}

async function GalleryContent() {
  await connection();
  const gallery = await getGallery();
  const fileIds =
    gallery.status === "ready"
      ? gallery.collections.flatMap((collection) =>
          collection.images.map((image) => image.id),
        )
      : [];

  return (
    <section className="gallery-content wrap" aria-label="Foto galeri">
      <ImageAssetPreloader
        sources={fileIds.map(
          (id) => `/api/gallery/image/${encodeURIComponent(id)}`,
        )}
        readyAttribute="data-gallery-preload-ready"
      />
      {gallery.status === "setup" ? (
        <div className="gallery-message" role="status">
          <span className="gallery-message-mark" aria-hidden="true">↗</span>
          <div>
            <h2>Galeri belum terhubung.</h2>
              <p>Album foto belum tersedia saat ini.</p>
          </div>
        </div>
      ) : gallery.status === "error" ? (
        <div className="gallery-message" role="status">
          <span className="gallery-message-mark" aria-hidden="true">!</span>
          <div>
            <h2>Google Drive belum bisa diakses.</h2>
            <p>{gallery.message}</p>
          </div>
        </div>
      ) : (
        <div className="gallery-collections">
          {gallery.collections.map((collection) => (
            <GallerySection key={collection.id} collection={collection} />
          ))}
        </div>
      )}
    </section>
  );
}

function GallerySection({ collection }: { collection: GalleryCollection }) {
  return (
    <section className="gallery-collection" aria-labelledby={`gallery-${collection.id}`}>
      <header className="gallery-collection-heading">
        <div>
          <h2 id={`gallery-${collection.id}`}>{collection.title}</h2>
        </div>
        {collection.status === "ready" ? (
          <div className="gallery-collection-actions">
            <p className="gallery-count">
              <span>{String(collection.images.length).padStart(2, "0")}</span>
              {" "}FOTO
            </p>
            {collection.folderUrl ? (
              <a
                className="gallery-folder-link"
                href={collection.folderUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                Buka folder Drive <span aria-hidden="true">↗</span>
              </a>
            ) : null}
          </div>
        ) : null}
      </header>
      {collection.status === "ready" ? (
        <ScrollReveal className="gallery-grid-reveal">
          <GalleryPhotoGrid
            images={collection.images}
            title={collection.id}
          />
        </ScrollReveal>
      ) : (
        <p className="gallery-collection-message">
          {collection.status === "setup"
            ? "Album ini sedang disiapkan."
            : collection.message}
        </p>
      )}
    </section>
  );
}

function GalleryLoading() {
  return (
    <section className="gallery-content wrap" aria-label="Foto galeri">
      <div className="gallery-message" role="status" aria-live="polite">
        <span className="gallery-message-mark" aria-hidden="true">…</span>
        <div>
          <h2>Menghubungkan galeri.</h2>
          <p>Foto dari Google Drive sedang dimuat.</p>
        </div>
      </div>
    </section>
  );
}
