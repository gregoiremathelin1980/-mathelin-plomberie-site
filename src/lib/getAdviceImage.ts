/**
 * Advice image: single source /public/images/conseils.
 * 1. Detect category from article slug (priority: chauffe-eau, radiateur, chauffage, evier, robinet, canalisation, plomberie)
 * 2. Choisir une image dans le dossier (déterministe par slug, width >= 600px)
 * 3. Fallback: /images/conseils/plomberie (never placeholder)
 */

import fs from "node:fs";
import path from "node:path";
import imageSize from "image-size";

const CONSEILS_BASE = path.join(process.cwd(), "public", "images", "conseils");
const IMAGE_EXTENSIONS = new Set([".jpg", ".jpeg", ".png", ".webp", ".gif"]);
const MIN_IMAGE_WIDTH = 600;
const DEFAULT_PLOMBERIE_PATH = "/images/conseils/plomberie/plomberie.jpg";

export const ADVICE_IMAGE_CATEGORIES = [
  "radiateur",
  "chauffe-eau",
  "chauffage",
  "evier",
  "robinet",
  "canalisation",
  "plomberie",
  "toilette-suspendue",
  "douche",
  "chaudiere",
  "climatisation",
  "plancher-chauffant",
] as const;

export type AdviceImageCategory = (typeof ADVICE_IMAGE_CATEGORIES)[number];

function isAdviceCategory(cat: string): cat is AdviceImageCategory {
  return (ADVICE_IMAGE_CATEGORIES as readonly string[]).includes(cat);
}

/** Indice stable à partir d’une chaîne (même résultat serveur / client — pas d’hydratation cassée). */
function pickIndex(length: number, seed: string): number {
  if (length <= 0) return 0;
  let h = 0;
  for (let i = 0; i < seed.length; i++) {
    h = (Math.imul(31, h) + seed.charCodeAt(i)) | 0;
  }
  return Math.abs(h) % length;
}

const U = (id: string) => `https://images.unsplash.com/photo-${id}?w=800&q=80`;
/** Fallback Unsplash par catégorie quand aucun fichier local. */
const ADVICE_IMAGE_UNSPLASH: Record<AdviceImageCategory, string> = {
  radiateur: U("1584568691250-31d8d0b053e9"),
  "chauffe-eau": U("1600585154340-ef313acf8d54"),
  chauffage: U("1584568691250-31d8d0b053e9"),
  evier: U("1558618666-fcd25c85cd64"),
  robinet: U("1584622650111-993a426fbf0a"),
  canalisation: U("1600607687939-ce8a6c25118c"),
  plomberie: U("1600573472592-401b489a3cdc"),
  "toilette-suspendue": U("1558618666-fcd25c85cd64"),
  douche: U("1600585154340-ef313acf8d54"),
  chaudiere: U("1584568691250-31d8d0b053e9"),
  climatisation: U("1600573472592-401b489a3cdc"),
  "plancher-chauffant": U("1584568691250-31d8d0b053e9"),
};
const ADVICE_IMAGE_UNSPLASH_FALLBACK = U("1600566753086-00f18fb6b3ea");

/**
 * Detect category from article slug.
 * Priority: chauffe-eau → radiateur → chauffage → evier → robinet → canalisation → … → plomberie.
 * Examples: desembouage/equilibrage/panne-chauffage → chauffage; radiateur-bruit → radiateur; evier-bouche → evier.
 */
export function getAdviceImageCategory(slug: string): AdviceImageCategory {
  const s = slug.toLowerCase();

  if (
    s.includes("chauffe-eau") ||
    s.includes("ballon") ||
    s.includes("eau-chaude") ||
    s.includes("pas-eau-chaude") ||
    s.includes("detartrage") ||
    s.includes("vidange") ||
    s.includes("resistance") ||
    s.includes("groupe-securite")
  )
    return "chauffe-eau";
  if (s.includes("radiateur") || s.includes("purge"))
    return "radiateur";
  if (s.includes("desembouage") || s.includes("equilibrage") || s.includes("panne-chauffage"))
    return "chauffage";
  if (s.includes("evier") || s.includes("eviter-evier") || s.includes("evacuation-lente"))
    return "evier";
  if (s.includes("robinet") || s.includes("robinetterie") || s.includes("mousseur") || s.includes("fuite-robinet"))
    return "robinet";
  if (
    s.includes("canalisation") ||
    s.includes("tuyau") ||
    s.includes("tuyaux") ||
    (s.includes("pression") && s.includes("eau")) ||
    s.includes("claquent") ||
    s.includes("coup-de-belier") ||
    s.includes("debouchage") ||
    s.includes("evacuation") ||
    s.includes("bouche")
  )
    return "canalisation";
  if (s.includes("toilette")) return "toilette-suspendue";
  if (s.includes("douche")) return "douche";
  if (s.includes("chaudiere")) return "chaudiere";
  if (s.includes("climatisation")) return "climatisation";
  if (s.includes("plancher-chauffant")) return "plancher-chauffant";

  return "plomberie";
}

function getImageWidth(filePath: string): number | null {
  try {
    const buffer = fs.readFileSync(filePath || "");
    const result = imageSize(new Uint8Array(buffer));
    return result?.width ?? null;
  } catch {
    return null;
  }
}

/** Lists image URLs in dir; only includes images with width >= MIN_IMAGE_WIDTH. */
function listImagesInDir(dir: string, urlPrefix: string): string[] {
  try {
    const names = fs.readdirSync(dir || "");
    const valid: string[] = [];
    for (const n of names) {
      if (!IMAGE_EXTENSIONS.has(path.extname(n).toLowerCase())) continue;
      const fullPath = path.join(dir, n);
      const w = getImageWidth(fullPath);
      if (w != null && w >= MIN_IMAGE_WIDTH) valid.push(`${urlPrefix}/${n}`);
    }
    return valid;
  } catch {
    return [];
  }
}

/**
 * Returns one image URL for an advice article.
 * 1. Category from slug → images in /images/conseils/{category}, choix stable par slug.
 * 2. If category has no images → fallback /images/conseils/plomberie.
 * Never returns placeholder; ensure plomberie has at least one image.
 */
export function getAdviceImage(slug: string): string {
  const category = getAdviceImageCategory(slug);
  if (!isAdviceCategory(category)) return getAdviceImageFromCategory("plomberie", slug);

  const dir = path.join(CONSEILS_BASE, category);
  const list = listImagesInDir(dir, `/images/conseils/${category}`);
  if (list.length > 0) return list[pickIndex(list.length, slug)];

  const fallback = getAdviceImageFromCategory("plomberie", slug);
  if (fallback === DEFAULT_PLOMBERIE_PATH) {
    return ADVICE_IMAGE_UNSPLASH[category] ?? ADVICE_IMAGE_UNSPLASH_FALLBACK;
  }
  return fallback;
}

/** Fallback par catégorie ; choix déterministe selon le slug. */
function getAdviceImageFromCategory(category: AdviceImageCategory, slug: string): string {
  const dir = path.join(CONSEILS_BASE, category);
  const list = listImagesInDir(dir, `/images/conseils/${category}`);
  if (list.length > 0) return list[pickIndex(list.length, `${slug}:${category}`)];

  const plomberieDir = path.join(CONSEILS_BASE, "plomberie");
  const plomberie = listImagesInDir(plomberieDir, "/images/conseils/plomberie");
  if (plomberie.length > 0) return plomberie[pickIndex(plomberie.length, `${slug}:plomberie`)];

  for (const cat of ADVICE_IMAGE_CATEGORIES) {
    if (cat === category) continue;
    const d = path.join(CONSEILS_BASE, cat);
    const L = listImagesInDir(d, `/images/conseils/${cat}`);
    if (L.length > 0) return L[pickIndex(L.length, `${slug}:${cat}`)];
  }

  return DEFAULT_PLOMBERIE_PATH;
}

/** Alt text for SEO from category and optional title. */
export function getAdviceImageAlt(slug: string, title?: string): string {
  const category = getAdviceImageCategory(slug);
  const labels: Record<AdviceImageCategory, string> = {
    radiateur: "Radiateur de chauffage central",
    "chauffe-eau": "Chauffe-eau et eau chaude sanitaire",
    chauffage: "Chauffage central et désembouage",
    evier: "Évier et débouchage",
    robinet: "Robinetterie et fuites",
    canalisation: "Canalisation et tuyauterie",
    plomberie: "Plomberie et dépannage",
    "toilette-suspendue": "Toilette suspendue",
    douche: "Douche et équipements",
    chaudiere: "Chaudière",
    climatisation: "Climatisation",
    "plancher-chauffant": "Plancher chauffant",
  };
  const base = labels[category] ?? "Plomberie et dépannage";
  return title ? `${base} — ${title}` : base;
}
