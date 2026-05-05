import type { Metadata } from "next";
import { buildPageMetadata } from "@/lib/seo/metaBuilder";
import BreadcrumbSchema from "@/components/BreadcrumbSchema";
import Link from "next/link";
import { Phone } from "lucide-react";
import { getSiteSettings } from "@/lib/content";
import { buttonVariants } from "@/components/ui/button";
import { phoneToTelHref } from "@/lib/satelliteLandings";

export const metadata: Metadata = buildPageMetadata({
  title: "Zones d'intervention plombier dans l'Ain | Mathelin Plomberie Chauffage",
  description:
    "Plombier chauffagiste intervenant à Pérouges, Meximieux, Ambérieu-en-Bugey, Lagnieu, Saint-Vulbas et 15 communes de l'Ain. Dépannage rapide, devis gratuit.",
  path: "/zones-intervention",
});

const URGENCES: { slug: string; label: string; desc: string }[] = [
  { slug: "fuite-eau-meximieux", label: "Fuite d'eau à Meximieux", desc: "Recherche et réparation de fuite, intervention sous 1 h" },
  { slug: "wc-bouche-meximieux", label: "WC bouché à Meximieux", desc: "Débouchage mécanique rapide, ventouse et furet" },
  { slug: "chauffe-eau-panne-meximieux", label: "Chauffe-eau en panne à Meximieux", desc: "Diagnostic et remplacement résistance ou groupe de sécurité" },
  { slug: "chaudiere-panne-meximieux", label: "Chaudière en panne à Meximieux", desc: "Remise en route, purge, pièce détachée en stock" },
  { slug: "fuite-eau-amberieu", label: "Fuite d'eau à Ambérieu-en-Bugey", desc: "Intervention rapide, détection par écoute ou caméra" },
  { slug: "wc-bouche-amberieu", label: "WC bouché à Ambérieu-en-Bugey", desc: "Débouchage professionnel avec matériel haute pression" },
  { slug: "chauffe-eau-panne-amberieu", label: "Chauffe-eau en panne à Ambérieu-en-Bugey", desc: "Dépannage ou remplacement, toutes marques" },
  { slug: "chaudiere-panne-amberieu", label: "Chaudière en panne à Ambérieu-en-Bugey", desc: "Diagnostic complet, réparation ou remplacement" },
  { slug: "fuite-eau-lagnieu", label: "Fuite d'eau à Lagnieu", desc: "Détection et réparation de fuite, intervention rapide" },
  { slug: "wc-bouche-lagnieu", label: "WC bouché à Lagnieu", desc: "Débouchage furet ou hydrocurage, résultat immédiat" },
  { slug: "chauffe-eau-panne-lagnieu", label: "Chauffe-eau en panne à Lagnieu", desc: "Diagnostic, détartrage ou remplacement ballon" },
  { slug: "chaudiere-panne-lagnieu", label: "Chaudière en panne à Lagnieu", desc: "Dépannage toutes marques, entretien annuel" },
];

export default function ZonesInterventionPage() {
  const settings = getSiteSettings();
  const telHref = phoneToTelHref(settings.phone);

  return (
    <>
      <BreadcrumbSchema
        items={[
          { name: "Accueil", path: "/" },
          { name: "Zones d'intervention", path: "/zones-intervention" },
        ]}
      />

      <section className="bg-primary px-4 py-10 text-white sm:px-6 sm:py-14">
        <div className="mx-auto max-w-3xl text-center">
          <h1 className="font-heading text-2xl font-bold leading-tight sm:text-3xl md:text-4xl">
            Votre plombier dans l&apos;Ain — zones d&apos;intervention
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-white/90">
            Grégoire Mathelin, artisan plombier-chauffagiste basé à Pérouges,
            intervient dans plus de 15 communes de la Plaine de l&apos;Ain et du
            Bugey.
          </p>
        </div>
      </section>

      <main className="px-4 py-10 sm:px-6 sm:py-14">
        <article className="mx-auto max-w-3xl space-y-12">
          {/* --- Introduction --- */}
          <section className="space-y-4 leading-relaxed text-gray-text">
            <p>
              Artisan plombier-chauffagiste depuis 2013, Grégoire Mathelin est
              installé à <strong>Pérouges (01800)</strong>, au cœur de la Plaine
              de l&apos;Ain. Titulaire d&apos;un BP Génie Climatique, il
              intervient aussi bien en plomberie sanitaire qu&apos;en chauffage,
              du simple dépannage à la rénovation complète.
            </p>
            <p>
              Avec <strong>51 avis 5&nbsp;étoiles</strong> sur Google et un
              véhicule atelier équipé des pièces les plus courantes, il garantit
              une intervention rapide et soignée sur un rayon de 15&nbsp;km
              autour de Pérouges. Que vous habitiez une maison individuelle dans
              un lotissement de Meximieux ou un appartement ancien à
              Ambérieu-en-Bugey, vous bénéficiez du même service réactif :
              diagnostic, devis transparent et réparation dans la journée quand
              c&apos;est possible.
            </p>
          </section>

          {/* --- Côtière & Plaine de l'Ain --- */}
          <section className="space-y-4">
            <h2 className="text-xl font-semibold text-primary">
              Côtière &amp; Plaine de l&apos;Ain
            </h2>
            <p className="leading-relaxed text-gray-text">
              La Plaine de l&apos;Ain regroupe des communes résidentielles en
              plein essor, avec de nombreux lotissements et maisons
              individuelles. <strong>Meximieux</strong>, plus grande ville du
              secteur, concentre à la fois des pavillons récents et un
              centre-ville ancien où la plomberie vieillit parfois mal.{" "}
              <strong>Pérouges</strong>, cité médiévale classée, compte aussi
              des habitations qui nécessitent un savoir-faire adapté aux
              bâtiments historiques.
            </p>
            <p className="leading-relaxed text-gray-text">
              Les communes de{" "}
              <strong>
                Villieu-Loyes-Mollon, Rignieux-le-Franc, Le&nbsp;Montellier,
                Béligneux
              </strong>{" "}
              et <strong>Saint-Jean-de-Niost</strong> sont toutes situées à
              5-15&nbsp;minutes de notre base. Fuite d&apos;eau sur un raccord
              PER, chauffe-eau à remplacer, radiateur qui ne chauffe plus : nous
              intervenons le jour même pour les urgences et sous 48&nbsp;h pour
              les travaux planifiés.
            </p>
            <p className="text-sm text-gray-text">
              <Link
                href="/plombier-meximieux"
                className="font-medium text-primary underline hover:text-primary/80"
              >
                Voir notre page plombier à Meximieux →
              </Link>
            </p>
          </section>

          {/* --- Bugey & Ambérieu --- */}
          <section className="space-y-4">
            <h2 className="text-xl font-semibold text-primary">
              Bugey &amp; Ambérieu-en-Bugey
            </h2>
            <p className="leading-relaxed text-gray-text">
              À l&apos;est de la Plaine de l&apos;Ain, le Bugey offre un relief
              plus marqué et un climat plus rigoureux en hiver.{" "}
              <strong>Ambérieu-en-Bugey</strong>, sous-préfecture de
              l&apos;Ain, possède un parc immobilier diversifié : immeubles des
              années 60-70 avec colonnes en fonte, maisons de ville et
              lotissements périphériques. Le gel hivernal y provoque
              régulièrement des éclatements de tuyaux et des pannes de
              chaudière.
            </p>
            <p className="leading-relaxed text-gray-text">
              Nous couvrons également{" "}
              <strong>
                Lagnieu, Saint-Vulbas, Château-Gaillard, Douvres,
                Pont-d&apos;Ain
              </strong>{" "}
              et <strong>Saint-Denis-en-Bugey</strong>. La zone industrielle de
              Saint-Vulbas (Parc Industriel de la Plaine de l&apos;Ain) nous
              confie aussi des interventions de maintenance. Temps de trajet
              depuis Pérouges : 10 à 20&nbsp;minutes selon la commune.
            </p>
            <p className="text-sm text-gray-text">
              <Link
                href="/plombier-amberieu"
                className="font-medium text-primary underline hover:text-primary/80"
              >
                Voir notre page plombier à Ambérieu-en-Bugey →
              </Link>
            </p>
          </section>

          {/* --- Urgences les plus fréquentes --- */}
          <section className="space-y-4">
            <h2 className="text-xl font-semibold text-primary">
              Nos urgences les plus fréquentes
            </h2>
            <p className="leading-relaxed text-gray-text">
              Quel que soit votre problème, nous assurons un dépannage
              7&nbsp;jours sur&nbsp;7 dans l&apos;ensemble de notre zone. Voici
              les situations d&apos;urgence pour lesquelles nous intervenons le
              plus souvent&nbsp;:
            </p>
            <ul className="grid gap-3 sm:grid-cols-2">
              {URGENCES.map((u) => (
                <li key={u.slug}>
                  <Link
                    href={`/urgence/${u.slug}`}
                    className="block rounded-lg border p-4 transition-shadow hover:shadow-md"
                  >
                    <span className="font-semibold text-primary">
                      {u.label}
                    </span>
                    <span className="mt-1 block text-sm text-gray-text">
                      {u.desc}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </section>

          {/* --- CTA final --- */}
          <section className="rounded-xl border-2 border-accent/30 bg-accent/5 p-6 text-center sm:p-8">
            <h2 className="text-lg font-semibold text-accent">
              Besoin d&apos;un plombier dans l&apos;Ain&nbsp;?
            </h2>
            <p className="mx-auto mt-2 max-w-md text-gray-text">
              Appelez directement pour une intervention rapide ou demandez un
              devis gratuit en ligne. Réponse sous 2&nbsp;h en semaine.
            </p>
            <div className="mt-6 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
              <a
                href={telHref}
                className={buttonVariants({
                  variant: "accent",
                  size: "lg",
                  className: "inline-flex items-center gap-2",
                })}
              >
                <Phone className="h-5 w-5" aria-hidden />
                Appeler {settings.phone}
              </a>
              <Link
                href="/contact"
                className={buttonVariants({ variant: "outline", size: "lg" })}
              >
                Demander un devis gratuit
              </Link>
            </div>
          </section>
        </article>
      </main>
    </>
  );
}
