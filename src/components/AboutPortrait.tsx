"use client";

import Image from "next/image";
import { useState } from "react";

type AboutPortraitProps = {
  location: string;
  focus: string;
};

export default function AboutPortrait({ location, focus }: AboutPortraitProps) {
  const [hasImage, setHasImage] = useState(true);

  return (
    <div className="about-card">
      <div className="about-card-heading">
        <span>PROFIL</span>
        <span aria-hidden="true">01</span>
      </div>
      <div className="about-photo">
        {hasImage ? (
          <Image
            src="/foto-daffa.jpg"
            alt="Foto Daffa Abrar"
            width={600}
            height={800}
            unoptimized
            onError={() => setHasImage(false)}
          />
        ) : (
          <div className="about-photo-placeholder" role="img" aria-label="Foto Daffa Abrar belum ditambahkan">
            <span>Foto 3 × 4</span>
            <small>Simpan foto di public/foto-daffa.jpg</small>
          </div>
        )}
      </div>
      <dl className="about-facts">
        <div>
          <dt>Lokasi</dt>
          <dd>{location}</dd>
        </div>
        <div>
          <dt>Fokus</dt>
          <dd>{focus}</dd>
        </div>
      </dl>
    </div>
  );
}
