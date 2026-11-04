import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Appie - Digital Healthcare Platform",
  description:
    "Routine health concerns assessed and managed with symptom assessment, verified medical consultation, and medication delivery.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  minimumScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" data-theme="dark">
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                const saved = localStorage.getItem('appie_theme') || 'dark';
                document.documentElement.setAttribute('data-theme', saved);
              } catch (e) {}
            `,
          }}
        />
      </head>
      <body>
        <div className="app-container">
          <div className="bg-ambient-glow" />
          {children}
        </div>
      </body>
    </html>
  );
}
