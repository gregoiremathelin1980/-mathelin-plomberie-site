/**
 * Schéma JSON-LD PlumbingBusiness / LocalBusiness pour le SEO.
 * Données structurées lues par Google (recherche locale, Knowledge Panel).
 */
import { SITE_URL } from "@/lib/config";
import type { SiteSettings } from "@/lib/content";

const FOUNDING_DATE = "2013-02-01";
const OFFICIAL_NAME = "Mathelin Grégoire - Plomberie Chauffage";
const LOGO_IMAGE_URL = "https://www.mathelin-plomberie.fr/images/carte-visite.jpg";
const DEFAULT_CITY = "Pérouges";
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
  const schema = {
    "@context": "https://schema.org",
    "@type": ["LocalBusiness", "Plumber", "HomeAndConstructionBusiness"],
    name: OFFICIAL_NAME,
    alternateName: [settings.company, "Mathelin Plomberie Chauffage"].filter(Boolean),
    image: LOGO_IMAGE_URL,
    logo: LOGO_IMAGE_URL,
    foundingDate: FOUNDING_DATE,
    description:
      "Plombier chauffagiste : dépannage plomberie, urgence fuite d'eau, canalisation bouchée, débouchage évier, radiateur froid, chauffe-eau. Intervention à Pérouges, Meximieux, Ambérieu-en-Bugey, Lagnieu.",
    url: SITE_URL,
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
