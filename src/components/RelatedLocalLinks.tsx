import Link from "next/link";

interface RelatedLink {
  href: string;
  label: string;
}

interface RelatedLocalLinksProps {
  villesProches: RelatedLink[];
  problemesFrequents: RelatedLink[];
  urgence: RelatedLink;
}

export default function RelatedLocalLinks({ villesProches, problemesFrequents, urgence }: RelatedLocalLinksProps) {
  return (
    <section className="border-t border-gray-200 bg-gray-50 px-4 py-10 sm:px-6">
      <div className="mx-auto max-w-2xl">
        <h2 className="mb-6 text-lg font-semibold text-primary">
          Interventions dans les villes voisines
        </h2>
        <div className="grid gap-6 sm:grid-cols-3">
          <div>
            <h3 className="mb-2 text-sm font-semibold uppercase tracking-wide text-gray-500">Villes proches</h3>
            <ul className="space-y-1.5">
              {villesProches.map((v) => (
                <li key={v.href}>
                  <Link href={v.href} className="text-sm text-gray-600 underline-offset-2 hover:text-primary hover:underline">
                    {v.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="mb-2 text-sm font-semibold uppercase tracking-wide text-gray-500">Problèmes fréquents</h3>
            <ul className="space-y-1.5">
              {problemesFrequents.map((p) => (
                <li key={p.href}>
                  <Link href={p.href} className="text-sm text-gray-600 underline-offset-2 hover:text-primary hover:underline">
                    {p.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="mb-2 text-sm font-semibold uppercase tracking-wide text-gray-500">En cas d&apos;urgence</h3>
            <Link href={urgence.href} className="text-sm font-medium text-primary underline-offset-2 hover:underline">
              {urgence.label}
            </Link>
            <p className="mt-2 text-xs text-gray-500">
              <Link href="/zones-intervention" className="underline-offset-2 hover:underline">
                Voir toutes les zones d&apos;intervention →
              </Link>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
