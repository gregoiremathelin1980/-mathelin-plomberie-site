import Link from "next/link";
import { Phone, FileText, Clock, MapPin, Shield } from "lucide-react";
import { getSiteSettings } from "@/lib/content";
import { buttonVariants } from "@/components/ui/button";
import { buildPageMetadata } from "@/lib/seo/metaBuilder";
import SatellitePlumbingJsonLd from "@/components/satellite/SatellitePlumbingJsonLd";
import SatelliteTestimonialsSection from "@/components/satellite/SatelliteTestimonialsSection";
import SatelliteStickyCall from "@/components/satellite/SatelliteStickyCall";
import SatelliteLocalFooter from "@/components/satellite/SatelliteLocalFooter";
import FAQSchema from "@/components/FAQSchema";
import RelatedLocalLinks from "@/components/RelatedLocalLinks";
import BreadcrumbSchema from "@/components/BreadcrumbSchema";
import { resolveGmbProfileForStructuredData } from "@/lib/gmbSeoDefaults";
import {
  getGmbUrlForSatellitePages,
  getSatelliteLandingsData,
  phoneToTelHref,
  satelliteAggregateFromGbp,
} from "@/lib/satelliteLandings";
import { getSatelliteTestimonialsFromGeocomptaOrFallback } from "@/lib/satelliteReviews";

export const metadata = buildPageMetadata({
  title: "Plombier Meximieux – Dépannage rapide 7j/7 | Mathelin Plomberie Chauffage",
  description:
    "Plombier à Meximieux : fuite d'eau, débouchage, chauffe-eau, chauffage. Artisan local basé à Pérouges, intervention rapide sur la Côtière de l'Ain. Devis gratuit.",
  path: "/plombier-meximieux",
  canonicalAbsolute: "https://www.plombier-meximieux.fr/",
});

const FAQ_MEXIMIEUX = [
  {
    question: "Quel est le délai d'intervention pour un plombier à Meximieux ?",
    answer:
      "Basé à Pérouges, à moins de 10 minutes de Meximieux, j'interviens généralement dans l'heure pour les urgences (fuite, WC bouché, panne de chauffe-eau). Pour les travaux planifiés, un rendez-vous est fixé sous 24 à 48 h.",
  },
  {
    question: "Combien coûte un dépannage plomberie à Meximieux ?",
    answer:
      "Le tarif dépend de la nature de l'intervention. Un diagnostic de fuite démarre à 60 € TTC. Chaque intervention fait l'objet d'un devis clair avant travaux — pas de surprise sur la facture.",
  },
  {
    question: "Intervenez-vous le week-end et les jours fériés à Meximieux ?",
    answer:
      "Oui, j'assure un service de dépannage d'urgence 7 jours sur 7 sur Meximieux et les communes voisines (Pérouges, Villieu, Rignieux-le-Franc). Appelez directement pour vérifier ma disponibilité.",
  },
  {
    question: "Quels quartiers de Meximieux desservez-vous ?",
    answer:
      "J'interviens sur tout Meximieux : centre-ville (Place de la Grenette, rue de Genève), lotissements des Allagniers, quartier de la gare, et les hameaux environnants vers Villieu-Loyes-Mollon et Pérouges.",
  },
];

export default async function PlombierMeximieux() {
  const settings = getSiteSettings();
  const landing = getSatelliteLandingsData();
  const telHref = phoneToTelHref(settings.phone);
  const { items: testimonialItems, fromGeocompta, googleBusinessProfile } =
    await getSatelliteTestimonialsFromGeocomptaOrFallback(landing.testimonials_meximieux, 3);
  const aggregateNote = satelliteAggregateFromGbp(resolveGmbProfileForStructuredData(googleBusinessProfile));

  return (
    <>
      <SatellitePlumbingJsonLd variant="meximieux" settings={settings} googleBusinessProfile={googleBusinessProfile} />
      <FAQSchema faq={FAQ_MEXIMIEUX} />
      <BreadcrumbSchema items={[
        { name: "Accueil", path: "/" },
        { name: "Zones d'intervention", path: "/zones-intervention" },
        { name: "Plombier Meximieux", path: "/plombier-meximieux" },
      ]} />

      {/* Hero */}
      <section className="bg-primary px-4 py-12 text-white sm:px-6 sm:py-14">
        <div className="mx-auto max-w-lg text-center">
          <h1 className="font-heading text-3xl font-bold leading-tight sm:text-4xl md:text-5xl">
            Plombier à Meximieux – Dépannage rapide 7j/7
          </h1>
          <p className="mx-auto mt-4 max-w-md text-white/90">
            Artisan local basé à Pérouges, à 8&nbsp;min de Meximieux.
            Fuite, débouchage, chauffe-eau&nbsp;: j&apos;arrive vite.
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

      {/* Réassurance rapide */}
      <section className="border-b border-gray-200 bg-white px-4 py-6 sm:px-6">
        <div className="mx-auto flex max-w-3xl flex-wrap items-center justify-center gap-6 text-sm text-gray-700">
          <span className="flex items-center gap-1.5"><Clock className="h-4 w-4 text-primary" aria-hidden />Intervention sous 1&nbsp;h</span>
          <span className="flex items-center gap-1.5"><MapPin className="h-4 w-4 text-primary" aria-hidden />Basé à 8&nbsp;min</span>
          <span className="flex items-center gap-1.5"><Shield className="h-4 w-4 text-primary" aria-hidden />Devis avant travaux</span>
        </div>
      </section>

      <main className="px-4 py-12 sm:px-6 sm:py-14">
        <div className="mx-auto max-w-2xl space-y-12">

          {/* Intro locale */}
          <section>
            <p className="text-center leading-relaxed text-gray-text">
              Vous habitez <strong>Meximieux</strong>, le <strong>quartier de la gare</strong>, les{" "}
              <strong>lotissements des Allagniers</strong> ou le <strong>centre-ville près de la Place de la Grenette</strong>&nbsp;?
              Grégoire Mathelin, artisan plombier-chauffagiste diplômé (BP Génie Climatique), intervient
              rapidement depuis sa base de <strong>Pérouges (01800)</strong>. Maisons individuelles,
              appartements en copropriété ou pavillons de lotissement&nbsp;: chaque habitat de la Côtière a ses spécificités.
            </p>
          </section>

          {/* Intervention récente */}
          <section>
            <h2 className="text-xl font-semibold text-primary">Intervention récente à Meximieux</h2>
            <div className="mt-4 rounded-xl border border-primary/20 bg-primary/5 p-5">
              <p className="leading-relaxed text-gray-text">
                <strong>Fuite sous évier</strong> dans un pavillon du quartier des Allagniers.
                Le joint du siphon était fissuré, provoquant une infiltration sous le meuble de cuisine.
                Diagnostic en 15&nbsp;minutes, remplacement du siphon complet et test d&apos;étanchéité.
              </p>
              <p className="mt-2 text-sm font-medium text-primary">
                Résultat&nbsp;: fuite stoppée, sol séché, facture de 85&nbsp;€ TTC — le client a pu reprendre sa soirée tranquille.
              </p>
            </div>
          </section>

          {/* Services spécifiques */}
          <section>
            <h2 className="text-xl font-semibold text-primary">Nos interventions sur la Côtière</h2>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <div className="rounded-lg border p-4">
                <h3 className="font-semibold text-gray-900">Fuite d&apos;eau urgente</h3>
                <p className="mt-1 text-sm text-gray-text">Recherche de fuite, réparation, remplacement de tuyauterie. Intervention possible le soir et le week-end.</p>
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

          {/* Pourquoi local */}
          <section>
            <h2 className="text-xl font-semibold text-primary">Pourquoi choisir un plombier local à Meximieux&nbsp;?</h2>
            <ul className="mt-4 space-y-3 text-gray-text">
              <li className="flex gap-2">
                <span className="mt-1 shrink-0 text-primary">✓</span>
                <span><strong>Proximité</strong>&nbsp;: Pérouges → Meximieux en 8&nbsp;min par la D22. Pas de frais de déplacement excessifs.</span>
              </li>
              <li className="flex gap-2">
                <span className="mt-1 shrink-0 text-primary">✓</span>
                <span><strong>Connaissance du terrain</strong>&nbsp;: je connais les réseaux de la Côtière, les lotissements récents et les immeubles du centre-ville.</span>
              </li>
              <li className="flex gap-2">
                <span className="mt-1 shrink-0 text-primary">✓</span>
                <span><strong>Réactivité</strong>&nbsp;: disponible 7j/7, intervention sous 1h en urgence, devis transparent avant toute réparation.</span>
              </li>
              <li className="flex gap-2">
                <span className="mt-1 shrink-0 text-primary">✓</span>
                <span><strong>Avis clients</strong>&nbsp;: plus de 50 avis 5 étoiles sur Google. Artisan recommandé sur la Plaine de l&apos;Ain.</span>
              </li>
            </ul>
          </section>

          {/* Zones desservies */}
          <section>
            <h2 className="text-xl font-semibold text-primary">Communes voisines desservies</h2>
            <p className="mt-3 text-gray-text leading-relaxed">
              Depuis Meximieux, j&apos;interviens également à{" "}
              <strong>Pérouges</strong>, <strong>Villieu-Loyes-Mollon</strong>, <strong>Rignieux-le-Franc</strong>,{" "}
              <strong>Le Montellier</strong>, <strong>Béligneux</strong> et <strong>Saint-Jean-de-Niost</strong>.
              Pour le secteur <strong>Ambérieu-en-Bugey</strong> et le Bugey, consultez la page{" "}
              <a href="https://www.plombier-amberieu.fr/" className="font-medium text-primary underline-offset-2 hover:underline">
                plombier Ambérieu
              </a>.
            </p>
          </section>

          {/* FAQ */}
          <section>
            <h2 className="text-xl font-semibold text-primary">Questions fréquentes – Plombier Meximieux</h2>
            <dl className="mt-4 space-y-4">
              {FAQ_MEXIMIEUX.map((faq) => (
                <div key={faq.question} className="rounded-lg border p-4">
                  <dt className="font-semibold text-gray-900">{faq.question}</dt>
                  <dd className="mt-2 text-sm leading-relaxed text-gray-text">{faq.answer}</dd>
                </div>
              ))}
            </dl>
          </section>

          {/* CTA final */}
          <div className="text-center">
            <p className="mb-4 text-sm font-medium text-primary">
              Artisan plombier-chauffagiste diplômé (BP Génie Climatique) — depuis 2013.
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
          { href: "/plombier-amberieu", label: "Plombier à Ambérieu-en-Bugey" },
          { href: "/zones-intervention", label: "Plombier à Pérouges & Villieu" },
          { href: "/zones-intervention", label: "Plombier à Lagnieu & Saint-Vulbas" },
        ]}
        problemesFrequents={[
          { href: "/urgence/fuite-eau-meximieux", label: "Fuite d'eau à Meximieux" },
          { href: "/urgence/wc-bouche-meximieux", label: "WC bouché à Meximieux" },
        ]}
        urgence={{ href: "/urgence-depannage", label: "Urgence plomberie 7j/7" }}
      />

      <SatelliteTestimonialsSection
        title="Ce que disent nos clients à Meximieux"
        items={testimonialItems}
        aggregate={aggregateNote}
        googleMapsUrl={getGmbUrlForSatellitePages(settings)}
        sourceHint={
          fromGeocompta
            ? "Avis synchronisés depuis notre fiche Google — même flux que www.mathelin-plomberie.fr."
            : undefined
        }
      />

      <SatelliteLocalFooter variant="meximieux" settings={settings} />
      <SatelliteStickyCall phoneLabel={settings.phone} telHref={telHref} />
    </>
  );
}
