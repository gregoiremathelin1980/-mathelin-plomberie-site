import Link from "next/link";
import type { GeocomptaRelatedLink } from "@/lib/api/geocomptaSchemas";

function linkHref(
  link: GeocomptaRelatedLink,
  base: "p" | "realisations" | "conseils"
): string {
  if (link.path?.trim().startsWith("/")) return link.path.trim();
  if (base === "p") return `/p/${link.slug}`;
  if (base === "realisations") return `/realisations/${link.slug}`;
  return `/conseils/${link.slug}`;
}

interface GeocomptaRelatedSectionProps {
  relatedPages?: GeocomptaRelatedLink[];
  relatedRealisations?: GeocomptaRelatedLink[];
  relatedAdvice?: GeocomptaRelatedLink[];
}

/** Maillage interne fourni par l’API GéoCompta (affichage sans calcul SEO local). */
export default function GeocomptaRelatedSection({
  relatedPages = [],
  relatedRealisations = [],
  relatedAdvice = [],
}: GeocomptaRelatedSectionProps) {
  const has =
    relatedPages.length > 0 || relatedRealisations.length > 0 || relatedAdvice.length > 0;
  if (!has) return null;

  return (
    <section className="mt-12 border-t border-gray-200 pt-10" aria-label="Liens utiles">
      <h2 className="font-heading text-xl font-bold text-primary">Pour aller plus loin</h2>
      <div className="mt-6 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {relatedPages.length > 0 && (
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wide text-gray-500">Pages</h3>
            <ul className="mt-3 space-y-2 text-primary">
              {relatedPages.map((l) => (
                <li key={`p-${l.slug}`}>
                  <Link href={linkHref(l, "p")} className="hover:underline">
                    {l.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        )}
        {relatedRealisations.length > 0 && (
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wide text-gray-500">
              Réalisations
            </h3>
            <ul className="mt-3 space-y-2 text-primary">
              {relatedRealisations.map((l) => (
                <li key={`r-${l.slug}`}>
                  <Link href={linkHref(l, "realisations")} className="hover:underline">
                    {l.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        )}
        {relatedAdvice.length > 0 && (
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wide text-gray-500">Conseils</h3>
            <ul className="mt-3 space-y-2 text-primary">
              {relatedAdvice.map((l) => (
                <li key={`c-${l.slug}`}>
                  <Link href={linkHref(l, "conseils")} className="hover:underline">
                    {l.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </section>
  );
}
