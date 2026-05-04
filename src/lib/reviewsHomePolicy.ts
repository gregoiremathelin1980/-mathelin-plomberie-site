/**
 * Accueil : avis issus de `site-data` **jamais** en production (aucun faux témoignage possible, même si une env est mal réglée).
 * En dev : opt-in explicite `SITE_DATA_HOME_REVIEWS=true` pour tester avec `reviews.json`.
 */
export function allowSiteDataHomeReviewsEnv(
  nodeEnv: string | undefined,
  siteDataHomeReviews: string | undefined
): boolean {
  const env = nodeEnv ?? "development";
  if (env === "production") return false;
  return siteDataHomeReviews === "true";
}

export function allowSiteDataHomeReviews(): boolean {
  return allowSiteDataHomeReviewsEnv(process.env.NODE_ENV, process.env.SITE_DATA_HOME_REVIEWS);
}

/**
 * Production / GéoCompta : si l’API ne renvoie aucun avis, autoriser un repli explicite depuis
 * `site-data/google-reviews.json` ou `reviews.json` (contenu réel à maintenir côté déployeur).
 */
export function allowHomeReviewsSiteDataFallback(): boolean {
  return process.env.HOME_REVIEWS_SITE_DATA_FALLBACK === "true";
}
