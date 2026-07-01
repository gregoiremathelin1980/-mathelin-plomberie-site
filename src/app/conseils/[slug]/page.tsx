import { notFound } from "next/navigation";
import { getConseilBySlug, getConseils } from "@/lib/content";
import { getRecentInterventions } from "@/lib/site-data";
import { resolveConseilCoverImage } from "@/lib/conseilsMerged";
import ArticleTemplate from "@/templates/ArticleTemplate";
import GeocomptaRelatedSection from "@/components/GeocomptaRelatedSection";
import { tryGetCachedGeocomptaConseil, getCachedGeocomptaSitemapData } from "@/lib/api/geocomptaCached";
import { renderPublicSeoContent } from "@/lib/renderPublicSeoContent";
import { buildPageMetadata } from "@/lib/seo/metaBuilder";

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
    return buildPageMetadata({
      title: baseTitle,
      description: api.seoDescription ?? api.metaDescription ?? api.excerpt ?? api.title,
      path: `/conseils/${slug}`,
      type: "article",
    });
  }
  const conseil = getConseilBySlug(slug);
  if (!conseil) return {};
  const cityPart = conseil.city ? ` à ${conseil.city}` : "";
  return buildPageMetadata({
    title: `${conseil.title}${cityPart}`,
    description: conseil.excerpt ?? conseil.title,
    path: `/conseils/${slug}`,
    type: "article",
  });
}

export default async function ConseilDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const api = await tryGetCachedGeocomptaConseil(slug);

  if (api) {
    const imageUrl = resolveConseilCoverImage(api.image);
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
          imageAlt={api.title}
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

  const recentInterventions = getRecentInterventions();

  return (
    <ArticleTemplate
      title={conseil.title}
      date={conseil.date}
      city={conseil.city}
      backHref="/conseils"
      backLabel="Retour aux conseils"
      recentInterventions={recentInterventions}
    >
      {conseil.content ? (
        <div className="whitespace-pre-wrap text-gray-text">{conseil.content}</div>
      ) : null}
    </ArticleTemplate>
  );
}
