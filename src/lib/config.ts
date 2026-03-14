export const SITE_PHONE = "04 74 00 00 00";
export const SITE_PHONE_RAW = "0474000000";
export const SITE_URL = "https://mathelin-plomberie.fr";

/** Base URL des photos chantiers (NAS). Les images sont servies par cette URL, pas stockées localement. */
export const PHOTO_BASE_URL =
  (typeof process !== "undefined" && process.env.PHOTO_BASE_URL) ||
  "https://photos.mathelin-plomberie.fr";

/**
 * Retourne l'URL complète d'une image (Geocompta peut envoyer un chemin relatif ou une URL).
 * Si pathOrUrl est déjà une URL (http), la retourne telle quelle.
 */
export function getPhotoUrl(pathOrUrl: string | undefined): string | undefined {
  if (!pathOrUrl?.trim()) return undefined;
  const s = pathOrUrl.trim();
  if (s.startsWith("http://") || s.startsWith("https://")) return s;
  const base = PHOTO_BASE_URL.replace(/\/$/, "");
  return s.startsWith("/") ? base + s : base + "/" + s;
}

/** Adresse de l'entreprise */
export const SITE_ADDRESS = {
  street: "57 impasse des Verchères",
  city: "Pérouges",
  postalCode: "01800",
  country: "France",
};
export const SITE_ADDRESS_LINE =
  `${SITE_ADDRESS.street}, ${SITE_ADDRESS.postalCode} ${SITE_ADDRESS.city}, ${SITE_ADDRESS.country}`;

/** Communes dans le rayon d'intervention (15 km autour de Pérouges) */
export const CITIES_15KM = [
  "Pérouges",
  "Meximieux",
  "Ambérieu-en-Bugey",
  "Saint-Vulbas",
  "Lagnieu",
  "Villieu-Loyes-Mollon",
  "Blyes",
  "Leyment",
  "Bourg-Saint-Christophe",
] as const;

/** Villes proposées dans le formulaire de devis */
export const DEVIS_CITIES = [
  "Pérouges",
  "Meximieux",
  "Ambérieu-en-Bugey",
  "Saint-Vulbas",
  "Lagnieu",
  "Autre commune",
] as const;
