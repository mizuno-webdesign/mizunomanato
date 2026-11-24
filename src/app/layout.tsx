import type { Metadata } from "next";
import Script from "next/script";
import { cormorant, notoSansJP, shipporiMincho, inter, plex } from "@/lib/fonts";
import "./globals.css";

const GA_ID = "G-377SE17230";

export const metadata: Metadata = {
  title: "Manato Mizuno — EC構築・運用パートナー",
  description:
    "ECサイト運営の課題を紐解き、前進させるパートナー。EC構築・改善・運用支援まで。状況に合わせて、無理のない一手を提案します。",
  metadataBase: new URL("https://mizunomanato.com"),
  openGraph: {
    title: "Manato Mizuno — EC構築・運用パートナー",
    description:
      "ECサイト運営の課題を紐解き、前進させるパートナー。",
    url: "https://mizunomanato.com",
    siteName: "Manato Mizuno",
    locale: "ja_JP",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Manato Mizuno — EC構築・運用パートナー",
    description: "ECサイト運営の課題を紐解き、前進させるパートナー。",
  },
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
    <html
      lang="ja"
      className={`${plex.variable} ${cormorant.variable} ${notoSansJP.variable} ${shipporiMincho.variable} ${inter.variable}`}
    >
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
      {/* 旧ページ（作り直し前）の旧書体変数（--font-display 等）は、旧コンポーネントが
          個別に参照している。全ページの作り直し後に旧書体の読み込みごと削除する。 */}
      <body>
        {children}
      </body>
    </html>
  );
}
