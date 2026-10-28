"use client";

import Image from "next/image";
import { useState } from "react";

type GalleryPhotoProps = {
  id: string;
  name: string;
  priority: boolean;
};

export default function GalleryPhoto({
  id,
  name,
  priority,
}: GalleryPhotoProps) {
  const [sourceIndex, setSourceIndex] = useState(0);

  if (sourceIndex > 0) {
    return (
      <div className="gallery-image-fallback" role="img" aria-label={name}>
        <span>Pratinjau foto tidak tersedia</span>
      </div>
    );
  }

  return (
    <Image
      src={`/api/gallery/image/${encodeURIComponent(id)}`}
      alt={name}
      fill
      unoptimized
      sizes="(max-width: 620px) 100vw, (max-width: 900px) 50vw, 33vw"
      priority={priority}
      onError={() => setSourceIndex((current) => current + 1)}
    />
  );
}
