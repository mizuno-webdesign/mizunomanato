import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // `next dev` が AGENTS.md を自動で書き換えるのを止める（docs: 01-app/02-guides/ai-agents.md）。
  // 社長承認（2026-11-24）。AGENTS.md は手で管理する。
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
  async redirects() {
    return [
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
