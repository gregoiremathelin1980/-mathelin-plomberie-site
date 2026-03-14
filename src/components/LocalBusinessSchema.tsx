import { SITE_URL } from "@/lib/config";
import type { SiteSettings } from "@/lib/content";

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
    "@type": ["LocalBusiness", "Plumber"],
    name: settings.company,
    description: `Plombier chauffagiste : dépannage plomberie, urgence plomberie, fuite d'eau, canalisation bouchée, débouchage évier, toilette bouchée, radiateur froid, chauffe-eau en panne. Intervention autour de ${settings.cities.slice(0, 5).join(", ")}. Zone : ${settings.service_radius}.`,
    telephone: phoneToInternational(settings.phone),
    email: settings.email || undefined,
    address: {
      "@type": "PostalAddress",
      streetAddress: settings.address,
      addressCountry: "FR",
    },
    areaServed: settings.cities.map((name) => ({ "@type": "City", name })),
    priceRange: "€€",
    url: SITE_URL,
    serviceType: "Dépannage plomberie et chauffage",
  };
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
