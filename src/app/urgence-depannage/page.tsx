import Link from "next/link";
import { Phone } from "lucide-react";
import { getSiteSettings } from "@/lib/content";
import { buttonVariants } from "@/components/ui/button";
import { buildPageMetadata } from "@/lib/seo/metaBuilder";

export const metadata = buildPageMetadata({
  title: "Urgence dépannage plomberie | Ambérieu, Meximieux, Pérouges | Sous 2h",
  description:
    "Plombier disponible pour urgences à Ambérieu, Meximieux et Pérouges. Intervention sous 2h. Fuite d'eau, débouchage, chauffe-eau en panne.",
  path: "/urgence-depannage",
});

export default async function UrgenceDepannagePage() {
  const settings = getSiteSettings();
  const phoneRaw = settings.phone.replace(/\s/g, "");

  return (
    <main className="container px-4 py-16">
      <h1 className="font-heading text-3xl font-bold text-primary sm:text-4xl">
        Urgence dépannage plomberie
      </h1>

      <p className="mt-6 text-lg text-gray-text">
        Plombier disponible pour urgences à Ambérieu, Meximieux et Pérouges.
        <strong className="text-primary"> Intervention sous 2h.</strong>
      </p>

      <section className="mt-8 rounded-xl bg-primary/5 border border-primary/10 px-5 py-6">
        <h2 className="text-xl font-semibold text-primary">
          Fuite, canalisation bouchée, chauffe-eau en panne
        </h2>
        <p className="mt-2 text-gray-text">
          Fuite d&apos;eau, débouchage évier ou WC, chauffe-eau qui ne chauffe plus,
          radiateur froid : nous intervenons en urgence sur Ambérieu-en-Bugey,
          Meximieux, Pérouges et les communes alentour.
        </p>
      </section>

      <div className="mt-10 flex flex-wrap gap-4">
        <a
          href={`tel:${phoneRaw}`}
          className={buttonVariants({ variant: "accent", size: "lg", className: "inline-flex items-center gap-2" })}
        >
          <Phone className="h-5 w-5" aria-hidden />
          Appeler pour une urgence
        </a>
        <Link
          href="/contact"
          className={buttonVariants({ variant: "outline", size: "lg", className: "inline-flex" })}
        >
          Demander un devis
        </Link>
      </div>

      <p className="mt-6 text-sm text-gray-text">
        Urgences traitées selon disponibilité. Pour une intervention sous 2h,
        appelez directement.
      </p>
    </main>
  );
}
