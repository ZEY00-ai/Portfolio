"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useSyncExternalStore,
  type ReactNode,
} from "react";

export type Language = "id" | "en";

type LanguageContextValue = {
  language: Language;
  setLanguage: (language: Language) => void;
};

const LanguageContext = createContext<LanguageContextValue | null>(null);

function subscribe(onChange: () => void) {
  const observer = new MutationObserver(onChange);
  observer.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ["data-language"],
  });
  return () => observer.disconnect();
}

function getSnapshot(): Language {
  return document.documentElement.dataset.language === "en" ? "en" : "id";
}

function getServerSnapshot(): Language {
  return "id";
}

export function LanguageProvider({ children }: { children: ReactNode }) {
  const language = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  const setLanguage = useCallback((nextLanguage: Language) => {
    document.documentElement.dataset.language = nextLanguage;
    document.documentElement.lang = nextLanguage;
    try {
      localStorage.setItem("language", nextLanguage);
    } catch (error) {
      console.error("Could not save the selected language.", error);
    }
  }, []);

  const value = useMemo(
    () => ({ language, setLanguage }),
    [language, setLanguage],
  );

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider.");
  }
  return context;
}

export function LocalizedText({
  id,
  en,
}: {
  id: string;
  en: string;
}) {
  const { language } = useLanguage();
  return language === "en" ? en : id;
}
