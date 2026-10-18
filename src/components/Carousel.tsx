"use client";

import { useState, type CSSProperties, type ReactNode } from "react";

type CarouselItem = {
  id: string;
  label: string;
  content: ReactNode;
};

type CarouselStyle = CSSProperties & {
  "--carousel-duration": string;
};

export default function Carousel({
  items,
  label,
}: {
  items: CarouselItem[];
  label: string;
}) {
  const [paused, setPaused] = useState(false);
  const carouselStyle: CarouselStyle = {
    "--carousel-duration": `${Math.max(items.length, 1) * 6}s`,
  };

  function renderItems(duplicate = false) {
    return items.map((item, index) => (
      <div
        className="carousel-slide"
        key={item.id}
        role={duplicate ? undefined : "group"}
        aria-roledescription={duplicate ? undefined : "slide"}
        aria-label={duplicate ? undefined : `${index + 1} dari ${items.length}: ${item.label}`}
      >
        {item.content}
      </div>
    ));
  }

  return (
    <div
      className={`carousel${paused ? " carousel-paused" : ""}${items.length < 2 ? " carousel-static" : ""}`}
      role="region"
      aria-label={label}
      aria-roledescription="carousel"
      style={carouselStyle}
    >
      <div className="carousel-viewport">
        <div className="carousel-belt">
          <div className="carousel-belt-group">{renderItems()}</div>
          {items.length > 1 && (
            <div className="carousel-belt-group" aria-hidden="true" inert>
              {renderItems(true)}
            </div>
          )}
        </div>
      </div>

      {items.length > 1 && (
        <div className="carousel-controls">
          <span className="carousel-status" aria-live="off">
            {paused ? "Putaran dijeda" : "Berputar otomatis"}
          </span>
          <button
            type="button"
            className="carousel-button carousel-play-button"
            aria-label={paused ? "Lanjutkan putaran" : "Jeda putaran"}
            aria-pressed={paused}
            onClick={() => setPaused((value) => !value)}
          >
            {paused ? "▶" : "Ⅱ"}
          </button>
        </div>
      )}
    </div>
  );
}
