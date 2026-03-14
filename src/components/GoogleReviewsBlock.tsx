import { unstable_noStore } from "next/cache";
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
      {review.author && (
        <footer className="mt-3 text-sm text-gray-500">— {review.author}</footer>
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

/** Layout B : 1 avis mis en avant + 2 plus petits */
function LayoutB({ reviews }: { reviews: ReviewEntry[] }) {
  const [first, ...rest] = reviews;
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {first && (
        <div className="sm:col-span-2 lg:col-span-1">
          <ReviewCard review={first} highlighted />
        </div>
      )}
      <div className="flex flex-col gap-4 sm:col-span-2 lg:col-span-1">
        {rest.map((r, i) => (
          <ReviewCard key={i} review={r} />
        ))}
      </div>
    </div>
  );
}

/** Layout C : 3 avis empilés */
function LayoutC({ reviews }: { reviews: ReviewEntry[] }) {
  return (
    <div className="space-y-4">
      {reviews.map((r, i) => (
        <ReviewCard key={i} review={r} />
      ))}
    </div>
  );
}

interface GoogleReviewsBlockProps {
  reviews: ReviewEntry[];
}

/** Bloc avis Google : 3 avis, layout A/B/C choisi aléatoirement à chaque chargement. */
export default async function GoogleReviewsBlock({ reviews }: GoogleReviewsBlockProps) {
  unstable_noStore();
  if (!reviews?.length) return null;

  const layoutIndex = Math.floor(Math.random() * 3);
  const Layout = [LayoutA, LayoutB, LayoutC][layoutIndex];

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
          <Layout reviews={reviews} />
        </div>
      </div>
    </section>
  );
}
