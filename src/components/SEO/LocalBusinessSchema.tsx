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
  "Pérouges", "Meximieux", "Ambérieu-en-Bugey", "Lagnieu", "Saint-Vulbas",
  "Villieu-Loyes-Mollon", "Rignieux-le-Franc", "Béligneux", "Le Montellier",
  "Saint-Jean-de-Niost", "Château-Gaillard", "Douvres", "Pont-d'Ain",
  "Saint-Denis-en-Bugey", "Blyes", "Leyment",
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
      "Pompe à chaleur",
      "Climatisation",
      "VMC",
      "Rénovation salle de bain",
    ],
    knowsAbout: [
      "Plomberie",
      "Chauffage",
      "Débouchage",
      "Fuite d'eau",
      "Chauffe-eau",
      "Radiateur",
      "Pompe à chaleur air-eau",
      "Climatisation réversible",
      "VMC double flux",
      "Rénovation salle de bain",
    ],
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: "5.0",
      reviewCount: "51",
      bestRating: 5,
      worstRating: 1,
    },
    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
        opens: "07:00",
        closes: "19:00",
      },
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: ["Saturday"],
        opens: "08:00",
        closes: "17:00",
      },
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: ["Sunday"],
        opens: "08:00",
        closes: "12:00",
        description: "Urgences uniquement",
      },
    ],
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "Services plomberie et chauffage",
      itemListElement: [
        { "@type": "Offer", itemOffered: { "@type": "Service", name: "Dépannage fuite d'eau", description: "Recherche et réparation de fuite, intervention urgence 7j/7" } },
        { "@type": "Offer", itemOffered: { "@type": "Service", name: "Débouchage canalisation", description: "Débouchage WC, évier, douche. Furet mécanique et hydrocurage" } },
        { "@type": "Offer", itemOffered: { "@type": "Service", name: "Installation et remplacement chauffe-eau", description: "Pose chauffe-eau électrique, gaz ou thermodynamique. Détartrage" } },
        { "@type": "Offer", itemOffered: { "@type": "Service", name: "Dépannage chauffage", description: "Radiateur froid, chaudière en panne, purge, désembouage" } },
        { "@type": "Offer", itemOffered: { "@type": "Service", name: "Entretien chaudière", description: "Entretien annuel obligatoire chaudière gaz. Attestation fournie" } },
        { "@type": "Offer", itemOffered: { "@type": "Service", name: "Robinetterie", description: "Remplacement mitigeur, robinet thermostatique, douchette" } },
        { "@type": "Offer", itemOffered: { "@type": "Service", name: "Pompe à chaleur", description: "Installation, remplacement et dépannage de PAC air-eau. Mise en service" } },
        { "@type": "Offer", itemOffered: { "@type": "Service", name: "Climatisation", description: "Pose et entretien de climatisation réversible. Split, multisplit, gainable" } },
        { "@type": "Offer", itemOffered: { "@type": "Service", name: "VMC", description: "Installation et dépannage VMC simple flux, double flux ou hygroréglable" } },
        { "@type": "Offer", itemOffered: { "@type": "Service", name: "Rénovation salle de bain", description: "Rénovation complète ou partielle. Plomberie, douche, baignoire, robinetterie" } },
      ],
    },
    contactPoint: {
      "@type": "ContactPoint",
      telephone: phoneToInternational(settings.phone),
      contactType: "customer service",
      areaServed: "FR",
      availableLanguage: "French",
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
