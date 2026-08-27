import { Cormorant_Garamond, Noto_Sans_JP, Shippori_Mincho, Inter } from "next/font/google";

export const cormorant = Cormorant_Garamond({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["400", "500"],
  style: ["normal", "italic"],
  display: "swap",
});

export const notoSansJP = Noto_Sans_JP({
  variable: "--font-body",
  subsets: ["latin"],
  weight: ["400", "700"],
  display: "swap",
});

// 記事本文の見出し用。Cormorant Garamond（欧文専用）は和文グリフを持たないため、
// 和文と半角数字が混在する見出しに使うと、和文がブラウザ標準フォールバックの
// ゴシック体になってしまい字面がちぐはぐになる。Shippori Minchoは和文・欧文とも
// 対応した明朝体で、Cormorantに近い細身で上品なトーンを保ちつつ字面を揃えられる。
export const shipporiMincho = Shippori_Mincho({
  variable: "--font-display-jp",
  subsets: ["latin"],
  weight: ["400", "600"],
  display: "swap",
});

export const inter = Inter({
  variable: "--font-ui",
  subsets: ["latin"],
  weight: ["400", "500"],
  display: "swap",
});
