import { unstable_noStore } from "next/cache";
import Link from "next/link";
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

const HOME_SERVICES = SERVICES.slice(0, 3);

export default async function HomePage() {
  unstable_noStore();
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

  const pricing = getPricing();
  const simulateur = getSimulateur();
  const recentInterventions = getRecentInterventions();
  const reviews = getRandomReviews(3);
  const settings = getSiteSettings();
  const ds = settings.displaySettings ?? {
    showReviews: true,
    showAdvice: true,
    showAdviceImages: true,
    showEstimator: true,
    showRecentInterventions: true,
  };

  return (
    <>
      {ds.showReviews && reviews.length > 0 && <ReviewsSchema settings={settings} reviews={reviews} />}
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
            Pour les situations urgentes (fuite d&apos;eau, chauffe-eau en panne, radiateur froid, canalisation bouchée), contactez directement votre plombier local.
          </p>
          <p className="mx-auto max-w-2xl px-4 pb-12 text-center text-sm font-medium text-primary">
            Artisan plombier-chauffagiste diplômé (BP Génie Climatique) à votre service depuis 2013.
          </p>
        </>
      )}
      <section id="services" className="px-4 py-12 sm:px-6">
        <div className="mx-auto max-w-6xl">
          <h2 className="font-heading text-2xl font-bold text-primary sm:text-3xl">
            Nos services
          </h2>
          <p className="mt-2 text-gray-text">
            Dépannage plomberie et chauffage autour de Meximieux et Ambérieu : fuite d&apos;eau, canalisation bouchée, chauffe-eau en panne, radiateur froid.
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
