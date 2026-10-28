"use client";

import { useEffect, useState } from "react";

type ImageAssetPreloaderProps = {
  sources: string[];
  readyAttribute:
    | "data-gallery-preload-ready"
    | "data-portfolio-assets-ready";
};

export default function ImageAssetPreloader({
  sources,
  readyAttribute,
}: ImageAssetPreloaderProps) {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let cancelled = false;
    let timedOut = false;
    const uniqueSources = Array.from(new Set(sources.filter(Boolean)));
    const timeoutId = window.setTimeout(() => {
      timedOut = true;
      if (!cancelled) setReady(true);
    }, 30_000);

    async function preload() {
      let nextIndex = 0;
      const workers = Array.from(
        { length: Math.min(4, uniqueSources.length) },
        async () => {
          while (!timedOut && nextIndex < uniqueSources.length) {
            const source = uniqueSources[nextIndex];
            nextIndex += 1;

            await new Promise<void>((resolve) => {
              const image = new window.Image();
              let settled = false;

              function finish() {
                if (settled) return;
                settled = true;
                resolve();
              }

              image.addEventListener("error", finish, { once: true });
              image.addEventListener(
                "load",
                () => {
                  void image.decode().catch(() => undefined).finally(finish);
                },
                { once: true },
              );
              image.src = source;

              if (image.complete) {
                if (image.naturalWidth > 0) {
                  void image.decode().catch(() => undefined).finally(finish);
                } else {
                  finish();
                }
              }
            });
          }
        },
      );
      await Promise.all(workers);

      if (!cancelled) {
        window.clearTimeout(timeoutId);
        setReady(true);
      }
    }

    void preload();
    return () => {
      cancelled = true;
      window.clearTimeout(timeoutId);
    };
  }, [sources]);

  return (
    <span
      hidden
      aria-hidden="true"
      {...{ [readyAttribute]: ready ? "true" : "false" }}
    />
  );
}
