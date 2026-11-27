import type { NextConfig } from "next";

// 安全用の応答ヘッダー。
const COMMON_HEADERS = [
  // ファイルの種類を、ブラウザが中身から推測して変えないようにする
  { key: "X-Content-Type-Options", value: "nosniff" },
  // ほかのサイトへ移るとき、開いていたページの詳しいアドレスは渡さない（ドメインまで）
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  // このサイトで使わない機能は、使えないようにする
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
];

const nextConfig: NextConfig = {
  // 使っている仕組みの名前を、応答に付けない
  poweredByHeader: false,
  // `next dev` が AGENTS.md を自動で書き換えるのを止める（docs: 01-app/02-guides/ai-agents.md）。
  // 社長承認（2026-11-24）。AGENTS.md は手で管理する。
  // 16.4 からは、false だと目印（BEGIN/END:nextjs-agent-rules）で囲んだ部分が削除されるので、AGENTS.md に目印を書かない。
  agentRules: false,
  // 同じWi-Fiのスマホ実機から開発サーバーを開くため、PCのLAN IPを許可する（開発時のみ有効。本番には影響しない）。
  // IPが変わったら（ルーターの再割り当て等）ここを書き換える。docs: 01-app/03-api-reference/05-config/01-next-config-js/allowedDevOrigins.md
  allowedDevOrigins: ["192.168.1.2"],
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.sanity.io",
      },
    ],
  },
  async headers() {
    return [
      { source: "/:path*", headers: COMMON_HEADERS },
      // ほかのサイトの中に埋め込めないようにする（見えない形で重ねて、操作させるのを防ぐ）
      {
        source: "/((?!studio).*)",
        headers: [
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
          { key: "Content-Security-Policy", value: "frame-ancestors 'self'" },
        ],
      },
      // 管理画面は、Sanity の画面の中に表示される使い方があるので、Sanity だけは許可する
      {
        source: "/studio/:path*",
        headers: [{ key: "Content-Security-Policy", value: "frame-ancestors 'self' https://sanity.io https://*.sanity.io" }],
      },
    ];
  },
  async redirects() {
    return [
      // 旧「最近の対応」ページは外し、事例一覧へ一時転送する（社長判断 2026-11-25。Sanity のデータは残す）。
      // 復活させる可能性があるので、恒久転送（permanent: true）にはしない。
      {
        source: "/activity",
        destination: "/works",
        permanent: false,
      },
      {
        source: "/works-post/lipico",
        destination: "/works/lipico",
        permanent: true,
      },
      {
        source: "/works-post/cocorome",
        destination: "/works/cocorome",
        permanent: true,
      },
      {
        source: "/works-post/localguidestars",
        destination: "/works/local-guide-stars",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
