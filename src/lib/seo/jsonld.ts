import { SITE_URL } from "@/lib/config";

/** Élément de fil d'Ariane */
export interface BreadcrumbItem {
  name: string;
  path: string;
}

/**
 * Génère le schéma JSON-LD BreadcrumbList pour une page.
 * pathItems : [{ name: "Accueil", path: "/" }, { name: "Services", path: "/services" }, { name: "Installation radiateurs", path: "/services/installation-radiateurs" }]
 */
export function buildBreadcrumbSchema(pathItems: BreadcrumbItem[]): object {
  if (!pathItems.length) return {};
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: pathItems.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: `${SITE_URL}${item.path.startsWith("/") ? item.path : `/${item.path}`}`,
    })),
  };
}

/**
 * Génère le schéma Service (schema.org) pour une page service.
 */
export function buildServiceSchema(params: {
  name: string;
  description: string;
  serviceType: string;
  areaServed: string[];
  provider?: string;
}): object {
  const { name, description, serviceType, areaServed, provider = "Mathelin Plomberie Chauffage" } = params;
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name,
    description,
    serviceType,
    provider: { "@type": "Plumber", name: provider },
    areaServed: areaServed.map((city) => ({ "@type": "City", name: city })),
    url: SITE_URL,
  };
}

/**
 * Génère le schéma FAQPage (schema.org).
 */
export function buildFAQSchema(faq: { question: string; answer: string }[]): object | null {
  if (!faq?.length) return null;
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faq.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };
}

/**
 * Génère le schéma LocalBusiness / Plumber pour le layout.
 */
export function buildLocalBusinessSchema(params: {
  company: string;
  description: string;
  phone: string;
  email?: string;
  address: string;
  cities: string[];
  serviceRadius?: string;
}): object {
  const raw = params.phone.replace(/\s/g, "");
  const telephone = raw.startsWith("0") ? `+33${raw.slice(1)}` : `+33${raw}`;
  return {
    "@context": "https://schema.org",
    "@type": ["LocalBusiness", "Plumber"],
    name: params.company,
    description: params.description,
    telephone,
    email: params.email || undefined,
    address: { "@type": "PostalAddress", streetAddress: params.address, addressCountry: "FR" },
    areaServed: params.cities.map((name) => ({ "@type": "City", name })),
    priceRange: "€€",
    url: SITE_URL,
    serviceType: "Dépannage plomberie et chauffage",
  };
}
