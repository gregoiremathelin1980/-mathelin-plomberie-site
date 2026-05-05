import Link from "next/link";
import { MapPin } from "lucide-react";

const RECENT_CASES = [
  {
    href: "/urgence/fuite-eau-amberieu",
    label: "Fuite sous évier réparée",
    ville: "Ambérieu-en-Bugey",
    detail: "Joint siphon remplacé, étanchéité vérifiée",
  },
  {
    href: "/urgence/wc-bouche-meximieux",
    label: "WC bouché débouché en 30 min",
    ville: "Meximieux",
    detail: "Débouchage furet mécanique, canalisation nettoyée",
  },
  {
    href: "/urgence/chauffe-eau-panne-amberieu",
    label: "Chauffe-eau 200L remplacé",
    ville: "Lagnieu",
    detail: "Pose ballon neuf + évacuation ancien, même journée",
  },
  {
    href: "/urgence/chaudiere-panne-meximieux",
    label: "Chaudière gaz remise en route",
    ville: "Pérouges",
    detail: "Pressostat défaillant, pièce remplacée sur place",
  },
  {
    href: "/urgence/fuite-eau-meximieux",
    label: "Recherche de fuite non destructive",
    ville: "Saint-Vulbas",
    detail: "Détection acoustique, réparation ciblée sans casse",
  },
];

export default function HomeRecentCases() {
  return (
    <section className="border-y border-gray-200 bg-white px-4 py-12 sm:px-6">
      <div className="mx-auto max-w-4xl">
        <h2 className="font-heading text-xl font-bold text-primary sm:text-2xl">
          Dernières interventions
        </h2>
        <p className="mt-1 text-sm text-gray-500">
          Exemples récents d&apos;interventions dans l&apos;Ain
        </p>
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {RECENT_CASES.map((c) => (
            <Link
              key={c.href}
              href={c.href}
              className="group rounded-lg border border-gray-200 p-4 transition hover:border-primary/30 hover:shadow-sm"
            >
              <p className="font-semibold text-gray-900 group-hover:text-primary">{c.label}</p>
              <p className="mt-1 flex items-center gap-1 text-xs text-gray-500">
                <MapPin className="h-3 w-3" aria-hidden />
                {c.ville}
              </p>
              <p className="mt-2 text-sm text-gray-text">{c.detail}</p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
