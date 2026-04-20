import Link from "next/link";
import { Phone, FileText } from "lucide-react";
import { getSiteSettings } from "@/lib/content";
import { buttonVariants } from "@/components/ui/button";
import ReassuranceBlock from "@/components/ReassuranceBlock";
import { buildPageMetadata } from "@/lib/seo/metaBuilder";
import SatellitePlumbingJsonLd from "@/components/satellite/SatellitePlumbingJsonLd";
import SatelliteTestimonialsSection from "@/components/satellite/SatelliteTestimonialsSection";
import SatelliteStickyCall from "@/components/satellite/SatelliteStickyCall";
import SatelliteLocalFooter from "@/components/satellite/SatelliteLocalFooter";
import { getSatelliteLandingsData, phoneToTelHref } from "@/lib/satelliteLandings";

export const metadata = buildPageMetadata({
  title: "Plombier Ambérieu-en-Bugey & Plaine de l'Ain | Mathelin Plomberie Chauffage",
  description:
    "Plombier chauffagiste BP Génie Climatique : Ambérieu, Lagnieu, Saint-Vulbas, Bugey. Dépannage urgence, fuites, chauffage. Siège à Pérouges depuis 2013.",
  path: "/plombier-amberieu",
});

export default async function PlombierAmberieu() {
  const settings = getSiteSettings();
  const landing = getSatelliteLandingsData();
  const telHref = phoneToTelHref(settings.phone);

  return (
    <>
      <SatellitePlumbingJsonLd
        variant="amberieu"
        settings={settings}
        includeAggregateRating={landing.testimonials_amberieu.length > 0}
      />
      <section className="bg-primary px-4 py-12 text-white sm:px-6 sm:py-16">
        <div className="mx-auto max-w-3xl text-center">
          <h1 className="font-heading text-3xl font-bold leading-tight sm:text-4xl md:text-5xl">
            Plombier Ambérieu-en-Bugey — Plaine de l&apos;Ain &amp; Bugey
          </h1>
          <p className="mt-4 text-lg text-primary-50">
            Artisan <strong>BP Génie Climatique</strong> basé à <strong>Pérouges</strong>. Nous concentrons nos
            déplacements côté <strong>Ambérieu</strong>, <strong>Lagnieu</strong>, <strong>Saint-Vulbas</strong> et
            vallées du <strong>Bugey</strong> : urgence plomberie, chauffage et eau sanitaire, sans confondre avec le
            discours d&apos;un site « générique ».
          </p>
          <div className="mt-8 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <a
              href={telHref}
              className={buttonVariants({
                variant: "accent",
                size: "lg",
                className: "inline-flex items-center gap-2 bg-accent text-white hover:bg-accent/90",
              })}
            >
              <Phone className="h-5 w-5" aria-hidden />
              Appeler
            </a>
            <Link
              href="/devis"
              className={buttonVariants({
                variant: "outline",
                size: "lg",
                className: "inline-flex items-center gap-2 border-white bg-white/10 text-white hover:bg-white/20",
              })}
            >
              <FileText className="h-5 w-5" aria-hidden />
              Demander un devis
            </Link>
          </div>
        </div>
      </section>

      <ReassuranceBlock />

      <main className="container px-4 py-12">
        <p className="text-gray-text leading-relaxed">
          Entre <strong>Plaine de l&apos;Ain</strong> et relief du <strong>Bugey</strong>, les installations vieillissent
          autrement (pentes, extensions, anciens réseaux). Nous intervenons à <strong>Ambérieu-en-Bugey</strong> pour des
          situations concrètes : fuite après gel, radiateur qui ne monte plus en pression, remplacement de groupe de
          sécurité, débouchage principal.
        </p>

        <h2 className="mt-10 text-xl font-semibold text-primary">Secteur Lagnieu &amp; Saint-Vulbas</h2>
        <p className="mt-2 text-gray-text leading-relaxed">
          <strong>Lagnieu</strong> et <strong>Saint-Vulbas</strong> sont des points d&apos;ancrage fréquents : trajets
          routiers maîtrisés depuis Pérouges, créneaux d&apos;urgence selon disponibilité. Nous coordonnons avec vous
          l&apos;accès logement ou local pro pour limiter l&apos;arrêt d&apos;activité.
        </p>
        <ul className="mt-4 list-disc pl-6 text-gray-text">
          <li>dépannage chauffage et plomberie d&apos;urgence</li>
          <li>diagnostic fuite et réparation ciblée</li>
          <li>débouchage et entretien sanitaire</li>
          <li>chauffe-eau et robinetterie</li>
        </ul>

        <h2 className="mt-10 text-xl font-semibold text-primary">Lien avec la Côtière (Meximieux)</h2>
        <p className="mt-2 text-gray-text leading-relaxed">
          Certaines interventions restent plus logiques depuis notre organisation côté{" "}
          <strong>Meximieux / Côtière</strong> selon l&apos;heure et le secteur — voir{" "}
          <a
            href="https://www.plombier-meximieux.fr/"
            className="font-medium text-primary underline-offset-2 hover:underline"
          >
            plombier Meximieux
          </a>
          . Le numéro et l&apos;adresse artisan restent les mêmes que sur notre fiche Google (cohérence NAP).
        </p>

        <p className="mt-8 text-sm font-medium text-primary">
          Artisan plombier-chauffagiste diplômé (BP Génie Climatique) à votre service depuis 2013.
        </p>
        <Link
          href="/contact"
          className={buttonVariants({ variant: "accent", className: "mt-6 inline-block" })}
        >
          Demander un devis
        </Link>
      </main>

      <SatelliteTestimonialsSection
        title="Avis clients (extraits)"
        items={landing.testimonials_amberieu}
        aggregate={landing.googleAggregateRating}
        googleMapsUrl={settings.googleReviewsUrl}
      />

      <SatelliteLocalFooter variant="amberieu" settings={settings} />
      <SatelliteStickyCall phoneLabel={settings.phone} telHref={telHref} />
    </>
  );
}
