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
import LocalRealisations from "@/components/LocalRealisations";
import { getRealisationsForCities } from "@/lib/communes";
import RelatedLocalLinks from "@/components/RelatedLocalLinks";
import BreadcrumbSchema from "@/components/BreadcrumbSchema";
import { GMB_FALLBACK_PROFILE, resolveGmbProfileForStructuredData } from "@/lib/gmbSeoDefaults";
import { MAIN_SITE_URL } from "@/lib/config";
import {
  getGmbUrlForSatellitePages,
  getSatelliteLandingsData,
  phoneToTelHref,
  satelliteAggregateFromGbp,
} from "@/lib/satelliteLandings";
import { getSatelliteTestimonialsFromGeocomptaOrFallback } from "@/lib/satelliteReviews";

const SATELLITE_URL = "https://www.plombier-meximieux.fr";
const AMBERIEU_URL = "https://www.plombier-amberieu.fr";

export const metadata = {
  ...buildPageMetadata({
    title: "Plombier Meximieux – Dépannage plomberie rapide",
    description:
      "Dépannage plomberie à Meximieux : fuite, débouchage, chauffe-eau, chauffage. Artisan à Pérouges (8 min), devis gratuit. Intervention rapide Côtière de l'Ain.",
    path: "/plombier-meximieux",
    canonicalAbsolute: `${SATELLITE_URL}/`,
  }),
  // Vérification Bing Webmaster Tools
  verification: { google: "R_D2PA0M0As_t7IEYX3cuJeiwN6U1KLXuWrlHeQaG80", other: { "msvalidate.01": "9472921A5C7E7CC011555F1EB9851796" } },
};

const FAQ_MEXIMIEUX = [
  {
    question: "Quel est le délai d'intervention pour un plombier à Meximieux ?",
    answer:
      "Basé à Pérouges, à moins de 10 minutes de Meximieux, j'interviens rapidement, selon le degré d'urgence (fuite, WC bouché, panne de chauffe-eau). Pour les travaux planifiés, un rendez-vous est fixé sous 24 à 48 h.",
  },
  {
    question: "Combien coûte un dépannage plomberie à Meximieux ?",
    answer:
      "Le tarif dépend de la nature de l'intervention. Un diagnostic de fuite démarre à partir de 120 € TTC (prix indicatif, variable selon la configuration). Chaque intervention fait l'objet d'un devis clair avant travaux — pas de surprise sur la facture.",
  },
  {
    question: "Intervenez-vous le week-end et les jours fériés à Meximieux ?",
    answer:
      "J'interviens rapidement, selon le degré d'urgence, sur Meximieux et les communes voisines (Pérouges, Villieu, Rignieux-le-Franc). Appelez directement pour être pris en charge au plus vite.",
  },
  {
    question: "Desservez-vous tout Meximieux ?",
    answer:
      "J'interviens sur tout Meximieux : centre-ville, lotissements, et les hameaux environnants vers Villieu-Loyes-Mollon et Pérouges.",
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
      <BreadcrumbSchema
        baseUrl={SATELLITE_URL}
        items={[
          { name: "Accueil", path: `${SATELLITE_URL}/` },
          { name: "Zones d'intervention", path: `${MAIN_SITE_URL}/zones-intervention` },
          { name: "Plombier Meximieux", path: `${SATELLITE_URL}/` },
        ]}
      />

      <section className="bg-primary px-4 py-12 text-white sm:px-6 sm:py-14">
        <div className="mx-auto max-w-lg text-center">
          <h1 className="font-heading text-3xl font-bold leading-tight sm:text-4xl md:text-5xl">
            Plombier à Meximieux – Dépannage rapide
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
              href={`${MAIN_SITE_URL}/devis`}
              className={buttonVariants({
                variant: "outline",
                size: "lg",
                className:
                  "inline-flex items-center justify-center gap-2 border-white bg-white text-slate-800 hover:bg-white/90",
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
          <span className="flex items-center gap-1.5"><MapPin className="h-4 w-4 text-primary" aria-hidden />À 8&nbsp;min de Meximieux</span>
          <span className="flex items-center gap-1.5"><Shield className="h-4 w-4 text-primary" aria-hidden />Devis avant travaux</span>
        </div>
      </section>

      <div className="px-4 py-12 sm:px-6 sm:py-14">
        <div className="mx-auto max-w-2xl space-y-12">
          <section>
            <p className="text-center leading-relaxed text-gray-text">
              Vous habitez <strong>Meximieux</strong>, en <strong>centre-ville</strong> ou en <strong>lotissement</strong>&nbsp;?
              Grégoire Mathelin, Maître Artisan Plombier Chauffagiste (BP Génie Climatique), intervient
              rapidement depuis sa base de <strong>Pérouges (01800)</strong>, 57 impasse des Verchères.
              Maisons individuelles, appartements en copropriété ou pavillons de lotissement&nbsp;: chaque habitat de la Côtière a ses spécificités.
            </p>
          </section>

          <LocalRealisations
            title="Nos réalisations à Meximieux et alentours"
            items={getRealisationsForCities(["Meximieux", "Pérouges", "Béligneux", "Rignieux-le-Franc"])}
          />

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
                <span><strong>Réactivité</strong>&nbsp;: intervention rapide, selon le degré d&apos;urgence, devis transparent avant toute réparation.</span>
              </li>
              <li className="flex gap-2">
                <span className="mt-1 shrink-0 text-primary">✓</span>
                <span><strong>Avis clients</strong>&nbsp;: {GMB_FALLBACK_PROFILE.totalReviewCount} avis 5&nbsp;étoiles sur Google. Artisan recommandé sur la Plaine de l&apos;Ain.</span>
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-primary">Communes voisines desservies</h2>
            <p className="mt-3 text-gray-text leading-relaxed">
              Depuis Meximieux, j&apos;interviens également à{" "}
              <strong>Pérouges</strong>, <strong>Villieu-Loyes-Mollon</strong>, <strong>Rignieux-le-Franc</strong>,{" "}
              <strong>Le Montellier</strong>, <strong>Béligneux</strong> et <strong>Saint-Jean-de-Niost</strong>.
              Pour le secteur <strong>Ambérieu-en-Bugey</strong> et le Bugey, consultez la page{" "}
              <a href={`${AMBERIEU_URL}/`} className="font-medium text-primary underline-offset-2 hover:underline">
                plombier Ambérieu
              </a>.
            </p>
          </section>

          <section className="rounded-xl border-2 border-accent/30 bg-accent/5 p-6 text-center">
            <h2 className="text-lg font-bold text-accent">Urgence plomberie à Meximieux&nbsp;?</h2>
            <p className="mt-2 text-sm text-gray-text">
              Fuite importante, dégât des eaux, canalisation percée&nbsp;: ne perdez pas de temps.
              Coupez l&apos;arrivée d&apos;eau au compteur et appelez immédiatement.
            </p>
            <a href={telHref} className={buttonVariants({ variant: "accent", className: "mt-4 inline-flex items-center gap-2" })}>
              <Phone className="h-5 w-5" aria-hidden />
              Appeler en urgence
            </a>
          </section>

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

          <div className="text-center">
            <p className="mb-4 text-sm font-medium text-primary">
              Maître Artisan Plombier Chauffagiste (BP Génie Climatique) — depuis 2013.
            </p>
            <div className="flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
              <a href={telHref} className={buttonVariants({ variant: "accent", size: "lg" })}>
                <Phone className="mr-2 h-5 w-5" aria-hidden />
                Appeler
              </a>
              <Link href={`${MAIN_SITE_URL}/contact`} className={buttonVariants({ variant: "outline" })}>
                Demander un devis
              </Link>
            </div>
          </div>
        </div>
      </div>

      <RelatedLocalLinks
        villesProches={[
          { href: `${AMBERIEU_URL}/`, label: "Plombier à Ambérieu-en-Bugey" },
          { href: `${MAIN_SITE_URL}/zones-intervention`, label: "Plombier à Pérouges & Villieu" },
          { href: `${MAIN_SITE_URL}/zones-intervention`, label: "Plombier à Lagnieu & Saint-Vulbas" },
        ]}
        problemesFrequents={[
          { href: `${MAIN_SITE_URL}/urgence/fuite-eau-meximieux`, label: "Fuite d'eau à Meximieux" },
          { href: `${MAIN_SITE_URL}/urgence/wc-bouche-meximieux`, label: "WC bouché à Meximieux" },
          { href: `${MAIN_SITE_URL}/urgence/chauffe-eau-panne-meximieux`, label: "Chauffe-eau en panne Meximieux" },
          { href: `${MAIN_SITE_URL}/urgence/chaudiere-panne-meximieux`, label: "Chaudière en panne Meximieux" },
        ]}
        urgence={{ href: `${MAIN_SITE_URL}/urgence-depannage`, label: "Urgence plomberie" }}
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
