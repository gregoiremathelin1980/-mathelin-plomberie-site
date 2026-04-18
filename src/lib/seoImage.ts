/**
 * SEO images : nom de fichier et balise alt pour les photos chantiers.
 * Format recommandé pour l'export GéoCompta / stockage : [type]-mathelin-plomberie-[ville].jpg
 */

const SLUG_BRAND = "mathelin-plomberie";

const ACCENTS: Record<string, string> = {
  à: "a", â: "a", ä: "a", é: "e", è: "e", ê: "e", ë: "e", î: "i", ï: "i", ô: "o", ù: "u", û: "u", ü: "u", ÿ: "y", ç: "c",
};
function slugify(text: string): string {
  let s = text.toLowerCase();
  for (const [accent, plain] of Object.entries(ACCENTS)) {
    s = s.replace(new RegExp(accent, "g"), plain);
  }
  return s.replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
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
  const c = city?.trim();
  if (c) {
    const lower = base.toLowerCase();
    const cityLower = c.toLowerCase();
    if (lower.includes(cityLower) || lower.includes(`à ${cityLower}`)) {
      return `${base} - Mathelin Plomberie`;
    }
    return `${base} à ${c} - Mathelin Plomberie`;
  }
  return `${base} - Mathelin Plomberie`;
}
