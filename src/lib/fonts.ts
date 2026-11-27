import { Outfit } from "next/font/google";

// 和文の書体は、まとめたフォント（siteSans.ts）と、分割フォント（fontsPlex.ts）。

// 英字の見出し・ナビ・TOP の名前に使う書体（社長決定 2026-11-24：Outfit。ナビと名前は 2026-11-26）。--font-heading で読む。
export const outfit = Outfit({
  variable: "--font-heading",
  subsets: ["latin"],
  weight: ["500", "600"],
  display: "swap",
});
