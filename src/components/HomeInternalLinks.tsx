import Link from "next/link";
import { SERVICES } from "@/lib/services-data";
import { SATELLITE_AMBERIEU_URL, SATELLITE_MEXIMIEUX_URL } from "@/lib/config";

const ZONES = [
  { href: `${SATELLITE_MEXIMIEUX_URL}/`, label: "Plombier à Meximieux" },
  { href: `${SATELLITE_AMBERIEU_URL}/`, label: "Plombier à Ambérieu-en-Bugey" },
  { href: "/zones-intervention", label: "Toutes les zones" },
  { href: "/urgence/fuite-eau-meximieux", label: "Fuite d'eau Meximieux" },
  { href: "/urgence/fuite-eau-amberieu", label: "Fuite d'eau Ambérieu" },
  { href: "/urgence/fuite-eau-lagnieu", label: "Fuite d'eau Lagnieu" },
  { href: "/urgence/wc-bouche-meximieux", label: "WC bouché Meximieux" },
  { href: "/urgence/wc-bouche-amberieu", label: "WC bouché Ambérieu" },
  { href: "/urgence/wc-bouche-lagnieu", label: "WC bouché Lagnieu" },
  { href: "/urgence/chauffe-eau-panne-meximieux", label: "Chauffe-eau panne Meximieux" },
  { href: "/urgence/chauffe-eau-panne-amberieu", label: "Chauffe-eau panne Ambérieu" },
  { href: "/urgence/chauffe-eau-panne-lagnieu", label: "Chauffe-eau panne Lagnieu" },
  { href: "/urgence/chaudiere-panne-meximieux", label: "Chaudière panne Meximieux" },
  { href: "/urgence/chaudiere-panne-amberieu", label: "Chaudière panne Ambérieu" },
  { href: "/urgence/chaudiere-panne-lagnieu", label: "Chaudière panne Lagnieu" },
];

const TOP_CONSEILS = [
  { href: "/conseils/toilettes-bouchees", label: "Toilettes bouchées" },
  { href: "/conseils/fuite-robinet", label: "Fuite de robinet" },
  { href: "/conseils/pression-eau-faible", label: "Pression d'eau faible" },
  { href: "/conseils/radiateur-froid", label: "Radiateur froid" },
  { href: "/conseils/pas-eau-chaude", label: "Plus d'eau chaude" },
  { href: "/conseils/bruit-radiateur", label: "Bruit de radiateur" },
  { href: "/conseils/detartrage-chauffe-eau", label: "Détartrage chauffe-eau" },
  { href: "/conseils/evacuation-lente", label: "Évacuation lente" },
];

function LinkGroup({ title, links }: { title: string; links: { href: string; label: string }[] }) {
  return (
    <div>
      <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-primary">{title}</h3>
      <ul className="space-y-1.5">
        {links.map((l) => (
          <li key={l.href}>
            <Link
              href={l.href}
              className="text-sm text-gray-600 underline-offset-2 hover:text-primary hover:underline"
            >
              {l.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function HomeInternalLinks() {
  const serviceLinks = SERVICES.map((s) => ({
    href: `/services/${s.slug}`,
    label: s.title,
  }));

  return (
    <section className="border-t border-gray-200 bg-gray-50 px-4 py-12 sm:px-6" aria-label="Plan du site">
      <div className="mx-auto max-w-6xl">
        <h2 className="mb-8 font-heading text-xl font-bold text-primary sm:text-2xl">
          Nos interventions dans l&apos;Ain
        </h2>
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-5">
          <LinkGroup title="Zones d'intervention" links={ZONES.slice(0, 3)} />
          <LinkGroup title="Urgences par ville" links={ZONES.slice(3)} />
          <LinkGroup title="Services" links={serviceLinks} />
          <LinkGroup title="Conseils pratiques" links={TOP_CONSEILS} />
          <LinkGroup
            title="En savoir plus"
            links={[
              { href: "/zones-intervention", label: "Zones d'intervention" },
              { href: "/blog", label: "Blog" },
              { href: "/realisations", label: "Nos réalisations" },
              { href: "/contact", label: "Nous contacter" },
              { href: "/devis", label: "Demander un devis" },
              { href: "/urgence-depannage", label: "Urgence dépannage" },
            ]}
          />
        </div>
      </div>
    </section>
  );
}
