/**
 * Types et valeurs par défaut pour displaySettings.
 * Fichier sans dépendances Node (fs, path) pour pouvoir être importé par des composants client (admin).
 */

export interface DisplaySettings {
  showReviews?: boolean;
  showAdvice?: boolean;
  showAdviceImages?: boolean;
  showEstimator?: boolean;
  showRecentInterventions?: boolean;
}

const defaultDisplaySettings: Required<DisplaySettings> = {
  showReviews: true,
  showAdvice: true,
  showAdviceImages: true,
  showEstimator: true,
  showRecentInterventions: true,
};

export function getDefaultDisplaySettings(): Required<DisplaySettings> {
  return { ...defaultDisplaySettings };
}
