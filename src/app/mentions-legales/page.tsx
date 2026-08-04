import Link from "next/link";
import LegalPageLayout from "@/components/LegalPageLayout";
import { LEGAL } from "@/lib/legal";
import { buildPageMetadata } from "@/lib/seo/metaBuilder";

export const metadata = buildPageMetadata({
  title: "Mentions légales | Mathelin Plomberie Chauffage",
  description:
    "Mentions légales d’EI Grégoire Mathelin — Mathelin Plomberie Chauffage. Médiation de la consommation CM2C.",
  path: "/mentions-legales",
});

export default function MentionsLegalesPage() {
  const m = LEGAL.mediator;

  return (
    <LegalPageLayout title="Mentions légales">
      <section>
        <h2>Éditeur du site</h2>
        <p className="font-semibold text-primary">{LEGAL.tradeName}</p>
        <p>{LEGAL.legalName}</p>
        <p>SIRET : {LEGAL.siret}</p>
        <p>Code APE : {LEGAL.ape}</p>
        <p>N° TVA intracommunautaire : {LEGAL.tva}</p>
        <p>Immatriculation : {LEGAL.rcs}</p>
        <p>Adresse : {LEGAL.address}</p>
        <p>Tél. : {LEGAL.phone}</p>
        <p>
          Email :{" "}
          <a href={`mailto:${LEGAL.email}`}>{LEGAL.email}</a>
        </p>
        <p>
          Site :{" "}
          <a href={LEGAL.site} target="_blank" rel="noopener noreferrer">
            {LEGAL.site}
          </a>
        </p>
      </section>

      <section>
        <h2>Directeur de la publication</h2>
        <p>Grégoire Mathelin</p>
      </section>

      <section>
        <h2>Assurance décennale</h2>
        <p>
          {LEGAL.assurance.name} — Contrat n° {LEGAL.assurance.contract}
        </p>
        <p>Couverture : {LEGAL.assurance.coverage}</p>
      </section>

      <section>
        <h2>Hébergement</h2>
        <p>
          Le site est hébergé par Vercel Inc., 440 N Barranca Ave #4133,
          Covina, CA 91723, États-Unis —{" "}
          <a
            href="https://vercel.com"
            target="_blank"
            rel="noopener noreferrer"
          >
            vercel.com
          </a>
          .
        </p>
      </section>

      <section id="mediation">
        <h2>Médiation de la consommation</h2>
        <p>
          Conformément aux articles L.616-1 et R.616-1 du Code de la
          consommation, nous proposons un dispositif de médiation de la
          consommation. En cas de litige, le consommateur peut saisir
          gratuitement le médiateur après réclamation écrite préalable restée
          infructueuse (sous réserve de l’article L.612-2) :
        </p>
        <p className="font-medium">{m.name}</p>
        <p>{m.address}</p>
        <p>Tél. : {m.phone}</p>
        <p>
          Site :{" "}
          <a href={m.website} target="_blank" rel="noopener noreferrer">
            {m.website}
          </a>
        </p>
        <p>
          Saisine en ligne :{" "}
          <a href={m.saisine} target="_blank" rel="noopener noreferrer">
            {m.saisine}
          </a>
        </p>
        <p>
          Voir aussi l’article 18 des{" "}
          <Link href="/cgv#mediation">Conditions Générales de Vente</Link>.
        </p>
      </section>

      <section>
        <h2>Données personnelles</h2>
        <p>
          Les données collectées via les formulaires (contact, devis) sont
          destinées exclusivement au traitement de votre demande. Conformément
          au RGPD, vous disposez d’un droit d’accès, de rectification et
          d’effacement en écrivant à{" "}
          <a href={`mailto:${LEGAL.email}`}>{LEGAL.email}</a>.
        </p>
      </section>

      <section>
        <h2>Conditions générales de vente</h2>
        <p>
          Les{" "}
          <Link href="/cgv">Conditions Générales de Vente</Link> s’appliquent
          aux devis et prestations de {LEGAL.tradeName}.
        </p>
      </section>
    </LegalPageLayout>
  );
}
