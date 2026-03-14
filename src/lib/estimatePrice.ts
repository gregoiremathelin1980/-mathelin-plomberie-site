/**
 * Estimation de prix à partir de /data/pricing.json.
 * Le site ne lit que ce fichier (export depuis Géocompta à terme).
 * Aucun accès à Géocompta.
 */

export interface PricingJSON {
  base: Record<string, number>;
  gravite?: Record<string, number>;
  precision: Record<string, number>;
  urgence: Record<string, number>;
  distance: Record<string, number>;
}

export interface EstimateParams {
  type_intervention: string;
  precision: string;
  situation: string;
  ville: string;
}

export interface EstimateResult {
  min: number;
  max: number;
  estimate: number;
}

/** Map form step1 value to pricing base key */
const BASE_KEYS: Record<string, string> = {
  canalisation: "debouchage",
  fuite: "fuite",
  "chauffe-eau": "chauffe_eau",
  radiateur: "radiateur",
  robinet: "robinetterie",
  autre: "autre",
};

/** Map form step2 value to pricing precision key */
const PRECISION_KEYS: Record<string, string> = {
  "pas-eau-chaude": "pas_eau_chaude",
  bruit: "bruit_anormal",
  fuite: "fuite_chauffe_eau",
  "chauffe-eau": "fuite_chauffe_eau", // fuite type, détail "Fuite chauffe-eau"
  entretien: "entretien",
  evier: "evier",
  toilette: "toilette",
  douche: "douche",
  robinet: "robinet",
  tuyau: "tuyau",
  radiateur: "radiateur",
  froid: "froid",
  purge: "purge",
  pression: "pression",
  remplacement: "remplacement",
  autre: "autre",
};

/** Map form step3 to pricing urgence key */
const URGENCE_KEYS: Record<string, string> = {
  diagnostic: "diagnostic",
  genant: "genant",
  urgence: "urgence",
};

/** Normalize city label to pricing distance key (no accents, lowercase, _) */
function cityToDistanceKey(ville: string): string {
  if (!ville || ville === "Autre commune") return "";
  const noAccent = ville
    .toLowerCase()
    .replace(/[àâä]/g, "a")
    .replace(/[éèêë]/g, "e")
    .replace(/[îï]/g, "i")
    .replace(/[ôö]/g, "o")
    .replace(/[ùûü]/g, "u")
    .replace(/ç/g, "c");
  return noAccent.replace(/\s+/g, "_").replace(/-/g, "_");
}

/**
 * Calcule une estimation à partir du fichier pricing et des réponses du formulaire.
 * Objectif commercial : fourchette basse attractive, prix haut = prix typique.
 * prix_typique = base + precision + urgence + distance
 * min = base + distance  (attractif)
 * max = prix_typique    (réaliste)
 */
export function estimatePrice(
  pricing: PricingJSON,
  params: EstimateParams
): EstimateResult {
  const baseKey = BASE_KEYS[params.type_intervention] ?? "autre";
  const base = pricing.base[baseKey] ?? pricing.base.autre ?? 110;

  const precisionKey = PRECISION_KEYS[params.precision] ?? params.precision ?? "";
  const precisionVal = precisionKey
    ? (pricing.precision[precisionKey] ?? 0)
    : 0;

  const urgenceKey = URGENCE_KEYS[params.situation] ?? "";
  const urgenceVal = urgenceKey
    ? (pricing.urgence[urgenceKey] ?? 0)
    : 0;

  const distanceKey = cityToDistanceKey(params.ville);
  const distanceVal = distanceKey
    ? (pricing.distance[distanceKey] ?? 0)
    : 0;

  const prixTypique = Math.round(base + precisionVal + urgenceVal + distanceVal);
  const min = Math.round(base + distanceVal);
  const max = prixTypique;

  return { min: Math.max(0, min), max, estimate: max };
}
