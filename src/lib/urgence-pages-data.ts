export interface UrgencePageData {
  slug: string;
  title: string;
  h1: string;
  metaDescription: string;
  intro: string;
  risques: string[];
  solution: string;
  cta: string;
  faq: { question: string; answer: string }[];
}

export const URGENCE_PAGES: UrgencePageData[] = [
  // --- MEXIMIEUX ---
  {
    slug: "fuite-eau-meximieux",
    title: "Fuite d'eau à Meximieux",
    h1: "Fuite d'eau à Meximieux – Intervention en urgence",
    metaDescription:
      "Fuite d'eau à Meximieux ? Plombier local basé à Pérouges, intervention sous 1h. Recherche de fuite, réparation, devis gratuit. Appelez Mathelin Plomberie.",
    intro:
      "Une fuite d'eau à Meximieux peut survenir à tout moment : joint usé sous l'évier, tuyau percé dans la salle de bain, canalisation enterrée qui suinte. Dans les maisons des lotissements des Allagniers ou les appartements du centre-ville, une fuite non traitée cause rapidement des dégâts importants.",
    risques: [
      "Dégât des eaux avec infiltration chez le voisin (copropriété)",
      "Moisissures et détérioration des murs et plafonds",
      "Surconsommation d'eau pouvant doubler votre facture",
      "Risque électrique si l'eau atteint une prise ou un tableau",
    ],
    solution:
      "J'arrive sous 1 heure à Meximieux depuis ma base de Pérouges. Diagnostic visuel et détection (écoute, caméra si nécessaire), réparation immédiate si possible, ou mise en sécurité + devis pour les travaux plus importants. Pièces courantes en stock dans le véhicule.",
    cta: "Fuite en cours ? Coupez l'eau au compteur et appelez immédiatement.",
    faq: [
      {
        question: "Comment arrêter une fuite d'eau en attendant le plombier à Meximieux ?",
        answer:
          "Coupez l'arrivée d'eau générale au compteur (souvent en limite de propriété ou au sous-sol). Épongez l'eau stagnante pour limiter les dégâts. Si la fuite est sur un radiateur, fermez la vanne du radiateur concerné.",
      },
      {
        question: "Combien coûte une réparation de fuite à Meximieux ?",
        answer:
          "Une réparation simple (joint, raccord) démarre à 60-90 € TTC. Une recherche de fuite encastrée avec détection peut aller de 150 à 350 € selon la complexité. Devis systématique avant travaux.",
      },
      {
        question: "Intervenez-vous pour une fuite le dimanche à Meximieux ?",
        answer:
          "Oui, j'assure les urgences 7j/7 sur Meximieux et les communes voisines. Appelez directement pour vérifier ma disponibilité.",
      },
    ],
  },
  {
    slug: "wc-bouche-meximieux",
    title: "WC bouché à Meximieux",
    h1: "WC bouché à Meximieux – Débouchage rapide",
    metaDescription:
      "WC bouché à Meximieux ? Débouchage professionnel par plombier local. Intervention rapide, matériel pro. Mathelin Plomberie Chauffage – Pérouges.",
    intro:
      "Un WC bouché à Meximieux, c'est le quotidien perturbé pour toute la famille. Que ce soit dans un pavillon du quartier de la gare ou un appartement près de la Place de la Grenette, le problème nécessite souvent un débouchage mécanique professionnel quand la ventouse ne suffit plus.",
    risques: [
      "Débordement et risque sanitaire",
      "Odeurs persistantes dans toute la maison",
      "Refoulement dans la douche ou la baignoire (réseau commun)",
      "Dégradation des joints et étanchéité de la cuvette",
    ],
    solution:
      "Débouchage mécanique avec furet professionnel ou hydrocurage haute pression selon l'obstruction. Je vérifie l'état de la canalisation après intervention pour éviter les récidives. Si le bouchon est profond (canalisation principale), caméra d'inspection pour localiser précisément.",
    cta: "WC bouché ? N'utilisez pas de produits chimiques agressifs – appelez un pro.",
    faq: [
      {
        question: "Peut-on déboucher un WC soi-même à Meximieux ?",
        answer:
          "La ventouse fonctionne pour les bouchons légers. Évitez l'acide et les déboucheurs chimiques qui abîment les canalisations. Si le problème persiste après 2 tentatives, faites appel à un plombier pour un débouchage mécanique.",
      },
      {
        question: "Combien coûte un débouchage de WC à Meximieux ?",
        answer:
          "Un débouchage simple au furet : 80-120 € TTC. Un hydrocurage de canalisation principale : 150-250 € TTC. Tarif communiqué par téléphone avant déplacement.",
      },
      {
        question: "Le débouchage est-il garanti ?",
        answer:
          "Oui. Si le bouchon revient dans les 30 jours pour la même cause, je réinterviens gratuitement. En cas de problème structurel (canalisation affaissée), je vous oriente vers la solution adaptée.",
      },
    ],
  },
  {
    slug: "chauffe-eau-panne-meximieux",
    title: "Chauffe-eau en panne à Meximieux",
    h1: "Chauffe-eau en panne à Meximieux – Dépannage express",
    metaDescription:
      "Chauffe-eau en panne à Meximieux ? Diagnostic et réparation rapide par artisan local. Remplacement si nécessaire. Devis gratuit – Mathelin Plomberie.",
    intro:
      "Plus d'eau chaude dans votre maison à Meximieux ? Que ce soit un ballon électrique dans un pavillon de Villieu-Loyes-Mollon ou un chauffe-eau thermodynamique dans une construction récente des Allagniers, la panne de chauffe-eau est une urgence du quotidien – surtout en hiver.",
    risques: [
      "Plus d'eau chaude pour la douche et la vaisselle",
      "Fuite au niveau du groupe de sécurité (dégât des eaux possible)",
      "Surconsommation électrique si la résistance est entartrée",
      "Risque de panne définitive si le ballon est en fin de vie (10-15 ans)",
    ],
    solution:
      "Diagnostic complet : vérification de la résistance, du thermostat, du groupe de sécurité et de l'anode. Réparation si possible (remplacement résistance, thermostat). Si le ballon est trop ancien ou percé, je propose un remplacement avec devis détaillé – pose sous 48 h.",
    cta: "Plus d'eau chaude ? Un diagnostic rapide évite un remplacement inutile.",
    faq: [
      {
        question: "Mon chauffe-eau ne chauffe plus à Meximieux, que faire ?",
        answer:
          "Vérifiez d'abord le disjoncteur dédié au chauffe-eau. Si le courant passe, le problème vient de la résistance, du thermostat ou du ballon lui-même. Un diagnostic professionnel permet de savoir s'il faut réparer ou remplacer.",
      },
      {
        question: "Combien de temps pour remplacer un chauffe-eau à Meximieux ?",
        answer:
          "Un remplacement standard (même emplacement, même capacité) prend 2 à 3 h. Si le ballon est disponible en stock, l'intervention peut être planifiée sous 24-48 h.",
      },
      {
        question: "Quel chauffe-eau choisir pour une maison à Meximieux ?",
        answer:
          "Pour une famille de 3-4 personnes, un ballon 200 L électrique est le standard. Le thermodynamique consomme 3 fois moins mais coûte plus cher à l'achat. Je vous conseille selon votre usage et votre budget.",
      },
    ],
  },
  {
    slug: "chaudiere-panne-meximieux",
    title: "Chaudière en panne à Meximieux",
    h1: "Chaudière en panne à Meximieux – Dépannage chauffage",
    metaDescription:
      "Chaudière en panne à Meximieux ? Dépannage rapide par chauffagiste local (BP Génie Climatique). Radiateur froid, pression basse, bruit. Mathelin Plomberie.",
    intro:
      "Votre chaudière ne démarre plus à Meximieux ? En plein hiver sur la Côtière de l'Ain, une panne de chauffage est une vraie urgence. Que ce soit une chaudière gaz murale dans un lotissement ou une chaudière au sol dans une maison ancienne de Pérouges, le diagnostic doit être rapide.",
    risques: [
      "Plus de chauffage ni d'eau chaude (chaudière mixte)",
      "Gel des canalisations si la maison n'est pas chauffée en hiver",
      "Panne qui s'aggrave : une fuite interne peut endommager la chaudière définitivement",
      "Risque CO (monoxyde de carbone) si la combustion est défectueuse",
    ],
    solution:
      "Diagnostic complet : pression du circuit, état du brûleur, vérification des sécurités, code erreur. Réparation sur place si la pièce est courante (sonde, pressostat, vanne 3 voies). Sinon, commande de la pièce et intervention sous 48-72 h. Mise en sécurité immédiate si risque CO.",
    cta: "Chaudière en panne ? Ne tentez pas de la redémarrer si elle s'est arrêtée sur défaut.",
    faq: [
      {
        question: "Ma chaudière affiche un code erreur à Meximieux, que faire ?",
        answer:
          "Notez le code erreur affiché et appelez-moi. Certains codes sont simples (pression basse = remettre de l'eau dans le circuit). D'autres nécessitent un diagnostic professionnel. Ne réinitialisez pas plus de 2 fois de suite.",
      },
      {
        question: "L'entretien annuel de chaudière est-il obligatoire ?",
        answer:
          "Oui, l'entretien annuel est obligatoire pour les chaudières gaz, fioul et bois (décret 2009-649). Il permet de prévenir les pannes et d'assurer votre sécurité. Attestation fournie après intervention.",
      },
      {
        question: "Combien coûte un dépannage chaudière à Meximieux ?",
        answer:
          "Un diagnostic démarre à 80 € TTC. La réparation dépend de la pièce à remplacer. L'entretien annuel complet : 90-130 € TTC. Devis toujours fourni avant intervention.",
      },
    ],
  },
  // --- AMBÉRIEU ---
  {
    slug: "fuite-eau-amberieu",
    title: "Fuite d'eau à Ambérieu-en-Bugey",
    h1: "Fuite d'eau à Ambérieu – Plombier en urgence",
    metaDescription:
      "Fuite d'eau à Ambérieu-en-Bugey ? Artisan plombier local, intervention rapide depuis Pérouges. Recherche de fuite, réparation, devis gratuit.",
    intro:
      "Une fuite d'eau à Ambérieu-en-Bugey nécessite une réaction rapide. Dans les immeubles anciens de la rue Alexandre Bérard, les canalisations en cuivre ou en plomb vieillissantes sont sujettes aux fuites. Dans les maisons de Saint-Denis-en-Bugey ou les pavillons du quartier Tiret, ce sont souvent les raccords ou les joints qui lâchent.",
    risques: [
      "Infiltration dans les murs en pierre (fréquent dans le bâti ancien du Bugey)",
      "Dégât des eaux avec impact sur l'assurance habitation",
      "Facture d'eau en forte hausse (fuites invisibles)",
      "Affaiblissement des fondations en cas de fuite enterrée",
    ],
    solution:
      "Intervention sous 1 h depuis Pérouges via la D1084. Recherche de fuite par écoute, gaz traceur ou caméra thermique selon le cas. Réparation immédiate des fuites accessibles, devis pour les réparations encastrées. Mise en sécurité systématique.",
    cta: "Fuite à Ambérieu ? Fermez le robinet d'arrêt général et appelez.",
    faq: [
      {
        question: "Comment détecter une fuite cachée à Ambérieu ?",
        answer:
          "Surveillez votre compteur d'eau : relevez le chiffre le soir, ne consommez pas d'eau la nuit, relevez le matin. Si le compteur a tourné, vous avez une fuite. J'utilise ensuite des outils de détection professionnels pour la localiser sans tout casser.",
      },
      {
        question: "Mon assurance couvre-t-elle la recherche de fuite ?",
        answer:
          "Oui, la plupart des contrats habitation couvrent la recherche de fuite (convention IRSI). Je fournis le rapport de recherche nécessaire pour votre déclaration de sinistre.",
      },
      {
        question: "Fuite sur canalisation enterrée à Ambérieu : que faire ?",
        answer:
          "Ne creusez pas vous-même. J'utilise un détecteur acoustique pour localiser la fuite sans terrassement inutile. La réparation se fait ensuite de manière ciblée pour limiter les travaux.",
      },
    ],
  },
  {
    slug: "wc-bouche-amberieu",
    title: "WC bouché à Ambérieu-en-Bugey",
    h1: "WC bouché à Ambérieu – Débouchage professionnel",
    metaDescription:
      "WC bouché à Ambérieu-en-Bugey ? Débouchage au furet ou hydrocurage par plombier local. Intervention rapide, tarif transparent. Mathelin Plomberie.",
    intro:
      "Un WC bouché à Ambérieu-en-Bugey perturbe toute la maisonnée. Dans les logements du centre-ville ou les maisons de Château-Gaillard, les canalisations anciennes à faible pente sont souvent la cause de bouchons récurrents. Le problème peut venir du WC lui-même ou d'un engorgement plus profond dans la canalisation principale.",
    risques: [
      "Débordement avec risque d'inondation sanitaire",
      "Refoulement dans les autres appareils (douche, lavabo)",
      "Odeurs nauséabondes dans le logement",
      "Dégradation de la canalisation si bouchon ancien calcifié",
    ],
    solution:
      "Débouchage mécanique au furet électrique pour les bouchons proches. Hydrocurage haute pression pour les engorgements profonds ou récurrents. Inspection caméra si le problème revient régulièrement pour identifier un défaut structurel (contre-pente, racines, canalisation affaissée).",
    cta: "Ne versez pas d'acide ! Appelez pour un débouchage propre et garanti.",
    faq: [
      {
        question: "Mon WC se bouche souvent à Ambérieu, pourquoi ?",
        answer:
          "Les causes fréquentes : canalisations anciennes à faible diamètre, contre-pente, accumulation de calcaire, ou racines d'arbres dans le réseau. Une inspection caméra permet d'identifier la cause exacte et d'y remédier durablement.",
      },
      {
        question: "Le débouchage de WC est-il rapide ?",
        answer:
          "Un débouchage simple prend 30 à 45 minutes. Si le bouchon est profond et nécessite un hydrocurage, comptez 1 h à 1 h 30. L'intervention est propre — je protège le sol et nettoie après.",
      },
      {
        question: "Intervenez-vous le soir pour un WC bouché à Ambérieu ?",
        answer:
          "Oui, les urgences sanitaires n'attendent pas. J'interviens en soirée et le week-end selon disponibilité. Appelez pour une prise en charge rapide.",
      },
    ],
  },
  {
    slug: "chauffe-eau-panne-amberieu",
    title: "Chauffe-eau en panne à Ambérieu-en-Bugey",
    h1: "Panne de chauffe-eau à Ambérieu – Diagnostic rapide",
    metaDescription:
      "Chauffe-eau en panne à Ambérieu ? Diagnostic, réparation ou remplacement par artisan chauffagiste local. Devis gratuit, intervention rapide. Mathelin Plomberie.",
    intro:
      "Plus d'eau chaude à Ambérieu-en-Bugey ? Dans les résidences du quartier Saint-Germain comme dans les maisons anciennes de Lagnieu, la panne de chauffe-eau est fréquente — surtout quand le ballon a plus de 10 ans. L'eau calcaire du réseau d'Ambérieu accélère l'entartrage et réduit la durée de vie des résistances.",
    risques: [
      "Absence totale d'eau chaude (douche, vaisselle, ménage)",
      "Fuite au groupe de sécurité avec dégât des eaux",
      "Ballon qui consomme plus à cause de l'entartrage",
      "Risque de percement du ballon (corrosion de la cuve)",
    ],
    solution:
      "Diagnostic complet sur place : test de la résistance, du thermostat, vérification du groupe de sécurité et de l'état de l'anode sacrificielle. Réparation si le ballon est récent, remplacement avec devis si nécessaire. Je gère aussi l'évacuation de l'ancien appareil.",
    cta: "Plus d'eau chaude ? Vérifiez le disjoncteur, puis appelez.",
    faq: [
      {
        question: "Faut-il réparer ou remplacer mon chauffe-eau à Ambérieu ?",
        answer:
          "Si le ballon a moins de 8 ans et que la cuve n'est pas percée, la réparation est souvent rentable (thermostat, résistance). Au-delà de 10-12 ans, le remplacement est généralement plus économique à moyen terme.",
      },
      {
        question: "Combien de temps sans eau chaude en cas de remplacement ?",
        answer:
          "Si le modèle est en stock (200 L électrique standard), le remplacement peut se faire le jour même ou le lendemain. Pour un modèle thermodynamique, comptez 3 à 5 jours de délai de commande.",
      },
      {
        question: "L'eau est-elle très calcaire à Ambérieu ?",
        answer:
          "Oui, le réseau d'eau du secteur Bugey/Plaine de l'Ain est assez calcaire (30-35°fH). Un détartrage régulier du chauffe-eau (tous les 3-4 ans) et éventuellement un adoucisseur prolongent significativement la durée de vie du ballon.",
      },
    ],
  },
  {
    slug: "chaudiere-panne-amberieu",
    title: "Chaudière en panne à Ambérieu-en-Bugey",
    h1: "Chaudière en panne à Ambérieu – Chauffagiste en urgence",
    metaDescription:
      "Chaudière en panne à Ambérieu-en-Bugey ? Chauffagiste diplômé (BP Génie Climatique), dépannage rapide. Radiateur froid, code erreur, pression. Mathelin Plomberie.",
    intro:
      "En hiver, une chaudière en panne à Ambérieu-en-Bugey, c'est le froid qui s'installe rapidement — surtout dans les maisons en altitude de Saint-Denis-en-Bugey exposées au vent du Bugey. Chaudière gaz murale ou au sol, le diagnostic doit être confié à un chauffagiste qualifié.",
    risques: [
      "Gel des canalisations si la maison est inoccupée (risque fort en Bugey)",
      "Absence de chauffage et d'eau chaude sanitaire",
      "Risque de monoxyde de carbone si combustion défectueuse",
      "Panne aggravée par une tentative de réparation non qualifiée",
    ],
    solution:
      "Diagnostic complet avec lecture du code erreur, contrôle de la pression, vérification du brûleur et des sécurités. Pièces courantes en stock (pressostat, sonde, vanne 3 voies). Mise en sécurité immédiate en cas de risque CO. Attestation d'entretien fournie.",
    cta: "Chaudière en panne en plein hiver ? Chaque heure compte — appelez maintenant.",
    faq: [
      {
        question: "Ma chaudière perd de la pression à Ambérieu, est-ce grave ?",
        answer:
          "Une baisse de pression lente est souvent due à une micro-fuite sur le circuit de chauffage ou à un vase d'expansion défaillant. Remettez de l'eau via le robinet de remplissage (entre 1 et 1,5 bar). Si le problème revient en moins de 48 h, appelez pour un diagnostic.",
      },
      {
        question: "Faites-vous l'entretien de chaudière à Ambérieu ?",
        answer:
          "Oui. Entretien annuel obligatoire : nettoyage du brûleur, vérification du tirage, contrôle des sécurités, mesure de CO. Attestation remise en fin d'intervention. Tarif : 90-130 € TTC.",
      },
      {
        question: "Chaudière ou pompe à chaleur : que me conseillez-vous ?",
        answer:
          "Ça dépend de votre isolation et de votre budget. En rénovation à Ambérieu, une chaudière gaz condensation reste efficace et abordable. La PAC air-eau est intéressante pour les maisons bien isolées. Je vous conseille en fonction de votre situation.",
      },
    ],
  },
  // --- LAGNIEU ---
  {
    slug: "fuite-eau-lagnieu",
    title: "Fuite d'eau à Lagnieu",
    h1: "Fuite d'eau à Lagnieu – Plombier en urgence",
    metaDescription:
      "Fuite d'eau à Lagnieu ? Artisan plombier basé à Pérouges, intervention rapide. Recherche de fuite, réparation, devis gratuit. Appelez Mathelin Plomberie Chauffage.",
    intro:
      "À Lagnieu, les fuites d'eau touchent aussi bien les maisons de la route de Lyon que les appartements du centre bourg. Tuyaux en cuivre vieillissants, raccords PER mal serrés ou canalisations enterrées abîmées par les racines : chaque situation nécessite un diagnostic précis avant réparation.",
    risques: [
      "Dégât des eaux avec infiltration dans les murs en pierre (maisons anciennes de Lagnieu)",
      "Moisissures et détérioration rapide des revêtements",
      "Surconsommation d'eau importante si la fuite est invisible",
      "Risque d'affaissement si la fuite touche une canalisation enterrée",
    ],
    solution:
      "Depuis Pérouges, j'arrive en 15 minutes à Lagnieu. Détection par écoute ou caméra thermique, réparation immédiate quand c'est possible. Pièces courantes en stock dans le véhicule atelier. Devis clair avant tout travail important.",
    cta: "Fuite d'eau à Lagnieu ? Coupez l'arrivée d'eau et appelez immédiatement.",
    faq: [
      {
        question: "Quel est le délai d'intervention pour une fuite à Lagnieu ?",
        answer:
          "En urgence, j'arrive sous 30 minutes à Lagnieu depuis ma base de Pérouges (7 km). Pour les cas non urgents, rendez-vous sous 24-48 h.",
      },
      {
        question: "Comment couper l'eau en attendant le plombier à Lagnieu ?",
        answer:
          "Fermez la vanne d'arrêt général, généralement située près du compteur d'eau (souvent dans un regard en limite de propriété ou dans le garage). En appartement, cherchez la vanne sous l'évier ou dans le placard technique.",
      },
      {
        question: "Recherche de fuite à Lagnieu : quel tarif ?",
        answer:
          "Le déplacement + diagnostic visuel est inclus dans l'intervention (à partir de 80 € TTC). Si une détection par caméra ou gaz traceur est nécessaire, un devis complémentaire est établi avant.",
      },
    ],
  },
  {
    slug: "wc-bouche-lagnieu",
    title: "WC bouché à Lagnieu",
    h1: "WC bouché à Lagnieu – Débouchage rapide",
    metaDescription:
      "WC bouché à Lagnieu ? Débouchage professionnel par plombier local. Furet, hydrocurage, intervention rapide. Mathelin Plomberie Chauffage – Devis gratuit.",
    intro:
      "Un WC bouché à Lagnieu, c'est une situation courante que nous rencontrons régulièrement, aussi bien dans les pavillons le long de la route de Lyon que dans les logements du centre bourg. Lingettes, calcaire ou défaut de pente : les causes sont variées mais la solution est toujours rapide avec le bon matériel.",
    risques: [
      "Refoulement et débordement dans les pièces adjacentes",
      "Odeurs désagréables persistantes dans tout le logement",
      "Risque sanitaire si les eaux usées stagnent",
      "Bouchon aggravé si on utilise des produits chimiques inadaptés",
    ],
    solution:
      "Débouchage mécanique au furet professionnel ou hydrocurage haute pression selon le type de bouchon. Inspection caméra si récidive pour vérifier l'état de la canalisation. Intervention propre, résultat immédiat.",
    cta: "WC bouché à Lagnieu ? N'attendez pas le débordement — appelez maintenant.",
    faq: [
      {
        question: "Combien coûte un débouchage WC à Lagnieu ?",
        answer:
          "Un débouchage classique au furet coûte entre 100 et 150 € TTC. Si un hydrocurage est nécessaire (bouchon profond), comptez 200-300 € TTC. Devis gratuit par téléphone.",
      },
      {
        question: "Intervenez-vous le week-end à Lagnieu ?",
        answer:
          "Oui, j'interviens 7 jours sur 7, y compris samedi et dimanche matin. Les urgences sont traitées en priorité.",
      },
      {
        question: "Mon WC se bouche régulièrement à Lagnieu, pourquoi ?",
        answer:
          "C'est souvent un problème de pente insuffisante, de canalisation rétrécie par le calcaire, ou d'habitudes (lingettes, cotons-tiges). Une inspection caméra permet de diagnostiquer la cause exacte.",
      },
    ],
  },
  {
    slug: "chauffe-eau-panne-lagnieu",
    title: "Chauffe-eau en panne à Lagnieu",
    h1: "Chauffe-eau en panne à Lagnieu – Dépannage rapide",
    metaDescription:
      "Chauffe-eau en panne à Lagnieu ? Dépannage ou remplacement par plombier local. Ballon électrique, gaz, thermodynamique. Mathelin Plomberie – Intervention rapide.",
    intro:
      "Plus d'eau chaude à Lagnieu ? C'est un cas fréquent que nous rencontrons dans les maisons des années 80-90 de la route de Lyon, où les ballons électriques d'origine arrivent en fin de vie. Résistance entartrée, thermostat HS ou cuve percée : un diagnostic rapide permet de décider entre réparation et remplacement.",
    risques: [
      "Absence totale d'eau chaude pour la famille",
      "Fuite au groupe de sécurité entraînant dégât des eaux",
      "Surconsommation électrique si la résistance est entartrée",
      "Risque de panne définitive si le ballon a plus de 10 ans",
    ],
    solution:
      "Diagnostic complet du chauffe-eau : test du thermostat, vérification de la résistance, état du groupe de sécurité et de l'anode. Si réparable, intervention immédiate. Si remplacement nécessaire, devis transparent et pose sous 24-48 h (Atlantic, Thermor, De Dietrich en stock).",
    cta: "Plus d'eau chaude à Lagnieu ? Appelez pour un diagnostic rapide.",
    faq: [
      {
        question: "Combien coûte le remplacement d'un chauffe-eau à Lagnieu ?",
        answer:
          "Pour un ballon électrique 200L (le plus courant), comptez 550-750 € TTC fourni posé, incluant le remplacement du groupe de sécurité et l'évacuation de l'ancien. Devis gratuit et précis avant intervention.",
      },
      {
        question: "Chauffe-eau électrique ou thermodynamique à Lagnieu ?",
        answer:
          "Le ballon classique reste le plus abordable. Le thermodynamique coûte plus cher à l'achat (1 500-2 500 €) mais divise la facture électrique par 3. Je vous conseille en fonction de votre configuration et de votre budget.",
      },
      {
        question: "Mon chauffe-eau fait du bruit à Lagnieu, c'est normal ?",
        answer:
          "Des claquements ou sifflements pendant la chauffe signalent un entartrage de la résistance. Un détartrage (150-180 € TTC) résout le problème et prolonge la durée de vie du ballon de plusieurs années.",
      },
    ],
  },
  {
    slug: "chaudiere-panne-lagnieu",
    title: "Chaudière en panne à Lagnieu",
    h1: "Chaudière en panne à Lagnieu – Chauffagiste en urgence",
    metaDescription:
      "Chaudière en panne à Lagnieu ? Chauffagiste qualifié (BP Génie Climatique), dépannage rapide toutes marques. Diagnostic, réparation, entretien. Mathelin Plomberie.",
    intro:
      "Une chaudière en panne à Lagnieu en plein hiver, c'est une urgence. Que ce soit une chaudière gaz murale Saunier Duval ou une chaudière au sol Frisquet, le diagnostic doit être rapide et fiable. Nous rencontrons fréquemment des pannes liées à la pression, au thermostat ou au brûleur dans les maisons du secteur.",
    risques: [
      "Gel des canalisations si la maison reste sans chauffage",
      "Absence de chauffage et d'eau chaude sanitaire",
      "Risque de monoxyde de carbone si la combustion est défectueuse",
      "Facture de réparation plus élevée si la panne s'aggrave",
    ],
    solution:
      "Diagnostic complet : lecture du code erreur, contrôle pression circuit, vérification brûleur et sécurités. Pièces courantes en stock (pressostat, sonde, vanne 3 voies, circulateur). Mise en sécurité immédiate si risque CO. Attestation d'entretien fournie si entretien annuel réalisé.",
    cta: "Chaudière en panne à Lagnieu ? N'attendez pas le grand froid — appelez maintenant.",
    faq: [
      {
        question: "Ma chaudière affiche un code erreur à Lagnieu, que faire ?",
        answer:
          "Notez le code erreur affiché et coupez la chaudière. Certains codes sont bénins (manque de pression = remettre de l'eau). Pour les autres, appelez un chauffagiste qualifié. Ne tentez pas de réinitialiser plus de 2 fois de suite.",
      },
      {
        question: "Quel est le tarif d'un dépannage chaudière à Lagnieu ?",
        answer:
          "Un diagnostic + réparation courante (remplacement pressostat, purge, remise en pression) coûte entre 120 et 250 € TTC. Les pièces spécifiques font l'objet d'un devis séparé avant commande.",
      },
      {
        question: "Faites-vous l'entretien annuel de chaudière à Lagnieu ?",
        answer:
          "Oui. Entretien annuel obligatoire : nettoyage brûleur, vérification tirage, contrôle sécurités, mesure CO. Attestation conforme remise à la fin. Tarif : 90-130 € TTC selon le modèle.",
      },
    ],
  },
];
