import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { ConseilsItem } from "@/lib/content";
import { getAdviceImage, getAdviceImageAlt } from "@/lib/getAdviceImage";
import BlogCard from "./BlogCard";

interface AdvicePreviewProps {
  conseils: ConseilsItem[];
}

export default function AdvicePreview({ conseils }: AdvicePreviewProps) {
  if (!conseils?.length) {
    return (
      <section className="bg-gray-50 px-4 py-16 sm:px-6">
        <div className="mx-auto max-w-6xl">
          <h2 className="font-heading text-2xl font-bold text-primary sm:text-3xl">
            Conseils
          </h2>
          <p className="mt-4 text-gray-text">Aucun conseil pour le moment.</p>
        </div>
      </section>
    );
  }

  const posts = conseils.map((c) => ({
    id: c.slug,
    title: c.title,
    excerpt: c.excerpt,
    city: c.city,
    date: c.date,
    slug: c.slug,
    category: c.category,
    image: getAdviceImage(c.slug),
    imageAlt: getAdviceImageAlt(c.slug, c.title),
  }));

  return (
    <section className="bg-gray-50 px-4 py-16 sm:px-6">
      <div className="mx-auto max-w-6xl">
        <h2 className="font-heading text-2xl font-bold text-primary sm:text-3xl">
          Conseils
        </h2>
        <p className="mt-2 text-gray-text">
          Entretien et bonnes pratiques pour éviter pannes et remplacements inutiles.
        </p>
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {posts.map((post) => (
            <BlogCard key={post.id} post={post} baseHref="/conseils" />
          ))}
        </div>
        <div className="mt-8 flex justify-center">
          <Link
            href="/conseils"
            className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:underline"
          >
            Voir tous les conseils
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
