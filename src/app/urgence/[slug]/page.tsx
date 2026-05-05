import { notFound } from "next/navigation";
import Link from "next/link";
import { Phone, AlertTriangle } from "lucide-react";
import { getSiteSettings } from "@/lib/content";
import { buttonVariants } from "@/components/ui/button";
import { buildPageMetadata } from "@/lib/seo/metaBuilder";
import FAQSchema from "@/components/FAQSchema";
import BreadcrumbSchema from "@/components/BreadcrumbSchema";
import RelatedLocalLinks from "@/components/RelatedLocalLinks";
import { URGENCE_PAGES } from "@/lib/urgence-pages-data";
import { phoneToTelHref } from "@/lib/satelliteLandings";

function getRelatedLinks(currentSlug: string) {
  const isMeximieux = currentSlug.includes("meximieux");
  return {
    villesProches: isMeximieux
      ? [
          { href: "/plombier-meximieux", label: "Plombier à Meximieux" },
          { href: "/plombier-amberieu", label: "Plombier à Ambérieu" },
          { href: "/zones-intervention", label: "Toutes les villes" },
        ]
      : [
          { href: "/plombier-amberieu", label: "Plombier à Ambérieu" },
          { href: "/plombier-meximieux", label: "Plombier à Meximieux" },
          { href: "/zones-intervention", label: "Toutes les villes" },
        ],
    problemesFrequents: URGENCE_PAGES
      .filter((p) => p.slug !== currentSlug)
      .slice(0, 2)
      .map((p) => ({ href: `/urgence/${p.slug}`, label: p.title })),
    urgence: { href: "/urgence-depannage", label: "Toutes les urgences plomberie" },
  };
}

export function generateStaticParams() {
  return URGENCE_PAGES.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const page = URGENCE_PAGES.find((p) => p.slug === slug);
  if (!page) return {};
  return buildPageMetadata({
    title: page.title,
    description: page.metaDescription,
    path: `/urgence/${page.slug}`,
  });
}

export default async function UrgencePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const page = URGENCE_PAGES.find((p) => p.slug === slug);
  if (!page) notFound();

  const settings = getSiteSettings();
  const telHref = phoneToTelHref(settings.phone);

  const related = getRelatedLinks(slug);

  return (
    <>
      <FAQSchema faq={page.faq} />
      <BreadcrumbSchema items={[
        { name: "Accueil", path: "/" },
        { name: "Urgences", path: "/urgence-depannage" },
        { name: page.title, path: `/urgence/${page.slug}` },
      ]} />

      <section className="bg-primary px-4 py-10 text-white sm:px-6 sm:py-12">
        <div className="mx-auto max-w-2xl text-center">
          <h1 className="font-heading text-2xl font-bold leading-tight sm:text-3xl md:text-4xl">
            {page.h1}
          </h1>
          <p className="mx-auto mt-4 max-w-lg text-white/90">{page.cta}</p>
          <a
            href={telHref}
            className={buttonVariants({
              variant: "accent",
              size: "lg",
              className:
                "mt-6 inline-flex min-h-[52px] min-w-[220px] items-center justify-center gap-2 bg-accent px-10 py-4 text-lg font-semibold text-white shadow-lg ring-2 ring-white/40 hover:bg-accent/90",
            })}
          >
            <Phone className="h-6 w-6" aria-hidden />
            Appeler maintenant
          </a>
        </div>
      </section>

      <main className="px-4 py-10 sm:px-6 sm:py-12">
        <article className="mx-auto max-w-2xl space-y-10">

          <section>
            <p className="leading-relaxed text-gray-text">{page.intro}</p>
          </section>

          <section>
            <h2 className="flex items-center gap-2 text-lg font-semibold text-red-600">
              <AlertTriangle className="h-5 w-5" aria-hidden />
              Risques si vous n&apos;intervenez pas
            </h2>
            <ul className="mt-3 space-y-2 text-gray-text">
              {page.risques.map((r) => (
                <li key={r} className="flex gap-2">
                  <span className="mt-0.5 shrink-0 text-red-500">•</span>
                  <span>{r}</span>
                </li>
              ))}
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-primary">Notre solution</h2>
            <p className="mt-3 leading-relaxed text-gray-text">{page.solution}</p>
          </section>

          <section className="rounded-xl border-2 border-accent/30 bg-accent/5 p-6 text-center">
            <p className="font-semibold text-accent">{page.cta}</p>
            <a href={telHref} className={buttonVariants({ variant: "accent", className: "mt-4 inline-flex items-center gap-2" })}>
              <Phone className="h-5 w-5" aria-hidden />
              Appeler {settings.phone}
            </a>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-primary">Questions fréquentes</h2>
            <dl className="mt-4 space-y-4">
              {page.faq.map((f) => (
                <div key={f.question} className="rounded-lg border p-4">
                  <dt className="font-semibold text-gray-900">{f.question}</dt>
                  <dd className="mt-2 text-sm leading-relaxed text-gray-text">{f.answer}</dd>
                </div>
              ))}
            </dl>
          </section>

          <div className="text-center">
            <p className="mb-4 text-sm text-gray-text">
              Grégoire Mathelin — artisan plombier-chauffagiste diplômé (BP Génie Climatique), basé à Pérouges (01800).
            </p>
            <div className="flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
              <a href={telHref} className={buttonVariants({ variant: "accent" })}>
                <Phone className="mr-2 h-4 w-4" aria-hidden />
                Appeler
              </a>
              <Link href="/contact" className={buttonVariants({ variant: "outline" })}>
                Demander un devis
              </Link>
            </div>
          </div>
        </article>
      </main>

      <RelatedLocalLinks
        villesProches={related.villesProches}
        problemesFrequents={related.problemesFrequents}
        urgence={related.urgence}
      />
    </>
  );
}
