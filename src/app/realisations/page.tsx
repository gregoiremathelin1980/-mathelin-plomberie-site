import { FolderOpen } from "lucide-react";
import ProjectGallery from "@/components/ProjectGallery";
import { getRealisations } from "@/lib/content";
import { getRealisationsFromSiteData } from "@/lib/site-data";
import { getPhotoUrl } from "@/lib/config";

export const metadata = {
  title: "Réalisations | Mathelin Plomberie Chauffage",
  description:
    "Découvrez nos réalisations en plomberie et chauffage à Pérouges, Meximieux, Ambérieu, Lagnieu.",
};

function toGalleryItem(r: { slug: string; title: string; city?: string; description?: string; images?: string[] }) {
  return {
    id: r.slug,
    slug: r.slug,
    title: r.title,
    city: r.city,
    image: getPhotoUrl(r.images?.[0]),
    description: r.description,
  };
}

export default function RealisationsPage() {
  const fromSiteData = getRealisationsFromSiteData();
  const fromContent = getRealisations();
  const bySlug = new Map(fromContent.map((r) => [r.slug, toGalleryItem(r)]));
  fromSiteData.forEach((r) => bySlug.set(r.slug, toGalleryItem(r)));
  const realisations = Array.from(bySlug.values());

  return (
    <div className="px-4 py-16 sm:px-6">
      <div className="mx-auto max-w-6xl">
        <div className="mb-12 flex items-center gap-3">
          <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
            <FolderOpen className="h-7 w-7" />
          </span>
          <div>
            <h1 className="font-heading text-3xl font-bold text-primary">
              Nos réalisations
            </h1>
            <p className="mt-1 text-gray-text">
              Découvrez quelques-unes de nos interventions en plomberie et chauffage.
            </p>
          </div>
        </div>
        <ProjectGallery realisations={realisations} standalone />
      </div>
    </div>
  );
}
