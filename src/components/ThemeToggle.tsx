"use client";

import { useSyncExternalStore } from "react";
import { useLanguage } from "@/components/LanguageProvider";

type Theme = "light" | "dark";

// Tema aktif disimpan di atribut data-theme pada <html>
function subscribe(onChange: () => void) {
  const observer = new MutationObserver(onChange);
  observer.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ["data-theme"],
  });
  return () => observer.disconnect();
}

function getSnapshot(): Theme {
  return document.documentElement.dataset.theme === "dark" ? "dark" : "light";
}

function getServerSnapshot(): Theme {
  return "light";
}

export default function ThemeToggle() {
  const theme = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const { language } = useLanguage();

  function toggle() {
    const next: Theme = theme === "dark" ? "light" : "dark";
    document.documentElement.dataset.theme = next;
    try {
      localStorage.setItem("theme", next);
    } catch {}
  }

  return (
    <div
      className="theme-controls"
      role="group"
      aria-label={language === "id" ? "Pengaturan tampilan" : "Display settings"}
    >
      <button
        type="button"
        className="theme-btn"
        onClick={toggle}
        aria-label={language === "id"
          ? theme === "dark" ? "Ganti ke tema terang" : "Ganti ke tema gelap"
          : theme === "dark" ? "Switch to light theme" : "Switch to dark theme"}
        suppressHydrationWarning
      >
        <span aria-hidden="true">{theme === "dark" ? "☾" : "☀"}</span>
      </button>
    </div>
  );
}