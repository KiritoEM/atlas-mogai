# MogAI

Front-end de **Moramora** : détection d'infractions routières à moto par l'IA (sans casque, plus de deux personnes, téléphone au guidon) sur photo, vidéo ou caméra en direct. Le dépôt contient aussi la landing **MogAI** qui présente les apps du projet (Moramora, Aiza, Gaspika).

> Next.js 16 · React 19 · Tailwind 4 · TypeScript — branché sur l'API Django [DEVFEST-MORAMORA-API](https://github.com/HairanRins/DEVFEST-MORAMORA-API) (YOLOv8).

## Démo en ligne

[Cliquez pour voir le site](https://mogai-atlas.vercel.app/)

## Fonctionnalités

### Application web

- [x] Landing page MogAI
- [x] Inscription et connexion avec authentification
- [x] Redirection automatique vers la plateforme Moramora après la connexion et l'inscription
- [x] Vue d'ensemble : journal des alertes en temps réel et état du service
- [x] Analyse d'une photo
- [x] Analyse d'une vidéo : scènes en infraction, frise chronologique, alertes en direct
- [x] Caméra analysée en continu (envoi de trames JPEG par WebSocket)
- [x] Profil utilisateur et déconnexion

### Backend

- [x] API REST Django
- [x] Authentification JWT (inscription, connexion, profil, déconnexion)
- [x] Détection d'infractions sur image et sur vidéo
- [x] WebSocket pour les alertes et l'analyse en temps réel
- [x] Configuration CORS et WebSocket des origines autorisées

## Stack technique

|              |                                                              |
| ------------ | ------------------------------------------------------------ |
| **Frontend** | Next.js, TypeScript, Tailwind CSS, TanStack Query, WebSocket |
| **Backend**  | Django, API REST, WebSocket                                  |
| **IA**       | YOLO (vision par ordinateur), PyTorch                        |
| **Infra**    | Docker et Render (backend), Vercel (frontend)                |

## Démarrage de l'application web

```bash
npm install
cp .env.example .env.local   # puis choisir l'API (voir ci-dessous)
npm run dev                  # http://localhost:3000
```

| Variable | Rôle |
|---|---|
| `NEXT_PUBLIC_API_URL` | URL de l'API, sans slash final. Production : `https://moramora-api.onrender.com`. En local : `http://localhost:8000`. Le WebSocket en est déduit (`http`→`ws`, `https`→`wss`). |

L'API doit autoriser l'origine du front (`CORS_ALLOWED_ORIGINS` et `WEBSOCKET_ALLOWED_ORIGINS`, `http://localhost:3000` par défaut).

## Scripts

| Commande | Effet |
|---|---|
| `npm run dev` | Serveur de développement |
| `npm run build` / `npm start` | Build et serveur de production |
| `npm run lint` | ESLint |
| `npm test` | Tests unitaires (Vitest) · `npm run test:watch` en continu |

## Pages

| Route | Rôle | Backend |
|---|---|---|
| `/` | Landing MogAI | — |
| `/connexion`, `/inscription` | Authentification (JWT stocké localement), puis redirection vers `/moramora` | `/api/auth/login/`, `/api/auth/signup/` |
| `/moramora` | Vue d'ensemble : journal des alertes en temps réel, état du service | WebSocket `/ws/detection/`, `/api/health/` |
| `/moramora/photo` | Analyse d'une photo | `POST /api/detection/image/` |
| `/moramora/video` | Analyse d'une vidéo : scènes en infraction, frise, alertes en direct | `POST /api/detection/video/` + WebSocket |
| `/moramora/direct` | Caméra analysée en continu | WebSocket (trames JPEG binaires) |
| `/moramora/profil` | Profil et déconnexion | `/api/auth/profile/`, `/api/auth/logout/` |

## Analyse vidéo : comment ça marche

1. Le front envoie la vidéo (50 Mo et 2 min max) avec une **précision** : Rapide 0,5 · Standard 1 · Précis 2 · Très précis 5 images/s.
2. L'API analyse les images échantillonnées (120 max), puis **ré-analyse à 2 images/s** les alentours de chaque infraction.
3. Les détections sont **filtrées et confirmées** : seuil par classe, une seule étiquette par objet, une infraction n'est retenue que si elle apparaît sur plusieurs images (ou une fois avec une confiance ≥ 0,6). Les détections isolées, typiques des hallucinations du modèle, sont écartées.
4. Les images successives d'une même scène sont regroupées en **incidents** : chacun donne le nombre de personnes (ou motos) en infraction et une image clé annotée.
5. Pendant l'analyse, les alertes arrivent en direct par WebSocket. Si la connexion HTTP est coupée avant la réponse, le résultat est récupéré via le message WebSocket `video_completed`.

## Organisation du code

```
src/
├── app/                    Routes (App Router)
├── components/
│   ├── ui/                 Composants d'interface partagés
│   └── moramora/           Analyseurs photo et vidéo
├── constants/              Configuration de l'API (URL, limites)
├── hooks/                  Requêtes et mutations TanStack Query
├── lib/                    Session, schémas de formulaires, utilitaires
├── types/                  Types de l'API
└── features/
    ├── landing/            Landing MogAI
    └── moramora/
        ├── api/            Client HTTP, messages FR, récupération vidéo (+ tests)
        ├── services/       Appels à l'API (auth, détection, santé, profil)
        ├── providers/      Contexte d'authentification
        ├── realtime/       WebSocket de détection (alertes, reconnexion)
        └── components/     Écrans (vue d'ensemble, direct, profil, formulaires…)
```

Les tests sont à côté du code (`*.test.ts`).

> **Note** : cette version de Next.js diffère de la documentation habituelle. Consultez `node_modules/next/dist/docs/` avant de modifier les conventions (voir `AGENTS.md`).
