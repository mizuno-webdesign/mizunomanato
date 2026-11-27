import type { Metadata, Viewport } from "next";
import Script from "next/script";
import { plex, outfit } from "@/lib/fonts";
import "./globals.css";
import ClickTracker from "@/components/ClickTracker";
import InlineScript from "@/components/InlineScript";
import { THEME_COLORS, THEME_INIT_SCRIPT } from "@/lib/theme";
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

// スマホのブラウザ上部の色は、ページ上端の地の色に合わせる。明るい表示と暗い表示の両方に対応する。
// 切り替えボタンで端末の設定と違う表示を選んだときは、ThemeToggle が色を書き換える。
export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: THEME_COLORS.light },
    { media: "(prefers-color-scheme: dark)", color: THEME_COLORS.dark },
  ],
  colorScheme: "light dark",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    // data-scroll-behavior：画面を移るときは、なめらかスクロールを一時的に切る（Next 16 の指定）
    // data-theme は下のスクリプトが描画の前に付けるため、サーバーの出力との違いは警告しない
    <html lang="ja" data-scroll-behavior="smooth" className={`${plex.variable} ${outfit.variable}`} suppressHydrationWarning>
      <head>
        <InlineScript html={THEME_INIT_SCRIPT} />
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
        <ClickTracker />
      </body>
    </html>
  );
}
