import { notFound } from "next/navigation";
import { getConseilBySlug, getConseils } from "@/lib/content";
import { getRecentInterventions } from "@/lib/site-data";
import { getAdviceImage, getAdviceImageAlt } from "@/lib/getAdviceImage";
import { getPhotoUrl } from "@/lib/config";
import ArticleTemplate from "@/templates/ArticleTemplate";
import GeocomptaRelatedSection from "@/components/GeocomptaRelatedSection";
import { tryGetCachedGeocomptaConseil, getCachedGeocomptaSitemapData } from "@/lib/api/geocomptaCached";
import { renderPublicSeoContent } from "@/lib/renderPublicSeoContent";

export const revalidate = 86400;

export async function generateStaticParams() {
  const fromFiles = getConseils().map((c) => c.slug);
  const geo = await getCachedGeocomptaSitemapData();
  const fromApi = geo?.conseils.map((x) => x.slug) ?? [];
  const slugs = Array.from(new Set([...fromFiles, ...fromApi])).filter(Boolean);
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const api = await tryGetCachedGeocomptaConseil(slug);
  if (api) {
    const baseTitle =
      api.seoTitle ?? api.metaTitle ?? `${api.title}${api.city ? ` à ${api.city}` : ""}`;
    return {
      title: `${baseTitle} | Mathelin Plomberie Chauffage`,
      description: api.seoDescription ?? api.metaDescription ?? api.excerpt ?? api.title,
    };
  }
  const conseil = getConseilBySlug(slug);
  if (!conseil) return {};
  const cityPart = conseil.city ? ` à ${conseil.city}` : "";
  return {
    title: `${conseil.title}${cityPart} | Mathelin Plomberie Chauffage`,
    description: conseil.excerpt ?? conseil.title,
  };
}

export default async function ConseilDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const api = await tryGetCachedGeocomptaConseil(slug);

  if (api) {
    const imageUrl = getPhotoUrl(api.image ?? undefined) ?? getAdviceImage(slug);
    const imageAlt = getAdviceImageAlt(slug, api.title);
    const recentInterventions = getRecentInterventions();

    return (
      <>
        <ArticleTemplate
          title={api.title}
          date={api.date}
          city={api.city}
          backHref="/conseils"
          backLabel="Retour aux conseils"
          imageUrl={imageUrl}
          imageAlt={imageAlt}
          recentInterventions={recentInterventions}
        >
          {renderPublicSeoContent(api.content)}
        </ArticleTemplate>
        <div className="px-4 pb-16 sm:px-6">
          <div className="mx-auto max-w-3xl">
            <GeocomptaRelatedSection
              relatedPages={api.relatedPages}
              relatedRealisations={api.relatedRealisations}
              relatedAdvice={api.relatedAdvice}
            />
          </div>
        </div>
      </>
    );
  }

  const conseil = getConseilBySlug(slug);
  if (!conseil) notFound();

  const imageUrl = getAdviceImage(slug);
  const imageAlt = getAdviceImageAlt(slug, conseil.title);
  const recentInterventions = getRecentInterventions();

  return (
    <ArticleTemplate
      title={conseil.title}
      date={conseil.date}
      city={conseil.city}
      backHref="/conseils"
      backLabel="Retour aux conseils"
      imageUrl={imageUrl}
      imageAlt={imageAlt}
      recentInterventions={recentInterventions}
    >
      {conseil.content ? (
        <div className="whitespace-pre-wrap text-gray-text">{conseil.content}</div>
      ) : null}
    </ArticleTemplate>
  );
}
