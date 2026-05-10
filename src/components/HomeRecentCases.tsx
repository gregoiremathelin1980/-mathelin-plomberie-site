import { MapPin } from "lucide-react";

export interface RecentCase {
  label: string;
  ville: string;
  detail: string;
}

const ALL_CASES: RecentCase[] = [
  { label: "Fuite sous évier réparée", ville: "Meximieux", detail: "Siphon remplacé, étanchéité vérifiée" },
  { label: "Fuite sur canalisation d'eau froide", ville: "Ambérieu-en-Bugey", detail: "Portion de cuivre remplacée par brasure forte" },
  { label: "Robinet mitigeur remplacé", ville: "Pérouges", detail: "Ancien mitigeur grippé, nouveau Hansgrohe posé et réglé" },
  { label: "Fuite chasse d'eau réparée", ville: "Villieu-Loyes-Mollon", detail: "Mécanisme complet remplacé, plus de fuite" },
  { label: "Remplacement mécanisme WC suspendu", ville: "Béligneux", detail: "Mécanisme Geberit remplacé, chasse d'eau fonctionnelle" },
  { label: "Remplacement WC complet", ville: "Saint-Maurice-de-Gourdans", detail: "Cuvette suspendue posée avec bâti-support Geberit" },
  { label: "Colonne d'eau remplacée", ville: "Dagneux", detail: "Ancienne colonne vétuste, nouveau réseau cuivre brasure forte" },
  { label: "WC bouché débouché en 30 min", ville: "Meximieux", detail: "Débouchage pompe manuelle, canalisation nettoyée" },
  { label: "Canalisation cuisine curée", ville: "Lagnieu", detail: "Curage haute pression, évacuation fluide retrouvée" },
  { label: "Évacuation douche débouchée", ville: "Pérouges", detail: "Bouchon de calcaire dissous, siphon nettoyé" },
  { label: "Canalisation principale curée", ville: "Ambérieu-en-Bugey", detail: "Curage mécanique sur 15 mètres, écoulement rétabli" },
  { label: "Évier bouché débouché", ville: "Saint-Vulbas", detail: "Amas de graisse retiré, évacuation fluide" },
  { label: "Chauffe-eau 200L remplacé", ville: "Lagnieu", detail: "Pose ballon Atlantic neuf + évacuation ancien, même journée" },
  { label: "Chauffe-eau 150L installé", ville: "Meximieux", detail: "Remplacement ballon vétuste par Thermor, mise en service immédiate" },
  { label: "Groupe de sécurité remplacé", ville: "Ambérieu-en-Bugey", detail: "Fuite au groupe, pièce neuve posée en 1h" },
  { label: "Chauffe-eau thermodynamique posé", ville: "Dagneux", detail: "Atlantic, installation complète avec raccordement et mise en service" },
  { label: "Détartrage chauffe-eau", ville: "Pérouges", detail: "Résistance entartrée nettoyée, performance retrouvée" },
  { label: "Chaudière gaz installée", ville: "Pérouges", detail: "Pose chaudière Frisquet condensation, mise en service et réglages" },
  { label: "Chaudière gaz mise en service", ville: "Ambérieu-en-Bugey", detail: "Installation Atlantic, certificat de conformité gaz et mise en service" },
  { label: "Désembouage circuit chauffage", ville: "Meximieux", detail: "Nettoyage complet du réseau, installation filtre magnétique, radiateurs chauds uniformément" },
  { label: "Désembouage plancher chauffant", ville: "Villieu-Loyes-Mollon", detail: "Circuit purgé, injection produit inhibiteur de corrosion et de boues" },
  { label: "Remplacement radiateur", ville: "Lagnieu", detail: "Ancien radiateur fissuré, nouveau Finimetal posé et purgé" },
  { label: "Radiateurs fonte percés remplacés", ville: "Saint-Vulbas", detail: "Radiateurs fonte remplacés par aluminium Chappée, plus modernes et moins volumineux" },
  { label: "Création réseau chauffage", ville: "Béligneux", detail: "Réseau cuivre neuf brasure forte pour extension maison, 6 radiateurs" },
  { label: "Création réseau chauffage", ville: "Pérouges", detail: "Pose complète plancher chauffant et radiateurs, maison neuve" },
  { label: "Rénovation salle de bains", ville: "Meximieux", detail: "Receveur extra-plat Aquabella, meuble vasque et robinetterie Hansgrohe" },
  { label: "Rénovation salle de bains", ville: "Ambérieu-en-Bugey", detail: "Remplacement baignoire par douche Jacob Delafon, plomberie complète" },
  { label: "Remplacement douche complète", ville: "Dagneux", detail: "Receveur extra-plat, paroi et mitigeur thermostatique Porcher posés" },
  { label: "Salle d'eau créée", ville: "Lagnieu", detail: "Nouvelle salle d'eau dans combles, réseau complet tiré" },
  { label: "Climatisation réversible posée", ville: "Meximieux", detail: "Split mural Panasonic installé, mise en service" },
  { label: "Climatisation bi-split installée", ville: "Pérouges", detail: "Midea, 2 unités intérieures raccordées, confort été et hiver" },
];

function mulberry32(seed: number) {
  let a = seed >>> 0;
  return function next() {
    a += 0x6d2b79f5;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function pickRandom(pool: RecentCase[], count: number, seed: number): RecentCase[] {
  const rand = mulberry32(seed);
  const idx = pool.map((_, i) => i);
  for (let i = idx.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    const tmp = idx[i]!;
    idx[i] = idx[j]!;
    idx[j] = tmp;
  }
  return idx.slice(0, count).map((i) => pool[i]!);
}

interface HomeRecentCasesProps {
  seed?: number;
  count?: number;
}

export default function HomeRecentCases({ seed, count = 5 }: HomeRecentCasesProps) {
  const cases = pickRandom(ALL_CASES, count, seed ?? Date.now());

  return (
    <section className="border-y border-gray-200 bg-white px-4 py-12 sm:px-6">
      <div className="mx-auto max-w-4xl">
        <h2 className="font-heading text-xl font-bold text-primary sm:text-2xl">
          Dernières interventions
        </h2>
        <p className="mt-1 text-sm text-gray-500">
          Exemples récents d&apos;interventions dans l&apos;Ain
        </p>
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {cases.map((c, i) => (
            <div
              key={`${c.ville}-${c.label}-${i}`}
              className="rounded-lg border border-gray-200 p-4"
            >
              <p className="font-semibold text-gray-900">{c.label}</p>
              <p className="mt-1 flex items-center gap-1 text-xs text-gray-500">
                <MapPin className="h-3 w-3" aria-hidden />
                {c.ville}
              </p>
              <p className="mt-2 text-sm text-gray-text">{c.detail}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
