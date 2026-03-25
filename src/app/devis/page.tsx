import EstimateForm from "@/components/EstimateForm";
import { getPricing, getSiteSettings } from "@/lib/content";
import { buildPageMetadata } from "@/lib/seo/metaBuilder";

export const metadata = buildPageMetadata({
  title: "Devis | Mathelin Plomberie Chauffage",
  description:
    "Demandez une estimation pour votre intervention plomberie ou chauffage. Pérouges, Meximieux, Ambérieu, Saint-Vulbas, Lagnieu.",
  path: "/devis",
});

export default function DevisPage() {
  const pricing = getPricing();
  const settings = getSiteSettings();
  const showEstimator = settings.displaySettings.showEstimator !== false;

  if (!showEstimator) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-16 text-center text-gray-600">
        <p>L&apos;estimateur de prix est actuellement désactivé.</p>
        <p className="mt-2 text-sm">Contactez-nous pour une estimation personnalisée.</p>
      </div>
    );
  }

  return (
    <div className="pb-16 pt-4">
      <EstimateForm pricing={pricing} />
    </div>
  );
}
