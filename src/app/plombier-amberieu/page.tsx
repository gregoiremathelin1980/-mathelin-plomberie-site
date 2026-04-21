import Link from "next/link";
import { headers } from "next/headers";
import { Phone, FileText } from "lucide-react";
import { getSiteSettings } from "@/lib/content";
import { buttonVariants } from "@/components/ui/button";
import ReassuranceBlock from "@/components/ReassuranceBlock";
import { buildPageMetadata } from "@/lib/seo/metaBuilder";
import SatellitePlumbingJsonLd from "@/components/satellite/SatellitePlumbingJsonLd";
import SatelliteTestimonialsSection from "@/components/satellite/SatelliteTestimonialsSection";
import SatelliteStickyCall from "@/components/satellite/SatelliteStickyCall";
import SatelliteLocalFooter from "@/components/satellite/SatelliteLocalFooter";
import {
  getGmbUrlForSatellitePages,
  getSatelliteLandingsData,
  phoneToTelHref,
  satelliteAggregateFromGbp,
} from "@/lib/satelliteLandings";
import { getSatelliteTestimonialsFromGeocomptaOrFallback } from "@/lib/satelliteReviews";

export const metadata = buildPageMetadata({
  title: "Plombier Ambérieu-en-Bugey & Plaine de l'Ain | Mathelin Plomberie Chauffage",
  description:
    "Plombier chauffagiste BP Génie Climatique : Ambérieu, Lagnieu, Saint-Vulbas, Bugey. Dépannage urgence, fuites, chauffage. Siège à Pérouges depuis 2013.",
  path: "/plombier-amberieu",
});

export default async function PlombierAmberieu() {
  headers();
  const settings = getSiteSettings();
  const landing = getSatelliteLandingsData();
  const telHref = phoneToTelHref(settings.phone);
  const { items: testimonialItems, fromGeocompta, googleBusinessProfile } =
    await getSatelliteTestimonialsFromGeocomptaOrFallback(landing.testimonials_amberieu, 3);
  const aggregateNote = satelliteAggregateFromGbp(googleBusinessProfile);

  return (
    <>
      <SatellitePlumbingJsonLd variant="amberieu" settings={settings} googleBusinessProfile={googleBusinessProfile} />
      <section className="bg-primary px-4 py-8 text-white sm:px-6 sm:py-10">
        <div className="mx-auto max-w-[600px] text-center">
          <h1 className="font-heading text-3xl font-bold leading-tight sm:text-4xl md:text-5xl">
            Plombier Ambérieu-en-Bugey — Plaine de l&apos;Ain &amp; Bugey
          </h1>
          <p className="mt-3 text-base text-primary-50 sm:text-lg">
            <strong>BP Génie Climatique</strong> à <strong>Pérouges</strong>. Urgences plomberie et chauffage côté{" "}
            <strong>Ambérieu</strong>, <strong>Lagnieu</strong>, <strong>Saint-Vulbas</strong> et vallées du{" "}
            <strong>Bugey</strong>.
          </p>
          <div className="mt-6 flex flex-col items-center gap-3 sm:flex-row sm:justify-center sm:gap-4">
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

      <ReassuranceBlock className="py-10 sm:py-12" />

      <main className="container px-4 py-14 text-center sm:px-6 sm:py-16">
        <div className="mx-auto max-w-3xl">
          <p className="mx-auto max-w-[600px] text-gray-text leading-relaxed">
            Entre <strong>Plaine de l&apos;Ain</strong> et relief du <strong>Bugey</strong>, nous intervenons à{" "}
            <strong>Ambérieu-en-Bugey</strong> : fuite après gel, radiateur sous pression, groupe de sécurité,
            débouchage principal.
          </p>

          <h2 className="mt-12 text-xl font-semibold text-primary">Secteur Lagnieu &amp; Saint-Vulbas</h2>
          <p className="mx-auto mt-2 max-w-[600px] text-gray-text leading-relaxed">
            <strong>Lagnieu</strong> et <strong>Saint-Vulbas</strong> : trajets maîtrisés depuis Pérouges, créneaux
            d&apos;urgence selon disponibilité.
          </p>
          <ul className="mx-auto mt-4 max-w-[600px] list-disc pl-6 text-left text-gray-text">
            <li>dépannage chauffage et plomberie d&apos;urgence</li>
            <li>diagnostic fuite et réparation ciblée</li>
            <li>débouchage et entretien sanitaire</li>
            <li>chauffe-eau et robinetterie</li>
          </ul>

          <h2 className="mt-12 text-xl font-semibold text-primary">Lien avec la Côtière (Meximieux)</h2>
          <p className="mx-auto mt-2 max-w-[600px] text-gray-text leading-relaxed">
            Selon l&apos;heure et le secteur, voir aussi{" "}
            <a
              href="https://www.plombier-meximieux.fr/"
              className="font-medium text-primary underline-offset-2 hover:underline"
            >
              plombier Meximieux
            </a>
            . Numéro et adresse artisan alignés sur la fiche Google (cohérence NAP).
          </p>

          <p className="mt-10 text-sm font-medium text-primary">
            Artisan plombier-chauffagiste diplômé (BP Génie Climatique) à votre service depuis 2013.
          </p>
          <Link
            href="/contact"
            className={buttonVariants({ variant: "accent", className: "mt-5 inline-block" })}
          >
            Demander un devis
          </Link>
        </div>
      </main>

      <SatelliteTestimonialsSection
        title="Avis clients (extraits)"
        items={testimonialItems}
        aggregate={aggregateNote}
        googleMapsUrl={getGmbUrlForSatellitePages(settings)}
        sourceHint={
          fromGeocompta
            ? "Extraits d’avis synchronisés via GéoCompta — même flux que le site principal mathelin-plomberie.fr."
            : undefined
        }
      />

      <SatelliteLocalFooter variant="amberieu" settings={settings} />
      <SatelliteStickyCall phoneLabel={settings.phone} telHref={telHref} />
    </>
  );
}
