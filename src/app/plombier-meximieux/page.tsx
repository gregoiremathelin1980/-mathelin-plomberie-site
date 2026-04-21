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
  title: "Plombier Meximieux & Côtière de l'Ain | Mathelin Plomberie Chauffage",
  description:
    "Plombier chauffagiste BP Génie Climatique : Meximieux, Pérouges, Côtière de l'Ain. Dépannage fuite, débouchage, chauffe-eau. Artisan à Pérouges depuis 2013.",
  path: "/plombier-meximieux",
});

export default async function PlombierMeximieux() {
  headers();
  const settings = getSiteSettings();
  const landing = getSatelliteLandingsData();
  const telHref = phoneToTelHref(settings.phone);
  const { items: testimonialItems, fromGeocompta, googleBusinessProfile } =
    await getSatelliteTestimonialsFromGeocomptaOrFallback(landing.testimonials_meximieux, 3);
  const aggregateNote = satelliteAggregateFromGbp(googleBusinessProfile);

  return (
    <>
      <SatellitePlumbingJsonLd variant="meximieux" settings={settings} googleBusinessProfile={googleBusinessProfile} />
      <section className="bg-primary px-4 py-8 text-white sm:px-6 sm:py-10">
        <div className="mx-auto max-w-[600px] text-center">
          <h1 className="font-heading text-3xl font-bold leading-tight sm:text-4xl md:text-5xl">
            Plombier à Meximieux — Côtière de l&apos;Ain &amp; Pérouges
          </h1>
          <p className="mt-3 text-base text-primary-50 sm:text-lg">
            <strong>BP Génie Climatique</strong>, basé à <strong>Pérouges</strong>. Urgences plomberie et chauffage sur
            la <strong>Côtière</strong> et le bassin de <strong>Pérouges</strong>.
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
            Sur la <strong>Plaine de l&apos;Ain côté Côtière</strong>, les fuites et canalisation bouchée ne préviennent
            pas. Diagnostic clair avant toute pièce changée : dépannage à <strong>Meximieux</strong>, interventions vers{" "}
            <strong>Pérouges</strong>, <strong>Villieu-Loyes-Mollon</strong> ou <strong>Rignieux-le-Franc</strong>.
          </p>

          <h2 className="mt-12 text-xl font-semibold text-primary">Dépannage plomberie &amp; chauffage</h2>
          <p className="mx-auto mt-2 max-w-[600px] text-gray-text leading-relaxed">
            Fuites d&apos;eau, évier ou WC bouché, chauffe-eau en panne, radiateur froid : priorité aux secteurs où
            l&apos;eau et le chauffage structurent votre quotidien.
          </p>
          <ul className="mx-auto mt-4 max-w-[600px] list-disc pl-6 text-left text-gray-text">
            <li>recherche et réparation de fuite</li>
            <li>débouchage canalisation et sanitaires</li>
            <li>remplacement ou réparation de chauffe-eau</li>
            <li>petite robinetterie et réglage de chauffage</li>
          </ul>

          <h2 className="mt-12 text-xl font-semibold text-primary">Pourquoi nous appeler depuis Meximieux&nbsp;?</h2>
          <p className="mx-auto mt-2 max-w-[600px] text-gray-text leading-relaxed">
            Base artisanale à <strong>Pérouges (01800)</strong>, déplacements maîtrisés vers la Côtière. Pour le{" "}
            <strong>Bugey</strong> et <strong>Ambérieu</strong>, voir notre{" "}
            <a
              href="https://www.plombier-amberieu.fr/"
              className="font-medium text-primary underline-offset-2 hover:underline"
            >
              plombier Ambérieu-en-Bugey
            </a>
            .
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

      <SatelliteLocalFooter variant="meximieux" settings={settings} />
      <SatelliteStickyCall phoneLabel={settings.phone} telHref={telHref} />
    </>
  );
}
