import Link from "next/link";
import { Phone, FileText } from "lucide-react";
import { getSiteSettings } from "@/lib/content";
import { buttonVariants } from "@/components/ui/button";
import ReassuranceBlock from "@/components/ReassuranceBlock";

export const metadata = {
  title: "Plombier Chauffagiste à Ambérieu-en-Bugey | Dépannage et chauffage",
  description:
    "Plombier chauffagiste à Ambérieu-en-Bugey : BP Génie Climatique, 13 ans d'expérience. Dépannage plomberie de Meximieux à Ambérieu, Saint-Vulbas et Lagnieu. Intervention rapide.",
};

export default async function PlombierAmberieu() {
  const settings = getSiteSettings();
  const phoneRaw = settings.phone.replace(/\s/g, "");

  return (
    <>
      <section className="bg-primary px-4 py-12 text-white sm:px-6 sm:py-16">
        <div className="mx-auto max-w-3xl text-center">
          <h1 className="font-heading text-3xl font-bold leading-tight sm:text-4xl md:text-5xl">
            Plombier Chauffagiste à Ambérieu-en-Bugey
          </h1>
          <p className="mt-4 text-lg text-primary-50">
            Brevet Professionnel Génie Climatique et 13 ans d&apos;expérience.
            Intervention rapide sur Ambérieu, Saint-Denis-en-Bugey et Bettant.
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
          Saint-Vulbas et Lagnieu. Mathelin Plomberie intervient à Ambérieu pour
          vos travaux de plomberie et chauffage : dépannage urgent, réparation
          de fuite d&apos;eau, remplacement de chauffe-eau et rénovation de salle
          de bain.
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
          Château-Gaillard, Saint-Denis-en-Bugey, Bettant, Lagnieu, Leyment et
          Meximieux.
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
