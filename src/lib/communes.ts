import { getRealisations, type RealisationItem } from "@/lib/content";
import { getRealisationsFromSiteData } from "@/lib/site-data";

export interface Commune {
  slug: string;
  name: string;
  /** Code postal tel qu'affiché dans les zones desservies de la fiche Google (absent = non affiché). */
  postalCode?: string;
  /** Contenu propre à la commune, fourni par l'artisan (rien d'inventé). */
  local?: {
    delai: string;
    secteur: string;
    realisationSlug?: string;
    realisationTexte?: string;
  };
}

/**
 * Communes de la zone desservie de la fiche Google (hors Pérouges, Meximieux et Ambérieu-en-Bugey,
 * qui ont déjà leur page). Une page /plombier/[slug] par entrée.
 */
export const COMMUNES: Commune[] = [
  {
    slug: "amberieu-en-bugey",
    name: "Ambérieu-en-Bugey",
    postalCode: "01500",
    local: {
      delai:
        "Je pars de Pérouges : comptez une vingtaine de minutes pour arriver à Ambérieu-en-Bugey, sous réserve d'être disponible. Appelez-moi, je vous confirme le créneau au téléphone.",
      secteur: "Ambérieu-en-Bugey, Château-Gaillard et les communes voisines.",
      realisationSlug: "remplacement-wc-amberieu",
      realisationTexte:
        "Dernier chantier à Ambérieu-en-Bugey : remplacement d'un WC à poser chez un particulier, avec un pack WC Trinity sans bride et un abattant à frein de chute.",
    },
  },
  { slug: "balan", name: "Balan" },
  { slug: "dagneux", name: "Dagneux", postalCode: "01120" },
  { slug: "lagnieu", name: "Lagnieu", postalCode: "01150" },
  { slug: "leyment", name: "Leyment", postalCode: "01150" },
  { slug: "montluel", name: "Montluel", postalCode: "01120" },
  { slug: "charnoz-sur-ain", name: "Charnoz-sur-Ain" },
  { slug: "beligneux", name: "Béligneux", postalCode: "01360" },
  { slug: "bressolles", name: "Bressolles", postalCode: "01360" },
  { slug: "saint-vulbas", name: "Saint-Vulbas", postalCode: "01150" },
  { slug: "chazey-sur-ain", name: "Chazey-sur-Ain", postalCode: "01150" },
  { slug: "rignieux-le-franc", name: "Rignieux-le-Franc", postalCode: "01800" },
  { slug: "saint-denis-en-bugey", name: "Saint-Denis-en-Bugey", postalCode: "01500" },
  { slug: "villieu-loyes-mollon", name: "Villieu-Loyes-Mollon", postalCode: "01800" },
  { slug: "bourg-saint-christophe", name: "Bourg-Saint-Christophe", postalCode: "01800" },
  { slug: "saint-maurice-de-remens", name: "Saint-Maurice-de-Rémens", postalCode: "01500" },
  { slug: "saint-maurice-de-gourdans", name: "Saint-Maurice-de-Gourdans", postalCode: "01800" },
];

export function getCommuneBySlug(slug: string): Commune | undefined {
  return COMMUNES.find((c) => c.slug === slug);
}

function normalizeCity(s: string): string {
  return s
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[-'’]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

/** Réalisations (contenu + site-data, dédoublonnées par slug) dont le champ `city` correspond à l'une des communes. */
export function getRealisationsForCities(cities: string[]): RealisationItem[] {
  const wanted = new Set(cities.map(normalizeCity));
  const bySlug = new Map<string, RealisationItem>();
  for (const r of getRealisations()) bySlug.set(r.slug, r);
  for (const r of getRealisationsFromSiteData()) bySlug.set(r.slug, r as RealisationItem);
  return Array.from(bySlug.values()).filter((r) => r.city && wanted.has(normalizeCity(r.city)));
}
