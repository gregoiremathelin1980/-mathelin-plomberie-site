import { buildBreadcrumbSchema, type BreadcrumbItem } from "@/lib/seo/jsonld";

interface BreadcrumbSchemaProps {
  items: BreadcrumbItem[];
}

/** Injecte le schéma JSON-LD BreadcrumbList pour le SEO. */
export default function BreadcrumbSchema({ items }: BreadcrumbSchemaProps) {
  if (!items.length) return null;
  const schema = buildBreadcrumbSchema(items);
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
