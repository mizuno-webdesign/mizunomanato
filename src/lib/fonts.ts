import { IBM_Plex_Sans_JP, Outfit } from "next/font/google";

// サイトの書体（社長決定 2026-11-24）。和文・欧文ともこの1書体。
export const plex = IBM_Plex_Sans_JP({
  variable: "--font-plex",
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  display: "swap",
});

// カード見出しの英字だけに使う書体（社長決定 2026-11-24：Outfit）。FlipHeading の英語面が --font-heading を読む。
export const outfit = Outfit({
  variable: "--font-heading",
  subsets: ["latin"],
  weight: ["600"],
  display: "swap",
});
