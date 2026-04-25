/**
 * Schéma JSON-LD PlumbingBusiness / LocalBusiness pour le SEO.
 * Données structurées lues par Google (recherche locale, Knowledge Panel).
 */
import type { SiteSettings } from "@/lib/content";
import { SITE_URL } from "@/lib/config";
import { GMB_FALLBACK_PROFILE, GMB_SHARE_URL } from "@/lib/gmbSeoDefaults";
import { getGmbSameAsUrl } from "@/lib/satelliteLandings";

const FOUNDING_DATE = "2013-02-01";
const OFFICIAL_NAME = "Mathelin Grégoire - Plomberie Chauffage";
/** Canonique sans www — aligné sur layout metadata et sitemap */
const MAIN_URL = SITE_URL;
const LOGO_IMAGE_URL = `${MAIN_URL}/images/carte-visite.jpg`;
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
    name: OFFICIAL_NAME,
    alternateName: [settings.company, "Mathelin Plomberie Chauffage"].filter(Boolean),
    image: LOGO_IMAGE_URL,
    logo: LOGO_IMAGE_URL,
    foundingDate: FOUNDING_DATE,
    description:
      "Mathelin Plomberie : artisan plombier-chauffagiste à Pérouges. Dépannage urgence, entretien chaudière et rénovation dans toute la Plaine de l'Ain. Devis gratuit et intervention rapide.",
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
      ratingValue: String(GMB_FALLBACK_PROFILE.averageRating),
      reviewCount: String(GMB_FALLBACK_PROFILE.totalReviewCount),
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
