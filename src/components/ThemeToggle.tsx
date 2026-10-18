"use client";

import { useSyncExternalStore } from "react";

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

  function toggle() {
    const next: Theme = theme === "dark" ? "light" : "dark";
    document.documentElement.dataset.theme = next;
    try {
      localStorage.setItem("theme", next);
    } catch {}
  }

  return (
    <button
      type="button"
      className="theme-btn"
      onClick={toggle}
      aria-label="Ganti tema terang atau gelap"
      suppressHydrationWarning
    >
      {theme === "dark" ? "Terang" : "Gelap"}
    </button>
  );
}