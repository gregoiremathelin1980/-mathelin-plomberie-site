import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Wrench, MapPin, Lightbulb } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { getSeoImageAlt } from "@/lib/seoImage";
import LocalProofBlock from "@/components/LocalProofBlock";
import type { RecentInterventionEntry } from "@/lib/site-data";

interface RealisationTemplateProps {
  title: string;
  city?: string;
  image?: string;
  images?: string[];
  /** Afficher les photos chantiers (réglage admin). Si false, les images ne sont pas rendues. */
  showChantierPhotos?: boolean;
  description?: string;
  serviceExplanation?: string;
  /** Liens vers conseils plomberie */
  conseils?: { slug: string; title: string }[];
  /** Slug du service pour lien interne */
  serviceSlug?: string;
  serviceTitle?: string;
  /** Interventions récentes (preuve locale) */
  recentInterventions?: RecentInterventionEntry[];
}

export default function RealisationTemplate({
  title,
  city,
  image,
  images,
  showChantierPhotos = true,
  description,
  serviceExplanation,
  conseils = [],
  serviceSlug,
  serviceTitle,
  recentInterventions = [],
}: RealisationTemplateProps) {
  const allImages = image ? [image, ...(images ?? [])] : images ?? [];
  const shouldShowImages = showChantierPhotos && allImages.length > 0;

  return (
    <article className="px-4 py-16 sm:px-6">
      <div className="mx-auto max-w-3xl">
        <Link
          href="/realisations"
          className="mb-8 inline-flex items-center gap-2 text-sm font-medium text-primary hover:underline"
        >
          <ArrowLeft className="h-4 w-4" />
          Retour aux réalisations
        </Link>
        <h1 className="font-heading text-3xl font-bold text-primary sm:text-4xl">
          {title}
        </h1>
        {city && (
          <p className="mt-2 text-gray-text">{city}</p>
        )}
        {shouldShowImages && (
          <div className="mt-6 space-y-4">
            {allImages.slice(0, 3).map((src, i) => (
              <div
                key={i}
                className="relative aspect-video w-full overflow-hidden rounded-2xl bg-gray-100"
              >
                <Image
                  src={src}
                  alt={getSeoImageAlt(title, city)}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 672px"
                />
              </div>
            ))}
          </div>
        )}
        {description && (
          <div className="mt-8">
            <h2 className="font-heading text-lg font-semibold text-primary">
              Intervention
            </h2>
            <p className="mt-2 text-gray-text">{description}</p>
          </div>
        )}
        {serviceExplanation && (
          <div className="mt-6">
            <h2 className="font-heading text-lg font-semibold text-primary">
              Prestation
            </h2>
            <p className="mt-2 text-gray-text">{serviceExplanation}</p>
          </div>
        )}

        {/* Liens internes : service, ville, conseils */}
        <div className="mt-8 flex flex-wrap gap-4 text-sm">
          {serviceSlug && (
            <Link
              href={`/services/${serviceSlug}`}
              className="inline-flex items-center gap-1.5 font-medium text-primary hover:underline"
            >
              <Wrench className="h-4 w-4" />
              {serviceTitle ?? "Voir ce service"}
            </Link>
          )}
          {city && (
            <Link
              href="/realisations"
              className="inline-flex items-center gap-1.5 font-medium text-primary hover:underline"
            >
              <MapPin className="h-4 w-4" />
              Interventions à {city}
            </Link>
          )}
        </div>
        {conseils.length > 0 && (
          <div className="mt-6">
            <h2 className="font-heading text-lg font-semibold text-primary flex items-center gap-2">
              <Lightbulb className="h-5 w-5" />
              Conseils plomberie
            </h2>
            <ul className="mt-2 space-y-1">
              {conseils.map((c) => (
                <li key={c.slug}>
                  <Link href={`/conseils/${c.slug}`} className="text-primary hover:underline">
                    {c.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        )}

        {recentInterventions.length > 0 && (
          <div className="mt-10">
            <LocalProofBlock interventions={recentInterventions} />
          </div>
        )}

        <p className="mt-10 text-sm font-medium text-primary">
          Artisan plombier-chauffagiste diplômé (BP Génie Climatique) à votre service depuis 2013.
        </p>

        <Card className="mt-6">
          <CardContent className="pt-6">
            <p className="font-medium text-primary">
              Un projet similaire ? Demandez une estimation ou contactez-nous.
            </p>
            <div className="mt-4 flex flex-wrap gap-3">
              <Link
                href="/devis"
                className={cn(buttonVariants({ variant: "accent" }))}
              >
                Estimer une intervention
              </Link>
              <Link
                href="/contact"
                className={cn(buttonVariants({ variant: "outline" }))}
              >
                Nous contacter
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </article>
  );
}
