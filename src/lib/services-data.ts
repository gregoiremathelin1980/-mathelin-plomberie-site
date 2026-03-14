export const SERVICES = [
  {
    slug: "debouchage-canalisation",
    title: "Débouchage canalisation",
    description: "Débouchage et entretien des canalisations. Intervention rapide pour évacuation et diagnostic.",
    icon: "Pipe",
  },
  {
    slug: "reparation-fuite",
    title: "Réparation fuite",
    description: "Recherche de fuites et réparation. Équipement de détection pour localiser et traiter les fuites.",
    icon: "Droplets",
  },
  {
    slug: "robinetterie",
    title: "Robinetterie",
    description: "Remplacement et réparation de robinetterie. Cuisine, salle de bain, WC.",
    icon: "Gauge",
  },
  {
    slug: "installation-chauffe-eau",
    title: "Installation chauffe-eau",
    description: "Pose de chauffe-eau électrique, gaz ou thermodynamique. Ballon, instantané.",
    icon: "Flame",
  },
  {
    slug: "remplacement-chauffe-eau",
    title: "Remplacement chauffe-eau",
    description: "Remplacement de chauffe-eau en fin de vie ou défaillant. Devis et pose.",
    icon: "Flame",
  },
  {
    slug: "depannage-chauffe-eau",
    title: "Dépannage chauffe-eau",
    description: "Dépannage et entretien de chauffe-eau. Pas d'eau chaude, fuite, diagnostic.",
    icon: "Flame",
  },
  {
    slug: "installation-radiateurs",
    title: "Installation radiateurs",
    description: "Pose et raccordement de radiateurs. Eau chaude ou électrique.",
    icon: "Thermometer",
  },
  {
    slug: "remplacement-radiateurs",
    title: "Remplacement radiateurs",
    description: "Remplacement de radiateurs. Raccordement, purge et équilibrage du circuit.",
    icon: "Thermometer",
  },
  {
    slug: "desembouage-chauffage",
    title: "Désembouage chauffage",
    description: "Désembouage du circuit de chauffage. Rénovation et entretien des installations.",
    icon: "Thermometer",
  },
  {
    slug: "installation-plancher-chauffant",
    title: "Installation plancher chauffant",
    description: "Pose de plancher chauffant hydraulique ou électrique. Neuf ou rénovation.",
    icon: "Thermometer",
  },
  {
    slug: "installation-chaudiere",
    title: "Installation chaudière",
    description: "Installation de chaudière gaz, fioul ou mixte. Remplacement et mise aux normes.",
    icon: "Flame",
  },
  {
    slug: "installation-wc",
    title: "Installation WC",
    description: "Pose et remplacement de WC. Modèles à poser, suspendus, sortie horizontale ou verticale.",
    icon: "Bath",
  },
] as const;

export type ServiceSlug = (typeof SERVICES)[number]["slug"];
