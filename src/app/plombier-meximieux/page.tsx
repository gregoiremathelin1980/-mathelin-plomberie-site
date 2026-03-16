import Link from "next/link";
import { Phone, FileText } from "lucide-react";
import { getSiteSettings } from "@/lib/content";
import { buttonVariants } from "@/components/ui/button";
import ReassuranceBlock from "@/components/ReassuranceBlock";

export const metadata = {
  title: "Plombier Chauffagiste à Meximieux (01800) | Dépannage et chauffage",
  description:
    "Plombier chauffagiste à Meximieux : BP Génie Climatique, installation depuis 2013. Intervention rapide à Meximieux, Pérouges, Villieu-Loyes-Mollon et Rignieux-le-Franc.",
};

export default async function PlombierMeximieux() {
  const settings = getSiteSettings();
  const phoneRaw = settings.phone.replace(/\s/g, "");

  return (
    <>
      <section className="bg-primary px-4 py-12 text-white sm:px-6 sm:py-16">
        <div className="mx-auto max-w-3xl text-center">
          <h1 className="font-heading text-3xl font-bold leading-tight sm:text-4xl md:text-5xl">
            Plombier Chauffagiste à Meximieux (01800)
          </h1>
          <p className="mt-4 text-lg text-primary-50">
            Brevet Professionnel Génie Climatique, installation depuis 2013.
            Intervention rapide à Meximieux, Pérouges, Villieu-Loyes-Mollon et
            Rignieux-le-Franc.
          </p>
          <div className="mt-8 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <a
              href={`tel:${phoneRaw}`}
              className={buttonVariants({
                variant: "accent",
                size: "lg",
                className: "inline-flex items-center gap-2 bg-accent text-white hover:bg-accent/90",
              })}
            >
              <Phone className="h-5 w-5" aria-hidden />
              Appeler
            </a>
            <Link
              href="/devis"
              className={buttonVariants({
                variant: "outline",
                size: "lg",
                className: "inline-flex items-center gap-2 border-white bg-white/10 text-white hover:bg-white/20",
              })}
            >
              <FileText className="h-5 w-5" aria-hidden />
              Demander un devis
            </Link>
          </div>
        </div>
      </section>

      <ReassuranceBlock />

      <main className="container px-4 py-12">
        <p className="text-gray-text">
          Dépannage plomberie de Meximieux à Ambérieu-en-Bugey, en passant par
          Saint-Vulbas et Lagnieu. Mathelin Plomberie intervient à Meximieux pour
          tous vos travaux de plomberie et chauffage : dépannage urgent,
          réparation de fuite d&apos;eau, débouchage de canalisation et
          remplacement de chauffe-eau.
        </p>

        <h2 className="mt-8 text-xl font-semibold text-primary">
          Dépannage plomberie à Meximieux
        </h2>
        <p className="mt-2 text-gray-text">
          Nous intervenons rapidement pour les urgences plomberie : fuite
          d&apos;eau, canalisation bouchée, problème de chauffe-eau ou panne de
          chauffage.
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
          Pérouges, Villieu-Loyes-Mollon, Rignieux-le-Franc, Faramans,
          Chazey-sur-Ain, Saint-Maurice-de-Gourdans et Blyes.
        </p>

        <Link
          href="/contact"
          className={buttonVariants({ variant: "accent", className: "mt-8 inline-block" })}
        >
          Demander un devis
        </Link>
      </main>
    </>
  );
}
