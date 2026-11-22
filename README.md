# MogAI · Moramora

Front-end de **Moramora** : détection d'infractions routières à moto par l'IA (sans casque, plus de deux personnes, téléphone au guidon) sur photo, vidéo ou caméra en direct. Le dépôt contient aussi la landing **MogAI** qui présente les apps du projet (Moramora, Aiza, Gaspika).

> Next.js 16 · React 19 · Tailwind 4 · TypeScript — branché sur l'API Django [DEVFEST-MORAMORA-API](https://github.com/HairanRins/DEVFEST-MORAMORA-API) (YOLOv8).

## Démarrage rapide

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
| `/connexion`, `/inscription` | Authentification (JWT stocké localement, révoqué à la déconnexion) | `/api/auth/*` |
| `/moramora` | Vue d'ensemble : journal des alertes en temps réel, état du service | WebSocket, `/api/health/` |
| `/moramora/photo` | Analyse d'une photo | `POST /api/detection/image/` |
| `/moramora/video` | Analyse d'une vidéo : scènes en infraction, frise, alertes en direct | `POST /api/detection/video/` + WebSocket |
| `/moramora/direct` | Caméra analysée en continu | WebSocket (images JPEG) |
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
├── app/                      Routes (App Router)
└── features/
    ├── landing/              Landing MogAI
    └── moramora/
        ├── api/              Client HTTP, types, messages FR, récupération vidéo (+ tests)
        ├── auth/             Session et contexte d'authentification
        ├── realtime/         WebSocket de détection (alertes, reconnexion)
        └── components/       Écrans et UI (photo, vidéo, direct, profil…)
```

Les tests sont à côté du code (`*.test.ts`).

> **Note** : cette version de Next.js diffère de la documentation habituelle. Consultez `node_modules/next/dist/docs/` avant de modifier les conventions (voir `AGENTS.md`).
