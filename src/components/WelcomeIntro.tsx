"use client";

import { usePathname } from "next/navigation";
import { useSyncExternalStore } from "react";
import { LocalizedText, useLanguage } from "@/components/LanguageProvider";

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
  const { language } = useLanguage();
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
            {isGallery
              ? language === "id" ? "CERITA DALAM SETIAP FOTO" : "A STORY IN EVERY PHOTO"
              : language === "id" ? "HALO, SELAMAT DATANG" : "HELLO, WELCOME"}
          </p>
          <p className="welcome-title">
            {language === "id" ? "Selamat datang di" : "Welcome to my"}
            <span>{isGallery ? "Gallery." : language === "id" ? "Website Portfolio." : "Portfolio Website."}</span>
          </p>
          <div className="welcome-progress" />
          <p className="welcome-byline">
            {isGallery ? "SMA" : "Daffa Abrar"} <span>·</span>{" "}
            {isGallery ? language === "id" ? "KULIAH · PRIBADI" : "SCHOOL · PERSONAL" : "Web Developer"}
          </p>
        </div>

        <div className="welcome-bottomline">
          <span>
            {isGallery ? (
              language === "id"
                ? <>MOMEN <i>·</i> CERITA <i>·</i> KENANGAN</>
                : <>MOMENTS <i>·</i> STORIES <i>·</i> MEMORIES</>
            ) : (
              <>DESIGN <i>·</i> CODE <i>·</i> LEARN</>
            )}
          </span>
          <span>{isGallery
            ? <LocalizedText id="GALERI FOTO" en="PHOTO GALLERY" />
            : <LocalizedText id="SELAMAT MENJELAJAH" en="HAPPY EXPLORING" />}</span>
        </div>
      </div>
      <span className="welcome-orbit" />
    </div>
  );
}
