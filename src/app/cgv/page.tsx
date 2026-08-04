import Link from "next/link";
import LegalPageLayout from "@/components/LegalPageLayout";
import { LEGAL } from "@/lib/legal";
import { buildPageMetadata } from "@/lib/seo/metaBuilder";

export const metadata = buildPageMetadata({
  title: "Conditions Générales de Vente | Mathelin Plomberie",
  description:
    "Conditions générales de vente d’EI Grégoire Mathelin — plomberie et chauffage. Médiation de la consommation CM2C.",
  path: "/cgv",
});

export default function CgvPage() {
  const m = LEGAL.mediator;

  return (
    <LegalPageLayout
      title="Conditions Générales de Vente"
      subtitle={`Version ${LEGAL.cgvVersion}`}
    >
      <section>
        <p className="font-semibold text-primary">{LEGAL.legalName}</p>
        <p>SIRET : {LEGAL.siret} — Code APE : {LEGAL.ape}</p>
        <p>N° TVA : {LEGAL.tva}</p>
        <p>Immatriculation : {LEGAL.rcs}</p>
        <p>Adresse : {LEGAL.address}</p>
        <p>
          Tél. : {LEGAL.phone} — Email :{" "}
          <a href={`mailto:${LEGAL.email}`}>{LEGAL.email}</a>
        </p>
        <p>
          Site :{" "}
          <a href={LEGAL.site} target="_blank" rel="noopener noreferrer">
            {LEGAL.site}
          </a>
        </p>
        <p>
          Assurance décennale : {LEGAL.assurance.name} — Contrat n°{" "}
          {LEGAL.assurance.contract}
        </p>
        <p>Couverture : {LEGAL.assurance.coverage}</p>
      </section>

      <section>
        <h2>1. Validité de l’offre</h2>
        <p>
          La présente proposition est valable jusqu’à la date de fin de validité
          indiquée sur le devis. Au-delà, EI Grégoire Mathelin se réserve la
          faculté de maintenir l’offre ou de présenter une proposition
          actualisée.
        </p>
      </section>

      <section>
        <h2>2. Acceptation de l’offre</h2>
        <p>
          La commande ne devient ferme et définitive qu’après réception des
          éléments suivants :
        </p>
        <ul>
          <li>
            le devis signé avec la mention manuscrite « Devis reçu avant
            l’exécution des travaux. Bon pour travaux » (ou « Bon pour accord,
            devis reçu avant début des travaux ») ;
          </li>
          <li>
            le règlement de l’acompte prévu au devis (chèque ou virement) ;
          </li>
          <li>
            le cas échéant, en cas de taux réduit de TVA, l’attestation de TVA
            afférente (simplifiée ou normale), remplie, signée et jointe.
          </li>
        </ul>
        <p>
          Si le client est un couple non marié, la signature de chacun est
          obligatoire. En signant le devis, le client reconnaît avoir pris
          connaissance des présentes Conditions Générales de Vente et les
          accepter sans réserve. Il n’est pas exigé de renvoyer les CGV signées
          séparément.
        </p>
      </section>

      <section>
        <h2>3. Application d’un taux réduit de TVA</h2>
        <p>
          Le client s’engage, en cas de requalification par l’administration
          fiscale du taux de TVA applicable aux travaux réalisés pour son
          compte, à assumer la totalité de la régularisation (principal,
          pénalités, intérêts) et à rembourser EI Grégoire Mathelin des sommes
          versées à ce titre.
        </p>
      </section>

      <section>
        <h2>4. Prestations</h2>
        <p>
          Les prestations sont exclusivement celles formulées sur le devis.
          Elles comprennent, sauf mention contraire, la fourniture et la mise
          en œuvre des matériaux, ainsi que les charges sociales et assurances
          professionnelles afférentes.
        </p>
        <p>
          En cas d’obligations déclaratives liées aux ouvrages (déclarations
          préalables, permis, DICT, etc.), le client s’engage à prendre en
          charge les démarches nécessaires, sauf mission expressément prévue au
          devis. En cas de non-présentation des autorisations nécessaires, EI
          Grégoire Mathelin ne démarrera pas les travaux et se réserve le droit
          de facturer les frais déjà engagés.
        </p>
        <p>
          Toute prestation supplémentaire doit être acceptée et confirmée par
          écrit (devis additif ou bon de commande). Le client veille à la bonne
          accessibilité du chantier et à l’accès à l’eau, à l’électricité et,
          dans la mesure du possible, à des sanitaires. Sauf autre accord, la
          fourniture des fluides est à la charge du client.
        </p>
      </section>

      <section>
        <h2>5. Coordination de chantier</h2>
        <p>
          Le maître de l’ouvrage coordonne le chantier et valide les factures,
          sauf s’il a désigné un maître d’œuvre qui le représente.
        </p>
      </section>

      <section>
        <h2>6. Délai d’exécution</h2>
        <p>
          Les travaux sont exécutés dans les meilleurs délais, ou dans les
          délais précisés au devis, ou selon un planning convenu avec le client
          (et, le cas échéant, les autres corps d’état).
        </p>
      </section>

      <section>
        <h2>7. Prolongation du délai d’exécution</h2>
        <p>
          Un délai prévu pourra être prolongé notamment du fait des intempéries,
          congés, interruptions imputables au client, ou cas de force majeure
          (grèves, interruption des transports ou approvisionnements, etc.).
        </p>
      </section>

      <section>
        <h2>8. Réception des travaux</h2>
        <p>
          Dès l’achèvement des travaux, le client (ou son représentant) et EI
          Grégoire Mathelin procèdent à la réception, avec ou sans réserves. Un
          métré contradictoire pourra être établi à cette occasion.
        </p>
      </section>

      <section>
        <h2>9. Réserve de propriété</h2>
        <p>
          Les fournitures restent la propriété de EI Grégoire Mathelin jusqu’au
          complet paiement, conformément à la loi n° 80-335 du 12 mai 1980.
        </p>
      </section>

      <section>
        <h2>10. Prescriptions techniques</h2>
        <p>
          Les travaux sont réalisés conformément aux règles de l’art. Les
          matériaux sont conformes aux normes et au devis ; à défaut, un accord
          réciproque est nécessaire. EI Grégoire Mathelin peut refuser des
          travaux non conformes aux règles de l’art, ainsi que l’utilisation de
          matériaux fournis par le client. Un changement de matériau équivalent
          peut être proposé si les conditions de mise en œuvre l’exigent.
        </p>
      </section>

      <section>
        <h2>10 bis. Ouvrages anciens / rénovation</h2>
        <p>
          Dans le cadre de travaux de rénovation, EI Grégoire Mathelin ne peut
          être tenu responsable des dommages causés par l’état antérieur de
          canalisations, revêtements ou supports anciens, invisibles,
          fragilisés par le temps ou non conformes aux normes actuelles,
          découverts en cours de chantier. Toute découverte de ce type pourra
          donner lieu à un devis additif ou à une suspension des travaux
          jusqu’à accord écrit du client sur la suite à donner.
        </p>
      </section>

      <section>
        <h2>11. Conditions de règlement</h2>
        <p>Sauf conditions différentes figurant au devis :</p>
        <ul>
          <li>acompte à la commande (montant fixé au devis) ;</li>
          <li>éventuelles situations d’avancement ;</li>
          <li>
            solde à l’achèvement, selon les conditions de la facture.
          </li>
        </ul>
        <p>
          Aucune retenue de garantie ne peut être pratiquée par un client
          particulier, sauf disposition légale ou contrat spécifique.
        </p>
      </section>

      <section>
        <h2>12. Retard de règlement</h2>
        <p>
          Aucun escompte n’est accordé pour paiement anticipé, sauf mention
          contraire. Tout retard de règlement entraîne l’application :
        </p>
        <ul>
          <li>
            d’intérêts de retard au taux annuel égal à trois fois le taux
            d’intérêt légal en vigueur (ou, à défaut, au taux BCE + 10 points) ;
          </li>
          <li>
            et, pour les clients professionnels, de l’indemnité forfaitaire de
            40 € pour frais de recouvrement (art. D441-5 du Code de commerce).
          </li>
        </ul>
        <p>
          EI Grégoire Mathelin pourra adresser une mise en demeure (LRAR) et
          suspendre les travaux tant que les sommes dues ne sont pas réglées.
          Les frais de recouvrement contentieux sont à la charge du client.
        </p>
      </section>

      <section>
        <h2>13. Travaux supplémentaires</h2>
        <p>
          Les travaux non prévus au devis initial font l’objet de devis
          additifs ou de bons de commande séparés.
        </p>
      </section>

      <section>
        <h2>14. Utilisation du devis</h2>
        <p>
          Le devis et ses annexes restent la propriété de EI Grégoire Mathelin ;
          ils ne peuvent être utilisés ou communiqués à un tiers sans
          autorisation écrite.
        </p>
      </section>

      <section>
        <h2>15. Protection des données personnelles (RGPD)</h2>
        <p>
          EI Grégoire Mathelin conserve les données personnelles nécessaires au
          traitement du devis, des travaux et de la facturation. Le client peut
          exercer ses droits (accès, rectification, effacement, etc.) en
          écrivant à :{" "}
          <a href={`mailto:${LEGAL.email}`}>{LEGAL.email}</a>. Voir aussi les{" "}
          <Link href="/mentions-legales">mentions légales</Link>.
        </p>
      </section>

      <section>
        <h2>16. Accord des parties</h2>
        <p>
          La signature du devis implique l’accord sur la nature, les
          circonstances et le prix des travaux, ainsi que sur les présentes
          CGV.
        </p>
      </section>

      <section>
        <h2>17. Litiges — tribunal compétent</h2>
        <p>
          En cas de litige, les parties recherchent d’abord une solution
          amiable. À défaut :
        </p>
        <ul>
          <li>
            si le client est un professionnel, le Tribunal judiciaire de
            Bourg-en-Bresse est seul compétent ;
          </li>
          <li>
            si le client est un consommateur, le tribunal compétent est celui
            prévu par les dispositions d’ordre public du Code de la
            consommation (notamment le tribunal du lieu de son domicile).
          </li>
        </ul>
      </section>

      <section id="mediation">
        <h2>18. Médiation de la consommation</h2>
        <p>
          Conformément aux articles L.612-1, L.616-1 et R.616-1 du Code de la
          consommation, le consommateur peut, après réclamation écrite
          préalable restée infructueuse, saisir gratuitement le médiateur
          suivant (sous réserve de l’article L.612-2) :
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
      </section>
    </LegalPageLayout>
  );
}
