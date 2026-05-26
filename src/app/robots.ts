import { MetadataRoute } from "next";
import { headers } from "next/headers";
import { getSiteUrlFromHost } from "@/lib/config";

export default async function robots(): Promise<MetadataRoute.Robots> {
  const h = await headers();
  const { url } = getSiteUrlFromHost(h.get("host"));

  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/admin", "/api/"],
    },
    sitemap: `${url}/sitemap.xml`,
  };
}
