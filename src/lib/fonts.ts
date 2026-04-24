import { Cormorant_Garamond, Noto_Sans_JP, Inter } from "next/font/google";

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

export const inter = Inter({
  variable: "--font-ui",
  subsets: ["latin"],
  weight: ["400", "500"],
  display: "swap",
});
