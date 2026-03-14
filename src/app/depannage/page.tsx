import Link from "next/link";
import { Wrench } from "lucide-react";
import { getDepannageSlugs, getDepannageBySlug } from "@/lib/site-data";

export const metadata = {
  title: "Dépannage plomberie | Mathelin Plomberie Chauffage",
  description:
    "Pages dépannage par problème et ville. Fuite chauffe-eau, débouchage, réparation. Pérouges, Meximieux, Ambérieu, Lagnieu.",
};

export default function DepannageListPage() {
  const slugs = getDepannageSlugs();
  const items = slugs
    .map((slug) => getDepannageBySlug(slug))
    .filter(Boolean)
    .map((d) => ({ slug: d!.slug, title: d!.title, city: d!.city }));

  return (
    <div className="px-4 py-16 sm:px-6">
      <div className="mx-auto max-w-3xl">
        <div className="mb-12 flex items-center gap-3">
          <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
            <Wrench className="h-7 w-7" />
          </span>
          <div>
            <h1 className="font-heading text-3xl font-bold text-primary">
              Dépannage par problème et ville
            </h1>
            <p className="mt-1 text-gray-text">
              Explications et interventions typiques pour chaque type de dépannage.
            </p>
          </div>
        </div>
        {items.length === 0 ? (
          <p className="text-gray-text">Aucune page dépannage pour le moment.</p>
        ) : (
          <ul className="space-y-2">
            {items.map((item) => (
              <li key={item.slug}>
                <Link
                  href={`/depannage/${item.slug}`}
                  className="block rounded-xl border border-gray-200 bg-white px-4 py-3 font-medium text-primary transition hover:border-primary/30 hover:bg-primary/5"
                >
                  {item.title}
                  {item.city && (
                    <span className="ml-2 text-sm font-normal text-gray-text">
                      — {item.city}
                    </span>
                  )}
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
