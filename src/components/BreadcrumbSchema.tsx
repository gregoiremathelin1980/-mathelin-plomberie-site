import { buildBreadcrumbSchema, type BreadcrumbItem } from "@/lib/seo/jsonld";

interface BreadcrumbSchemaProps {
  items: BreadcrumbItem[];
  /** Origine pour les chemins relatifs (défaut = site principal). */
  baseUrl?: string;
}

/** Injecte le schéma JSON-LD BreadcrumbList pour le SEO. */
export default function BreadcrumbSchema({ items, baseUrl }: BreadcrumbSchemaProps) {
  if (!items.length) return null;
  const schema = buildBreadcrumbSchema(items, baseUrl);
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
