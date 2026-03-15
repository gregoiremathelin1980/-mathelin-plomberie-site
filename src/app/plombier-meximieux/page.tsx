import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";

export const metadata = {
  title: "Plombier à Meximieux | Dépannage plomberie et chauffage",
  description:
    "Mathelin Plomberie intervient à Meximieux et dans un rayon de 20 km pour dépannage plomberie, fuite d'eau, débouchage canalisation et installation de chauffe-eau.",
};

export default function PlombierMeximieux() {
  return (
    <main className="container px-4 py-16">
      <h1 className="font-heading text-3xl font-bold text-primary sm:text-4xl">
        Plombier à Meximieux
      </h1>

      <p className="mt-6 text-gray-text">
        Mathelin Plomberie intervient à Meximieux pour tous vos travaux de
        plomberie et chauffage : dépannage urgent, réparation de fuite d&apos;eau,
        débouchage de canalisation et remplacement de chauffe-eau.
      </p>

      <h2 className="mt-8 text-xl font-semibold text-primary">
        Dépannage plomberie à Meximieux
      </h2>

      <p className="mt-2 text-gray-text">
        Nous intervenons rapidement pour les urgences plomberie :
        fuite d&apos;eau, canalisation bouchée, problème de chauffe-eau ou panne
        de chauffage.
      </p>

      <ul className="mt-4 list-disc pl-6 text-gray-text">
        <li>réparation fuite d&apos;eau</li>
        <li>débouchage canalisation</li>
        <li>dépannage chauffe-eau</li>
        <li>installation sanitaire</li>
        <li>remplacement chauffe-eau</li>
      </ul>

      <h2 className="mt-8 text-xl font-semibold text-primary">
        Zone d&apos;intervention autour de Meximieux
      </h2>

      <p className="mt-2 text-gray-text">
        Nous intervenons à Meximieux et dans les communes voisines :
        Pérouges, Villieu-Loyes-Mollon, Faramans, Chazey-sur-Ain,
        Saint-Maurice-de-Gourdans et Blyes.
      </p>

      <Link href="/contact" className={buttonVariants({ variant: "accent", className: "mt-8 inline-block" })}>
        Demander un devis
      </Link>
    </main>
  );
}
