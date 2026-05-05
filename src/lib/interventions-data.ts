export interface InterventionData {
  slug: string;
  title: string;
  h1: string;
  metaDescription: string;
  ville: string;
  quartier: string;
  probleme: string;
  action: string;
  resultat: string;
  date: string;
}

export const INTERVENTIONS: InterventionData[] = [
  {
    slug: "fuite-sous-evier-amberieu",
    title: "Fuite sous évier à Ambérieu – Intervention rapide",
    h1: "Fuite sous évier réparée à Ambérieu-en-Bugey",
    metaDescription:
      "Intervention rapide pour une fuite sous évier rue Alexandre Bérard à Ambérieu-en-Bugey. Remplacement siphon et raccords par Mathelin Plomberie.",
    ville: "Ambérieu-en-Bugey",
    quartier: "rue Alexandre Bérard",
    probleme:
      "Le client constatait une fuite persistante sous l'évier de cuisine. L'eau s'accumulait dans le meuble bas, provoquant des moisissures sur le bois. Le siphon en PVC était fissuré au niveau du raccord mural.",
    action:
      "Démontage du siphon défaillant, nettoyage du raccord mural et remplacement complet du siphon avec joints neufs. Vérification de l'étanchéité sous pression pendant 10 minutes.",
    resultat:
      "Fuite stoppée, meuble séché et traité. Intervention réalisée en 45 minutes — 95 € TTC, pièces et déplacement inclus.",
    date: "2026-05-02",
  },
  {
    slug: "wc-bouche-meximieux-allagniers",
    title: "WC bouché à Meximieux – Débouchage lotissement des Allagniers",
    h1: "Débouchage WC au lotissement des Allagniers, Meximieux",
    metaDescription:
      "WC bouché au lotissement des Allagniers à Meximieux. Débouchage mécanique au furet par plombier local. Résultat immédiat – Mathelin Plomberie.",
    ville: "Meximieux",
    quartier: "lotissement des Allagniers",
    probleme:
      "WC totalement bouché depuis la veille, impossible à déboucher avec une ventouse. Le refoulement menaçait de toucher la douche adjacente. Famille avec enfants en bas âge.",
    action:
      "Débouchage au furet électrique professionnel sur 4 mètres de canalisation. Extraction d'un amas de lingettes et de calcaire. Rinçage haute pression du tronçon.",
    resultat:
      "Écoulement rétabli immédiatement, aucun refoulement constaté après test. Intervention d'une heure — 120 € TTC.",
    date: "2026-04-28",
  },
  {
    slug: "chauffe-eau-lagnieu",
    title: "Remplacement chauffe-eau 200L à Lagnieu",
    h1: "Remplacement chauffe-eau 200L à Lagnieu centre",
    metaDescription:
      "Remplacement d'un chauffe-eau électrique 200L en fin de vie à Lagnieu. Pose neuf Atlantic en demi-journée. Devis gratuit – Mathelin Plomberie.",
    ville: "Lagnieu",
    quartier: "centre-ville",
    probleme:
      "Le ballon électrique de 200 litres ne chauffait plus depuis deux jours. Le diagnostic a révélé une résistance entièrement entartrée et une cuve percée par la corrosion. Le ballon avait 14 ans.",
    action:
      "Vidange et dépose de l'ancien ballon. Installation d'un chauffe-eau Atlantic 200L stéatite vertical, raccordement hydraulique et électrique. Remplacement du groupe de sécurité.",
    resultat:
      "Eau chaude disponible le soir même. Pose réalisée en 3 heures — 680 € TTC fourniture et pose, ancien appareil évacué.",
    date: "2026-04-25",
  },
  {
    slug: "debouchage-douche-perouges",
    title: "Débouchage douche à Pérouges – Maison ancienne",
    h1: "Débouchage douche dans une maison ancienne à Pérouges",
    metaDescription:
      "Douche bouchée dans une maison ancienne à Pérouges. Débouchage professionnel et nettoyage du siphon. Intervention rapide – Mathelin Plomberie.",
    ville: "Pérouges",
    quartier: "cité médiévale",
    probleme:
      "L'eau de la douche ne s'évacuait plus du tout dans cette maison en pierre du village médiéval. Le siphon était accessible mais le bouchon se trouvait plus loin dans la canalisation en fonte ancienne.",
    action:
      "Démontage du siphon, passage du furet sur 6 mètres dans la canalisation en fonte. Extraction d'un bouchon de cheveux et savon solidifié. Nettoyage complet du siphon.",
    resultat:
      "Évacuation rapide rétablie. Le client a été conseillé sur l'installation d'une grille de protection. Intervention — 110 € TTC.",
    date: "2026-04-22",
  },
  {
    slug: "radiateur-froid-saint-vulbas",
    title: "Radiateur froid à Saint-Vulbas – Diagnostic chauffage",
    h1: "Radiateur froid réparé en résidence à Saint-Vulbas",
    metaDescription:
      "Radiateur froid en partie basse dans une résidence à Saint-Vulbas. Purge et désembouage partiel par chauffagiste local – Mathelin Plomberie.",
    ville: "Saint-Vulbas",
    quartier: "résidence Les Genêts",
    probleme:
      "Un radiateur du salon restait froid en partie basse malgré la purge effectuée par le propriétaire. Les autres radiateurs fonctionnaient normalement. Suspicion d'embouage localisé.",
    action:
      "Purge complète du circuit, rinçage du radiateur incriminé à contre-courant. Vérification du débit sur le té de réglage et rééquilibrage du circuit de chauffage sur les 5 radiateurs.",
    resultat:
      "Radiateur chaud uniformément après intervention. Chauffage équilibré dans toutes les pièces — 150 € TTC.",
    date: "2026-04-18",
  },
  {
    slug: "fuite-chauffe-eau-villieu",
    title: "Fuite groupe sécurité à Villieu-Loyes-Mollon",
    h1: "Remplacement groupe de sécurité à Villieu-Loyes-Mollon",
    metaDescription:
      "Fuite permanente au groupe de sécurité d'un chauffe-eau à Villieu-Loyes-Mollon. Remplacement rapide par plombier local – Mathelin Plomberie.",
    ville: "Villieu-Loyes-Mollon",
    quartier: "quartier de la mairie",
    probleme:
      "Le groupe de sécurité du chauffe-eau coulait en permanence, pas seulement pendant la chauffe. Le clapet était bloqué par le calcaire après 8 ans sans remplacement. Perte d'eau estimée à 5 litres par heure.",
    action:
      "Coupure d'eau et vidange partielle du ballon. Dépose de l'ancien groupe de sécurité, nettoyage du raccord et pose d'un groupe neuf NF avec siphon d'évacuation.",
    resultat:
      "Plus aucune fuite hors cycle de chauffe. Le client économise environ 15 € par mois sur sa facture d'eau — 130 € TTC pièces et main-d'œuvre.",
    date: "2026-04-15",
  },
  {
    slug: "chaudiere-pression-amberieu",
    title: "Perte de pression chaudière à Ambérieu – Quartier Tiret",
    h1: "Perte de pression chaudière résolue – Quartier Tiret, Ambérieu",
    metaDescription:
      "Chaudière gaz en perte de pression récurrente au quartier Tiret à Ambérieu. Diagnostic et réparation du vase d'expansion – Mathelin Plomberie.",
    ville: "Ambérieu-en-Bugey",
    quartier: "quartier Tiret",
    probleme:
      "La chaudière gaz murale perdait sa pression tous les 2-3 jours, passant de 1,5 bar à 0,5 bar. Le propriétaire devait remettre de l'eau régulièrement. Code erreur récurrent au démarrage.",
    action:
      "Vérification du circuit : aucune fuite visible sur les radiateurs ni les raccords. Le vase d'expansion était dégonflé (membrane percée). Remplacement du vase d'expansion et remise en pression du circuit.",
    resultat:
      "Pression stable à 1,5 bar depuis l'intervention, plus aucun code erreur. Réparation effectuée en 1h30 — 220 € TTC.",
    date: "2026-04-11",
  },
  {
    slug: "robinet-cuisine-meximieux",
    title: "Remplacement mitigeur cuisine à Meximieux centre",
    h1: "Remplacement mitigeur cuisine au centre-ville de Meximieux",
    metaDescription:
      "Mitigeur de cuisine qui fuit remplacé au centre-ville de Meximieux. Pose d'un mitigeur Grohe neuf par plombier local – Mathelin Plomberie.",
    ville: "Meximieux",
    quartier: "centre-ville",
    probleme:
      "Le mitigeur de cuisine gouttait en permanence malgré le serrage. La cartouche céramique était usée et le corps du robinet présentait des traces de corrosion. Robinet d'origine posé à la construction il y a 18 ans.",
    action:
      "Dépose de l'ancien mitigeur, nettoyage du plan de travail et des raccords. Pose d'un mitigeur Grohe avec douchette extractible, raccordement sur flexibles neufs.",
    resultat:
      "Plus aucune fuite, débit et température ajustables en douceur. Le client apprécie la douchette pour le rinçage — 195 € TTC fourniture et pose.",
    date: "2026-04-08",
  },
  {
    slug: "canalisation-bouchee-lagnieu",
    title: "Canalisation principale bouchée à Lagnieu",
    h1: "Débouchage canalisation principale à Lagnieu",
    metaDescription:
      "Canalisation principale bouchée à Lagnieu. Hydrocurage haute pression et inspection caméra par plombier professionnel – Mathelin Plomberie.",
    ville: "Lagnieu",
    quartier: "route de Lyon",
    probleme:
      "Tous les appareils sanitaires refoulaient simultanément : WC, douche et évier de cuisine. La canalisation principale en PVC de 100 mm était obstruée entre la maison et le regard. Terrain en pente avec accès difficile.",
    action:
      "Hydrocurage haute pression depuis le regard extérieur. Extraction d'un amas de graisses et de racines sur 3 mètres. Inspection caméra pour vérifier l'état du tuyau après nettoyage.",
    resultat:
      "Évacuation totalement rétablie sur l'ensemble du réseau. Recommandation d'un curage préventif annuel — 280 € TTC.",
    date: "2026-04-04",
  },
  {
    slug: "fuite-wc-saint-denis-bugey",
    title: "Fuite WC à Saint-Denis-en-Bugey – Réparation rapide",
    h1: "Réparation fuite WC à Saint-Denis-en-Bugey",
    metaDescription:
      "Fuite au pied du WC à Saint-Denis-en-Bugey. Remplacement du joint de sortie et fixation. Intervention rapide – Mathelin Plomberie Chauffage.",
    ville: "Saint-Denis-en-Bugey",
    quartier: "route d'Ambérieu",
    probleme:
      "De l'eau suintait au pied de la cuvette à chaque chasse d'eau. Le joint de sortie (joint à lèvre) était écrasé et ne faisait plus l'étanchéité. Le carrelage commençait à se décoller autour du WC.",
    action:
      "Dépose de la cuvette, nettoyage du manchon d'évacuation et du sol. Remplacement du joint à lèvre et des vis de fixation. Repose de la cuvette avec serrage contrôlé.",
    resultat:
      "Étanchéité parfaite, plus aucun suintement après 20 chasses de test. Intervention en 1 heure — 110 € TTC.",
    date: "2026-03-31",
  },
  {
    slug: "detartrage-ballon-chateau-gaillard",
    title: "Détartrage ballon eau chaude à Château-Gaillard",
    h1: "Détartrage ballon eau chaude à Château-Gaillard",
    metaDescription:
      "Détartrage d'un ballon d'eau chaude électrique à Château-Gaillard. Nettoyage résistance et cuve, remplacement anode – Mathelin Plomberie.",
    ville: "Château-Gaillard",
    quartier: "lotissement des Tilleuls",
    probleme:
      "L'eau chaude mettait de plus en plus de temps à arriver et le ballon faisait des bruits de claquement pendant la chauffe. La résistance était recouverte de 3 cm de calcaire après 6 ans sans entretien.",
    action:
      "Vidange complète du ballon, ouverture de la trappe d'accès. Détartrage mécanique de la résistance stéatite et nettoyage de la cuve. Remplacement de l'anode magnésium usée.",
    resultat:
      "Chauffe silencieuse et rapide, consommation électrique réduite d'environ 15 %. Entretien réalisé en 2 heures — 160 € TTC.",
    date: "2026-03-27",
  },
  {
    slug: "thermostat-chaudiere-pont-ain",
    title: "Thermostat chaudière défaillant à Pont-d'Ain",
    h1: "Remplacement thermostat chaudière à Pont-d'Ain",
    metaDescription:
      "Thermostat de chaudière défaillant à Pont-d'Ain. Diagnostic et remplacement par chauffagiste qualifié. Confort retrouvé – Mathelin Plomberie.",
    ville: "Pont-d'Ain",
    quartier: "centre bourg",
    probleme:
      "La chaudière gaz fonctionnait en continu sans respecter la consigne de température. Le thermostat d'ambiance ne communiquait plus avec la chaudière. La maison surchauffait la nuit, facture de gaz en hausse.",
    action:
      "Diagnostic du thermostat filaire : câble coupé dans la goulotte du couloir. Remplacement par un thermostat programmable sans fil compatible. Paramétrage des plages horaires avec le propriétaire.",
    resultat:
      "Régulation de température fonctionnelle, programmation jour/nuit effective. Économie estimée à 15–20 % sur la facture de gaz — 185 € TTC fourni posé.",
    date: "2026-03-23",
  },
  {
    slug: "debouchage-evier-rignieux",
    title: "Débouchage évier à Rignieux-le-Franc",
    h1: "Débouchage évier bouché à Rignieux-le-Franc",
    metaDescription:
      "Évier de cuisine bouché à Rignieux-le-Franc. Débouchage au furet et nettoyage du siphon par plombier local – Mathelin Plomberie Chauffage.",
    ville: "Rignieux-le-Franc",
    quartier: "chemin des Granges",
    probleme:
      "L'évier de cuisine ne s'évacuait plus du tout. Le propriétaire avait essayé un déboucheur chimique sans résultat. Le bouchon se situait après le siphon, dans la canalisation encastrée dans le mur.",
    action:
      "Démontage du siphon et passage du furet sur 3 mètres dans la canalisation murale. Extraction d'un bouchon graisseux compact. Rinçage abondant et remontage du siphon.",
    resultat:
      "Évacuation fluide rétablie. Conseil donné au client pour l'entretien préventif mensuel (eau bouillante + vinaigre) — 100 € TTC.",
    date: "2026-03-19",
  },
  {
    slug: "purge-radiateurs-douvres",
    title: "Purge radiateurs à Douvres – Chauffage optimisé",
    h1: "Purge et équilibrage des radiateurs à Douvres",
    metaDescription:
      "Purge complète et équilibrage de 8 radiateurs à Douvres. Chauffage homogène retrouvé par chauffagiste local – Mathelin Plomberie Chauffage.",
    ville: "Douvres",
    quartier: "hameau de l'église",
    probleme:
      "Plusieurs radiateurs chauffaient mal dans cette maison de 120 m². Les pièces du haut restaient froides tandis que le salon surchauffait. La chaudière fonctionnait correctement mais le circuit n'avait pas été purgé depuis 4 ans.",
    action:
      "Purge méthodique des 8 radiateurs en commençant par le plus éloigné de la chaudière. Réglage des tés d'équilibrage sur chaque radiateur. Remise en pression du circuit à 1,5 bar.",
    resultat:
      "Chauffage homogène dans toutes les pièces, températures équilibrées à 1°C près. Intervention de 2 heures — 140 € TTC.",
    date: "2026-03-14",
  },
  {
    slug: "groupe-securite-beligneux",
    title: "Remplacement groupe sécurité à Béligneux",
    h1: "Groupe de sécurité remplacé à Béligneux",
    metaDescription:
      "Remplacement d'un groupe de sécurité qui fuit en continu à Béligneux. Intervention rapide par plombier local – Mathelin Plomberie Chauffage.",
    ville: "Béligneux",
    quartier: "route de Pérouges",
    probleme:
      "Le groupe de sécurité du chauffe-eau coulait en permanence dans le siphon d'évacuation. Le propriétaire s'en est aperçu grâce à une facture d'eau anormalement élevée. Le calcaire avait bloqué le clapet anti-retour.",
    action:
      "Fermeture de l'arrivée d'eau, vidange partielle du ballon. Dépose du groupe de sécurité grippé, nettoyage du filetage. Pose d'un groupe neuf Watts avec raccord diélectrique et siphon.",
    resultat:
      "Fuite stoppée, fonctionnement normal du clapet vérifié sur 3 cycles de chauffe. Intervention en 1 heure — 125 € TTC pièces incluses.",
    date: "2026-03-10",
  },
];
