import type { NextConfig } from "next";

const nextConfig: NextConfig = {
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
