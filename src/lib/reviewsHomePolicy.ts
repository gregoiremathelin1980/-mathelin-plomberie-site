/**
 * Avis fichier (`site-data/google-reviews.json` ou `reviews.json`) :
 * toujours autorisés — le contenu doit être maintenu avec des avis réels.
 * Désactivable explicitement avec `SITE_DATA_HOME_REVIEWS=false`.
 */
export function allowSiteDataHomeReviewsEnv(
  _nodeEnv: string | undefined,
  siteDataHomeReviews: string | undefined
): boolean {
  return siteDataHomeReviews !== "false";
}

export function allowSiteDataHomeReviews(): boolean {
  return allowSiteDataHomeReviewsEnv(process.env.NODE_ENV, process.env.SITE_DATA_HOME_REVIEWS);
}

export function allowHomeReviewsSiteDataFallback(): boolean {
  return allowSiteDataHomeReviews();
}
