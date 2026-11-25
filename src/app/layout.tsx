import type { Metadata } from "next";
import Script from "next/script";
import { plex, outfit } from "@/lib/fonts";
import "./globals.css";
import { SITE_DESCRIPTION, SITE_TITLE, SITE_URL, pageMetadata } from "@/lib/site";

const GA_ID = "G-377SE17230";

export const metadata: Metadata = {
  ...pageMetadata({ path: "/", title: SITE_TITLE, description: SITE_DESCRIPTION }),
  // canonical は各ページで指定する（ここに置くと、指定のないページが TOP 扱いになるため）
  alternates: undefined,
  metadataBase: new URL(SITE_URL),
  verification: {
    google: "u6UKhn9XOMoMHEZIoU3GJ3fflf7q5NiMu1QkTYScd-k",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja" className={`${plex.variable} ${outfit.variable}`}>
      <head>
        <Script
          src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
          strategy="afterInteractive"
        />
        <Script id="ga-init" strategy="afterInteractive">{`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${GA_ID}');
        `}</Script>
      </head>
      <body>
        {children}
      </body>
    </html>
  );
}
