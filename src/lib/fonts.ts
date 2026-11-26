import { IBM_Plex_Sans_JP, Outfit } from "next/font/google";

// サイトの書体（社長決定 2026-11-24）。和文・欧文ともこの1書体。
export const plex = IBM_Plex_Sans_JP({
  variable: "--font-plex",
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  display: "swap",
  // 先読みしない：日本語の書体は100個以上のファイルに分割されていて、先読みを有効にすると
  // ページで使わない分まで一斉に読み込み、画像の表示が遅くなる（段階5-5の計測で196個の先読みを確認）。
  // 先読みなしでも、使う文字の分は自動で読み込まれる。
  preload: false,
});

// 英字の見出し・ナビ・TOP の名前に使う書体（社長決定 2026-11-24：Outfit。ナビと名前は 2026-11-26）。--font-heading で読む。
export const outfit = Outfit({
  variable: "--font-heading",
  subsets: ["latin"],
  weight: ["500", "600"],
  display: "swap",
});
