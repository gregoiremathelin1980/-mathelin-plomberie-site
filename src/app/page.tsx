import { unstable_noStore } from "next/cache";
import Link from "next/link";
import Image from "next/image";
import Hero from "@/components/Hero";
import ServiceCard from "@/components/ServiceCard";
import EstimateForm from "@/components/EstimateForm";
import ProjectGallery from "@/components/ProjectGallery";
import AdvicePreview from "@/components/AdvicePreview";
import ContactForm from "@/components/ContactForm";
import UrgencyBlock from "@/components/UrgencyBlock";
import HomeRecentInterventions from "@/components/HomeRecentInterventions";
import { getRealisations, getRandomConseils, getPricing } from "@/lib/content";
import { getRecentInterventions, getSimulateur, getRandomReviews } from "@/lib/site-data";
import { getSiteSettings } from "@/lib/content";
import { getPhotoUrl } from "@/lib/config";
import { SERVICES } from "@/lib/services-data";
import { buttonVariants } from "@/components/ui/button";
import GoogleReviewsBlock from "@/components/GoogleReviewsBlock";
import ReviewsSchema from "@/components/ReviewsSchema";
import { isGeocomptaConfigured } from "@/lib/api/geocomptaClient";
import { getCachedGeocomptaHomepage } from "@/lib/api/geocomptaCached";
import type { ReviewEntry } from "@/lib/site-data";
import { buildPageMetadata } from "@/lib/seo/metaBuilder";

export const metadata = buildPageMetadata({
  title: "Mathelin Plomberie Chauffage | Plombier Pérouges, Meximieux, Ambérieu",
  description:
    "Plombier chauffagiste à Pérouges, Meximieux, Ambérieu-en-Bugey et Lagnieu. Dépannage plomberie, chauffe-eau, radiateurs, débouchage. Devis gratuit.",
  path: "/",
});

const HOME_SERVICES = SERVICES.slice(0, 3);

const GEO = isGeocomptaConfigured();

/** ISR 1 h quand GéoCompta est configuré ; sinon pages dynamiques (avis / conseils aléatoires fichiers). */
export const revalidate = GEO ? 3600 : 0;

export default async function HomePage() {
  if (!GEO) unstable_noStore();

  const pricing = getPricing();
  const simulateur = getSimulateur();
  const settings = getSiteSettings();
  const ds = settings.displaySettings ?? {
    showReviews: true,
    showAdvice: true,
    showAdviceImages: true,
    showEstimator: true,
    showRecentInterventions: true,
  };

  if (GEO) {
    const hp = await getCachedGeocomptaHomepage();

    const realisations = hp.featuredRealisations.map((r) => ({
      id: r.slug,
      slug: r.slug,
      title: r.title,
      city: r.city,
      image: getPhotoUrl(r.image ?? r.images?.[0]),
      description: r.description,
    }));

    const reviews: ReviewEntry[] = hp.featuredReviews.map((r) => ({
      author: r.author ?? r.name,
      rating: r.rating,
      text: r.text,
      date: r.date,
    }));

    const interventions = hp.featuredInterventions.map((i) => ({
      city: i.city,
      label: i.label,
      slug: i.slug,
      date: i.date,
    }));

    const conseilsForPreview = hp.featuredAdvice.map((a) => ({
      slug: a.slug,
      title: a.title,
      excerpt: a.excerpt,
      category: a.category,
      city: a.city,
      date: a.date,
      draft: false as const,
      content: "",
      heroImage: a.image,
    }));

    return (
      <>
        {ds.showReviews && reviews.length > 0 && <ReviewsSchema reviews={reviews} />}
        <Hero />
        {ds.showRecentInterventions && interventions.length > 0 && (
          <HomeRecentInterventions interventions={interventions} maxItems={20} />
        )}
        {ds.showReviews && <GoogleReviewsBlock reviews={reviews} layoutMode="stable" />}
        <UrgencyBlock />
        {hp.featuredPhotos.length > 0 && (
          <section className="border-y border-primary/10 bg-gray-50/80 px-4 py-10 sm:px-6" aria-label="Photos">
            <div className="mx-auto max-w-6xl">
              <h2 className="font-heading text-xl font-bold text-primary">Sur le terrain</h2>
              <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-4">
                {hp.featuredPhotos.slice(0, 8).map((ph, i) => {
                  const src = getPhotoUrl(ph.url);
                  if (!src) return null;
                  return (
                    <div key={i} className="relative aspect-square overflow-hidden rounded-xl bg-gray-200">
                      <Image
                        src={src}
                        alt={ph.alt ?? ph.caption ?? "Réalisation plomberie"}
                        fill
                        className="object-cover"
                        sizes="(max-width: 640px) 50vw, 25vw"
                      />
                    </div>
                  );
                })}
              </div>
            </div>
          </section>
        )}
        {ds.showEstimator && (
          <>
            <EstimateForm pricing={pricing} simulateur={simulateur} />
            <p className="mx-auto max-w-2xl px-4 pb-8 text-center text-sm text-gray-600">
              Diagnostic sur place et devis clair avant toute intervention.
            </p>
            <p className="mx-auto max-w-2xl px-4 pb-4 text-center text-sm text-gray-600">
              Pour les situations urgentes (fuite d&apos;eau, chauffe-eau en panne, radiateur froid, canalisation
              bouchée), contactez directement votre plombier local.
            </p>
            <p className="mx-auto max-w-2xl px-4 pb-12 text-center text-sm font-medium text-primary">
              Artisan plombier-chauffagiste diplômé (BP Génie Climatique) à votre service depuis 2013.
            </p>
          </>
        )}
        <section id="services" className="px-4 py-12 sm:px-6">
          <div className="mx-auto max-w-6xl">
            <h2 className="font-heading text-2xl font-bold text-primary sm:text-3xl">Nos services</h2>
            <p className="mt-2 text-gray-text">
              Dépannage plomberie et chauffage autour de Meximieux et Ambérieu : fuite d&apos;eau, canalisation
              bouchée, chauffe-eau en panne, radiateur froid.
            </p>
            <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {HOME_SERVICES.map((s) => (
                <ServiceCard
                  key={s.slug}
                  slug={s.slug}
                  title={s.title}
                  description={s.description}
                  iconKey={s.icon}
                />
              ))}
            </div>
            <div className="mt-8 flex justify-center">
              <Link href="/services" className={buttonVariants({ variant: "outline" })}>
                Voir tous les services
              </Link>
            </div>
          </div>
        </section>
        <ProjectGallery realisations={realisations} />
        {ds.showAdvice && <AdvicePreview conseils={conseilsForPreview} />}
        <ContactForm />
      </>
    );
  }

  const [rawRealisations, randomConseils] = await Promise.all([
    getRealisations(),
    Promise.resolve(getRandomConseils(3)),
  ]);
  const realisations = rawRealisations.map((r) => ({
    id: r.slug,
    slug: r.slug,
    title: r.title,
    city: r.city,
    image: getPhotoUrl(r.images?.[0]),
    description: r.description,
  }));

  const recentInterventions = getRecentInterventions();
  const reviews = getRandomReviews(3);

  return (
    <>
      {ds.showReviews && reviews.length > 0 && <ReviewsSchema reviews={reviews} />}
      <Hero />
      {ds.showRecentInterventions && recentInterventions.length > 0 && (
        <HomeRecentInterventions interventions={recentInterventions} />
      )}
      {ds.showReviews && <GoogleReviewsBlock reviews={reviews} />}
      <UrgencyBlock />
      {ds.showEstimator && (
        <>
          <EstimateForm pricing={pricing} simulateur={simulateur} />
          <p className="mx-auto max-w-2xl px-4 pb-8 text-center text-sm text-gray-600">
            Diagnostic sur place et devis clair avant toute intervention.
          </p>
          <p className="mx-auto max-w-2xl px-4 pb-4 text-center text-sm text-gray-600">
            Pour les situations urgentes (fuite d&apos;eau, chauffe-eau en panne, radiateur froid, canalisation
            bouchée), contactez directement votre plombier local.
          </p>
          <p className="mx-auto max-w-2xl px-4 pb-12 text-center text-sm font-medium text-primary">
            Artisan plombier-chauffagiste diplômé (BP Génie Climatique) à votre service depuis 2013.
          </p>
        </>
      )}
      <section id="services" className="px-4 py-12 sm:px-6">
        <div className="mx-auto max-w-6xl">
          <h2 className="font-heading text-2xl font-bold text-primary sm:text-3xl">Nos services</h2>
          <p className="mt-2 text-gray-text">
            Dépannage plomberie et chauffage autour de Meximieux et Ambérieu : fuite d&apos;eau, canalisation
            bouchée, chauffe-eau en panne, radiateur froid.
          </p>
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {HOME_SERVICES.map((s) => (
              <ServiceCard
                key={s.slug}
                slug={s.slug}
                title={s.title}
                description={s.description}
                iconKey={s.icon}
              />
            ))}
          </div>
          <div className="mt-8 flex justify-center">
            <Link href="/services" className={buttonVariants({ variant: "outline" })}>
              Voir tous les services
            </Link>
          </div>
        </div>
      </section>
      <ProjectGallery realisations={realisations} />
      {ds.showAdvice && <AdvicePreview conseils={randomConseils} />}
      <ContactForm />
    </>
  );
}
