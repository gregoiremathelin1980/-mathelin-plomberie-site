import { notFound } from "next/navigation";
import { getConseilBySlug, getConseils } from "@/lib/content";
import { getRecentInterventions } from "@/lib/site-data";
import { getAdviceImage, getAdviceImageAlt } from "@/lib/getAdviceImage";
import ArticleTemplate from "@/templates/ArticleTemplate";

export function generateStaticParams() {
  const conseils = getConseils();
  return conseils.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const conseil = await getConseilBySlug(slug);
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
  const conseil = await getConseilBySlug(slug);
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
