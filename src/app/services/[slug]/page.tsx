import { notFound } from "next/navigation";
import { SERVICES } from "@/lib/services-data";
import {
  getServiceContent,
  getRealisations,
  getConseils,
  getPrix,
  getVilles,
  getSiteSettings,
} from "@/lib/content";
import { getRecentInterventions } from "@/lib/site-data";
import ServiceTemplate from "@/templates/ServiceTemplate";
import ServiceSchema from "@/components/ServiceSchema";
import FAQSchema from "@/components/FAQSchema";
import BreadcrumbSchema from "@/components/BreadcrumbSchema";

export async function generateStaticParams() {
  return SERVICES.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const service = SERVICES.find((s) => s.slug === slug);
  const content = getServiceContent(slug);
  const title = content?.title ?? service?.title;
  const description = content?.description ?? service?.description;
  if (!title) return {};
  return {
    title: `${title} | Mathelin Plomberie Chauffage`,
    description,
  };
}

export default async function ServiceDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const service = SERVICES.find((s) => s.slug === slug);
  if (!service) notFound();

  const content = getServiceContent(slug);
  const settings = getSiteSettings();
  const villes = getVilles();
  const prix = getPrix();
  const allRealisations = getRealisations();
  const allConseils = getConseils();
  const recentInterventions = getRecentInterventions();

  const title = content?.title ?? service.title;
  const description = content?.description ?? service.description;
  const problems = content?.problems ?? [];
  const intervention = content?.intervention ?? description;
  const faq = content?.faq ?? [];

  const priceKeys = content?.priceKeys ?? [];
  const priceEntries = priceKeys
    .map((key) => {
      const entry = prix[key];
      if (!entry) return null;
      return { label: entry.label ?? key, min: entry.min, max: entry.max };
    })
    .filter(Boolean) as { label: string; min: number; max: number }[];

  let realisations = allRealisations.filter(
    (r) => r.service && r.service.toLowerCase() === title.toLowerCase()
  );
  if (realisations.length === 0 && slug === "debouchage-canalisation") {
    realisations = allRealisations.filter((r) =>
      r.service?.toLowerCase().includes("débouchage")
    );
  }
  if (realisations.length === 0 && slug === "reparation-fuite") {
    realisations = allRealisations.filter(
      (r) =>
        r.service?.toLowerCase().includes("fuite") ||
        r.service?.toLowerCase().includes("réparation")
    );
  }
  if (realisations.length === 0 && /radiateur|plancher|desembouage|chauffage/.test(slug)) {
    realisations = allRealisations.filter(
      (r) =>
        r.service?.toLowerCase().includes("radiateur") ||
        r.service?.toLowerCase().includes("plancher") ||
        r.service?.toLowerCase().includes("désembouage") ||
        r.service?.toLowerCase().includes("chauffage")
    );
  }
  if (realisations.length === 0 && slug.includes("chauffe-eau")) {
    realisations = allRealisations.filter((r) =>
      r.service?.toLowerCase().includes("chauffe-eau")
    );
  }
  if (realisations.length === 0 && slug.includes("chaudiere")) {
    realisations = allRealisations.filter((r) =>
      r.service?.toLowerCase().includes("chaudière")
    );
  }
  if (realisations.length === 0 && (slug === "robinetterie" || slug === "installation-wc")) {
    realisations = allRealisations.filter(
      (r) =>
        r.service?.toLowerCase().includes("robinet") ||
        r.service?.toLowerCase().includes("wc") ||
        r.service?.toLowerCase().includes("sanitaire")
    );
  }
  if (realisations.length === 0) {
    realisations = allRealisations.slice(0, 6);
  }

  const conseilCategories = content?.conseilCategories ?? [];
  const conseils = conseilCategories.length
    ? allConseils.filter((c) => c.category && conseilCategories.includes(c.category))
    : allConseils.slice(0, 5);
  const conseilLinks = conseils.map((c) => ({ slug: c.slug, title: c.title }));

  const breadcrumbItems = [
    { name: "Accueil", path: "/" },
    { name: "Services", path: "/services" },
    { name: title, path: `/services/${slug}` },
  ];

  return (
    <>
      <BreadcrumbSchema items={breadcrumbItems} />
      <ServiceSchema
        name={title}
        description={description}
        serviceType={title}
        areaServed={villes}
      />
      <FAQSchema faq={faq} />
      <ServiceTemplate
        title={title}
        description={description}
        problems={problems}
        intervention={intervention}
        priceEntries={priceEntries}
        cities={villes}
        realisations={realisations}
        conseils={conseilLinks}
        faq={faq}
        phone={settings.phone}
        recentInterventions={recentInterventions}
      />
    </>
  );
}
