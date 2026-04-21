import type { GeocomptaGoogleBusinessProfile } from "@/lib/api/geocomptaSchemas";

/** Fiche Google officielle (Partager) — `sameAs` + cohérence SERP. */
export const GMB_SHARE_URL = "https://share.google/EoCX35WiMTVFXIfpT";

/** Valeurs publiques affichées sur Google (fallback si l’API GéoCompta ne renvoie pas encore le profil). */
export const GMB_FALLBACK_PROFILE: GeocomptaGoogleBusinessProfile = {
  averageRating: 5,
  totalReviewCount: 51,
  lastSyncedAt: null,
};

export function resolveGmbProfileForStructuredData(
  fromApi: GeocomptaGoogleBusinessProfile | null
): GeocomptaGoogleBusinessProfile {
  if (
    fromApi &&
    Number.isFinite(fromApi.averageRating) &&
    Number.isFinite(fromApi.totalReviewCount) &&
    fromApi.totalReviewCount >= 0
  ) {
    return fromApi;
  }
  return GMB_FALLBACK_PROFILE;
}
