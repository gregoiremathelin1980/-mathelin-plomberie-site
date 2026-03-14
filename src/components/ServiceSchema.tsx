import { SITE_URL } from "@/lib/config";

interface ServiceSchemaProps {
  name: string;
  description: string;
  serviceType: string;
  areaServed: string[];
  provider?: string;
}

export default function ServiceSchema({
  name,
  description,
  serviceType,
  areaServed,
  provider = "Mathelin Plomberie Chauffage",
}: ServiceSchemaProps) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Service",
    name,
    description,
    serviceType,
    provider: {
      "@type": "Plumber",
      name: provider,
    },
    areaServed: areaServed.map((city) => ({
      "@type": "City",
      name: city,
    })),
    url: SITE_URL,
  };
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
