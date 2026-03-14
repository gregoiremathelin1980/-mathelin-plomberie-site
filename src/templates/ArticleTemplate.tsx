import Link from "next/link";
import Image from "next/image";
import { ArrowLeft } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { formatDateFR } from "@/lib/date";
import RandomConseilImage from "@/components/RandomConseilImage";
import LocalProofBlock from "@/components/LocalProofBlock";
import type { RecentInterventionEntry } from "@/lib/site-data";

interface ArticleTemplateProps {
  title: string;
  date?: string;
  city?: string;
  children: React.ReactNode;
  backHref?: string;
  backLabel?: string;
  /** Single image URL (conseils: from getAdviceImage). When set, used instead of imageCandidates. */
  imageUrl?: string;
  imageAlt?: string;
  /** Legacy: local image candidates, one shown at random. */
  imageCandidates?: string[];
  imageFallback?: string;
  /** Interventions récentes (preuve locale) */
  recentInterventions?: RecentInterventionEntry[];
}

export default function ArticleTemplate({
  title,
  date,
  city,
  children,
  backHref = "/blog",
  backLabel = "Retour au blog",
  imageUrl,
  imageAlt,
  imageCandidates = [],
  imageFallback,
  recentInterventions = [],
}: ArticleTemplateProps) {
  const showSingleImage = imageUrl && imageUrl.length > 0;
  const showRandomImage = !showSingleImage && (imageCandidates.length > 0 || imageFallback);

  return (
    <article className="px-4 py-16 sm:px-6">
      <div className="mx-auto max-w-3xl">
        <Link
          href={backHref}
          className="mb-8 inline-flex items-center gap-2 text-sm font-medium text-primary hover:underline"
        >
          <ArrowLeft className="h-4 w-4" />
          {backLabel}
        </Link>
        {showSingleImage && (
          <div className="relative mb-8 aspect-video w-full overflow-hidden rounded-2xl bg-gray-100">
            <Image
              src={imageUrl}
              alt={imageAlt ?? title}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 672px"
            />
          </div>
        )}
        {showRandomImage && (
          <div className="relative mb-8 aspect-video w-full overflow-hidden rounded-2xl bg-gray-100">
            <RandomConseilImage
              imageCandidates={imageCandidates}
              fallbackUrl={imageFallback}
              alt={imageAlt ?? title}
            />
          </div>
        )}
        <header>
          <h1 className="font-heading text-3xl font-bold text-primary sm:text-4xl">
            {title}
          </h1>
          {(date || city) && (
            <p className="mt-2 text-sm text-gray-text">
              {[date ? formatDateFR(date) : "", city].filter(Boolean).join(" · ")}
            </p>
          )}
        </header>
        <div className="prose prose-gray mt-8 max-w-none">{children}</div>
        {recentInterventions.length > 0 && (
          <div className="mt-10">
            <LocalProofBlock interventions={recentInterventions} />
          </div>
        )}
        <div className="mt-10">
          <Link
            href="/contact"
            className={cn(buttonVariants({ variant: "accent" }))}
          >
            Demander un devis
          </Link>
        </div>
      </div>
    </article>
  );
}
