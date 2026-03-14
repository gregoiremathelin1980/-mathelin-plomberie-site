import { notFound } from "next/navigation";
import {
  getDepannageBySlug,
  getDepannageSlugs,
  getRecentInterventions,
  getRealisationBySlugFromSiteData,
} from "@/lib/site-data";
import {
  getRealisations,
  getRealisationBySlug,
  type RealisationItem,
} from "@/lib/content";
import { getSiteSettings } from "@/lib/content";
import DepannageTemplate from "@/templates/DepannageTemplate";
import ServiceSchema from "@/components/ServiceSchema";

export async function generateStaticParams() {
  const slugs = getDepannageSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const depannage = getDepannageBySlug(slug);
  if (!depannage) return {};
  const cityPart = depannage.city ? ` à ${depannage.city}` : "";
  return {
    title: `${depannage.title} | Mathelin Plomberie Chauffage`,
    description:
      depannage.excerpt ??
      `Intervention dépannage plomberie${cityPart}. Diagnostic et réparation par un plombier chauffagiste local.`,
  };
}

export default async function DepannagePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const depannage = getDepannageBySlug(slug);
  if (!depannage) notFound();

  const settings = getSiteSettings();
  const allRealisations = getRealisations();
  const recentInterventions = getRecentInterventions();

  const realisations: RealisationItem[] = depannage.realisations?.length
    ? depannage.realisations
        .map((s) => {
          const fromSite = getRealisationBySlugFromSiteData(s);
          if (fromSite)
            return {
              slug: fromSite.slug,
              title: fromSite.title,
              city: fromSite.city,
              service: fromSite.service,
              date: fromSite.date,
              images: fromSite.images,
              description: fromSite.description,
              content: fromSite.content,
            } as RealisationItem;
          return getRealisationBySlug(s);
        })
        .filter((r): r is RealisationItem => r != null)
    : allRealisations.slice(0, 4);

  return (
    <>
      <ServiceSchema
        name={depannage.title}
        description={depannage.excerpt ?? depannage.title}
        serviceType="Dépannage plomberie"
        areaServed={settings.cities}
      />
      <DepannageTemplate
        depannage={depannage}
        realisations={realisations}
        recentInterventions={recentInterventions}
        phone={settings.phone}
      />
    </>
  );
}
