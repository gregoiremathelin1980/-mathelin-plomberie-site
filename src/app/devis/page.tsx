import EstimateForm from "@/components/EstimateForm";
import { getPricing } from "@/lib/content";

export const metadata = {
  title: "Devis | Mathelin Plomberie Chauffage",
  description:
    "Demandez une estimation pour votre intervention plomberie ou chauffage. Pérouges, Meximieux, Ambérieu, Saint-Vulbas, Lagnieu.",
};

export default function DevisPage() {
  const pricing = getPricing();
  return (
    <div className="pb-16 pt-4">
      <EstimateForm pricing={pricing} />
    </div>
  );
}
