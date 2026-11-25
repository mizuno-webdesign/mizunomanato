import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";

// 管理画面と送信APIは、クロールの対象にしない。
export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/", disallow: ["/studio", "/api/"] },
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
