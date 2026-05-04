/**
 * Schéma JSON-LD PlumbingBusiness / LocalBusiness pour le SEO.
 * Données structurées lues par Google (recherche locale, Knowledge Panel).
 */
import type { SiteSettings } from "@/lib/content";
import { SITE_URL } from "@/lib/config";
import { GMB_SHARE_URL } from "@/lib/gmbSeoDefaults";
import { getGmbSameAsUrl } from "@/lib/satelliteLandings";

const FOUNDING_DATE = "2013-02-01";
/** Nom aligné fiche Google Business / balises titre & Open Graph */
const BRAND_NAME = "Mathelin Plomberie Chauffage";
const LEGAL_ALTERNATE_NAME = "Mathelin Grégoire - Plomberie Chauffage";
const MAIN_URL = SITE_URL;
const LOGO_IMAGE_URL = `${MAIN_URL}/images/carte-visite.webp`;
const DEFAULT_CITY = "Pérouges";
/** Domaines satellites (redirection vers le site principal) = preuves d'identité pour Google */
const SAME_AS = [
  "https://www.plombier-amberieu.fr",
  "https://www.plombier-meximieux.fr",
];
/** Fallback si settings.cities vide ; doit inclure Ambérieu-en-Bugey et Saint-Vulbas pour SEO local */
const AREA_SERVED = [
  "Ambérieu-en-Bugey",
  "Meximieux",
  "Lagnieu",
  "Pérouges",
  "Saint-Vulbas",
  "Villieu-Loyes-Mollon",
  "Blyes",
  "Leyment",
];

function phoneToInternational(phone: string): string {
  const raw = phone.replace(/\s/g, "");
  return raw.startsWith("0") ? `+33${raw.slice(1)}` : `+33${raw}`;
}

export default function LocalBusinessSchema({
  settings,
}: {
  settings: SiteSettings;
}) {
  const gmbUrl = getGmbSameAsUrl(settings)?.trim() || GMB_SHARE_URL;
  const sameAs = Array.from(new Set([gmbUrl, ...SAME_AS]));

  const schema = {
    "@context": "https://schema.org",
    "@id": `${MAIN_URL}/#localbusiness`,
    "@type": ["LocalBusiness", "Plumber", "HomeAndConstructionBusiness"],
    name: BRAND_NAME,
    alternateName: [LEGAL_ALTERNATE_NAME, settings.company].filter(Boolean),
    image: LOGO_IMAGE_URL,
    logo: LOGO_IMAGE_URL,
    foundingDate: FOUNDING_DATE,
    description:
      "Mathelin Plomberie Chauffage : artisan plombier à Pérouges. Dépannage urgence 7j/7, entretien chaudière et rénovation dans l'Ain. Devis gratuit au 06 61 42 24 07.",
    url: MAIN_URL,
    sameAs,
    telephone: phoneToInternational(settings.phone),
    email: settings.email || undefined,
    founder: {
      "@type": "Person",
      name: "Mathelin Grégoire",
    },
    address: {
      "@type": "PostalAddress",
      streetAddress: settings.address,
      addressLocality: DEFAULT_CITY,
      postalCode: "01800",
      addressRegion: "Ain",
      addressCountry: "FR",
    },
    areaServed: (settings.cities?.length ? settings.cities : AREA_SERVED).map(
      (name) => ({ "@type": "Place", name })
    ),
    priceRange: "€€",
    serviceType: [
      "Dépannage plomberie",
      "Chauffage",
      "Réparation fuite d'eau",
      "Débouchage canalisation",
      "Chauffe-eau",
      "Radiateurs",
    ],
    knowsAbout: [
      "Plomberie",
      "Chauffage",
      "Débouchage",
      "Fuite d'eau",
      "Chauffe-eau",
      "Radiateur",
    ],
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: "5.0",
      reviewCount: "51",
      bestRating: 5,
      worstRating: 1,
    },
    ...(settings.service_radius && {
      serviceArea: {
        "@type": "GeoCircle",
        geoMidpoint: {
          "@type": "GeoCoordinates",
          latitude: 45.9019,
          longitude: 5.1778,
        },
        geoRadius: "15000",
      },
    }),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
