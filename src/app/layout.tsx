import type { Metadata } from "next";
import { Cormorant_Garamond, Noto_Sans_JP } from "next/font/google";
import "./globals.css";

const cormorant = Cormorant_Garamond({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["400", "500"],
  style: ["normal", "italic"],
  display: "swap",
});

const notoSansJP = Noto_Sans_JP({
  variable: "--font-body",
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  display: "swap",
});

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
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="ja"
      className={`${cormorant.variable} ${notoSansJP.variable}`}
    >
      <body
        style={{
          fontFamily: "var(--font-body), 'Hiragino Kaku Gothic ProN', sans-serif",
        }}
      >
        {children}
      </body>
    </html>
  );
}
