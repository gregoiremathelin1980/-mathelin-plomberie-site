import { notFound } from "next/navigation";
import { getBlogPostBySlug, getBlogPosts } from "@/lib/content";
import { getRecentInterventions } from "@/lib/site-data";
import ArticleTemplate from "@/templates/ArticleTemplate";
import { buildPageMetadata } from "@/lib/seo/metaBuilder";

export function generateStaticParams() {
  const posts = getBlogPosts();
  return posts.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await getBlogPostBySlug(slug);
  if (!post) return {};
  return buildPageMetadata({
    title: post.title,
    description: post.excerpt ?? post.title,
    path: `/blog/${slug}`,
    type: "article",
  });
}

export default async function BlogArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await getBlogPostBySlug(slug);
  if (!post) notFound();
  const recentInterventions = getRecentInterventions();

  return (
    <ArticleTemplate
      title={post.title}
      date={post.date}
      city={post.city}
      recentInterventions={recentInterventions}
    >
      {post.content ? (
        <div className="whitespace-pre-wrap text-gray-text">{post.content}</div>
      ) : null}
    </ArticleTemplate>
  );
}
