import { SITE_URL } from "@/lib/config";
import type { ReviewEntry } from "@/lib/site-data";

interface ReviewsSchemaProps {
  reviews: ReviewEntry[];
}

/**
 * Complète l’entité LocalBusiness globale (layout) : même @id, sans dupliquer NAP.
 * Les avis structurés ne sont émis que si le bloc avis est affiché sur la page.
 */
export default function ReviewsSchema({ reviews }: ReviewsSchemaProps) {
  if (!reviews?.length) return null;

  const ratingSum = reviews.reduce((s, r) => s + r.rating, 0);
  const ratingValue = Math.round((ratingSum / reviews.length) * 10) / 10;
  const reviewCount = reviews.length;

  const aggregateSchema = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "@id": `${SITE_URL}/#localbusiness`,
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue,
      reviewCount,
      bestRating: 5,
      worstRating: 1,
    },
  };

  const reviewSchemas = reviews.map((r) => ({
    "@context": "https://schema.org",
    "@type": "Review",
    author: { "@type": "Person", name: r.author ?? "Client" },
    reviewRating: {
      "@type": "Rating",
      ratingValue: r.rating,
      bestRating: 5,
      worstRating: 1,
    },
    reviewBody: r.text,
    datePublished: r.date ?? undefined,
  }));

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(aggregateSchema) }}
      />
      {reviewSchemas.map((schema, i) => (
        <script
          key={i}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      ))}
    </>
  );
}
