"use client";

import { usePathname } from "next/navigation";
import { useSyncExternalStore } from "react";

function subscribeToReadiness(attribute: string, callback: () => void) {
  const observer = new MutationObserver(callback);
  observer.observe(document.body, {
    attributes: true,
    childList: true,
    subtree: true,
    attributeFilter: [attribute],
  });
  return () => observer.disconnect();
}

function isAssetReady(attribute: string) {
  return Boolean(document.querySelector(`[${attribute}="true"]`));
}

function subscribeToGalleryPreload(callback: () => void) {
  return subscribeToReadiness("data-gallery-preload-ready", callback);
}

function isGalleryPreloaded() {
  return isAssetReady("data-gallery-preload-ready");
}

function subscribeToPortfolioAssets(callback: () => void) {
  return subscribeToReadiness("data-portfolio-assets-ready", callback);
}

function arePortfolioAssetsReady() {
  return isAssetReady("data-portfolio-assets-ready");
}

export default function WelcomeIntro() {
  const pathname = usePathname();
  const isGallery = pathname === "/gallery";

  return <WelcomeScreen key={pathname} isGallery={isGallery} />;
}

function WelcomeScreen({ isGallery }: { isGallery: boolean }) {
  const assetsReady = useSyncExternalStore(
    isGallery ? subscribeToGalleryPreload : subscribeToPortfolioAssets,
    isGallery ? isGalleryPreloaded : arePortfolioAssetsReady,
    () => false,
  );

  return (
    <div
      className="welcome-screen"
      data-assets-loading={!assetsReady ? "true" : undefined}
      aria-hidden="true"
    >
      <div className="welcome-frame">
        <div className="welcome-topline">
          <span className="welcome-monogram">DA</span>
          <span>{isGallery ? "PHOTO GALLERY" : "PORTFOLIO WEBSITE"}</span>
        </div>

        <div className="welcome-message">
          <p className="welcome-kicker">
            {isGallery ? "CERITA DALAM SETIAP FOTO" : "HALO, SELAMAT DATANG"}
          </p>
          <p className="welcome-title">
            Welcome to my
            <span>{isGallery ? "Gallery." : "Portfolio Website."}</span>
          </p>
          <div className="welcome-progress" />
          <p className="welcome-byline">
            {isGallery ? "SMA" : "Daffa Abrar"} <span>·</span>{" "}
            {isGallery ? "KULIAH · PRIBADI" : "Web Developer"}
          </p>
        </div>

        <div className="welcome-bottomline">
          <span>
            {isGallery ? (
              <>MOMEN <i>·</i> CERITA <i>·</i> KENANGAN</>
            ) : (
              <>DESIGN <i>·</i> CODE <i>·</i> LEARN</>
            )}
          </span>
          <span>{isGallery ? "GALERI FOTO" : "SELAMAT MENJELAJAH"}</span>
        </div>
      </div>
      <span className="welcome-orbit" />
    </div>
  );
}
