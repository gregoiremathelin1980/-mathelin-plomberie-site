import Link from "next/link";
import type { SiteSettings } from "@/lib/content";

type Variant = "meximieux" | "amberieu";

const OTHER_SATELLITE: Record<Variant, { href: string; label: string }> = {
  meximieux: {
    href: "https://www.plombier-amberieu.fr/",
    label: "Ambérieu-en-Bugey, Lagnieu et Plaine de l’Ain",
  },
  amberieu: {
    href: "https://www.plombier-meximieux.fr/",
    label: "Meximieux, Pérouges et Côtière de l’Ain",
  },
};

export default function SatelliteLocalFooter({
  variant,
  settings,
}: {
  variant: Variant;
  settings: SiteSettings;
}) {
  const other = OTHER_SATELLITE[variant];
  return (
    <footer className="border-t border-gray-200 bg-white px-4 py-10 pb-28 text-center text-sm text-gray-700 sm:px-6 md:pb-10">
      <div className="mx-auto max-w-3xl space-y-6">
        <div>
          <p className="font-semibold text-primary">{settings.company}</p>
          <p className="mt-1 whitespace-pre-line">{settings.address}</p>
          <p className="mt-1">
            Tél. :{" "}
            <a className="font-medium text-primary hover:underline" href={`tel:${settings.phone.replace(/\s/g, "")}`}>
              {settings.phone}
            </a>
          </p>
        </div>
        <p>
          <span className="text-gray-600">Nous intervenons aussi sur le secteur </span>
          <a href={other.href} className="font-medium text-primary underline-offset-2 hover:underline">
            {other.label}
          </a>
          .
        </p>
        <p className="text-xs text-gray-500">
          Une entreprise{" "}
          <Link
            href="https://www.mathelin-plomberie.fr/"
            className="font-medium text-primary underline-offset-2 hover:underline"
          >
            Mathelin Plomberie Chauffage
          </Link>{" "}
          — plombier à Pérouges, site principal.
        </p>
        <nav
          className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-xs text-gray-500"
          aria-label="Informations légales"
        >
          <Link href="/mentions-legales" className="underline-offset-2 hover:text-primary hover:underline">
            Mentions légales
          </Link>
          <Link href="/cgv" className="underline-offset-2 hover:text-primary hover:underline">
            CGV
          </Link>
          <Link
            href="/mentions-legales#mediation"
            className="underline-offset-2 hover:text-primary hover:underline"
          >
            Médiation CM2C
          </Link>
        </nav>
      </div>
    </footer>
  );
}
