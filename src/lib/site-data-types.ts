/**
 * Types pour site-data (sans dépendances Node).
 * Permet à l’admin (composant client) d’utiliser ces types sans importer site-data.ts (fs, path).
 */

import type { DisplaySettings } from "./display-settings";

export type { DisplaySettings } from "./display-settings";

export interface SiteDataSettings {
  entreprise?: string;
  nom_contact?: string;
  telephone?: string;
  email?: string;
  zone?: string;
  messageUrgence?: string;
  /** Lien public « avis Google » (fiche Maps / GMB) si l’API GéoCompta ne renvoie pas encore d’avis. */
  googleReviewsUrl?: string;
  showAdviceImages?: boolean;
  showChantierPhotos?: boolean;
  displaySettings?: DisplaySettings;
}
