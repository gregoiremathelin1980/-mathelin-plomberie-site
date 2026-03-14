import Link from "next/link";
import { MapPin } from "lucide-react";
import type { RecentInterventionEntry } from "@/lib/site-data";
import { buttonVariants } from "@/components/ui/button";

interface LocalProofBlockProps {
  interventions: RecentInterventionEntry[];
}

/** Bloc "Interventions récentes autour de vous" (preuve locale) — pages villes, services, dépannage */
export default function LocalProofBlock({ interventions }: LocalProofBlockProps) {
  if (!interventions?.length) return null;

  return (
    <section className="mb-14 rounded-2xl border border-primary/20 bg-primary/5 p-6">
      <h2 className="font-heading text-xl font-semibold text-primary flex items-center gap-2">
        <MapPin className="h-5 w-5" />
        Interventions récentes autour de vous
      </h2>
      <ul className="mt-4 space-y-2 text-gray-700">
        {interventions.slice(0, 8).map((item, i) => (
          <li key={i} className="flex items-baseline gap-2">
            {item.slug ? (
              <Link
                href={`/realisations/${item.slug}`}
                className="font-medium text-primary underline-offset-2 hover:underline"
              >
                {item.city}
              </Link>
            ) : (
              <span className="font-medium text-primary">{item.city}</span>
            )}
            <span>— {item.label}</span>
          </li>
        ))}
      </ul>
      <p className="mt-4">
        <Link href="/realisations" className={buttonVariants({ variant: "outline", size: "sm" })}>
          Voir nos réalisations
        </Link>
      </p>
    </section>
  );
}
