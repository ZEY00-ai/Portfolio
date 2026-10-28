"use client";

import { useState } from "react";
import GalleryPhoto from "@/components/GalleryPhoto";
import type { GalleryImage } from "@/lib/gallery";

const PAGE_SIZE = 6;

export default function GalleryPhotoGrid({
  images,
  title,
}: {
  images: GalleryImage[];
  title: string;
}) {
  const [page, setPage] = useState(0);
  const pageCount = Math.ceil(images.length / PAGE_SIZE);
  const visibleImages = images.slice(
    page * PAGE_SIZE,
    (page + 1) * PAGE_SIZE,
  );
  const firstItem = page * PAGE_SIZE + 1;
  const lastItem = Math.min((page + 1) * PAGE_SIZE, images.length);

  function changePage(nextPage: number) {
    setPage(nextPage);
    document.getElementById(`gallery-grid-${title}`)?.scrollIntoView({
      behavior: "smooth",
      block: "nearest",
    });
  }

  return (
    <>
      <div className="gallery-grid" id={`gallery-grid-${title}`}>
        {visibleImages.map((image, index) => (
          <a
            className="gallery-card"
            href={image.viewUrl}
            key={image.id}
            target="_blank"
            rel="noopener noreferrer"
          >
            <div className="gallery-image">
              <GalleryPhoto
                id={image.id}
                name={image.name}
                priority={page === 0 && index < 2}
              />
            </div>
            <div className="gallery-card-caption">
              <span>{image.name}</span>
              <span aria-hidden="true">↗</span>
            </div>
          </a>
        ))}
      </div>
      {pageCount > 1 ? (
        <nav className="gallery-pagination" aria-label={`Halaman foto ${title}`}>
          <p aria-live="polite">
            <span className="gallery-pagination-label">MENAMPILKAN</span>
            <strong>{String(firstItem).padStart(2, "0")}–{String(lastItem).padStart(2, "0")}</strong>
            <span className="gallery-pagination-total">/ {String(images.length).padStart(2, "0")} FOTO</span>
          </p>
          <div className="gallery-pagination-controls">
            <button
              className="gallery-pagination-arrow"
              type="button"
              onClick={() => changePage(page - 1)}
              disabled={page === 0}
              aria-label="Foto sebelumnya"
            >
              <span aria-hidden="true">←</span>
            </button>
            <div className="gallery-pagination-pages" aria-label="Pilih halaman">
              {Array.from({ length: pageCount }, (_, index) => (
              <button
                className="gallery-page-number"
                type="button"
                key={index}
                onClick={() => changePage(index)}
                aria-label={`Halaman ${index + 1}`}
                aria-current={page === index ? "page" : undefined}
              >
                {index + 1}
              </button>
              ))}
            </div>
            <button
              className="gallery-pagination-arrow"
              type="button"
              onClick={() => changePage(page + 1)}
              disabled={page === pageCount - 1}
              aria-label="Foto berikutnya"
            >
              <span aria-hidden="true">→</span>
            </button>
          </div>
        </nav>
      ) : null}
    </>
  );
}
