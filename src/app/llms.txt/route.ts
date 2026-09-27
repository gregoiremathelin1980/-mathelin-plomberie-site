import { headers } from "next/headers";
import {
  MAIN_SITE_URL,
  SATELLITE_AMBERIEU_URL,
  SATELLITE_MEXIMIEUX_URL,
  getSiteUrlFromHost,
} from "@/lib/config";
import { getSiteSettings } from "@/lib/content";
import { LEGAL } from "@/lib/legal";
import { SERVICES } from "@/lib/services-data";

/**
 * /llms.txt (llmstxt.org) : fiche factuelle lisible par les assistants IA.
 * Servi sur les trois domaines ; seule l'introduction change selon le domaine demandé.
 */
export async function GET() {
  const h = await headers();
  const { url } = getSiteUrlFromHost(h.get("host"));
  const settings = getSiteSettings();

  const intro =
    url === SATELLITE_AMBERIEU_URL
      ? `${SATELLITE_AMBERIEU_URL} est la page locale d'Ambérieu-en-Bugey de ${settings.company} (site principal : ${MAIN_SITE_URL}).`
      : url === SATELLITE_MEXIMIEUX_URL
        ? `${SATELLITE_MEXIMIEUX_URL} est la page locale de Meximieux de ${settings.company} (site principal : ${MAIN_SITE_URL}).`
        : `Site officiel de ${settings.company}.`;

  const body = `# ${settings.company}

> ${LEGAL.title}, entreprise individuelle de Grégoire Mathelin basée à Pérouges (Ain, 01800). Plomberie, chauffage et dépannage dans la Plaine de l'Ain, la Côtière et le Bugey. BP Génie Climatique, en activité depuis 2013.

${intro}

## Coordonnées

- Téléphone : ${settings.phone}
- E-mail : ${settings.email}
- Adresse : ${LEGAL.address}
- Horaires : ${settings.business_hours ?? "sur rendez-vous"}
- SIRET : ${LEGAL.siret}
- Avis Google : ${settings.googleReviewsUrl ?? ""}

## Communes desservies

${settings.cities.join(", ")}.

## Prestations

${SERVICES.map((s) => `- [${s.title}](${MAIN_SITE_URL}/services/${s.slug}) : ${s.description}`).join("\n")}
## Pages utiles

- [Accueil](${MAIN_SITE_URL}/)
- [Dépannage et urgence](${MAIN_SITE_URL}/urgence)
- [Zones d'intervention](${MAIN_SITE_URL}/zones-intervention)
- [Réalisations](${MAIN_SITE_URL}/realisations)
- [Conseils](${MAIN_SITE_URL}/conseils)
- [Demande de devis](${MAIN_SITE_URL}/devis)
- [Contact](${MAIN_SITE_URL}/contact)
- [Plombier à Ambérieu-en-Bugey](${SATELLITE_AMBERIEU_URL}/)
- [Plombier à Meximieux](${SATELLITE_MEXIMIEUX_URL}/)
`;

  return new Response(body, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=3600",
    },
  });
}
