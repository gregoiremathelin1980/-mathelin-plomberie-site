/**
 * Accueil : avis issus de `site-data` uniquement si autorisé (évite témoignages d’exemple en prod sans GéoCompta).
 */
export function allowSiteDataHomeReviewsEnv(
  nodeEnv: string | undefined,
  siteDataHomeReviews: string | undefined
): boolean {
  const env = nodeEnv ?? "development";
  return env !== "production" || siteDataHomeReviews === "true";
}

export function allowSiteDataHomeReviews(): boolean {
  return allowSiteDataHomeReviewsEnv(process.env.NODE_ENV, process.env.SITE_DATA_HOME_REVIEWS);
}
