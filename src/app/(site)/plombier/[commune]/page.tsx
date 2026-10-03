import { notFound } from "next/navigation";
import Link from "next/link";
import { Phone, FileText, Clock, MapPin, Shield } from "lucide-react";
import { getSiteSettings } from "@/lib/content";
import { buttonVariants } from "@/components/ui/button";
import { buildPageMetadata } from "@/lib/seo/metaBuilder";
import FAQSchema from "@/components/FAQSchema";
import BreadcrumbSchema from "@/components/BreadcrumbSchema";
import RelatedLocalLinks from "@/components/RelatedLocalLinks";
import LocalRealisations from "@/components/LocalRealisations";
import { COMMUNES, getCommuneBySlug, getRealisationsForCities } from "@/lib/communes";
import { URGENCE_PAGES } from "@/lib/urgence-pages-data";
import { phoneToTelHref } from "@/lib/satelliteLandings";
import { MAIN_SITE_URL } from "@/lib/config";

const MEXIMIEUX_URL = "https://www.plombier-meximieux.fr";
const AMBERIEU_URL = "https://www.plombier-amberieu.fr";

export function generateStaticParams() {
  return COMMUNES.map((c) => ({ commune: c.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ commune: string }> }) {
  const { commune: slug } = await params;
  const commune = getCommuneBySlug(slug);
  if (!commune) return {};
  return buildPageMetadata({
    title: `Plombier ${commune.name} – Dépannage et chauffage`,
    description: `Plombier chauffagiste à ${commune.name} : fuite, débouchage, chauffe-eau, chauffage. Maître Artisan basé à Pérouges, devis gratuit.`,
    path: `/plombier/${commune.slug}`,
  });
}

export default async function PlombierCommunePage({ params }: { params: Promise<{ commune: string }> }) {
  const { commune: slug } = await params;
  const commune = getCommuneBySlug(slug);
  if (!commune) notFound();

  const { name } = commune;
  const settings = getSiteSettings();
  const telHref = phoneToTelHref(settings.phone);
  const realisations = getRealisationsForCities([name]);
  const urgences = URGENCE_PAGES.filter((p) => p.slug.endsWith(`-${commune.slug}`));
  const autres = COMMUNES.filter((c) => c.slug !== commune.slug);

  const faq = [
    {
      question: `Quel est le délai d'intervention pour un plombier à ${name} ?`,
      answer: `Basé à Pérouges, j'interviens à ${name} rapidement, selon le degré d'urgence (fuite, WC bouché, panne de chauffe-eau). Pour les travaux planifiés, un rendez-vous est fixé avec vous après le devis.`,
    },
    {
      question: `Combien coûte un dépannage plomberie à ${name} ?`,
      answer:
        "Le tarif dépend de la nature de l'intervention. Un diagnostic de fuite démarre à partir de 120 € TTC (prix indicatif, variable selon la configuration). Chaque intervention fait l'objet d'un devis clair avant travaux — pas de surprise sur la facture.",
    },
    {
      question: `Intervenez-vous le week-end et les jours fériés à ${name} ?`,
      answer: `J'interviens rapidement, selon le degré d'urgence, sur ${name} et les communes voisines. Appelez directement pour être pris en charge au plus vite.`,
    },
  ];

  return (
    <>
      <FAQSchema faq={faq} />
      <BreadcrumbSchema
        items={[
          { name: "Accueil", path: "/" },
          { name: "Zones d'intervention", path: "/zones-intervention" },
          { name: `Plombier ${name}`, path: `/plombier/${commune.slug}` },
        ]}
      />

      <section className="bg-primary px-4 py-12 text-white sm:px-6 sm:py-14">
        <div className="mx-auto max-w-lg text-center">
          <h1 className="font-heading text-3xl font-bold leading-tight sm:text-4xl md:text-5xl">
            Plombier à {name} – Dépannage rapide
          </h1>
          <p className="mx-auto mt-4 max-w-md text-white/90">
            Artisan local basé à Pérouges. Fuite, débouchage, chauffe-eau&nbsp;: j&apos;interviens à {name}.
          </p>
          <div className="mt-8 flex flex-col items-center gap-4">
            <a
              href={telHref}
              className={buttonVariants({
                variant: "accent",
                size: "lg",
                className:
                  "inline-flex min-h-[52px] min-w-[220px] items-center justify-center gap-2 bg-accent px-10 py-4 text-lg font-semibold text-white shadow-lg ring-2 ring-white/40 hover:bg-accent/90",
              })}
            >
              <Phone className="h-6 w-6" aria-hidden />
              Appeler maintenant
            </a>
            <Link
              href="/devis"
              className={buttonVariants({
                variant: "outline",
                size: "lg",
                className:
                  "inline-flex items-center justify-center gap-2 border-white bg-white/10 text-white hover:bg-white/20",
              })}
            >
              <FileText className="h-5 w-5" aria-hidden />
              Devis gratuit
            </Link>
          </div>
        </div>
      </section>

      <section className="border-b border-gray-200 bg-white px-4 py-6 sm:px-6">
        <div className="mx-auto flex max-w-3xl flex-wrap items-center justify-center gap-6 text-sm text-gray-700">
          <span className="flex items-center gap-1.5"><Clock className="h-4 w-4 text-primary" aria-hidden />Intervention rapide</span>
          <span className="flex items-center gap-1.5"><MapPin className="h-4 w-4 text-primary" aria-hidden />Basé à Pérouges</span>
          <span className="flex items-center gap-1.5"><Shield className="h-4 w-4 text-primary" aria-hidden />Devis avant travaux</span>
        </div>
      </section>

      <main className="px-4 py-12 sm:px-6 sm:py-14">
        <div className="mx-auto max-w-2xl space-y-12">
          <section>
            <p className="text-center leading-relaxed text-gray-text">
              Vous habitez <strong>{name}</strong>
              {commune.postalCode ? <> ({commune.postalCode})</> : null}&nbsp;?
              Grégoire Mathelin, Maître Artisan Plombier Chauffagiste (BP Génie Climatique), intervient
              rapidement depuis sa base de <strong>Pérouges (01800)</strong>&nbsp;: dépannage, installation et
              rénovation en plomberie et chauffage, pour les particuliers.
            </p>
          </section>

          <LocalRealisations title={`Nos réalisations à ${name}`} items={realisations} />

          <section>
            <h2 className="text-xl font-semibold text-primary">Nos interventions à {name}</h2>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <div className="rounded-lg border p-4">
                <h3 className="font-semibold text-gray-900">Fuite d&apos;eau urgente</h3>
                <p className="mt-1 text-sm text-gray-text">Recherche de fuite, réparation, remplacement de tuyauterie.</p>
              </div>
              <div className="rounded-lg border p-4">
                <h3 className="font-semibold text-gray-900">WC &amp; canalisation bouchés</h3>
                <p className="mt-1 text-sm text-gray-text">Débouchage mécanique ou hydrocurage. Évier, douche, WC, canalisation principale.</p>
              </div>
              <div className="rounded-lg border p-4">
                <h3 className="font-semibold text-gray-900">Chauffe-eau en panne</h3>
                <p className="mt-1 text-sm text-gray-text">Diagnostic, réparation ou remplacement. Électrique, gaz, thermodynamique.</p>
              </div>
              <div className="rounded-lg border p-4">
                <h3 className="font-semibold text-gray-900">Chauffage &amp; radiateurs</h3>
                <p className="mt-1 text-sm text-gray-text">Purge, désembouage, remplacement de radiateur, robinet thermostatique.</p>
              </div>
            </div>
          </section>

          {urgences.length > 0 ? (
            <section>
              <h2 className="text-xl font-semibold text-primary">Urgences fréquentes à {name}</h2>
              <ul className="mt-3 space-y-2">
                {urgences.map((p) => (
                  <li key={p.slug}>
                    <Link href={`/urgence/${p.slug}`} className="font-medium text-primary underline-offset-2 hover:underline">
                      {p.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          ) : null}

          <section className="rounded-xl border-2 border-accent/30 bg-accent/5 p-6 text-center">
            <h2 className="text-lg font-bold text-accent">Urgence plomberie à {name}&nbsp;?</h2>
            <p className="mt-2 text-sm text-gray-text">
              Fuite importante, dégât des eaux, canalisation percée&nbsp;: coupez l&apos;arrivée d&apos;eau au compteur
              et appelez immédiatement.
            </p>
            <a href={telHref} className={buttonVariants({ variant: "accent", className: "mt-4 inline-flex items-center gap-2" })}>
              <Phone className="h-5 w-5" aria-hidden />
              Appeler en urgence
            </a>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-primary">Questions fréquentes – Plombier {name}</h2>
            <dl className="mt-4 space-y-4">
              {faq.map((f) => (
                <div key={f.question} className="rounded-lg border p-4">
                  <dt className="font-semibold text-gray-900">{f.question}</dt>
                  <dd className="mt-2 text-sm leading-relaxed text-gray-text">{f.answer}</dd>
                </div>
              ))}
            </dl>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-primary">Autres communes desservies</h2>
            <p className="mt-3 leading-relaxed text-gray-text">
              J&apos;interviens aussi à{" "}
              <a href={`${MEXIMIEUX_URL}/`} className="font-medium text-primary underline-offset-2 hover:underline">Meximieux</a>,{" "}
              <a href={`${AMBERIEU_URL}/`} className="font-medium text-primary underline-offset-2 hover:underline">Ambérieu-en-Bugey</a>
              {autres.map((c, i) => (
                <span key={c.slug}>
                  {i === autres.length - 1 ? " et " : ", "}
                  <Link href={`/plombier/${c.slug}`} className="font-medium text-primary underline-offset-2 hover:underline">
                    {c.name}
                  </Link>
                </span>
              ))}
              .
            </p>
          </section>

          <div className="text-center">
            <p className="mb-4 text-sm font-medium text-primary">
              Maître Artisan Plombier Chauffagiste (BP Génie Climatique), basé à Pérouges (01800).
            </p>
            <div className="flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
              <a href={telHref} className={buttonVariants({ variant: "accent", size: "lg" })}>
                <Phone className="mr-2 h-5 w-5" aria-hidden />
                Appeler
              </a>
              <Link href="/contact" className={buttonVariants({ variant: "outline" })}>
                Demander un devis
              </Link>
            </div>
          </div>
        </div>
      </main>

      <RelatedLocalLinks
        villesProches={[
          { href: `${MEXIMIEUX_URL}/`, label: "Plombier à Meximieux" },
          { href: `${AMBERIEU_URL}/`, label: "Plombier à Ambérieu-en-Bugey" },
          { href: `${MAIN_SITE_URL}/zones-intervention`, label: "Toutes les zones d'intervention" },
        ]}
        problemesFrequents={URGENCE_PAGES.filter((p) => p.slug.startsWith("fuite-eau-") || p.slug.startsWith("wc-bouche-"))
          .slice(0, 2)
          .map((p) => ({ href: `${MAIN_SITE_URL}/urgence/${p.slug}`, label: p.title }))}
        urgence={{ href: `${MAIN_SITE_URL}/urgence-depannage`, label: "Urgence plomberie" }}
      />
    </>
  );
}
