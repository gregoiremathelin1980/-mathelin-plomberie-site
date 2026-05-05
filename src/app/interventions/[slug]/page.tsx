import { notFound } from "next/navigation";
import Link from "next/link";
import { Phone, MapPin, CheckCircle2, Wrench } from "lucide-react";
import { getSiteSettings } from "@/lib/content";
import { buttonVariants } from "@/components/ui/button";
import { buildPageMetadata } from "@/lib/seo/metaBuilder";
import BreadcrumbSchema from "@/components/BreadcrumbSchema";
import { INTERVENTIONS } from "@/lib/interventions-data";
import { phoneToTelHref } from "@/lib/satelliteLandings";

export function generateStaticParams() {
  return INTERVENTIONS.map((i) => ({ slug: i.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const page = INTERVENTIONS.find((i) => i.slug === slug);
  if (!page) return {};
  return buildPageMetadata({
    title: page.title,
    description: page.metaDescription,
    path: `/interventions/${page.slug}`,
  });
}

export default async function InterventionPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const page = INTERVENTIONS.find((i) => i.slug === slug);
  if (!page) notFound();

  const settings = getSiteSettings();
  const telHref = phoneToTelHref(settings.phone);

  return (
    <>
      <BreadcrumbSchema
        items={[
          { name: "Accueil", path: "/" },
          { name: "Interventions", path: "/zones-intervention" },
          { name: page.title, path: `/interventions/${page.slug}` },
        ]}
      />

      <section className="bg-primary px-4 py-10 text-white sm:px-6 sm:py-12">
        <div className="mx-auto max-w-2xl text-center">
          <p className="mb-2 flex items-center justify-center gap-1 text-sm text-white/70">
            <MapPin className="h-4 w-4" aria-hidden />
            {page.ville} — {page.quartier}
          </p>
          <h1 className="font-heading text-2xl font-bold leading-tight sm:text-3xl">
            {page.h1}
          </h1>
          <p className="mt-2 text-sm text-white/70">
            Intervention du {new Date(page.date).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" })}
          </p>
        </div>
      </section>

      <main className="px-4 py-10 sm:px-6 sm:py-12">
        <article className="mx-auto max-w-2xl space-y-8">

          <section>
            <h2 className="flex items-center gap-2 text-lg font-semibold text-gray-900">
              <Wrench className="h-5 w-5 text-primary" aria-hidden />
              Le problème
            </h2>
            <p className="mt-3 leading-relaxed text-gray-text">{page.probleme}</p>
          </section>

          <section>
            <h2 className="flex items-center gap-2 text-lg font-semibold text-gray-900">
              <Wrench className="h-5 w-5 text-primary" aria-hidden />
              Notre intervention
            </h2>
            <p className="mt-3 leading-relaxed text-gray-text">{page.action}</p>
          </section>

          <section className="rounded-xl border-2 border-green-200 bg-green-50 p-6">
            <h2 className="flex items-center gap-2 text-lg font-semibold text-green-800">
              <CheckCircle2 className="h-5 w-5" aria-hidden />
              Résultat
            </h2>
            <p className="mt-2 leading-relaxed text-green-900">{page.resultat}</p>
          </section>

          <section className="rounded-xl border-2 border-accent/30 bg-accent/5 p-6 text-center">
            <p className="font-semibold text-accent">
              Un problème similaire ? Appelez votre plombier local.
            </p>
            <div className="mt-4 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
              <a
                href={telHref}
                className={buttonVariants({ variant: "accent", className: "inline-flex items-center gap-2" })}
              >
                <Phone className="h-5 w-5" aria-hidden />
                Appeler {settings.phone}
              </a>
              <Link href="/contact" className={buttonVariants({ variant: "outline" })}>
                Demander un devis
              </Link>
            </div>
          </section>

          <nav className="text-center text-sm text-gray-500">
            <Link href="/zones-intervention" className="underline-offset-2 hover:text-primary hover:underline">
              ← Voir toutes les zones d&apos;intervention
            </Link>
          </nav>
        </article>
      </main>
    </>
  );
}
