import Link from "next/link";
import { ArrowLeft, Phone, AlertCircle, MapPin, FileText, Lightbulb, HelpCircle } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import ProjectCard from "@/components/ProjectCard";
import LocalProofBlock from "@/components/LocalProofBlock";
import { getPhotoUrl } from "@/lib/config";
import type { RealisationItem } from "@/lib/content";
import type { RecentInterventionEntry } from "@/lib/site-data";

interface ServiceTemplateProps {
  title: string;
  description: string;
  problems: string[];
  intervention: string;
  priceEntries: { label: string; min: number; max: number }[];
  cities: string[];
  realisations: RealisationItem[];
  conseils: { slug: string; title: string }[];
  faq: { question: string; answer: string }[];
  phone: string;
  recentInterventions?: RecentInterventionEntry[];
  children?: React.ReactNode;
}

export default function ServiceTemplate({
  title,
  description,
  problems,
  intervention,
  priceEntries,
  cities,
  realisations,
  conseils,
  faq,
  phone,
  recentInterventions = [],
  children,
}: ServiceTemplateProps) {
  return (
    <div className="px-4 py-16 sm:px-6">
      <div className="mx-auto max-w-4xl">
        <Link
          href="/services"
          className="mb-8 inline-flex items-center gap-2 text-sm font-medium text-primary hover:underline"
        >
          <ArrowLeft className="h-4 w-4" />
          Retour aux services
        </Link>

        {/* Hero */}
        <section className="mb-14">
          <h1 className="font-heading text-3xl font-bold text-primary sm:text-4xl">
            {title}
          </h1>
          <p className="mt-3 text-lg text-gray-text">
            {description}
          </p>
          <p className="mt-2 text-sm text-gray-500">
            Intervention dans un rayon de 15 km autour de Pérouges : {cities.slice(0, 4).join(", ")}…
          </p>
        </section>

        {/* Problems */}
        {problems.length > 0 && (
          <section className="mb-14">
            <h2 className="font-heading text-xl font-semibold text-primary">
              Problèmes fréquents
            </h2>
            <p className="mt-1 text-gray-text">
              Vous rencontrez l&apos;un de ces cas ?
            </p>
            <ul className="mt-4 list-inside list-disc space-y-2 text-gray-700">
              {problems.map((p) => (
                <li key={p}>{p}</li>
              ))}
            </ul>
          </section>
        )}

        {/* Intervention */}
        <section className="mb-14">
          <h2 className="font-heading text-xl font-semibold text-primary">
            Notre intervention
          </h2>
          <div className="mt-4 rounded-xl bg-gray-50 p-6 text-gray-700">
            {intervention}
          </div>
        </section>

        {/* Price estimation */}
        {priceEntries.length > 0 && (
          <section className="mb-14">
            <h2 className="font-heading text-xl font-semibold text-primary">
              Fourchettes de prix indicatives
            </h2>
            <div className="mt-4 space-y-3">
              {priceEntries.map((entry) => (
                <div
                  key={entry.label}
                  className="flex flex-wrap items-baseline justify-between gap-2 rounded-lg border border-gray-200 bg-white px-4 py-3"
                >
                  <span className="font-medium text-gray-800">{entry.label}</span>
                  <span className="font-semibold text-primary">
                    {entry.min}€ – {entry.max}€
                  </span>
                </div>
              ))}
            </div>
            <div className="mt-4 flex gap-2 text-sm text-gray-600">
              <AlertCircle className="h-5 w-5 shrink-0" />
              <p>Le prix exact dépend du diagnostic sur place.</p>
            </div>
          </section>
        )}

        {/* Service area */}
        <section className="mb-14">
          <h2 className="font-heading text-xl font-semibold text-primary flex items-center gap-2">
            <MapPin className="h-5 w-5" />
            Zone d&apos;intervention
          </h2>
          <p className="mt-2 text-gray-text">
            Nous intervenons à : {cities.join(", ")}.
          </p>
        </section>

        {/* Preuve locale (interventions récentes autour de vous) */}
        {recentInterventions.length > 0 && (
          <LocalProofBlock interventions={recentInterventions} />
        )}

        {/* Recent interventions */}
        {realisations.length > 0 && (
          <section className="mb-14">
            <h2 className="font-heading text-xl font-semibold text-primary flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Interventions récentes
            </h2>
            <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {realisations.slice(0, 6).map((r) => (
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

        {/* Advice links */}
        {conseils.length > 0 && (
          <section className="mb-14">
            <h2 className="font-heading text-xl font-semibold text-primary flex items-center gap-2">
              <Lightbulb className="h-5 w-5" />
              Conseils utiles
            </h2>
            <ul className="mt-4 space-y-2">
              {conseils.slice(0, 6).map((c) => (
                <li key={c.slug}>
                  <Link
                    href={`/conseils/${c.slug}`}
                    className="text-primary hover:underline font-medium"
                  >
                    {c.title}
                  </Link>
                </li>
              ))}
            </ul>
            <p className="mt-4">
              <Link href="/conseils" className={cn(buttonVariants({ variant: "outline" }))}>
                Voir tous les conseils
              </Link>
            </p>
          </section>
        )}

        {/* FAQ */}
        {faq.length > 0 && (
          <section className="mb-14">
            <h2 className="font-heading text-xl font-semibold text-primary flex items-center gap-2">
              <HelpCircle className="h-5 w-5" />
              Questions fréquentes
            </h2>
            <div className="mt-6 space-y-4">
              {faq.map((item) => (
                <Card key={item.question}>
                  <CardHeader className="pb-2">
                    <h3 className="font-semibold text-gray-900">{item.question}</h3>
                  </CardHeader>
                  <CardContent className="pt-0 text-gray-600">
                    {item.answer}
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>
        )}

        {/* CTA */}
        <Card className="border-primary/20 bg-primary/5">
          <CardContent className="pt-6">
            <p className="font-medium text-primary">
              Besoin de ce service ? Appelez-nous ou demandez un devis.
            </p>
            <div className="mt-4 flex flex-wrap gap-3">
              <a
                href={`tel:${phone.replace(/\s/g, "")}`}
                className={cn(buttonVariants({ variant: "accent" }), "inline-flex items-center gap-2")}
              >
                <Phone className="h-4 w-4" />
                Appeler maintenant
              </a>
              <Link href="/devis" className={cn(buttonVariants({ variant: "outline" }))}>
                Estimer une intervention
              </Link>
              <Link href="/contact" className={cn(buttonVariants({ variant: "outline" }))}>
                Nous contacter
              </Link>
            </div>
          </CardContent>
        </Card>

        {children}
      </div>
    </div>
  );
}
