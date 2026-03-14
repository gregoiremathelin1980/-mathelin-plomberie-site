import Link from "next/link";
import { formatMonthYearFR } from "@/lib/date";
import type { RealisationItem } from "@/lib/content";

interface RecentInterventionsProps {
  realisations: RealisationItem[];
}

export default function RecentInterventions({ realisations }: RecentInterventionsProps) {
  if (!realisations?.length) return null;

  return (
    <section className="bg-white px-4 py-16 sm:px-6">
      <div className="mx-auto max-w-6xl">
        <h2 className="font-heading text-2xl font-bold text-primary sm:text-3xl">
          Interventions récentes
        </h2>
        <p className="mt-2 text-gray-text">
          Dernières interventions réalisées par Mathelin Plomberie Chauffage.
        </p>
        <ul className="mt-6 space-y-3">
          {realisations.slice(0, 6).map((r) => (
            <li key={r.slug}>
              <Link
                href={`/realisations/${r.slug}`}
                className="flex flex-wrap items-baseline gap-2 text-gray-800 underline-offset-2 hover:underline"
              >
                <span className="font-medium">{r.title}</span>
                {r.city && (
                  <span className="text-gray-text">
                    à {r.city} — {formatMonthYearFR(r.date)}
                  </span>
                )}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
