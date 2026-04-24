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
import { resolveGmbProfileForStructuredData } from "@/lib/gmbSeoDefaults";
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
    "Plombier à Ambérieu-en-Bugey et sur la Plaine de l'Ain : urgence plomberie, chauffage, fuites. BP Génie Climatique à Pérouges. Devis gratuit, dépannage rapide.",
  path: "/plombier-amberieu",
  canonicalAbsolute: "https://www.plombier-amberieu.fr/",
});

export default async function PlombierAmberieu() {
  headers();
  const settings = getSiteSettings();
  const landing = getSatelliteLandingsData();
  const telHref = phoneToTelHref(settings.phone);
  const { items: testimonialItems, fromGeocompta, googleBusinessProfile } =
    await getSatelliteTestimonialsFromGeocomptaOrFallback(landing.testimonials_amberieu, 3);
  const aggregateNote = satelliteAggregateFromGbp(resolveGmbProfileForStructuredData(googleBusinessProfile));

  return (
    <>
      <SatellitePlumbingJsonLd variant="amberieu" settings={settings} googleBusinessProfile={googleBusinessProfile} />
      <section className="bg-primary px-4 py-10 text-white sm:px-6 sm:py-12">
        <div className="mx-auto max-w-lg text-center">
          <h1 className="font-heading text-3xl font-bold leading-tight sm:text-4xl md:text-5xl">
            Plombier à Ambérieu-en-Bugey
          </h1>
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
              Demander un devis
            </Link>
          </div>
        </div>
      </section>

      <ReassuranceBlock className="py-10 sm:py-12" />

      <main className="container px-4 py-14 text-center sm:px-6 sm:py-16">
        <div className="mx-auto max-w-2xl space-y-10">
          <p className="text-gray-text leading-relaxed">
            Entre <strong>Plaine de l&apos;Ain</strong> et relief du <strong>Bugey</strong>, nous intervenons à{" "}
            <strong>Ambérieu-en-Bugey</strong> : fuite après gel, radiateur sous pression, groupe de sécurité,
            débouchage principal.
          </p>

          <div>
            <h2 className="text-xl font-semibold text-primary">Secteur Lagnieu &amp; Saint-Vulbas</h2>
            <p className="mt-3 text-gray-text leading-relaxed">
              <strong>Lagnieu</strong> et <strong>Saint-Vulbas</strong> : trajets maîtrisés depuis Pérouges, créneaux
              d&apos;urgence selon disponibilité.
            </p>
            <ul className="mx-auto mt-4 max-w-md space-y-2 text-center text-gray-text">
              <li>• dépannage chauffage et plomberie d&apos;urgence</li>
              <li>• diagnostic fuite et réparation ciblée</li>
              <li>• débouchage et entretien sanitaire</li>
              <li>• chauffe-eau et robinetterie</li>
            </ul>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-primary">Lien avec la Côtière (Meximieux)</h2>
            <p className="mt-3 text-gray-text leading-relaxed">
              Selon l&apos;heure et le secteur, voir aussi{" "}
              <a
                href="https://www.plombier-meximieux.fr/"
                className="font-medium text-primary underline-offset-2 hover:underline"
              >
                plombier Meximieux
              </a>
              . Numéro et adresse artisan alignés sur la fiche Google (cohérence NAP).
            </p>
          </div>

          <p className="text-sm font-medium text-primary">
            Artisan plombier-chauffagiste diplômé (BP Génie Climatique) à votre service depuis 2013.
          </p>
          <Link href="/contact" className={buttonVariants({ variant: "accent", className: "inline-block" })}>
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
            ? "Extraits d’avis synchronisés via GéoCompta — même flux que le site principal www.mathelin-plomberie.fr."
            : undefined
        }
      />

      <SatelliteLocalFooter variant="amberieu" settings={settings} />
      <SatelliteStickyCall phoneLabel={settings.phone} telHref={telHref} />
    </>
  );
}
