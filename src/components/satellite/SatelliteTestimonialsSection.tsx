import Link from "next/link";
import { Quote, Star } from "lucide-react";
import type { SatelliteAggregateRating, SatelliteTestimonial } from "@/lib/satelliteLandings";

function Stars({ n }: { n: number }) {
  const c = Math.min(5, Math.max(0, Math.round(n)));
  return (
    <div className="flex gap-0.5 text-amber-500" aria-hidden>
      {Array.from({ length: 5 }, (_, i) => (
        <Star key={i} className={`h-4 w-4 ${i < c ? "fill-current" : ""}`} />
      ))}
    </div>
  );
}

export default function SatelliteTestimonialsSection({
  title,
  items,
  aggregate,
  googleMapsUrl,
  sourceHint,
}: {
  title: string;
  items: SatelliteTestimonial[];
  /** Agrégat fiche Google (API) ; absent si données GMB non disponibles. */
  aggregate: SatelliteAggregateRating | null;
  googleMapsUrl?: string;
  /** Ex. source GéoCompta (même flux que le site principal). */
  sourceHint?: string;
}) {
  return (
    <section
      className="border-y border-primary/10 bg-gray-50 px-4 py-14 sm:px-6 sm:py-16"
      aria-labelledby="satellite-avis-heading"
    >
      <div className="mx-auto max-w-3xl">
        <div className="flex items-center gap-2 text-primary">
          <Quote className="h-7 w-7 shrink-0" aria-hidden />
          <h2 id="satellite-avis-heading" className="font-heading text-2xl font-bold text-primary">
            {title}
          </h2>
        </div>
        {sourceHint ? <p className="mt-2 text-xs text-gray-500">{sourceHint}</p> : null}
        {aggregate ? (
          <p className="mt-2 text-sm text-gray-600">
            Note moyenne (fiche Google)&nbsp;:{" "}
            <strong>
              {Number.isInteger(aggregate.ratingValue)
                ? String(aggregate.ratingValue)
                : aggregate.ratingValue.toFixed(1)}{" "}
              / 5
            </strong>{" "}
            — <strong>{aggregate.reviewCount}</strong> avis.
          </p>
        ) : null}
        {items.length === 0 ? (
          <p className="mt-8 rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
            Aucun témoignage configuré. Ajoutez des extraits réels dans{" "}
            <code className="rounded bg-white px-1">content/settings/satellite-landings.json</code>.
          </p>
        ) : null}
        <ul className="mt-8 space-y-6">
          {items.map((t, i) => (
            <li key={i} className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
              <Stars n={t.rating} />
              <blockquote className="mt-2 text-gray-800">&ldquo;{t.text}&rdquo;</blockquote>
              <p className="mt-3 text-sm font-medium text-gray-600">— {t.firstName}</p>
            </li>
          ))}
        </ul>
        {googleMapsUrl ? (
          <p className="mt-8 text-center">
            <Link
              href={googleMapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm font-semibold text-primary underline-offset-2 hover:underline"
            >
              Voir tous nos avis sur Google
            </Link>
          </p>
        ) : null}
      </div>
    </section>
  );
}
