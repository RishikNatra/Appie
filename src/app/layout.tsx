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
                var theme = localStorage.getItem('appie_theme') || 'dark';
                document.documentElement.setAttribute('data-theme', theme);

                if (localStorage.getItem('appie_accent_glow') === 'false') {
                  document.documentElement.classList.add('glow-disabled');
                }
                if (localStorage.getItem('appie_high_contrast') === 'true') {
                  document.documentElement.classList.add('high-contrast');
                }
                if (localStorage.getItem('appie_dyslexia_mode') === 'true') {
                  document.documentElement.classList.add('dyslexia-mode');
                }
                if (localStorage.getItem('appie_reduced_motion') === 'true' || localStorage.getItem('appie_smooth_animations') === 'false') {
                  document.documentElement.classList.add('reduced-motion');
                }
                var font = localStorage.getItem('appie_font_scaling');
                if (font === 'large') {
                  document.documentElement.style.fontSize = '17.5px';
                } else if (font === 'x-large') {
                  document.documentElement.style.fontSize = '19px';
                }
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
