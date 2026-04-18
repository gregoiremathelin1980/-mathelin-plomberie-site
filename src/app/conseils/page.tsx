import { Lightbulb } from "lucide-react";
import ConseilsList from "@/components/ConseilsList";
import { getConseils } from "@/lib/content";
import { getAdviceImage } from "@/lib/getAdviceImage";
import { buildPageMetadata } from "@/lib/seo/metaBuilder";

export const metadata = buildPageMetadata({
  title: "Conseils plomberie & chauffage | Mathelin Plomberie Chauffage",
  description:
    "Conseils d'entretien et bonnes pratiques. Privilégier la maintenance et la réparation avant le remplacement. Pérouges, Meximieux, Ambérieu, Lagnieu.",
  path: "/conseils",
});

export default async function ConseilsPage() {
  const conseils = getConseils();
  const posts = conseils.map((c) => ({
    id: c.slug,
    title: c.title,
    excerpt: c.excerpt,
    city: c.city,
    date: c.date,
    slug: c.slug,
    category: c.category,
    image: getAdviceImage(c.slug),
  }));

  return (
    <div className="px-4 py-16 sm:px-6">
      <div className="mx-auto max-w-6xl">
        <div className="mb-12 flex items-center gap-3">
          <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
            <Lightbulb className="h-7 w-7" />
          </span>
          <div>
            <h1 className="font-heading text-3xl font-bold text-primary">
              Conseils
            </h1>
            <p className="mt-1 text-gray-text">
              Entretien et bonnes pratiques pour éviter pannes et remplacements inutiles.
            </p>
          </div>
        </div>
        <ConseilsList posts={posts} standalone />
      </div>
    </div>
  );
}
