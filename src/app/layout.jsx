import { withBasePath } from "@/lib/basePath";
import { getFontFacesCSS } from "@/lib/fontFaces";
import "./globals.css";

export const metadata = {
  title: "M Bilal - Web Developer",
  description: "Portfolio of Muhammad Bilal — Web Developer based in Pakistan",
  icons: {
    icon: withBasePath("/Logo.png"),
  },
};

const themeScript = `
(function () {
  try {
    var stored = localStorage.getItem("theme");
    var theme =
      stored ||
      (window.matchMedia("(prefers-color-scheme: light)").matches
        ? "light"
        : "dark");
    document.documentElement.setAttribute("data-theme", theme);
  } catch (e) {}
})();
`;

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
        <style dangerouslySetInnerHTML={{ __html: getFontFacesCSS() }} />
      </head>
      <body>{children}</body>
    </html>
  );
}
