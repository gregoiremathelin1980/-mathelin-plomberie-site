/**
 * SEO images : nom de fichier et balise alt pour les photos chantiers.
 * Format recommandé pour l'export GéoCompta / stockage : [type]-mathelin-plomberie-[ville].jpg
 */

const SLUG_BRAND = "mathelin-plomberie";

function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

/**
 * Génère le nom de fichier recommandé pour une photo chantier.
 * Ex. "Dépannage fuite", "Ambérieu" → "depannage-fuite-mathelin-plomberie-amberieu.jpg"
 */
export function getSeoImageFilename(typeTravaux: string, ville: string, ext = "jpg"): string {
  const typeSlug = slugify(typeTravaux || "chantier");
  const villeSlug = slugify(ville || "ain");
  return `${typeSlug}-${SLUG_BRAND}-${villeSlug}.${ext}`;
}

/**
 * Génère une balise alt SEO pour une image réalisation.
 * Ex. "Dépannage fuite à Ambérieu - Mathelin Plomberie"
 */
export function getSeoImageAlt(title: string, city?: string): string {
  const base = title?.trim() || "Réalisation plomberie";
  if (city?.trim()) {
    return `${base} à ${city.trim()} - Mathelin Plomberie`;
  }
  return `${base} - Mathelin Plomberie`;
}
