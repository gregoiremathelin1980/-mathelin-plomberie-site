import { BookOpen } from "lucide-react";
import BlogList from "@/components/BlogList";
import { getBlogPosts } from "@/lib/content";
import { buildPageMetadata } from "@/lib/seo/metaBuilder";

export const metadata = buildPageMetadata({
  title: "Blog | Mathelin Plomberie Chauffage",
  description:
    "Conseils plomberie, chauffage et actualités. Artisan local à Pérouges, Meximieux, Ambérieu, Lagnieu.",
  path: "/blog",
});

export default function BlogPage() {
  const posts = getBlogPosts();
  const postsWithId = posts.map((p) => ({
    id: p.slug,
    title: p.title,
    excerpt: p.excerpt,
    city: p.city,
    date: p.date,
    slug: p.slug,
  }));

  return (
    <div className="px-4 py-16 sm:px-6">
      <div className="mx-auto max-w-6xl">
        <div className="mb-12 flex items-center gap-3">
          <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
            <BookOpen className="h-7 w-7" />
          </span>
          <div>
            <h1 className="font-heading text-3xl font-bold text-primary">
              Actualités & conseils
            </h1>
            <p className="mt-1 text-gray-text">
              Conseils plomberie, chauffage et actualités de votre artisan local.
            </p>
          </div>
        </div>
        <BlogList posts={postsWithId} standalone />
      </div>
    </div>
  );
}
