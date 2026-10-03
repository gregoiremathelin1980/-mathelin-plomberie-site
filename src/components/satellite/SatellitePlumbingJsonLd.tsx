import type { GeocomptaGoogleBusinessProfile } from "@/lib/api/geocomptaSchemas";
import type { SiteSettings } from "@/lib/content";
import { MAIN_SITE_URL, SATELLITE_AMBERIEU_URL, SATELLITE_MEXIMIEUX_URL } from "@/lib/config";
import { GMB_SHARE_URL, resolveGmbProfileForStructuredData } from "@/lib/gmbSeoDefaults";
import {
  getGmbUrlForSatellitePages,
  getSatelliteLandingsData,
  phoneToInternationalSchema,
  postalAddressParts,
  type SatelliteLandingsFile,
} from "@/lib/satelliteLandings";

type Variant = "meximieux" | "amberieu";

function buildSchema(
  variant: Variant,
  settings: SiteSettings,
  landing: SatelliteLandingsFile,
  googleBusinessProfile: GeocomptaGoogleBusinessProfile | null
): Record<string, unknown> {
  const addr = postalAddressParts(settings.address);
  const gmbFromSettings = getGmbUrlForSatellitePages(settings)?.trim();
  const sameAsList = Array.from(new Set([GMB_SHARE_URL, gmbFromSettings].filter(Boolean) as string[]));
  const gbp = resolveGmbProfileForStructuredData(googleBusinessProfile);
  const areas = variant === "meximieux" ? landing.areaServed_meximieux : landing.areaServed_amberieu;
  const description =
    variant === "meximieux"
      ? "Plombier chauffagiste sur la Côtière et autour de Pérouges : dépannage, fuites, débouchage, chauffe-eau."
      : "Plombier chauffagiste sur la Plaine de l'Ain et le Bugey : dépannage, fuites, débouchage, chauffage.";

  const satelliteUrl =
    variant === "meximieux" ? `${SATELLITE_MEXIMIEUX_URL}/` : `${SATELLITE_AMBERIEU_URL}/`;

  // Même entité que le LocalBusiness du site principal (@id partagé) : les IA et Google
  // voient une seule entreprise présente sur trois domaines, pas trois homonymes.
  const base: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@id": `${MAIN_SITE_URL}/#localbusiness`,
    "@type": ["LocalBusiness", "Plumber"],
    name: settings.company,
    description,
    url: `${MAIN_SITE_URL}/`,
    mainEntityOfPage: satelliteUrl,
    telephone: phoneToInternationalSchema(settings.phone),
    address: {
      "@type": "PostalAddress",
      streetAddress: addr.streetAddress,
      addressLocality: addr.addressLocality,
      postalCode: addr.postalCode,
      addressRegion: "Ain",
      addressCountry: addr.addressCountry,
    },
    areaServed: areas.map((name) => ({ "@type": "City", name })),
  };

  if (sameAsList.length > 0) {
    base.sameAs = sameAsList;
  }

  return base;
}

export default function SatellitePlumbingJsonLd({
  variant,
  settings,
  googleBusinessProfile,
}: {
  variant: Variant;
  settings: SiteSettings;
  googleBusinessProfile: GeocomptaGoogleBusinessProfile | null;
}) {
  const landing = getSatelliteLandingsData();
  const schema = buildSchema(variant, settings, landing, googleBusinessProfile);
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
