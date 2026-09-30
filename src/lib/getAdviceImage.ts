/**
 * Alt SEO des images de conseils : catégorie déduite du slug.
 * Les photos elles-mêmes viennent de public/images/conseils/{slug}/cover.webp
 * (voir conseilsMerged.ts) — politique « zéro stock ».
 */

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
