import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import { LanguageProvider } from "@/components/LanguageProvider";
import WelcomeIntro from "@/components/WelcomeIntro";
import { site } from "@/lib/site";
import "./globals.css";

export const metadata: Metadata = {
  title: `${site.name}, ${site.role}`,
  description: site.headline,
};

const themeScript = `
(function () {
  try {
    document.documentElement.dataset.theme = localStorage.getItem("theme") || "dark";
    const language = localStorage.getItem("language") === "en" ? "en" : "id";
    document.documentElement.dataset.language = language;
    document.documentElement.lang = language;
  } catch {
    document.documentElement.dataset.theme = "dark";
    document.documentElement.dataset.language = "id";
    document.documentElement.lang = "id";
  }
})();
`;

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="id" data-language="id" suppressHydrationWarning className={`${GeistSans.variable} ${GeistMono.variable}`}>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body>
        <LanguageProvider>
          <WelcomeIntro />
          {children}
        </LanguageProvider>
      </body>
    </html>
  );
}