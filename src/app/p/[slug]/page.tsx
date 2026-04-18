import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import BreadcrumbSchema from "@/components/BreadcrumbSchema";
import GeocomptaRelatedSection from "@/components/GeocomptaRelatedSection";
import { getPhotoUrl } from "@/lib/config";
import { tryGetCachedGeocomptaSeoPage, getCachedGeocomptaPPageSlugs } from "@/lib/api/geocomptaCached";
import { isGeocomptaConfigured } from "@/lib/api/geocomptaClient";
import { buildPageMetadata } from "@/lib/seo/metaBuilder";

export const revalidate = 86400;

export async function generateStaticParams() {
  const slugs = await getCachedGeocomptaPPageSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const page = await tryGetCachedGeocomptaSeoPage(slug);
  if (!page) return {};
  const path = `/p/${slug}`;
  return buildPageMetadata({
    title: page.title,
    description: page.metaDescription,
    path,
    image: getPhotoUrl(page.image ?? undefined) ?? undefined,
    type: "article",
  });
}

export default async function GeocomptaSeoPageRoute({ params }: { params: Promise<{ slug: string }> }) {
  if (!isGeocomptaConfigured()) notFound();

  const { slug } = await params;
  const page = await tryGetCachedGeocomptaSeoPage(slug);
  if (!page) notFound();

  const path = `/p/${slug}`;
  const heroImage = getPhotoUrl(page.image ?? undefined);

  return (
    <>
      <BreadcrumbSchema
        items={[
          { name: "Accueil", path: "/" },
          { name: page.h1 ?? page.title, path },
        ]}
      />
      <article className="px-4 py-16 sm:px-6">
        <div className="mx-auto max-w-3xl">
          <Link
            href="/"
            className="mb-8 inline-flex items-center gap-2 text-sm font-medium text-primary hover:underline"
          >
            <ArrowLeft className="h-4 w-4" />
            Retour à l&apos;accueil
          </Link>
          {heroImage && (
            <div className="relative mb-8 aspect-video w-full overflow-hidden rounded-2xl bg-gray-100">
              <Image
                src={heroImage}
                alt={page.title}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 672px"
                priority
              />
            </div>
          )}
          <header>
            <h1 className="font-heading text-3xl font-bold text-primary sm:text-4xl">
              {page.h1 ?? page.title}
            </h1>
          </header>
          <div className="prose prose-gray mt-8 max-w-none">
            {page.contentHtml ? (
              <div
                className="text-gray-text [&_a]:text-primary [&_a]:underline"
                dangerouslySetInnerHTML={{ __html: page.contentHtml }}
              />
            ) : page.content ? (
              <div className="whitespace-pre-wrap text-gray-text">{page.content}</div>
            ) : null}
          </div>
          <GeocomptaRelatedSection
            relatedPages={page.relatedPages}
            relatedRealisations={page.relatedRealisations}
            relatedAdvice={page.relatedAdvice}
          />
        </div>
      </article>
    </>
  );
}
