import Link from "next/link";
import { MapPin } from "lucide-react";
import type { RecentInterventionEntry } from "@/lib/site-data";
import { formatMonthYearFR } from "@/lib/date";
import { buttonVariants } from "@/components/ui/button";

interface HomeRecentInterventionsProps {
  interventions: RecentInterventionEntry[];
  /** Limite d’affichage (défaut 5 ; GéoCompta peut en fournir davantage, ex. 8–20). */
  maxItems?: number;
}

/** Section accueil : cartes "Intervention récente à [ville]" — lien vers réalisations si slug. */
export default function HomeRecentInterventions({
  interventions,
  maxItems = 5,
}: HomeRecentInterventionsProps) {
  const list = interventions.slice(0, Math.max(1, maxItems));
  if (!list.length) return null;

  return (
    <section className="px-4 py-10 sm:px-6" aria-label="Interventions récentes">
      <div className="mx-auto max-w-6xl">
        <h2 className="font-heading text-2xl font-bold text-primary flex items-center gap-2">
          <MapPin className="h-6 w-6" />
          Interventions récentes
        </h2>
        <p className="mt-1 text-gray-600">
          Dernières interventions réalisées entre Meximieux, Ambérieu-en-Bugey, Saint-Vulbas et Lagnieu.
        </p>
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {list.map((item, i) => (
            <div
              key={i}
              className="rounded-2xl border border-primary/20 bg-white p-5 shadow-sm transition hover:shadow-md"
            >
              {item.slug ? (
                <Link href={`/realisations/${item.slug}`} className="block hover:opacity-90">
                  <p className="font-semibold text-primary">
                    Intervention récente à {item.city}
                  </p>
                  <p className="mt-1 text-gray-800 capitalize">{item.label}</p>
                  {item.date && (
                    <p className="mt-2 text-sm text-gray-500">
                      {formatMonthYearFR(item.date).replace(/^./, (c) => c.toUpperCase())}
                    </p>
                  )}
                </Link>
              ) : (
                <>
                  <p className="font-semibold text-primary">
                    Intervention récente à {item.city}
                  </p>
                  <p className="mt-1 text-gray-800 capitalize">{item.label}</p>
                  {item.date && (
                    <p className="mt-2 text-sm text-gray-500">
                      {formatMonthYearFR(item.date).replace(/^./, (c) => c.toUpperCase())}
                    </p>
                  )}
                </>
              )}
            </div>
          ))}
        </div>
        <p className="mt-6 text-center">
          <Link href="/realisations" className={buttonVariants({ variant: "outline" })}>
            Voir toutes nos réalisations
          </Link>
        </p>
      </div>
    </section>
  );
}
