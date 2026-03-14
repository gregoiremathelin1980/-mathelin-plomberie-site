/**
 * Génère sitemap.xml (blog, services, depannage, conseils, realisations).
 * Exclut le contenu brouillon.
 * Peut être exécuté en CI ou en complément du sitemap dynamique Next (src/app/sitemap.ts).
 * Usage : tsx scripts/generateSitemap.ts
 */

import fs from "node:fs";
import path from "node:path";
import { SITE_URL } from "../src/lib/config";
import { getRealisations, getBlogPosts, getConseils } from "../src/lib/content";
import { getDepannageSlugs } from "../src/lib/site-data";
import { SERVICES } from "../src/lib/services-data";

function escapeXml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function urlElement(url: string, lastmod?: Date, changefreq?: string, priority?: number): string {
  const lastmodStr = lastmod ? lastmod.toISOString().slice(0, 10) : new Date().toISOString().slice(0, 10);
  let out = `  <url>\n    <loc>${escapeXml(url)}</loc>\n    <lastmod>${lastmodStr}</lastmod>`;
  if (changefreq) out += `\n    <changefreq>${changefreq}</changefreq>`;
  if (priority !== undefined) out += `\n    <priority>${priority}</priority>`;
  out += `\n  </url>`;
  return out;
}

function main(): void {
  const [realisations, posts, conseils] = [
    getRealisations(),
    getBlogPosts(),
    getConseils(),
  ];
  const depannageSlugs = getDepannageSlugs();

  const staticUrls: { url: string; changefreq?: string; priority?: number }[] = [
    { url: SITE_URL, changefreq: "weekly", priority: 1 },
    { url: `${SITE_URL}/services`, changefreq: "monthly", priority: 0.9 },
    { url: `${SITE_URL}/devis`, changefreq: "monthly", priority: 0.9 },
    { url: `${SITE_URL}/depannage`, changefreq: "weekly", priority: 0.8 },
    { url: `${SITE_URL}/realisations`, changefreq: "weekly", priority: 0.8 },
    { url: `${SITE_URL}/blog`, changefreq: "weekly", priority: 0.8 },
    { url: `${SITE_URL}/conseils`, changefreq: "weekly", priority: 0.8 },
    { url: `${SITE_URL}/contact`, changefreq: "monthly", priority: 0.8 },
  ];

  const urls: string[] = [];
  for (const s of staticUrls) {
    urls.push(urlElement(s.url, new Date(), s.changefreq, s.priority));
  }
  for (const slug of depannageSlugs) {
    urls.push(urlElement(`${SITE_URL}/depannage/${slug}`, new Date(), "weekly", 0.6));
  }
  for (const s of SERVICES) {
    urls.push(urlElement(`${SITE_URL}/services/${s.slug}`, new Date(), "monthly", 0.7));
  }
  for (const r of realisations.filter((x) => x.slug)) {
    urls.push(urlElement(`${SITE_URL}/realisations/${r.slug}`, new Date(), "monthly", 0.6));
  }
  for (const p of posts.filter((x) => x.slug)) {
    urls.push(urlElement(`${SITE_URL}/blog/${p.slug}`, new Date(), "weekly", 0.6));
  }
  for (const c of conseils.filter((x) => x.slug)) {
    urls.push(urlElement(`${SITE_URL}/conseils/${c.slug}`, new Date(), "weekly", 0.6));
  }

  const xml =
    '<?xml version="1.0" encoding="UTF-8"?>\n' +
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' +
    urls.join("\n") +
    "\n</urlset>";

  const outPath = path.join(process.cwd(), "public", "sitemap.xml");
  fs.mkdirSync(path.dirname(outPath), { recursive: true });
  fs.writeFileSync(outPath, xml, "utf-8");
  console.log(`[generateSitemap] Écrit ${outPath} (${urls.length} URLs).`);
}

main();
