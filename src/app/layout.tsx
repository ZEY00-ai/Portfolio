import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
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
  } catch {
    document.documentElement.dataset.theme = "dark";
  }
})();
`;

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="id" suppressHydrationWarning className={`${GeistSans.variable} ${GeistMono.variable}`}>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body>
        <WelcomeIntro />
        {children}
      </body>
    </html>
  );
}