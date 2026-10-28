import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
  variable: "--font-inter",
});

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
    <html lang="en" data-theme="dark" className={inter.variable}>
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
