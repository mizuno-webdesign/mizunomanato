import { IBM_Plex_Sans_JP } from "next/font/google";

// 分割された IBM Plex Sans JP（まとめたフォント siteSans にない文字を受け持つ）。
// 定義の CSS が大きい（約250件）ので、ふだんは表示を止めないように、あとから読み込む（components/PlexFallback.tsx）。
// 本文に、まとめたフォントにない文字が多い詳細ページ（記事・事例）は、このファイルを直接読み込んで、
// 最初の表示の前にそろえる（文字が一瞬、別の書体にならないように）。
// 書体の指定は globals.css の --font-sans で、書体の名前を直接書いている。
export const plex = IBM_Plex_Sans_JP({
  variable: "--font-plex",
  subsets: ["latin"],
  weight: ["400", "700"],
  display: "swap",
  // 先読みしない：日本語の書体は100個以上のファイルに分割されていて、先読みを有効にすると
  // ページで使わない分まで一斉に読み込み、画像の表示が遅くなる（段階5-5の計測で196個の先読みを確認）。
  // 先読みなしでも、使う文字の分は自動で読み込まれる。
  preload: false,
});
