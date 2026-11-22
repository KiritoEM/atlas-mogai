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
    tagline:
      "La caméra détecte les dangers et prévient automatiquement les usagers proches",
    description:
      "Filmez simplement votre trajet : Moramora reconnaît les dangers, les géolocalise et diffuse une alerte aux personnes à proximité, sans formulaire ni signalement manuel.",
    meaning:
      "« Doucement » en malgache, pour une ville qui avance sans s'arrêter",
    features: [
      "Détection automatique des dangers par la caméra",
      "Géolocalisation instantanée de l'alerte",
      "Aucun formulaire ni saisie manuelle",
      "Diffusion ciblée aux usagers à proximité",
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
    category: "Anti-gaspillage alimentaire",
    tagline: "Planifiez vos courses et sauvez les invendus près de chez vous",
    description:
      "Préparez vos repas de la semaine, générez votre liste de courses et complétez-la avec les invendus disponibles autour de vous. Gaspika aide chaque foyer à acheter juste et moins jeter.",
    meaning:
      "Du gaspillage à l'assiette, avec les commerces et les habitants comme premiers acteurs",
    features: [
      "Planning hebdomadaire des repas",
      "Liste de courses générée et partagée",
      "Paniers d'invendus adaptés à la liste",
      "Suivi des repas et kilos de nourriture sauvés",
    ],
    tech: ["Géolocalisation", "Prévision IA", "Paiement mobile"],
  },
];

export const APP_BY_ID = Object.fromEntries(
  APPS.map((app) => [app.id, app]),
) as Record<AppId, AppContent>;

export type ChallengeId =
  | "trafic"
  | "gaspillage"
  | "dangers"
  | "services";

export type Challenge = {
  id: ChallengeId;
  title: string;
  description: string;
  apps: AppId[];
};

export const CHALLENGES: Challenge[] = [
  {
    id: "trafic",
    title: "Trajets imprévisibles",
    description:
      "Choisir un itinéraire adapté aux conditions de circulation et aux informations partagées en temps réel.",
    apps: ["aiza", "moramora"],
  },
  {
    id: "gaspillage",
    title: "Courses et gaspillage alimentaire",
    description:
      "Planifier les repas, préparer sa liste et intégrer les invendus proches pour acheter juste et moins jeter.",
    apps: ["gaspika"],
  },
  {
    id: "dangers",
    title: "Dangers sur la route",
    description:
      "La caméra détecte automatiquement un danger et prévient les usagers proches, sans saisie manuelle.",
    apps: ["moramora"],
  },
  {
    id: "services",
    title: "Accès aux services publics",
    description:
      "Un seul réflexe pour trouver un centre de santé, une administration ou le marché le plus proche.",
    apps: ["aiza"],
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
  "Trajets imprévisibles",
  "Invendus alimentaires",
  "Dangers sur la route",
  "Services publics",
  "Mobilité multimodale",
];

export const NAV_LINKS = [
  { label: "Vision", href: "#vision" },
  { label: "Applications", href: "#applications" },
  { label: "Défis", href: "#defis" },
];

export const TECH_STACK = [
  { label: "Intelligence artificielle", short: "IA" },
  { label: "Objets connectés", short: "IoT" },
  { label: "Cloud", short: "Cloud" },
  { label: "Données ouvertes", short: "Open Data" },
];
