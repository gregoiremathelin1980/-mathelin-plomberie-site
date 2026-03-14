/**
 * Lecture des exports GéoCompta (site-data).
 * Aucune connexion directe à GéoCompta.
 * Contenu : depannage/*.md, realisations/*.md, conseils/*.md, recent-interventions.json,
 * local-activity.json, reviews.json, simulateur.json
 *
 * Alias : SITE_DATA_DIR pointe vers site-data (ou env SITE_DATA_DIR, ex. C:\Users\Grégoire\SiteMathelinData).
 */

import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { loadMarkdown, logMarkdownWarnings } from "@/lib/contentLoader";
import type { PricingJSON } from "@/lib/estimatePrice";

const SITE_DATA_DIR =
  process.env.SITE_DATA_DIR || path.join(process.cwd(), "site-data");

export interface DepannageFrontmatter {
  title: string;
  city?: string;
  problem?: string;
  /** Explication du problème (court) */
  excerpt?: string;
  draft?: boolean;
}

export interface DepannageItem {
  slug: string;
  title: string;
  city?: string;
  problem?: string;
  excerpt?: string;
  /** Corps : explication du problème */
  content?: string;
  /** Section "intervention typique" (peut être dans le corps ou champ dédié) */
  intervention?: string;
  /** Slugs de réalisations liées */
  realisations?: string[];
}

function getSlugFromFilename(filename: string): string {
  return filename.replace(/\.md$/, "");
}

/** Liste des slugs des pages dépannage */
export function getDepannageSlugs(): string[] {
  const dir = path.join(SITE_DATA_DIR, "depannage");
  if (!fs.existsSync(dir)) return [];
  return fs
    .readdirSync(dir)
    .filter((f) => f.endsWith(".md"))
    .map((f) => getSlugFromFilename(f));
}

function parseMarkdownSiteData(raw: string, fileHint: string): { data: Record<string, unknown>; content: string } {
  const result = loadMarkdown(raw, { fileHint });
  logMarkdownWarnings(result.warnings, fileHint);
  return { data: result.data as Record<string, unknown>, content: result.content };
}

/** Une page dépannage par slug */
export function getDepannageBySlug(slug: string): DepannageItem | null {
  const filePath = path.join(SITE_DATA_DIR, "depannage", `${slug}.md`);
  if (!fs.existsSync(filePath)) return null;
  const raw = fs.readFileSync(filePath, "utf-8");
  const { data, content } = parseMarkdownSiteData(raw, path.relative(process.cwd(), filePath));
  const front = data as unknown as DepannageFrontmatter & { intervention?: string; realisations?: string[] };
  if (front.draft === true) return null;
  const parts = content.trim().split(/\n---+\n/);
  const mainContent = parts[0]?.trim() ?? "";
  const interventionSection = parts[1]?.trim();
  return {
    slug,
    title: front.title ?? slug,
    city: front.city,
    problem: front.problem,
    excerpt: front.excerpt ?? mainContent.slice(0, 200),
    content: mainContent,
    intervention: front.intervention ?? interventionSection,
    realisations: front.realisations,
  };
}

export interface RecentInterventionEntry {
  city: string;
  label: string;
  /** Optionnel : slug réalisation (lien vers /realisations/[slug]) */
  slug?: string;
  /** Optionnel : date au format YYYY-MM ou YYYY-MM-DD pour affichage "Mars 2026" */
  date?: string;
}

/** Interventions récentes (preuve locale) depuis site-data/recent-interventions.json */
export function getRecentInterventions(): RecentInterventionEntry[] {
  const filePath = path.join(SITE_DATA_DIR, "recent-interventions.json");
  try {
    if (!fs.existsSync(filePath)) return [];
    const raw = fs.readFileSync(filePath, "utf-8");
    const data = JSON.parse(raw) as { interventions?: RecentInterventionEntry[] } | RecentInterventionEntry[];
    if (Array.isArray(data)) return data;
    if (data.interventions && Array.isArray(data.interventions)) return data.interventions;
    return [];
  } catch {
    return [];
  }
}

/** Réalisations depuis site-data/realisations/*.md (export GéoCompta). Même structure que content. */
export interface SiteDataRealisationFrontmatter {
  title: string;
  city?: string;
  service?: string;
  date?: string;
  /** Image principale (Geocompta : URL ou chemin relatif vers le NAS). */
  image?: string;
  images?: string[];
  draft?: boolean;
  /** Conseils plomberie liés (slugs) */
  conseils?: string[];
}

export interface SiteDataRealisationItem {
  slug: string;
  title: string;
  city?: string;
  service?: string;
  date?: string;
  images?: string[];
  draft?: boolean;
  description?: string;
  content?: string;
  conseils?: string[];
}

function parseRealisationsFromDir(dir: string): SiteDataRealisationItem[] {
  if (!fs.existsSync(dir)) return [];
  const files = fs.readdirSync(dir).filter((f) => f.endsWith(".md"));
  const items: SiteDataRealisationItem[] = [];
  for (const file of files) {
    const slug = getSlugFromFilename(file);
    const fullPath = path.join(dir, file);
    const raw = fs.readFileSync(fullPath, "utf-8");
    const { data, content } = parseMarkdownSiteData(raw, path.relative(process.cwd(), fullPath));
    const front = data as unknown as SiteDataRealisationFrontmatter;
    if (front.draft === true) continue;
    const images = front.image
      ? [front.image, ...(front.images ?? [])]
      : front.images;
    items.push({
      slug,
      title: front.title ?? slug,
      city: front.city,
      service: front.service,
      date: front.date,
      images,
      conseils: front.conseils,
      description: content.trim().slice(0, 200),
      content: content.trim(),
    });
  }
  items.sort((a, b) => String(b.date ?? "").localeCompare(String(a.date ?? "")));
  return items;
}

export function getRealisationsFromSiteData(): SiteDataRealisationItem[] {
  return parseRealisationsFromDir(path.join(SITE_DATA_DIR, "realisations"));
}

export function getRealisationBySlugFromSiteData(slug: string): SiteDataRealisationItem | null {
  const filePath = path.join(SITE_DATA_DIR, "realisations", `${slug}.md`);
  if (!fs.existsSync(filePath)) return null;
  const raw = fs.readFileSync(filePath, "utf-8");
  const { data, content } = parseMarkdownSiteData(raw, path.relative(process.cwd(), filePath));
  const front = data as unknown as SiteDataRealisationFrontmatter;
  if (front.draft === true) return null;
  const images = front.image
    ? [front.image, ...(front.images ?? [])]
    : front.images;
  return {
    slug,
    title: front.title ?? slug,
    city: front.city,
    service: front.service,
    date: front.date,
    images,
    conseils: front.conseils,
    description: content.trim().slice(0, 200),
    content: content.trim(),
  };
}

// ——— local-activity.json ———
export interface LocalActivityEntry {
  city: string;
  count: number;
  /** Optionnel : période affichée (ex. "ces derniers mois") */
  period?: string;
}

export function getLocalActivity(): LocalActivityEntry[] {
  const filePath = path.join(SITE_DATA_DIR, "local-activity.json");
  try {
    if (!fs.existsSync(filePath)) return [];
    const raw = fs.readFileSync(filePath, "utf-8");
    const data = JSON.parse(raw) as { activities?: LocalActivityEntry[] } | LocalActivityEntry[];
    if (Array.isArray(data)) return data;
    if (data.activities && Array.isArray(data.activities)) return data.activities;
    return [];
  } catch {
    return [];
  }
}

// ——— conseils (site-data/conseils/*.md) ———
export interface SiteDataConseilFrontmatter {
  title: string;
  category?: string;
  city?: string;
  date?: string;
  excerpt?: string;
  draft?: boolean;
}

export interface SiteDataConseilItem {
  slug: string;
  title: string;
  category?: string;
  city?: string;
  date?: string;
  excerpt?: string;
  content?: string;
}

function parseConseilsFromDir(dir: string): SiteDataConseilItem[] {
  let files: string[];
  try {
    files = fs.readdirSync(dir || "").filter((f) => f.endsWith(".md"));
  } catch {
    return [];
  }
  const items: SiteDataConseilItem[] = [];
  for (const file of files) {
    const slug = getSlugFromFilename(file);
    const fullPath = path.join(dir, file);
    const raw = fs.readFileSync(fullPath, "utf-8");
    const { data, content } = parseMarkdownSiteData(raw, path.relative(process.cwd(), fullPath));
    const front = data as unknown as SiteDataConseilFrontmatter;
    if (front.draft === true) continue;
    items.push({
      slug,
      title: front.title ?? slug,
      category: front.category,
      city: front.city,
      date: front.date,
      excerpt: front.excerpt ?? content.trim().slice(0, 160),
      content: content.trim(),
    });
  }
  items.sort((a, b) => String(b.date ?? "").localeCompare(String(a.date ?? "")));
  return items;
}

export function getConseilsFromSiteData(): SiteDataConseilItem[] {
  return parseConseilsFromDir(path.join(SITE_DATA_DIR, "conseils"));
}

export function getConseilBySlugFromSiteData(slug: string): SiteDataConseilItem | null {
  const filePath = path.join(SITE_DATA_DIR, "conseils", `${slug}.md`);
  if (!fs.existsSync(filePath)) return null;
  const raw = fs.readFileSync(filePath, "utf-8");
  const { data, content } = parseMarkdownSiteData(raw, path.relative(process.cwd(), filePath));
  const front = data as unknown as SiteDataConseilFrontmatter;
  if (front.draft === true) return null;
  return {
    slug,
    title: front.title ?? slug,
    category: front.category,
    city: front.city,
    date: front.date,
    excerpt: front.excerpt ?? content.trim().slice(0, 160),
    content: content.trim(),
  };
}

// ——— reviews (google-reviews.json ou reviews.json) ———
export interface ReviewEntry {
  author?: string;
  rating: number;
  text: string;
  date?: string;
}

function parseReviews(raw: string): ReviewEntry[] {
  const data = JSON.parse(raw) as
    | { reviews?: (ReviewEntry & { name?: string })[] }
    | (ReviewEntry & { name?: string })[];
  const arr = Array.isArray(data) ? data : data.reviews ?? [];
  return arr.map((r) => ({
    author: r.author ?? r.name,
    rating: r.rating,
    text: r.text,
    date: r.date,
  }));
}

export function getReviews(): ReviewEntry[] {
  const files = ["google-reviews.json", "reviews.json"];
  for (const file of files) {
    const filePath = path.join(SITE_DATA_DIR, file);
    try {
      if (!fs.existsSync(filePath)) continue;
      const raw = fs.readFileSync(filePath, "utf-8");
      return parseReviews(raw);
    } catch {
      continue;
    }
  }
  return [];
}

/** Mélange et retourne N avis aléatoires (pour affichage à chaque chargement). */
export function getRandomReviews(count: number): ReviewEntry[] {
  const all = getReviews();
  const shuffled = [...all].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}

// ——— simulateur.json (sélecteur de problème dynamique) ———
export interface SimulateurStepOption {
  value: string;
  label: string;
}

export interface SimulateurStep2ByType {
  [type: string]: SimulateurStepOption[];
}

export interface SimulateurJSON {
  step1?: SimulateurStepOption[];
  step2?: SimulateurStep2ByType;
  step3?: SimulateurStepOption[];
}

export function getSimulateur(): SimulateurJSON | null {
  const filePath = path.join(SITE_DATA_DIR, "simulateur.json");
  try {
    if (!fs.existsSync(filePath)) return null;
    const raw = fs.readFileSync(filePath, "utf-8");
    return JSON.parse(raw) as SimulateurJSON;
  } catch {
    return null;
  }
}

/** Pricing pour l’estimateur : site-data/pricing.json (export GéoCompta). */
export function getPricingFromSiteData(): PricingJSON | null {
  const filePath = path.join(SITE_DATA_DIR, "pricing.json");
  try {
    if (!fs.existsSync(filePath)) return null;
    const raw = fs.readFileSync(filePath, "utf-8");
    return JSON.parse(raw) as PricingJSON;
  } catch {
    return null;
  }
}

export interface SiteDataSettings {
  entreprise?: string;
  /** Nom prénom du contact (affiché au-dessus du header) */
  nom_contact?: string;
  telephone?: string;
  email?: string;
  zone?: string;
  messageUrgence?: string;
  /** Afficher les images sur les cartes conseils (page /conseils) */
  showAdviceImages?: boolean;
  /** Afficher les photos chantiers (réalisations) sur le site */
  showChantierPhotos?: boolean;
}

export function getSiteDataSettings(): SiteDataSettings | null {
  const filePath = path.join(SITE_DATA_DIR, "site-settings.json");
  try {
    if (!fs.existsSync(filePath)) return null;
    const raw = fs.readFileSync(filePath, "utf-8");
    return JSON.parse(raw) as SiteDataSettings;
  } catch {
    return null;
  }
}

export function writeSiteDataSettings(settings: SiteDataSettings): void {
  const filePath = path.join(SITE_DATA_DIR, "site-settings.json");
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, JSON.stringify(settings, null, 2), "utf-8");
}
