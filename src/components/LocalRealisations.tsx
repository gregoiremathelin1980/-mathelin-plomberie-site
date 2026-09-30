import Image from "next/image";
import Link from "next/link";
import type { RealisationItem } from "@/lib/content";
import { MAIN_SITE_URL, getPhotoUrl } from "@/lib/config";
import { getSeoImageAlt } from "@/lib/seoImage";

interface LocalRealisationsProps {
  title: string;
  items: RealisationItem[];
}

/** Réalisations du site principal affichées sur une page locale (liens absolus : valable aussi sur les satellites). */
export default function LocalRealisations({ title, items }: LocalRealisationsProps) {
  if (items.length === 0) return null;
  return (
    <section>
      <h2 className="text-xl font-semibold text-primary">{title}</h2>
      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        {items.map((r) => {
          const src = getPhotoUrl(r.images?.[0]);
          return (
            <Link
              key={r.slug}
              href={`${MAIN_SITE_URL}/realisations/${r.slug}`}
              className="overflow-hidden rounded-lg border transition hover:shadow-md"
            >
              {src ? (
                <div className="relative aspect-[4/3] w-full bg-gray-100">
                  <Image
                    src={src}
                    alt={getSeoImageAlt(r.title, r.city)}
                    fill
                    className="object-cover"
                    sizes="(max-width: 640px) 100vw, 320px"
                  />
                </div>
              ) : null}
              <div className="p-4">
                <h3 className="font-semibold text-gray-900">{r.title}</h3>
                {r.city ? <p className="mt-1 text-sm text-gray-text">{r.city}</p> : null}
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
