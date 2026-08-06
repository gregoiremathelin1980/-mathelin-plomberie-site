import Link from "next/link";
import { Phone, FileText, Wrench, ThermometerSun, Droplets } from "lucide-react";
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
  title: "Plombier Ambérieu-en-Bugey – Urgence plomberie & chauffage",
  description:
    "Plombier chauffagiste à Ambérieu-en-Bugey : dépannage fuite, chaudière, chauffe-eau, débouchage. Artisan basé à Pérouges, 51 avis 5★. Intervention rapide Bugey & Plaine de l'Ain.",
  path: "/plombier-amberieu",
  canonicalAbsolute: "https://www.plombier-amberieu.fr/",
});

const FAQ_AMBERIEU = [
  {
    question: "Intervenez-vous en urgence à Ambérieu-en-Bugey le soir et le week-end ?",
    answer:
      "Oui. Basé à Pérouges à 15 minutes d'Ambérieu, j'assure les dépannages urgents 7j/7 : fuite d'eau, canalisation bouchée, panne de chauffage. Appelez directement pour une intervention rapide.",
  },
  {
    question: "Quel est le prix d'un remplacement de chauffe-eau à Ambérieu ?",
    answer:
      "Le tarif varie selon le type (électrique, thermodynamique) et la capacité. Comptez entre 600 et 1 500 € TTC pose incluse. Un devis détaillé est systématiquement fourni avant intervention — sans engagement.",
  },
  {
    question: "Desservez-vous Lagnieu et Saint-Vulbas depuis Ambérieu ?",
    answer:
      "Absolument. J'interviens sur tout le secteur : Ambérieu, Lagnieu, Saint-Vulbas, Château-Gaillard, Douvres, Saint-Denis-en-Bugey. Les trajets sont maîtrisés, les frais de déplacement restent raisonnables.",
  },
  {
    question: "Faites-vous l'entretien de chaudière gaz à Ambérieu ?",
    answer:
      "Oui, l'entretien annuel de chaudière gaz est obligatoire. Je réalise le contrôle, le nettoyage du brûleur, la vérification des sécurités et vous remets l'attestation d'entretien. Rendez-vous sous 48 h.",
  },
];

export default async function PlombierAmberieu() {
  const settings = getSiteSettings();
  const landing = getSatelliteLandingsData();
  const telHref = phoneToTelHref(settings.phone);
  const { items: testimonialItems, fromGeocompta, googleBusinessProfile } =
    await getSatelliteTestimonialsFromGeocomptaOrFallback(landing.testimonials_amberieu, 3);
  const aggregateNote = satelliteAggregateFromGbp(resolveGmbProfileForStructuredData(googleBusinessProfile));

  return (
    <>
      <SatellitePlumbingJsonLd variant="amberieu" settings={settings} googleBusinessProfile={googleBusinessProfile} />
      <FAQSchema faq={FAQ_AMBERIEU} />
      <BreadcrumbSchema items={[
        { name: "Accueil", path: "/" },
        { name: "Zones d'intervention", path: "/zones-intervention" },
        { name: "Plombier Ambérieu", path: "/plombier-amberieu" },
      ]} />

      {/* Hero — structure différente de Meximieux */}
      <section className="bg-gradient-to-b from-primary to-primary/90 px-4 py-12 text-white sm:px-6 sm:py-16">
        <div className="mx-auto max-w-2xl text-center">
          <h1 className="font-heading text-3xl font-bold leading-tight sm:text-4xl md:text-5xl">
            Votre plombier à Ambérieu-en-Bugey
          </h1>
          <p className="mx-auto mt-5 max-w-lg text-lg text-white/90">
            Urgence plomberie ou chauffage dans le Bugey&nbsp;?
            Grégoire Mathelin intervient depuis Pérouges en 15&nbsp;minutes.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <a
              href={telHref}
              className={buttonVariants({
                variant: "accent",
                size: "lg",
                className:
                  "inline-flex min-h-[52px] min-w-[200px] items-center justify-center gap-2 bg-accent px-8 py-4 text-lg font-semibold text-white shadow-lg ring-2 ring-white/40 hover:bg-accent/90",
              })}
            >
              <Phone className="h-6 w-6" aria-hidden />
              Appeler
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

      <main className="px-4 py-12 sm:px-6 sm:py-14">
        <div className="mx-auto max-w-2xl space-y-12">

          {/* Intro locale spécifique Ambérieu */}
          <section>
            <p className="text-center leading-relaxed text-gray-text">
              <strong>Ambérieu-en-Bugey</strong>, entre la <strong>Plaine de l&apos;Ain</strong> et les premiers reliefs du{" "}
              <strong>Bugey</strong>, concentre un parc immobilier varié&nbsp;: immeubles du centre-ville autour de la{" "}
              <strong>rue Alexandre Bérard</strong>, pavillons des quartiers résidentiels de <strong>Tiret</strong> et{" "}
              <strong>Saint-Germain</strong>, maisons anciennes de <strong>Saint-Denis-en-Bugey</strong>.
              Chaque type d&apos;habitat a ses problématiques plomberie&nbsp;: tuyaux en plomb dans l&apos;ancien,
              pression réseau variable en altitude, gel hivernal sur les canalisations exposées.
            </p>
          </section>

          {/* 3 colonnes services — mise en page différente de Meximieux */}
          <section>
            <h2 className="text-center text-xl font-semibold text-primary">Ce que je dépanne à Ambérieu</h2>
            <div className="mt-6 grid gap-5 sm:grid-cols-3">
              <div className="flex flex-col items-center rounded-xl border p-5 text-center">
                <Droplets className="h-8 w-8 text-primary" aria-hidden />
                <h3 className="mt-3 font-semibold">Plomberie</h3>
                <p className="mt-1 text-sm text-gray-text">Fuite, débouchage, robinetterie, recherche de fuite non destructive.</p>
              </div>
              <div className="flex flex-col items-center rounded-xl border p-5 text-center">
                <ThermometerSun className="h-8 w-8 text-primary" aria-hidden />
                <h3 className="mt-3 font-semibold">Chauffage</h3>
                <p className="mt-1 text-sm text-gray-text">Radiateur froid, désembouage, purge, entretien chaudière gaz.</p>
              </div>
              <div className="flex flex-col items-center rounded-xl border p-5 text-center">
                <Wrench className="h-8 w-8 text-primary" aria-hidden />
                <h3 className="mt-3 font-semibold">Chauffe-eau</h3>
                <p className="mt-1 text-sm text-gray-text">Panne, remplacement, détartrage, groupe de sécurité.</p>
              </div>
            </div>
          </section>

          {/* Cas réel — différent de celui de Meximieux */}
          <section>
            <h2 className="text-xl font-semibold text-primary">Dernière intervention à Ambérieu</h2>
            <div className="mt-4 rounded-xl border border-primary/20 bg-primary/5 p-5">
              <p className="leading-relaxed text-gray-text">
                <strong>Chauffe-eau en panne</strong> dans un appartement du centre-ville, rue Alexandre Bérard.
                Le groupe de sécurité fuyait depuis plusieurs jours, provoquant une surconsommation d&apos;eau.
                Remplacement du groupe, détartrage du ballon 200&nbsp;L et vérification de l&apos;anode.
              </p>
              <p className="mt-2 text-sm font-medium text-primary">
                Résultat&nbsp;: eau chaude retrouvée le jour même, plus de fuite. Intervention complète en 2&nbsp;h, 280&nbsp;€ TTC pièces comprises.
              </p>
            </div>
          </section>

          {/* Pourquoi local — arguments différents */}
          <section>
            <h2 className="text-xl font-semibold text-primary">Pourquoi un plombier local pour Ambérieu&nbsp;?</h2>
            <div className="mt-4 space-y-3 text-gray-text">
              <p>
                Les plateformes nationales envoient des techniciens qui ne connaissent ni le réseau d&apos;eau
                d&apos;Ambérieu, ni les spécificités des immeubles anciens du Bugey. Un artisan local,
                c&apos;est&nbsp;:
              </p>
              <ul className="ml-4 space-y-2">
                <li>→ Un <strong>temps de trajet court</strong> (Pérouges → Ambérieu en 15&nbsp;min via la D1084)</li>
                <li>→ Une <strong>connaissance du bâti local</strong>&nbsp;: maisons de village en pierre, lotissements années 80, résidences récentes</li>
                <li>→ Un <strong>interlocuteur unique</strong>&nbsp;: c&apos;est moi qui diagnostique, répare et facture</li>
                <li>→ Des <strong>51 avis 5&nbsp;étoiles</strong> sur Google, vérifiables sur la fiche Mathelin Plomberie Chauffage</li>
              </ul>
            </div>
          </section>

          {/* Secteur élargi */}
          <section>
            <h2 className="text-xl font-semibold text-primary">Secteur Bugey &amp; communes voisines</h2>
            <p className="mt-3 text-gray-text leading-relaxed">
              Au-delà d&apos;Ambérieu, j&apos;interviens à <strong>Lagnieu</strong>, <strong>Saint-Vulbas</strong>,{" "}
              <strong>Château-Gaillard</strong>, <strong>Douvres</strong>, <strong>Pont-d&apos;Ain</strong> et{" "}
              <strong>Saint-Denis-en-Bugey</strong>.
              Pour la <strong>Côtière</strong> (Meximieux, Villieu, Pérouges), consultez{" "}
              <a href="https://www.plombier-meximieux.fr/" className="font-medium text-primary underline-offset-2 hover:underline">
                plombier Meximieux
              </a>.
            </p>
          </section>

          {/* Section urgence — wording spécifique Ambérieu */}
          <section className="rounded-xl border-2 border-accent/30 bg-accent/5 p-6 text-center">
            <h2 className="text-lg font-bold text-accent">Urgence plomberie à Ambérieu&nbsp;?</h2>
            <p className="mt-2 text-sm text-gray-text">
              Fuite importante, dégât des eaux, canalisation percée&nbsp;: ne perdez pas de temps.
              Coupez l&apos;arrivée d&apos;eau au compteur et appelez immédiatement.
            </p>
            <a href={telHref} className={buttonVariants({ variant: "accent", className: "mt-4 inline-flex items-center gap-2" })}>
              <Phone className="h-5 w-5" aria-hidden />
              Appeler en urgence
            </a>
          </section>

          {/* FAQ */}
          <section>
            <h2 className="text-xl font-semibold text-primary">Questions fréquentes – Plombier Ambérieu</h2>
            <dl className="mt-4 space-y-4">
              {FAQ_AMBERIEU.map((faq) => (
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
              Grégoire Mathelin — Maître Artisan Plombier Chauffagiste, à votre service depuis 2013.
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
          { href: "/plombier-meximieux", label: "Plombier à Meximieux" },
          { href: "/zones-intervention", label: "Plombier à Lagnieu & Saint-Vulbas" },
          { href: "/zones-intervention", label: "Plombier à Château-Gaillard & Douvres" },
        ]}
        problemesFrequents={[
          { href: "/urgence/fuite-eau-amberieu", label: "Fuite d'eau à Ambérieu" },
          { href: "/urgence/chaudiere-panne-amberieu", label: "Chaudière en panne Ambérieu" },
        ]}
        urgence={{ href: "/urgence-depannage", label: "Urgence plomberie 7j/7" }}
      />

      <SatelliteTestimonialsSection
        title="Avis clients – secteur Ambérieu"
        items={testimonialItems}
        aggregate={aggregateNote}
        googleMapsUrl={getGmbUrlForSatellitePages(settings)}
        sourceHint={
          fromGeocompta
            ? "Avis synchronisés depuis notre fiche Google — même flux que www.mathelin-plomberie.fr."
            : undefined
        }
      />

      <SatelliteLocalFooter variant="amberieu" settings={settings} />
      <SatelliteStickyCall phoneLabel={settings.phone} telHref={telHref} />
    </>
  );
}
