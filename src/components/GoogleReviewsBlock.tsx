import { Star, Quote } from "lucide-react";
import type { ReviewEntry } from "@/lib/site-data";

function StarRating({ rating }: { rating: number }) {
  const n = Math.min(5, Math.max(0, Math.round(rating)));
  return (
    <div className="flex gap-0.5 text-amber-500" aria-label={`${rating} sur 5`}>
      {Array.from({ length: 5 }, (_, i) => (
        <Star
          key={i}
          className={`h-4 w-4 ${i < n ? "fill-current" : ""}`}
          aria-hidden
        />
      ))}
    </div>
  );
}

function ReviewCard({
  review,
  highlighted,
}: {
  review: ReviewEntry;
  highlighted?: boolean;
}) {
  return (
    <blockquote
      className={`rounded-2xl border bg-white p-5 ${
        highlighted
          ? "border-primary/30 shadow-md"
          : "border-gray-200"
      }`}
    >
      <StarRating rating={review.rating} />
      <p className="mt-2 text-gray-700 text-sm leading-relaxed">
        &ldquo;{review.text}&rdquo;
      </p>
      {(review.author || review.source) && (
        <footer className="mt-3 flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-gray-500">
          {review.author ? <span>— {review.author}</span> : null}
          {review.source ? (
            <span className="rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-600">{review.source}</span>
          ) : null}
        </footer>
      )}
    </blockquote>
  );
}

/** Layout A : grille 3 colonnes */
function LayoutA({ reviews }: { reviews: ReviewEntry[] }) {
  return (
    <div className="grid gap-4 sm:grid-cols-3">
      {reviews.map((r, i) => (
        <ReviewCard key={i} review={r} />
      ))}
    </div>
  );
}

interface GoogleReviewsBlockProps {
  reviews: ReviewEntry[];
  /**
   * GéoComptaAE : si true et liste vide, section sobre sans contenu inventé.
   * Hors API (pas de `GEOCOMPTA_API_BASE_URL`) : laisser false — pas de bloc si aucun avis en `site-data`.
   */
  geocomptaApiMode?: boolean;
  /** Erreur fetch `/api/public/reviews` (affichée seulement si la liste affichée est vide). */
  geocomptaReviewsLoadError?: string;
  /** Remplace le texte « Aucun avis pour le moment » quand la liste est vide (ex. prod sans GéoCompta). */
  reviewsEmptyHint?: string;
}

/** Bloc avis : données API ou repli fichier uniquement ; pas de faux avis en mode GéoComptaAE. */
export default async function GoogleReviewsBlock({
  reviews,
  geocomptaApiMode = false,
  geocomptaReviewsLoadError,
  reviewsEmptyHint,
}: GoogleReviewsBlockProps) {
  if (!reviews?.length) {
    if (!geocomptaApiMode) return null;
    const isDev = process.env.NODE_ENV === "development";
    const errorDetail =
      geocomptaReviewsLoadError &&
      (isDev ? (
        <pre className="mt-3 max-h-40 overflow-auto rounded-lg bg-red-50 p-3 text-left text-xs text-red-900 whitespace-pre-wrap break-words">
          {geocomptaReviewsLoadError}
        </pre>
      ) : (
        <p className="mt-2 text-sm text-amber-800">
          Impossible de charger les avis pour le moment. Vérifiez la connexion GéoComptaAE et les variables
          d’environnement (URL, clé Bearer).
        </p>
      ));
    return (
      <section className="bg-gray-50 px-4 py-16 sm:px-6" aria-label="Avis clients">
        <div className="mx-auto max-w-6xl">
          <div className="flex items-center gap-2 text-primary">
            <Quote className="h-8 w-8" aria-hidden />
            <h2 className="font-heading text-2xl font-bold sm:text-3xl">Avis clients</h2>
          </div>
          {geocomptaReviewsLoadError ? (
            <>
              <p className="mt-4 font-medium text-gray-800">Les avis n’ont pas pu être récupérés depuis GéoComptaAE.</p>
              {errorDetail}
            </>
          ) : (
            <p className="mt-4 text-gray-600">
              {reviewsEmptyHint ?? "Aucun avis pour le moment."}
            </p>
          )}
        </div>
      </section>
    );
  }

  return (
    <section className="bg-gray-50 px-4 py-16 sm:px-6" aria-label="Avis clients">
      <div className="mx-auto max-w-6xl">
        <div className="flex items-center gap-2 text-primary">
          <Quote className="h-8 w-8" aria-hidden />
          <h2 className="font-heading text-2xl font-bold sm:text-3xl">
            Avis clients
          </h2>
        </div>
        <p className="mt-2 text-gray-600">
          Ce que disent nos clients après une intervention.
        </p>
        <div className="mt-8">
          <LayoutA reviews={reviews} />
        </div>
      </div>
    </section>
  );
}
