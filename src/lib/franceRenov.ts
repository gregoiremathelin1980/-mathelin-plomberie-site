/**
 * Bandeau France Rénov' (arrêté du 7 juillet 2026, art. L. 122-26 du Code de la consommation).
 * Décision du client : seuls sont concernés pompe à chaleur, chauffe-eau thermodynamique,
 * VMC double flux et climatisation réversible. Aucun autre équipement (chaudière, radiateurs,
 * plancher chauffant, désembouage, chauffe-eau classique…) n'est visé.
 */
export const FRANCE_RENOV_SERVICE_SLUGS: readonly string[] = [
  "pompe-a-chaleur",
  "climatisation",
  "vmc",
  "installation-chauffe-eau", // pose électrique, gaz ou thermodynamique : le thermodynamique est concerné
];

/** Réalisations présentant des travaux concernés (climatisation réversible). */
export const FRANCE_RENOV_REALISATION_SLUGS: readonly string[] = [
  "installation-climatisation-perouges",
];

export const FRANCE_RENOV_URL = "https://france-renov.gouv.fr/servicepublic";
