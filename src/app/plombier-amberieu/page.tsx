import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";

export const metadata = {
  title: "Plombier à Ambérieu-en-Bugey | Dépannage et chauffage",
  description:
    "Plombier à Ambérieu-en-Bugey : dépannage plomberie, réparation fuite, installation sanitaire et entretien chauffage.",
};

export default function PlombierAmberieu() {
  return (
    <main className="container px-4 py-16">
      <h1 className="font-heading text-3xl font-bold text-primary sm:text-4xl">
        Plombier à Ambérieu-en-Bugey
      </h1>

      <p className="mt-6 text-gray-text">
        Mathelin Plomberie intervient à Ambérieu-en-Bugey pour vos travaux
        de plomberie et chauffage : dépannage urgent, réparation de fuite
        d&apos;eau, remplacement de chauffe-eau et rénovation de salle de bain.
      </p>

      <h2 className="mt-8 text-xl font-semibold text-primary">
        Dépannage plomberie à Ambérieu
      </h2>

      <ul className="mt-4 list-disc pl-6 text-gray-text">
        <li>dépannage plomberie urgence</li>
        <li>réparation fuite d&apos;eau</li>
        <li>débouchage évier et canalisation</li>
        <li>entretien chauffe-eau</li>
        <li>installation sanitaire</li>
      </ul>

      <h2 className="mt-8 text-xl font-semibold text-primary">
        Intervention autour d&apos;Ambérieu
      </h2>

      <p className="mt-2 text-gray-text">
        Nous intervenons à Ambérieu-en-Bugey et dans les communes proches :
        Château-Gaillard, Saint-Denis-en-Bugey, Bettant,
        Lagnieu, Leyment et Meximieux.
      </p>

      <Link href="/contact" className={buttonVariants({ variant: "accent", className: "mt-8 inline-block" })}>
        Demander un devis
      </Link>
    </main>
  );
}
