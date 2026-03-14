import Link from "next/link";
import { ArrowLeft, Phone } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import ProjectCard from "@/components/ProjectCard";
import LocalProofBlock from "@/components/LocalProofBlock";
import { getPhotoUrl } from "@/lib/config";
import type { DepannageItem } from "@/lib/site-data";
import type { RecentInterventionEntry } from "@/lib/site-data";
import type { RealisationItem } from "@/lib/content";

interface DepannageTemplateProps {
  depannage: DepannageItem;
  realisations: RealisationItem[];
  recentInterventions: RecentInterventionEntry[];
  phone: string;
}

export default function DepannageTemplate({
  depannage,
  realisations,
  recentInterventions,
  phone,
}: DepannageTemplateProps) {
  const phoneRaw = phone.replace(/\s/g, "");

  return (
    <article className="px-4 py-16 sm:px-6">
      <div className="mx-auto max-w-3xl">
        <Link
          href="/depannage"
          className="mb-8 inline-flex items-center gap-2 text-sm font-medium text-primary hover:underline"
        >
          <ArrowLeft className="h-4 w-4" />
          Retour au dépannage
        </Link>

        <h1 className="font-heading text-3xl font-bold text-primary sm:text-4xl">
          {depannage.title}
        </h1>
        {depannage.city && (
          <p className="mt-2 text-gray-text">{depannage.city}</p>
        )}

        {depannage.content && (
          <div className="mt-8">
            <h2 className="font-heading text-lg font-semibold text-primary">
              Explication du problème
            </h2>
            <div className="mt-2 text-gray-700 whitespace-pre-line">
              {depannage.content}
            </div>
          </div>
        )}

        {depannage.intervention && (
          <div className="mt-8">
            <h2 className="font-heading text-lg font-semibold text-primary">
              Intervention typique
            </h2>
            <div className="mt-2 text-gray-700 whitespace-pre-line">
              {depannage.intervention}
            </div>
          </div>
        )}

        {realisations.length > 0 && (
          <section className="mt-10">
            <h2 className="font-heading text-xl font-semibold text-primary">
              Réalisations liées
            </h2>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              {realisations.slice(0, 4).map((r) => (
                <ProjectCard
                  key={r.slug}
                  project={{
                    id: r.slug,
                    slug: r.slug,
                    title: r.title,
                    city: r.city,
                    image: getPhotoUrl(r.images?.[0]),
                    description: r.description,
                  }}
                />
              ))}
            </div>
            <p className="mt-4">
              <Link href="/realisations" className={cn(buttonVariants({ variant: "outline" }))}>
                Voir toutes les réalisations
              </Link>
            </p>
          </section>
        )}

        <LocalProofBlock interventions={recentInterventions} />

        <Card className="mt-10 border-primary/20 bg-primary/5">
          <CardContent className="pt-6">
            <p className="font-medium text-primary">
              Besoin d&apos;une intervention rapide ?
            </p>
            <div className="mt-4 flex flex-wrap gap-3">
              <a
                href={`tel:${phoneRaw}`}
                className={cn(buttonVariants({ variant: "accent" }), "inline-flex items-center gap-2")}
              >
                <Phone className="h-4 w-4" />
                Appeler maintenant
              </a>
              <Link href="/devis" className={cn(buttonVariants({ variant: "outline" }))}>
                Demander un devis
              </Link>
              <Link href="/contact" className={cn(buttonVariants({ variant: "outline" }))}>
                Nous contacter
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </article>
  );
}
