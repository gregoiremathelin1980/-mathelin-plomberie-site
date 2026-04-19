import { unstable_noStore } from "next/cache";
import { headers } from "next/headers";
import Link from "next/link";
import Image from "next/image";
import dynamic from "next/dynamic";
import Hero from "@/components/Hero";
import ServiceCard from "@/components/ServiceCard";
import HomeBelowFoldFallback from "@/components/home/HomeBelowFoldFallback";
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
import {
  getCachedGeocomptaHomepage,
  getCachedGeocomptaReviewPool,
  getGeocomptaHomeRevalidateSeconds,
} from "@/lib/api/geocomptaCached";
import { pickRotatingReviews } from "@/lib/reviewsRotation";
import { allowSiteDataHomeReviews } from "@/lib/reviewsHomePolicy";
import type { ReviewEntry } from "@/lib/site-data";
import { buildPageMetadata } from "@/lib/seo/metaBuilder";

const EstimateForm = dynamic(() => import("@/components/EstimateForm"), {
  ssr: true,
  loading: () => (
    <HomeBelowFoldFallback minHeightClass="min-h-[380px]" label="Chargement de l'estimateur de prix" />
  ),
});
const ContactForm = dynamic(() => import("@/components/ContactForm"), {
  ssr: true,
  loading: () => (
    <HomeBelowFoldFallback minHeightClass="min-h-[360px]" label="Chargement du formulaire de contact" />
  ),
});
const ProjectGallery = dynamic(() => import("@/components/ProjectGallery"), {
  ssr: true,
  loading: () => (
    <HomeBelowFoldFallback minHeightClass="min-h-[260px]" label="Chargement des réalisations" />
  ),
});
const AdvicePreview = dynamic(() => import("@/components/AdvicePreview"), {
  ssr: true,
  loading: () => (
    <HomeBelowFoldFallback minHeightClass="min-h-[320px]" label="Chargement des conseils" />
  ),
});

export const metadata = buildPageMetadata({
  title: "Mathelin Plomberie Chauffage | Plombier Pérouges, Meximieux, Ambérieu",
  description:
    "Plombier chauffagiste à Pérouges, Meximieux, Ambérieu-en-Bugey et Lagnieu. Dépannage plomberie, chauffe-eau, radiateurs, débouchage. Devis gratuit.",
  path: "/",
});

const HOME_SERVICES = SERVICES.slice(0, 3);

function getHomeReviewsDisplayCount(): number {
  const raw = process.env.GEOCOMPTA_HOME_REVIEWS_DISPLAY_COUNT;
  const n = raw != null && raw.trim() !== "" ? Number(raw) : NaN;
  if (Number.isFinite(n) && n >= 1 && n <= 24) return Math.floor(n);
  return 6;
}

/** ISR aligné sur le cache homepage GéoCompta (≤ au créneau de sync API, ex. 1800 s pour 30 min). */
export const revalidate = isGeocomptaConfigured() ? getGeocomptaHomeRevalidateSeconds() : 0;

export default async function HomePage() {
  /** Lit l’env à chaque requête (évite un module figé sans GEO sur certains workers). */
  headers();
  const geo = isGeocomptaConfigured();
  if (!geo) unstable_noStore();

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

  if (geo) {
    const displayCount = getHomeReviewsDisplayCount();
    const rotationSeed = Date.now();
    const hp = await getCachedGeocomptaHomepage();
    let reviewPool: ReviewEntry[] = [];
    let reviewsLoadError: string | undefined;
    try {
      reviewPool = await getCachedGeocomptaReviewPool();
    } catch (e) {
      const msg = e instanceof Error ? e.message : String(e);
      console.warn("[geocompta] pool avis (/api/public/reviews) indisponible:", e);
      reviewsLoadError = msg;
    }

    const realisations = hp.featuredRealisations.map((r) => ({
      id: r.slug,
      slug: r.slug,
      title: r.title,
      city: r.city,
      image: getPhotoUrl(r.image ?? r.images?.[0]),
      description: r.description,
    }));

    const reviewsFromHomeFeatured: ReviewEntry[] = hp.featuredReviews.map((r) => ({
      author: r.author,
      rating: r.rating,
      text: r.text,
      date: r.date,
      source: r.source,
    }));
    /** GéoComptaAE uniquement : `GET /api/public/reviews` puis `featuredReviews` du homepage — pas de fichier démo. */
    const reviews: ReviewEntry[] =
      reviewPool.length > 0
        ? pickRotatingReviews(reviewPool, displayCount, rotationSeed)
        : reviewsFromHomeFeatured.length > 0
          ? pickRotatingReviews(reviewsFromHomeFeatured, displayCount, rotationSeed)
          : [];

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
          <HomeRecentInterventions interventions={interventions} />
        )}
        {ds.showReviews && (
          <GoogleReviewsBlock
            reviews={reviews}
            geocomptaApiMode
            geocomptaReviewsLoadError={reviews.length === 0 ? reviewsLoadError : undefined}
            googleReviewsPageUrl={settings.googleReviewsUrl}
          />
        )}
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
  /** Voir `reviewsHomePolicy` + tests `npm run test`. */
  const allowFileHomeReviews = allowSiteDataHomeReviews();
  const reviews = allowFileHomeReviews ? getRandomReviews(3) : [];

  return (
    <>
      {ds.showReviews && reviews.length > 0 && <ReviewsSchema reviews={reviews} />}
      <Hero />
      {ds.showRecentInterventions && recentInterventions.length > 0 && (
        <HomeRecentInterventions interventions={recentInterventions} maxItems={5} />
      )}
      {ds.showReviews && (
        <GoogleReviewsBlock
          reviews={reviews}
          geocomptaApiMode={!allowFileHomeReviews}
          googleReviewsPageUrl={settings.googleReviewsUrl}
          reviewsEmptyHint={
            !allowFileHomeReviews
              ? "Les avis Google s’affichent ici via GéoCompta : dans Vercel, renseignez GEOCOMPTA_BASE_URL (HTTPS, ex. …:8443), GEOCOMPTA_API_KEY (Bearer), sur Production + Preview + Development, puis **Redeploy**. Ne pas utiliser de nom NEXT_PUBLIC_ pour la clé."
              : undefined
          }
        />
      )}
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
