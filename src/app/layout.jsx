import "./globals.css";

export const metadata = {
  title: "M Bilal - Web Developer",
  description: "Portfolio of Muhammad Bilal — Web Developer based in Pakistan",
  icons: {
    icon: "/Logo.png",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
