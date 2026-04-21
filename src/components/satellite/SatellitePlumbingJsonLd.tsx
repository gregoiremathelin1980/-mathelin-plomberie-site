import type { GeocomptaGoogleBusinessProfile } from "@/lib/api/geocomptaSchemas";
import type { SiteSettings } from "@/lib/content";
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
  const sameAs = getGmbUrlForSatellitePages(settings);
  const areas = variant === "meximieux" ? landing.areaServed_meximieux : landing.areaServed_amberieu;
  const description =
    variant === "meximieux"
      ? "Plombier chauffagiste sur la Côtière et autour de Pérouges : dépannage, fuites, débouchage, chauffe-eau."
      : "Plombier chauffagiste sur la Plaine de l'Ain et le Bugey : dépannage, fuites, débouchage, chauffage.";

  const base: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "PlumbingService",
    name: settings.company,
    description,
    url:
      variant === "meximieux"
        ? "https://www.plombier-meximieux.fr/"
        : "https://www.plombier-amberieu.fr/",
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

  if (
    googleBusinessProfile &&
    Number.isFinite(googleBusinessProfile.averageRating) &&
    Number.isFinite(googleBusinessProfile.totalReviewCount)
  ) {
    base.aggregateRating = {
      "@type": "AggregateRating",
      ratingValue: String(googleBusinessProfile.averageRating),
      reviewCount: String(Math.floor(googleBusinessProfile.totalReviewCount)),
      bestRating: "5",
      worstRating: "1",
    };
  }

  if (sameAs) {
    base.sameAs = [sameAs];
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
