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

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <style dangerouslySetInnerHTML={{ __html: getFontFacesCSS() }} />
      </head>
      <body>{children}</body>
    </html>
  );
}
