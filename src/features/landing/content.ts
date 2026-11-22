export type AppId = "moramora" | "aiza" | "gaspika";

export type AppContent = {
  id: AppId;
  index: string;
  name: string;
  category: string;
  tagline: string;
  description: string;
  meaning: string;
  features: string[];
  tech: string[];
};

export const APPS: AppContent[] = [
  {
    id: "moramora",
    index: "01",
    name: "Moramora",
    category: "Mobilité & voirie",
    tagline: "Le réflexe citoyen pour des routes plus sûres",
    description:
      "Un accident, un nid-de-poule, une rue inondée ? Signalez-le en quelques secondes et suivez la prise en charge par les équipes sur le terrain.",
    meaning:
      "« Doucement » en malgache, pour une ville qui avance sans s'arrêter",
    features: [
      "Signalement photo géolocalisé en 10 secondes",
      "Priorisation des incidents par l'IA",
      "Suivi transparent des interventions",
      "Alertes ciblées pour les usagers proches",
    ],
    tech: ["IA", "Géolocalisation", "Temps réel"],
  },
  {
    id: "aiza",
    index: "02",
    name: "Aiza",
    category: "Navigation & services",
    tagline: "« Où est-ce ? » — la ville vous répond",
    description:
      "Le bon itinéraire, le bon bus, le bon service. Aiza réunit transport, mobilité douce et services de proximité dans un seul guide urbain.",
    meaning: "« Où ? » en malgache, la réponse à chaque déplacement",
    features: [
      "Itinéraires multimodaux en temps réel",
      "Transport en commun et covoiturage",
      "Santé, administration et marchés à proximité",
      "Guidage communautaire, même hors connexion",
    ],
    tech: ["Cloud", "Données ouvertes", "Cartographie"],
  },
  {
    id: "gaspika",
    index: "03",
    name: "Gaspika",
    category: "Déchets & économie circulaire",
    tagline: "Rien ne se perd, tout se valorise",
    description:
      "Signalez les dépôts sauvages, suivez les tournées et trouvez le point de tri le plus proche. Gaspika transforme les déchets en ressources.",
    meaning:
      "Du gaspillage à la ressource, avec les habitants comme premiers acteurs",
    features: [
      "Signalement photo des dépôts sauvages",
      "Carte et calendrier de collecte",
      "Points de tri et partenaires recycleurs",
      "Score citoyen et récompenses locales",
    ],
    tech: ["Capteurs IoT", "IA de tri", "Économie circulaire"],
  },
];

export const APP_BY_ID = Object.fromEntries(
  APPS.map((app) => [app.id, app]),
) as Record<AppId, AppContent>;

export type ChallengeId =
  | "trafic"
  | "dechets"
  | "inondations"
  | "services"
  | "pollution"
  | "coordination";

export type Challenge = {
  id: ChallengeId;
  title: string;
  description: string;
  apps: AppId[];
};

export const CHALLENGES: Challenge[] = [
  {
    id: "trafic",
    title: "Embouteillages",
    description:
      "Des itinéraires qui s'adaptent en temps réel et des incidents signalés par ceux qui les vivent.",
    apps: ["aiza", "moramora"],
  },
  {
    id: "dechets",
    title: "Gestion des déchets",
    description:
      "Des tournées mieux ciblées, des dépôts sauvages visibles et des déchets qui redeviennent des ressources.",
    apps: ["gaspika"],
  },
  {
    id: "inondations",
    title: "Inondations",
    description:
      "Des zones à risque cartographiées et des signalements qui remontent avant que l'eau ne monte.",
    apps: ["moramora", "aiza"],
  },
  {
    id: "services",
    title: "Accès aux services publics",
    description:
      "Un seul réflexe pour trouver un centre de santé, une administration ou le marché le plus proche.",
    apps: ["aiza"],
  },
  {
    id: "pollution",
    title: "Pollution",
    description:
      "Moins de déchets brûlés, moins de trajets inutiles et des données pour cibler les vraies priorités.",
    apps: ["gaspika", "moramora"],
  },
  {
    id: "coordination",
    title: "Coordination des infrastructures",
    description:
      "Une même donnée urbaine partagée entre les applications et les services de la ville.",
    apps: ["moramora", "aiza", "gaspika"],
  },
];

export type Step = {
  id: "signaler" | "comprendre" | "agir" | "apprendre";
  index: string;
  title: string;
  description: string;
};

export const STEPS: Step[] = [
  {
    id: "signaler",
    index: "01",
    title: "Le citoyen signale",
    description:
      "Une photo, une position, dix secondes. Chaque habitant devient le premier capteur de sa ville.",
  },
  {
    id: "comprendre",
    index: "02",
    title: "La plateforme comprend",
    description:
      "L'IA qualifie, regroupe et priorise les signalements. Les capteurs IoT complètent le tableau.",
  },
  {
    id: "agir",
    index: "03",
    title: "Les services agissent",
    description:
      "Les équipes reçoivent la bonne information, au bon endroit. Les usagers sont prévenus.",
  },
  {
    id: "apprendre",
    index: "04",
    title: "La ville apprend",
    description:
      "Chaque action enrichit une carte urbaine vivante, ouverte et de plus en plus prédictive.",
  },
];

export type Pillar = {
  index: string;
  title: string;
  description: string;
};

export const PILLARS: Pillar[] = [
  {
    index: "01",
    title: "Écouter",
    description:
      "Les habitants sont les capteurs les plus précis de la ville. Leur expérience devient une donnée utile.",
  },
  {
    index: "02",
    title: "Relier",
    description:
      "Une même information alimente la mobilité, les services et la propreté. Fini les silos.",
  },
  {
    index: "03",
    title: "Agir",
    description:
      "Des interventions priorisées, suivies et mesurables. La technologie s'arrête là où le service commence.",
  },
];

export type RoadmapItem = {
  id: "eau" | "air" | "participation";
  title: string;
  description: string;
  status: string;
};

export const ROADMAP: RoadmapItem[] = [
  {
    id: "eau",
    title: "Eau & inondations",
    description:
      "Des capteurs et des modèles prédictifs pour anticiper les crues avant qu'elles ne bloquent la ville.",
    status: "En exploration",
  },
  {
    id: "air",
    title: "Qualité de l'air",
    description:
      "Un réseau de mesures citoyennes pour rendre la pollution visible, quartier par quartier.",
    status: "En exploration",
  },
  {
    id: "participation",
    title: "Participation citoyenne",
    description:
      "Voter les priorités de son quartier et suivre, décision par décision, ce que la ville en fait.",
    status: "En exploration",
  },
];

export const TICKER = [
  "Embouteillages",
  "Gestion des déchets",
  "Inondations",
  "Services publics",
  "Pollution",
  "Coordination des infrastructures",
  "Mobilité douce",
  "Données ouvertes",
];

export const NAV_LINKS = [
  { label: "Vision", href: "#vision" },
  { label: "Applications", href: "#applications" },
  { label: "Défis", href: "#defis" },
  { label: "Méthode", href: "#methode" },
];

export const TECH_STACK = [
  { label: "Intelligence artificielle", short: "IA" },
  { label: "Objets connectés", short: "IoT" },
  { label: "Cloud", short: "Cloud" },
  { label: "Données ouvertes", short: "Open Data" },
];
