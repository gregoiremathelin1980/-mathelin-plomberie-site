import Link from "next/link";
import { Wrench } from "lucide-react";
import EstimateForm from "@/components/EstimateForm";
import { getPricing } from "@/lib/content";
import { buildPageMetadata } from "@/lib/seo/metaBuilder";

export const metadata = buildPageMetadata({
  title: "Dépannage plomberie | Mathelin Plomberie Chauffage",
  description:
    "Dépannage plomberie et chauffage : fuite, débouchage, chauffe-eau. Pérouges, Meximieux, Ambérieu, Lagnieu et la Côtière. Estimation en ligne.",
  path: "/depannage",
});

export default function DepannagePage() {
  const pricing = getPricing();

  return (
    <div className="px-4 py-16 sm:px-6">
      <div className="mx-auto max-w-3xl">
        <div className="mb-12 flex items-center gap-3">
          <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
            <Wrench className="h-7 w-7" />
          </span>
          <div>
            <h1 className="font-heading text-3xl font-bold text-primary">
              Dépannage plomberie
            </h1>
            <p className="mt-1 text-gray-text">
              Explications et interventions typiques pour chaque type de dépannage.
            </p>
          </div>
        </div>
        <p className="mb-8 text-gray-text">
          <Link href="/urgence-depannage" className="font-medium text-primary underline hover:no-underline">
            Urgence plomberie à Pérouges, Meximieux, Ambérieu et dans toute la Côtière — intervention rapide, selon le degré d&apos;urgence
          </Link>
        </p>
      </div>
      <EstimateForm pricing={pricing} headingLevel="h2" />
    </div>
  );
}
