import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { loadMarkdown, logMarkdownWarnings } from "@/lib/contentLoader";
import type { PricingJSON } from "@/lib/estimatePrice";
import {
  getConseilsFromSiteData,
  getConseilBySlugFromSiteData,
  getPricingFromSiteData,
  getSiteDataSettings,
} from "@/lib/site-data";

const CONTENT_DIR = path.join(process.cwd(), "content");
const DATA_DIR = path.join(process.cwd(), "data");

/** Réglages d'affichage des sections (fusionné depuis site-data, avec valeurs par défaut). */
export interface DisplaySettings {
  showReviews: boolean;
  showAdvice: boolean;
  showAdviceImages: boolean;
  showEstimator: boolean;
  showRecentInterventions: boolean;
}

const defaultDisplaySettings: DisplaySettings = {
  showReviews: true,
  showAdvice: true,
  showAdviceImages: true,
  showEstimator: true,
  showRecentInterventions: true,
};

export interface SiteSettings {
  company: string;
  /** Nom du contact / artisan affiché au-dessus du header */
  owner_name?: string;
  phone: string;
  email: string;
  address: string;
  service_radius: string;
  homepage_message?: string;
  business_hours?: string;
  /** Afficher les images sur les cartes conseils */
  show_advice_images?: boolean;
  /** Afficher les photos chantiers (réalisations) hébergées sur le NAS */
  show_chantier_photos?: boolean;
  /** Affichage des sections (avis, conseils, images conseils, estimateur, interventions récentes) */
  displaySettings: DisplaySettings;
  cities: string[];
}

export interface RealisationFrontmatter {
  title: string;
  city?: string;
  service?: string;
  date?: string;
  /** Image principale (Geocompta peut envoyer une URL ou un chemin relatif). */
  image?: string;
  images?: string[];
  draft?: boolean;
}

export interface RealisationItem {
  slug: string;
  title: string;
  city?: string;
  service?: string;
  date?: string;
  images?: string[];
  draft?: boolean;
  description?: string;
  content?: string;
}

export interface BlogFrontmatter {
  title: string;
  city?: string;
  date?: string;
  excerpt?: string;
  draft?: boolean;
}

export interface BlogItem {
  slug: string;
  title: string;
  city?: string;
  date?: string;
  excerpt?: string;
  draft?: boolean;
  content?: string;
}

export interface ConseilsFrontmatter {
  title: string;
  category?: string;
  city?: string;
  date?: string;
  excerpt?: string;
  draft?: boolean;
}

export interface ConseilsItem {
  slug: string;
  title: string;
  category?: string;
  city?: string;
  date?: string;
  excerpt?: string;
  draft?: boolean;
  content?: string;
}

function readSiteSettingsPath(): string {
  return path.join(CONTENT_DIR, "settings", "site.json");
}

let siteSettingsCache: SiteSettings | null = null;

const defaultSiteSettings: SiteSettings = {
  company: "Mathelin Plomberie Chauffage",
  phone: "04 74 00 00 00",
  email: "contact@mathelin-plomberie-chauffage.fr",
  address: "57 impasse des Verchères, 01800 Pérouges, France",
  service_radius: "15 km",
  business_hours: undefined,
  show_advice_images: true,
  show_chantier_photos: true,
  displaySettings: defaultDisplaySettings,
  cities: [
    "Pérouges",
    "Meximieux",
    "Ambérieu-en-Bugey",
    "Saint-Vulbas",
    "Lagnieu",
    "Villieu-Loyes-Mollon",
    "Blyes",
    "Leyment",
  ],
};

export function getSiteSettings(): SiteSettings {
  if (siteSettingsCache) return siteSettingsCache;
  let base: SiteSettings;
  const filePath = readSiteSettingsPath();
  try {
    const raw = fs.readFileSync(filePath, "utf-8");
    base = JSON.parse(raw) as SiteSettings;
  } catch {
    base = defaultSiteSettings;
  }
  const fromSiteData = getSiteDataSettings();
  if (fromSiteData) {
    const ds = fromSiteData.displaySettings;
    const displaySettings: DisplaySettings = {
      showReviews: ds?.showReviews ?? defaultDisplaySettings.showReviews,
      showAdvice: ds?.showAdvice ?? defaultDisplaySettings.showAdvice,
      showAdviceImages: ds?.showAdviceImages ?? defaultDisplaySettings.showAdviceImages,
      showEstimator: ds?.showEstimator ?? defaultDisplaySettings.showEstimator,
      showRecentInterventions: ds?.showRecentInterventions ?? defaultDisplaySettings.showRecentInterventions,
    };
    base = {
      ...base,
      company: fromSiteData.entreprise ?? base.company,
      owner_name: fromSiteData.nom_contact ?? base.owner_name,
      phone: fromSiteData.telephone ?? base.phone,
      email: fromSiteData.email ?? base.email,
      service_radius: fromSiteData.zone ?? base.service_radius,
      homepage_message: fromSiteData.messageUrgence ?? base.homepage_message,
      show_advice_images: displaySettings.showAdviceImages ?? fromSiteData.showAdviceImages ?? base.show_advice_images,
      show_chantier_photos: fromSiteData.showChantierPhotos ?? base.show_chantier_photos,
      displaySettings,
    };
  } else {
    base = { ...base, displaySettings: defaultDisplaySettings };
  }
  if (!base.displaySettings) {
    base = { ...base, displaySettings: defaultDisplaySettings };
  }
  siteSettingsCache = base;
  return siteSettingsCache;
}

export function clearSiteSettingsCache(): void {
  siteSettingsCache = null;
}

export function writeSiteSettings(settings: SiteSettings): void {
  const filePath = readSiteSettingsPath();
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, JSON.stringify(settings, null, 2), "utf-8");
  siteSettingsCache = settings;
}

function getSlugFromFilename(filename: string): string {
  return filename.replace(/\.md$/, "");
}

function parseMarkdownWithValidation(raw: string, fileHint: string): { data: Record<string, unknown>; content: string } {
  const result = loadMarkdown(raw, { fileHint });
  logMarkdownWarnings(result.warnings, fileHint);
  return { data: result.data as Record<string, unknown>, content: result.content };
}

function parseRealisations(dir: string, includeDrafts: boolean): RealisationItem[] {
  if (!fs.existsSync(dir)) return [];
  const files = fs.readdirSync(dir).filter((f) => f.endsWith(".md"));
  const items: RealisationItem[] = [];
  for (const file of files) {
    const slug = getSlugFromFilename(file);
    const fullPath = path.join(dir, file);
    const raw = fs.readFileSync(fullPath, "utf-8");
    const { data, content } = parseMarkdownWithValidation(raw, path.relative(process.cwd(), fullPath));
    const front = data as unknown as RealisationFrontmatter;
    const isDraft = front.draft === true;
    if (isDraft && !includeDrafts) continue;
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
      draft: isDraft,
      description: content.trim().slice(0, 200),
      content: content.trim(),
    });
  }
  items.sort((a, b) => String(b.date ?? "").localeCompare(String(a.date ?? "")));
  return items;
}

export function getRealisations(): RealisationItem[] {
  return parseRealisations(path.join(CONTENT_DIR, "realisations"), false);
}

export function getAllRealisations(): RealisationItem[] {
  return parseRealisations(path.join(CONTENT_DIR, "realisations"), true);
}

export function getRealisationBySlug(slug: string): RealisationItem | null {
  const filePath = path.join(CONTENT_DIR, "realisations", `${slug}.md`);
  if (!fs.existsSync(filePath)) return null;
  const raw = fs.readFileSync(filePath, "utf-8");
  const { data, content } = parseMarkdownWithValidation(raw, path.relative(process.cwd(), filePath));
  const front = data as unknown as RealisationFrontmatter;
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
    description: content.trim().slice(0, 200),
    content: content.trim(),
  };
}

function parseBlogPosts(dir: string, includeDrafts: boolean): BlogItem[] {
  if (!fs.existsSync(dir)) return [];
  const files = fs.readdirSync(dir).filter((f) => f.endsWith(".md"));
  const items: BlogItem[] = [];
  for (const file of files) {
    const slug = getSlugFromFilename(file);
    const fullPath = path.join(dir, file);
    const raw = fs.readFileSync(fullPath, "utf-8");
    const { data, content } = parseMarkdownWithValidation(raw, path.relative(process.cwd(), fullPath));
    const front = data as unknown as BlogFrontmatter;
    const isDraft = front.draft === true;
    if (isDraft && !includeDrafts) continue;
    items.push({
      slug,
      title: front.title ?? slug,
      city: front.city,
      date: front.date,
      excerpt: front.excerpt ?? content.trim().slice(0, 160),
      draft: isDraft,
      content: content.trim(),
    });
  }
  items.sort((a, b) => String(b.date ?? "").localeCompare(String(a.date ?? "")));
  return items;
}

export function getBlogPosts(): BlogItem[] {
  return parseBlogPosts(path.join(CONTENT_DIR, "blog"), false);
}

export function getAllBlogPosts(): BlogItem[] {
  return parseBlogPosts(path.join(CONTENT_DIR, "blog"), true);
}

export function getBlogPostBySlug(slug: string): BlogItem | null {
  const filePath = path.join(CONTENT_DIR, "blog", `${slug}.md`);
  if (!fs.existsSync(filePath)) return null;
  const raw = fs.readFileSync(filePath, "utf-8");
  const { data, content } = parseMarkdownWithValidation(raw, path.relative(process.cwd(), filePath));
  const front = data as unknown as BlogFrontmatter;
  if (front.draft === true) return null;
  return {
    slug,
    title: front.title ?? slug,
    city: front.city,
    date: front.date,
    excerpt: front.excerpt ?? content.trim().slice(0, 160),
    content: content.trim(),
  };
}

function parseConseils(dir: string, includeDrafts: boolean): ConseilsItem[] {
  let files: string[];
  try {
    files = fs.readdirSync(dir || "").filter((f) => f.endsWith(".md"));
  } catch {
    return [];
  }
  const items: ConseilsItem[] = [];
  for (const file of files) {
    const slug = getSlugFromFilename(file);
    const fullPath = path.join(dir, file);
    const raw = fs.readFileSync(fullPath, "utf-8");
    const { data, content } = parseMarkdownWithValidation(raw, path.relative(process.cwd(), fullPath));
    const front = data as unknown as ConseilsFrontmatter;
    const isDraft = front.draft === true;
    if (isDraft && !includeDrafts) continue;
    items.push({
      slug,
      title: front.title ?? slug,
      category: front.category,
      city: front.city,
      date: front.date,
      excerpt: front.excerpt ?? content.trim().slice(0, 160),
      draft: isDraft,
      content: content.trim(),
    });
  }
  items.sort((a, b) => String(b.date ?? "").localeCompare(String(a.date ?? "")));
  return items;
}

/** Conseils : fusion site-data (prioritaire) + content/conseils. */
export function getConseils(): ConseilsItem[] {
  const fromSiteData = getConseilsFromSiteData();
  const fromContent = parseConseils(path.join(CONTENT_DIR, "conseils"), false);
  const bySlug = new Map<string, ConseilsItem>();
  for (const c of fromContent) bySlug.set(c.slug, c);
  for (const c of fromSiteData) {
    bySlug.set(c.slug, {
      slug: c.slug,
      title: c.title,
      category: c.category,
      city: c.city,
      date: c.date,
      excerpt: c.excerpt,
      draft: false,
      content: c.content,
    });
  }
  return Array.from(bySlug.values()).sort((a, b) =>
    String(b.date ?? "").localeCompare(String(a.date ?? ""))
  );
}

export function getAllConseils(): ConseilsItem[] {
  return parseConseils(path.join(CONTENT_DIR, "conseils"), true);
}

/** Conseil par slug : site-data en priorité, sinon content. */
export function getConseilBySlug(slug: string): ConseilsItem | null {
  const fromSiteData = getConseilBySlugFromSiteData(slug);
  if (fromSiteData)
    return {
      slug: fromSiteData.slug,
      title: fromSiteData.title,
      category: fromSiteData.category,
      city: fromSiteData.city,
      date: fromSiteData.date,
      excerpt: fromSiteData.excerpt,
      draft: false,
      content: fromSiteData.content,
    };
  const filePath = path.join(CONTENT_DIR, "conseils", `${slug}.md`);
  if (!fs.existsSync(filePath)) return null;
  const raw = fs.readFileSync(filePath, "utf-8");
  const { data, content } = parseMarkdownWithValidation(raw, path.relative(process.cwd(), filePath));
  const front = data as unknown as ConseilsFrontmatter;
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

/** Returns N random conseils (different each time for variety). */
export function getRandomConseils(count: number): ConseilsItem[] {
  const all = getConseils();
  const shuffled = [...all].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}

/** Price ranges: read from content/prix/prix.json (fallback to empty object). */
export interface PrixEntry {
  min: number;
  max: number;
  label?: string;
}

export function getPrix(): Record<string, PrixEntry> {
  const filePath = path.join(CONTENT_DIR, "prix", "prix.json");
  try {
    if (!fs.existsSync(filePath)) return {};
    const raw = fs.readFileSync(filePath, "utf-8");
    return JSON.parse(raw) as Record<string, PrixEntry>;
  } catch {
    return {};
  }
}

/** Pricing pour estimation : site-data/pricing.json en priorité, sinon data/pricing.json. Aucun accès direct à Géocompta. */
export function getPricing(): PricingJSON | null {
  const fromSiteData = getPricingFromSiteData();
  if (fromSiteData) return fromSiteData;
  const filePath = path.join(DATA_DIR, "pricing.json");
  try {
    if (!fs.existsSync(filePath)) return null;
    const raw = fs.readFileSync(filePath, "utf-8");
    return JSON.parse(raw) as PricingJSON;
  } catch {
    return null;
  }
}

/** Cities: from content/villes/villes.json if present, else from site settings. */
export function getVilles(): string[] {
  const filePath = path.join(CONTENT_DIR, "villes", "villes.json");
  try {
    if (fs.existsSync(filePath)) {
      const raw = fs.readFileSync(filePath, "utf-8");
      const data = JSON.parse(raw) as { cities?: string[] };
      if (Array.isArray(data.cities) && data.cities.length) return data.cities;
    }
  } catch {
    // fallback
  }
  return getSiteSettings().cities;
}

/** Service page content: problems, intervention, faq. From content/services/{slug}.json */
export interface ServiceContent {
  slug: string;
  title: string;
  description: string;
  problems: string[];
  intervention: string;
  priceKeys?: string[];
  conseilCategories?: string[];
  faq: { question: string; answer: string }[];
}

export function getServiceContent(slug: string): ServiceContent | null {
  const filePath = path.join(CONTENT_DIR, "services", `${slug}.json`);
  try {
    if (!fs.existsSync(filePath)) return null;
    const raw = fs.readFileSync(filePath, "utf-8");
    return JSON.parse(raw) as ServiceContent;
  } catch {
    return null;
  }
}

export type ContentType = "realisation" | "blog" | "conseil";

export function updateContentDraft(
  type: ContentType,
  slug: string,
  draft: boolean
): boolean {
  const dirs: Record<ContentType, string> = {
    realisation: "realisations",
    blog: "blog",
    conseil: "conseils",
  };
  const dir = path.join(CONTENT_DIR, dirs[type]);
  const filePath = path.join(dir, `${slug}.md`);
  if (!fs.existsSync(filePath)) return false;
  const raw = fs.readFileSync(filePath, "utf-8");
  const parsed = matter(raw);
  (parsed.data as { draft?: boolean }).draft = draft;
  const newRaw = matter.stringify(parsed.content, parsed.data);
  fs.writeFileSync(filePath, newRaw, "utf-8");
  return true;
}
