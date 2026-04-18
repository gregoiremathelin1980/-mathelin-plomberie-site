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
