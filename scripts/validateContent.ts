/**
 * Validation du contenu au build : frontmatter, slugs, doublons, structure site-data.
 * Log des warnings ; échoue (exit 1) uniquement en cas d'erreur critique (ex. markdown illisible).
 * Usage : npm run validate  ou  tsx scripts/validateContent.ts
 */

import fs from "node:fs";
import path from "node:path";
import {
  checkSlugRegistry,
  logSlugRegistryWarnings,
  type SlugRegistryEntry,
} from "../src/lib/slugRegistry";
import {
  loadMarkdown,
  logMarkdownWarnings,
} from "../src/lib/contentLoader";
import {
  validateSiteData,
  logSiteDataValidationWarnings,
} from "../src/lib/siteDataValidator";
import { SERVICES } from "../src/lib/services-data";

const ROOT = process.cwd();
const CONTENT_DIR = path.join(ROOT, "content");
const SITE_DATA_DIR = process.env.SITE_DATA_DIR || path.join(ROOT, "site-data");

function walkMd(dir: string): { filePath: string; slug: string }[] {
  if (!fs.existsSync(dir)) return [];
  const files = fs.readdirSync(dir);
  return files
    .filter((f) => f.endsWith(".md"))
    .map((f) => ({ filePath: path.join(dir, f), slug: f.replace(/\.md$/, "") }));
}

function collectSlugEntries(): SlugRegistryEntry[] {
  const entries: SlugRegistryEntry[] = [];

  // content
  for (const { filePath, slug } of walkMd(path.join(CONTENT_DIR, "realisations"))) {
    entries.push({ slug, source: "content", type: "realisation", fileHint: path.basename(filePath) });
  }
  for (const { filePath, slug } of walkMd(path.join(CONTENT_DIR, "conseils"))) {
    entries.push({ slug, source: "content", type: "conseil", fileHint: path.basename(filePath) });
  }
  for (const { filePath, slug } of walkMd(path.join(CONTENT_DIR, "blog"))) {
    entries.push({ slug, source: "content", type: "blog", fileHint: path.basename(filePath) });
  }
  // site-data
  for (const { slug, filePath } of walkMd(path.join(SITE_DATA_DIR, "realisations"))) {
    entries.push({ slug, source: "site-data", type: "realisation", fileHint: path.basename(filePath) });
  }
  for (const { slug, filePath } of walkMd(path.join(SITE_DATA_DIR, "conseils"))) {
    entries.push({ slug, source: "site-data", type: "conseil", fileHint: path.basename(filePath) });
  }
  for (const { slug, filePath } of walkMd(path.join(SITE_DATA_DIR, "depannage"))) {
    entries.push({ slug, source: "site-data", type: "depannage", fileHint: path.basename(filePath) });
  }
  // services (slugs from SERVICES)
  for (const s of SERVICES) {
    entries.push({ slug: s.slug, source: "content", type: "service", fileHint: "services-data" });
  }

  return entries;
}

function validateAllMarkdown(): { critical: boolean; count: number } {
  let count = 0;
  const dirs: { dir: string; type: SlugRegistryEntry["type"]; source: "content" | "site-data" }[] = [
    { dir: path.join(CONTENT_DIR, "realisations"), type: "realisation", source: "content" },
    { dir: path.join(CONTENT_DIR, "conseils"), type: "conseil", source: "content" },
    { dir: path.join(CONTENT_DIR, "blog"), type: "blog", source: "content" },
    { dir: path.join(SITE_DATA_DIR, "realisations"), type: "realisation", source: "site-data" },
    { dir: path.join(SITE_DATA_DIR, "conseils"), type: "conseil", source: "site-data" },
    { dir: path.join(SITE_DATA_DIR, "depannage"), type: "depannage", source: "site-data" },
  ];
  for (const { dir, type, source } of dirs) {
    if (!fs.existsSync(dir)) continue;
    for (const { filePath } of walkMd(dir)) {
      count++;
      try {
        const raw = fs.readFileSync(filePath, "utf-8");
        const result = loadMarkdown(raw, { fileHint: path.relative(ROOT, filePath) });
        if (result.warnings.length) {
          logMarkdownWarnings(result.warnings, path.relative(ROOT, filePath));
        }
      } catch (e) {
        console.error(`[validateContent] ERREUR CRITIQUE ${filePath}:`, e);
        return { critical: true, count };
      }
    }
  }
  return { critical: false, count };
}

function main(): void {
  console.log("[validateContent] Vérification du contenu...\n");

  // 1) Slugs
  const entries = collectSlugEntries();
  const slugWarnings = checkSlugRegistry(entries);
  logSlugRegistryWarnings(slugWarnings);
  const hasSlugIssues =
    slugWarnings.duplicates.length > 0 || slugWarnings.invalid.length > 0;

  // 2) Markdown
  const mdResult = validateAllMarkdown();
  if (mdResult.critical) {
    console.error("\n[validateContent] Arrêt suite à une erreur critique.");
    process.exit(1);
  }

  // 3) Site-data JSON (parse raw to validate structure)
  let recentRaw: unknown = [];
  let pricingRaw: unknown = null;
  let simulateurRaw: unknown = null;
  try {
    const recentPath = path.join(SITE_DATA_DIR, "recent-interventions.json");
    if (fs.existsSync(recentPath)) {
      recentRaw = JSON.parse(fs.readFileSync(recentPath, "utf-8"));
      if (recentRaw && typeof recentRaw === "object" && !Array.isArray(recentRaw)) {
        recentRaw = (recentRaw as { interventions?: unknown }).interventions ?? [];
      }
    }
  } catch {
    recentRaw = [];
  }
  try {
    const pricingPath = path.join(SITE_DATA_DIR, "pricing.json");
    if (fs.existsSync(pricingPath)) {
      pricingRaw = JSON.parse(fs.readFileSync(pricingPath, "utf-8"));
    }
  } catch {
    pricingRaw = null;
  }
  try {
    const simPath = path.join(SITE_DATA_DIR, "simulateur.json");
    if (fs.existsSync(simPath)) {
      simulateurRaw = JSON.parse(fs.readFileSync(simPath, "utf-8"));
    }
  } catch {
    simulateurRaw = null;
  }
  const siteDataResult = validateSiteData({
    recentInterventions: recentRaw,
    pricing: pricingRaw,
    simulateur: simulateurRaw,
  });
  logSiteDataValidationWarnings(siteDataResult);

  // 4) Journal build SEO (Step 14)
  const staticCount = 9;
  const serviceCount = SERVICES.length;
  const realisationCount = entries.filter((e) => e.type === "realisation").length;
  const depannageCount = entries.filter((e) => e.type === "depannage").length;
  const conseilCount = entries.filter((e) => e.type === "conseil").length;
  const blogCount = entries.filter((e) => e.type === "blog").length;
  console.log("\n--- SEO Build Log ---");
  console.log(`Pages statiques: ${staticCount}`);
  console.log(`Services: ${serviceCount}`);
  console.log(`Réalisations: ${realisationCount}`);
  console.log(`Dépannage: ${depannageCount}`);
  console.log(`Conseils: ${conseilCount}`);
  console.log(`Blog: ${blogCount}`);
  console.log(`Total (approx.): ${staticCount + serviceCount + realisationCount + depannageCount + conseilCount + blogCount}`);
  if (hasSlugIssues) {
    console.log("Warnings SEO: doublons ou slugs invalides (voir ci-dessus).");
  }
  console.log("---------------------");

  process.exit(0);
}

main();
