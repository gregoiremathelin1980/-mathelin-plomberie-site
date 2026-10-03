import Link from "next/link";
import { Phone } from "lucide-react";
import { getSiteSettings } from "@/lib/content";
import { buttonVariants } from "@/components/ui/button";
import { buildPageMetadata } from "@/lib/seo/metaBuilder";
import { SATELLITE_AMBERIEU_URL, SATELLITE_MEXIMIEUX_URL } from "@/lib/config";
import FAQSchema from "@/components/FAQSchema";

export const metadata = buildPageMetadata({
  title: "Urgence plomberie Ain – Intervention rapide",
  description:
    "Urgence plomberie à Ambérieu, Meximieux et Pérouges : fuite, WC bouché, chauffe-eau en panne. Artisan local, intervention rapide selon l'urgence.",
  path: "/urgence-depannage",
});

const FAQ_URGENCE = [
  {
    question: "Dans quel délai intervenez-vous en urgence ?",
    answer:
      "Sur Ambérieu-en-Bugey, Meximieux et Pérouges, l’objectif est une intervention rapide, selon le degré d’urgence. Appelez directement : le délai réel dépend de votre adresse et des interventions déjà en cours.",
  },
  {
    question: "Quelles urgences prenez-vous en charge ?",
    answer:
      "Fuite d’eau importante, dégât des eaux, WC ou canalisation bouchés, plus d’eau chaude (chauffe-eau), radiateur ou chaudière en panne en période de froid. Je priorise les situations qui menacent le logement ou le confort vital.",
  },
  {
    question: "Intervenez-vous le week-end et les jours fériés ?",
    answer:
      "Intervention rapide sur le secteur, selon le degré d’urgence. Pour être pris en charge au plus vite, le téléphone reste le canal le plus rapide.",
  },
];

const URGENCES_VILLES = [
  { href: "/urgence/fuite-eau-amberieu", label: "Fuite d’eau à Ambérieu" },
  { href: "/urgence/wc-bouche-amberieu", label: "WC bouché à Ambérieu" },
  { href: "/urgence/chauffe-eau-panne-amberieu", label: "Chauffe-eau panne Ambérieu" },
  { href: "/urgence/chaudiere-panne-amberieu", label: "Chaudière panne Ambérieu" },
  { href: "/urgence/fuite-eau-meximieux", label: "Fuite d’eau à Meximieux" },
  { href: "/urgence/wc-bouche-meximieux", label: "WC bouché à Meximieux" },
  { href: "/urgence/chauffe-eau-panne-meximieux", label: "Chauffe-eau panne Meximieux" },
  { href: "/urgence/fuite-eau-lagnieu", label: "Fuite d’eau à Lagnieu" },
  { href: "/urgence/wc-bouche-lagnieu", label: "WC bouché à Lagnieu" },
];

export default async function UrgenceDepannagePage() {
  const settings = getSiteSettings();
  const phoneRaw = settings.phone.replace(/\s/g, "");
  const telHref = phoneRaw.startsWith("0") ? `tel:+33${phoneRaw.slice(1)}` : `tel:${phoneRaw}`;

  return (
    <main className="px-4 py-12 sm:px-6 sm:py-16">
      <FAQSchema faq={FAQ_URGENCE} />
      <div className="mx-auto max-w-3xl">
        <h1 className="font-heading text-3xl font-bold text-primary sm:text-4xl">
          Urgence dépannage plomberie
        </h1>
        <p className="mt-4 text-lg leading-relaxed text-gray-text">
          Fuite, canalisation bouchée, plus d&apos;eau chaude ou chauffage en panne&nbsp;?
          Grégoire Mathelin, Maître Artisan Plombier Chauffagiste basé à{" "}
          <strong>Pérouges</strong>, intervient en urgence sur{" "}
          <strong>Ambérieu-en-Bugey</strong>, <strong>Meximieux</strong>,{" "}
          <strong>Lagnieu</strong> et la plaine de l&apos;Ain.{" "}
          <strong className="text-primary">Intervention rapide</strong>, selon le degré d&apos;urgence.
        </p>

        <div className="mt-8 flex flex-wrap gap-4">
          <a
            href={telHref}
            className={buttonVariants({
              variant: "accent",
              size: "lg",
              className: "inline-flex items-center gap-2",
            })}
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

        <section className="mt-12">
          <h2 className="text-xl font-semibold text-primary">Que faire avant l&apos;arrivée du plombier&nbsp;?</h2>
          <ol className="mt-4 list-decimal space-y-2 pl-5 text-gray-text">
            <li>Coupez l&apos;arrivée d&apos;eau au compteur en cas de fuite importante.</li>
            <li>Coupez l&apos;électricité près de la zone inondée si l&apos;eau approche des prises.</li>
            <li>Épongez pour limiter les dégâts, sans forcer sur un appareil électrique.</li>
            <li>Évitez les déboucheurs chimiques agressifs (joints et PVC).</li>
            <li>Appelez avec votre adresse précise (quartier, étage, digicode).</li>
          </ol>
        </section>

        <section className="mt-12 rounded-xl border border-primary/15 bg-primary/5 px-5 py-6">
          <h2 className="text-xl font-semibold text-primary">Secteurs couverts en urgence</h2>
          <p className="mt-3 leading-relaxed text-gray-text">
            Depuis Pérouges&nbsp;: <strong>Ambérieu-en-Bugey</strong> (~15&nbsp;min),{" "}
            <strong>Meximieux</strong> (~8&nbsp;min), <strong>Lagnieu</strong>,{" "}
            <strong>Saint-Vulbas</strong>, Villieu-Loyes-Mollon, Saint-Denis-en-Bugey et communes voisines.
            Pages dédiées&nbsp;:{" "}
            <a href={`${SATELLITE_AMBERIEU_URL}/`} className="font-medium text-primary underline-offset-2 hover:underline">
              plombier Ambérieu
            </a>
            {" · "}
            <a href={`${SATELLITE_MEXIMIEUX_URL}/`} className="font-medium text-primary underline-offset-2 hover:underline">
              plombier Meximieux
            </a>
            .
          </p>
        </section>

        <section className="mt-12">
          <h2 className="text-xl font-semibold text-primary">Urgences par ville</h2>
          <ul className="mt-4 grid gap-2 sm:grid-cols-2">
            {URGENCES_VILLES.map((u) => (
              <li key={u.href}>
                <Link href={u.href} className="text-sm font-medium text-primary underline-offset-2 hover:underline">
                  {u.label}
                </Link>
              </li>
            ))}
          </ul>
        </section>

        <section className="mt-12">
          <h2 className="text-xl font-semibold text-primary">Questions fréquentes</h2>
          <dl className="mt-4 space-y-4">
            {FAQ_URGENCE.map((faq) => (
              <div key={faq.question} className="rounded-lg border p-4">
                <dt className="font-semibold text-gray-900">{faq.question}</dt>
                <dd className="mt-2 text-sm leading-relaxed text-gray-text">{faq.answer}</dd>
              </div>
            ))}
          </dl>
        </section>

        <p className="mt-10 text-sm text-gray-text">
          Intervention rapide, selon le degré d&apos;urgence. Pour être pris en charge au plus vite, appelez
          directement le {settings.phone}.
        </p>
      </div>
    </main>
  );
}
