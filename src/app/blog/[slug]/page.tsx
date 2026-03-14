import { notFound } from "next/navigation";
import { getBlogPostBySlug, getBlogPosts } from "@/lib/content";
import { getRecentInterventions } from "@/lib/site-data";
import ArticleTemplate from "@/templates/ArticleTemplate";

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
  return {
    title: `${post.title} | Mathelin Plomberie Chauffage`,
    description: post.excerpt ?? post.title,
  };
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
