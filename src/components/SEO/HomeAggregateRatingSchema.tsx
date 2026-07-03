import { SITE_URL } from "@/lib/config";
import { GMB_FALLBACK_PROFILE } from "@/lib/gmbSeoDefaults";

/**
 * Note GMB uniquement sur l’accueil : évite « plusieurs notes cumulées » sur /blog, /conseils, etc.
 * Fusionnée par Google avec le LocalBusiness global (`@id` …/#localbusiness) du layout.
 */
export default function HomeAggregateRatingSchema() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "@id": `${SITE_URL}/#localbusiness`,
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: GMB_FALLBACK_PROFILE.averageRating.toFixed(1),
      reviewCount: String(GMB_FALLBACK_PROFILE.totalReviewCount),
      bestRating: 5,
      worstRating: 1,
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
