import type { Detection } from "./types";

/** Known YOLO labels → French. Unknown labels fall back to a readable form. */
const LABELS: Record<string, string> = {
  no_helmet: "Sans casque",
  without_helmet: "Sans casque",
  helmet: "Avec casque",
  with_helmet: "Avec casque",
  no_seatbelt: "Sans ceinture",
  triple_riding: "Trois personnes sur une moto",
  triple_ride: "Trois personnes sur une moto",
  mobile_usage: "Téléphone au volant",
  phone: "Téléphone au volant",
  wrong_way: "Contresens",
  red_light: "Feu rouge grillé",
  number_plate: "Plaque d'immatriculation",
  license_plate: "Plaque d'immatriculation",
  rider: "Conducteur",
  motorcycle: "Moto",
};

export function labelName(label: string): string {
  const key = label.trim().toLowerCase().replace(/[\s-]+/g, "_");
  if (LABELS[key]) {
    return LABELS[key];
  }
  const readable = label.replace(/[_-]+/g, " ").trim();
  return readable.charAt(0).toUpperCase() + readable.slice(1);
}

export function formatConfidence(confidence: number): string {
  return `${Math.round(confidence * 100)} %`;
}

/** Groups detections by label: [["no_helmet", 3], …], most frequent first. */
export function countByLabel(detections: Detection[]): [string, number][] {
  const counts = new Map<string, number>();
  for (const detection of detections) {
    counts.set(detection.label, (counts.get(detection.label) ?? 0) + 1);
  }
  return [...counts.entries()].sort((a, b) => b[1] - a[1]);
}

export function describeDetections(detections: Detection[]): string {
  if (detections.length === 0) {
    return "aucune infraction détectée";
  }
  const parts = countByLabel(detections).map(
    ([label, count]) => `${labelName(label).toLowerCase()} (${count})`,
  );
  const total = detections.length;
  return `${total} détection${total > 1 ? "s" : ""} : ${parts.join(", ")}`;
}

export function pluralize(count: number, singular: string, plural?: string) {
  return `${count} ${count > 1 ? (plural ?? `${singular}s`) : singular}`;
}

export function formatTimestamp(seconds: number): string {
  const total = Math.max(0, Math.floor(seconds));
  const minutes = Math.floor(total / 60);
  const rest = total % 60;
  return `${minutes}:${String(rest).padStart(2, "0")}`;
}

export function formatBytes(bytes: number): string {
  if (bytes < 1024 * 1024) {
    return `${Math.max(1, Math.round(bytes / 1024))} Ko`;
  }
  return `${(bytes / (1024 * 1024)).toFixed(1).replace(".", ",")} Mo`;
}

/** Backend messages are in English; translate the ones users can hit. */
const SERVER_MESSAGES: Record<string, string> = {
  "Invalid email or password.": "Email ou mot de passe incorrect.",
  "This username is already in use.": "Ce nom d'utilisateur est déjà pris.",
  "This email address is already in use.":
    "Un compte existe déjà avec cette adresse email.",
  "The username or email address is already in use.":
    "Ce nom d'utilisateur ou cette adresse email est déjà utilisé.",
  "The passwords do not match.": "Les mots de passe ne correspondent pas.",
  "This password is too common.": "Ce mot de passe est trop courant.",
  "This password is entirely numeric.":
    "Le mot de passe ne peut pas contenir uniquement des chiffres.",
  "This field may not be blank.": "Ce champ est obligatoire.",
  "This field is required.": "Ce champ est obligatoire.",
  "Enter a valid email address.": "Saisissez une adresse email valide.",
  "Only MP4, MOV, AVI and WebM/MKV videos are supported.":
    "Formats acceptés : MP4, MOV, AVI, WebM ou MKV.",
  "The video could not be decoded.": "Cette vidéo ne peut pas être lue.",
  "Video resolution exceeds the pixel limit.":
    "La résolution de la vidéo est trop élevée.",
  "Video is empty or exceeds the size limit.":
    "La vidéo est vide ou dépasse 50 Mo.",
  "Image is empty or exceeds the size limit.":
    "L'image est vide ou dépasse 5 Mo.",
};

export function translateServerMessage(message: string): string {
  const known = SERVER_MESSAGES[message];
  if (known) {
    return known;
  }
  if (message.startsWith("This password is too short")) {
    return "Le mot de passe doit contenir au moins 8 caractères.";
  }
  if (message.startsWith("The password is too similar")) {
    return "Le mot de passe ressemble trop à votre nom ou à votre email.";
  }
  if (message.startsWith("Enter a valid username")) {
    return "Lettres, chiffres et @ . + - _ uniquement.";
  }
  if (/throttled/i.test(message)) {
    return "Trop de tentatives. Patientez une minute avant de réessayer.";
  }
  if (/duration|too long/i.test(message)) {
    return "La vidéo dépasse la durée maximale de 2 minutes.";
  }
  return message;
}

export const DETECTION_ERRORS: Record<string, string> = {
  busy: "Le moteur d'analyse est occupé. Réessayez dans quelques secondes.",
  invalid_image:
    "Image illisible ou trop lourde. Utilisez un JPEG ou un PNG de 5 Mo maximum.",
  invalid_video:
    "Vidéo illisible, trop lourde ou trop longue (MP4, MOV, AVI ou WebM · 50 Mo et 2 min maximum).",
  processing_error:
    "L'analyse a échoué côté serveur. Réessayez ou essayez un autre fichier.",
};
