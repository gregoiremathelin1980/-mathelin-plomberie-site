import { notFound } from "next/navigation";
import { getRealisationBySlug, getRealisations, getSiteSettings } from "@/lib/content";
import {
  getRealisationBySlugFromSiteData,
  getRealisationsFromSiteData,
  getRecentInterventions,
} from "@/lib/site-data";
import { getConseils } from "@/lib/content";
import { SERVICES } from "@/lib/services-data";
import { getPhotoUrl } from "@/lib/config";
import RealisationTemplate from "@/templates/RealisationTemplate";

function findServiceSlugForTitle(serviceTitle?: string): { slug: string; title: string } | null {
  if (!serviceTitle) return null;
  const normalized = serviceTitle.toLowerCase().trim();
  const found = SERVICES.find(
    (s) =>
      s.title.toLowerCase() === normalized ||
      s.title.toLowerCase().includes(normalized) ||
      normalized.includes(s.title.toLowerCase())
  );
  return found ? { slug: found.slug, title: found.title } : null;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const realisation =
    getRealisationBySlugFromSiteData(slug) ?? getRealisationBySlug(slug);
  if (!realisation) return {};
  const cityPart = realisation.city ? ` à ${realisation.city}` : "";
  return {
    title: `${realisation.title}${cityPart} | Mathelin Plomberie Chauffage`,
    description: realisation.description ?? realisation.title,
  };
}

export function generateStaticParams() {
  const fromSiteData = getRealisationsFromSiteData();
  const fromContent = getRealisations();
  const slugs = new Set([
    ...fromSiteData.map((r) => r.slug),
    ...fromContent.map((r) => r.slug),
  ]);
  return Array.from(slugs).map((slug) => ({ slug }));
}

export default async function RealisationDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const fromSiteData = getRealisationBySlugFromSiteData(slug);
  const fromContent = getRealisationBySlug(slug);
  const realisation = fromSiteData ?? fromContent;
  if (!realisation) notFound();

  const allConseils = getConseils();
  const conseilSlugs =
    "conseils" in realisation && Array.isArray(realisation.conseils)
      ? (realisation as { conseils?: string[] }).conseils ?? []
      : [];
  const conseils = conseilSlugs
    .map((s) => allConseils.find((c) => c.slug === s))
    .filter(Boolean)
    .map((c) => ({ slug: c!.slug, title: c!.title })) as { slug: string; title: string }[];
  if (conseils.length === 0 && allConseils.length > 0) {
    conseils.push(
      ...allConseils.slice(0, 3).map((c) => ({ slug: c.slug, title: c.title }))
    );
  }

  const serviceLink = findServiceSlugForTitle(
    "service" in realisation ? realisation.service : undefined
  );
  const settings = getSiteSettings();
  const resolvedImages = realisation.images?.map((src) => getPhotoUrl(src)).filter(Boolean) as string[] | undefined;
  const recentInterventions = getRecentInterventions();

  return (
    <RealisationTemplate
      title={realisation.title}
      city={realisation.city}
      image={resolvedImages?.[0]}
      images={resolvedImages}
      showChantierPhotos={settings.show_chantier_photos !== false}
      description={realisation.description ?? realisation.content}
      serviceExplanation={"service" in realisation ? realisation.service : undefined}
      conseils={conseils}
      serviceSlug={serviceLink?.slug}
      serviceTitle={serviceLink?.title}
      recentInterventions={recentInterventions}
    />
  );
}
