export const SITE_PHONE = "04 74 00 00 00";
export const SITE_PHONE_RAW = "0474000000";
export const MAIN_SITE_URL = "https://www.mathelin-plomberie.fr";
export const SITE_URL = process.env.SITE_URL || MAIN_SITE_URL;
/** Landings satellites — URL canonique (évite cannibalisation avec /plombier-* sur le domaine principal). */
export const SATELLITE_MEXIMIEUX_URL = "https://www.plombier-meximieux.fr";
export const SATELLITE_AMBERIEU_URL = "https://www.plombier-amberieu.fr";

const SATELLITE_HOST_MAP: Record<string, string> = {
  "www.plombier-amberieu.fr": "https://www.plombier-amberieu.fr",
  "plombier-amberieu.fr": "https://www.plombier-amberieu.fr",
  "www.plombier-meximieux.fr": "https://www.plombier-meximieux.fr",
  "plombier-meximieux.fr": "https://www.plombier-meximieux.fr",
};

/** Détecte l'URL du site à partir du header Host (pour robots/sitemap dynamiques). */
export function getSiteUrlFromHost(host: string | null): { url: string; isSatellite: boolean } {
  if (host) {
    const sat = SATELLITE_HOST_MAP[host];
    if (sat) return { url: sat, isSatellite: true };
  }
  return { url: MAIN_SITE_URL, isSatellite: false };
}

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

/**
 * Hôtes autorisés pour `<Image src={url absolu} />` — doit rester aligné avec `next.config.js` (`remotePatterns`).
 * Si l’URL est hors liste, utiliser `<img>` pour éviter un 500 au rendu (hostname not configured).
 */
export function isNextImageRemoteHostAllowed(absoluteUrl: string): boolean {
  try {
    const u = new URL(absoluteUrl);
    if (u.protocol !== "https:" && u.protocol !== "http:") return false;
    const geocomptaHosts = (process.env.GEOCOMPTA_IMAGE_HOSTS ?? "")
      .split(",")
      .map((h) => h.trim())
      .filter(Boolean);
    const allowed = new Set<string>([
      "photos.mathelin-plomberie.fr",
      "images.unsplash.com",
      ...geocomptaHosts,
    ]);
    return allowed.has(u.hostname);
  } catch {
    return false;
  }
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
