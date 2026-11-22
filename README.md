# MogAI

## Démo en ligne
[Cliquez pour voir le site](https://mogai-atlas.vercel.app/)

## Fonctionnalités

### Application web

- [x] Landing page MogAI
- [x] Inscription et connexion avec authentification
- [x] Redirection automatique vers la plateforme Moramora après la connexion et l'inscription
- [x] Vue d'ensemble : journal des alertes en temps réel et état du service
- [x] Analyse d'une photo
- [x] Analyse d'une vidéo avec frise chronologique des infractions
- [x] Alertes en direct pendant l'analyse d'une vidéo
- [x] Caméra analysée en continu (envoi de trames JPEG par WebSocket)
- [x] Profil utilisateur et déconnexion

### Backend

- [x] API REST Django
- [x] Authentification JWT (inscription, connexion, profil, déconnexion)
- [x] Détection d'infractions sur image et sur vidéo
- [x] WebSocket pour les alertes et l'analyse en temps réel
- [x] Configuration CORS et WebSocket des origines autorisées

## Pages

| Route | Rôle | Backend |
|---|---|---|
| `/connexion`, `/inscription` | Authentification, puis redirection vers `/moramora` | `/api/auth/login/`, `/api/auth/signup/` |
| `/moramora` | Vue d'ensemble, alertes en temps réel, état du service | WebSocket `/ws/detection/`, `/api/health/` |
| `/moramora/photo` | Analyse d'une photo | `POST /api/detection/image/` |  
| `/moramora/video` | Analyse d'une vidéo, frise des infractions, alertes en direct | `POST /api/detection/video/` + WebSocket |
| `/moramora/direct` | Caméra analysée en continu | WebSocket (trames JPEG binaires) |
| `/moramora/profil` | Profil et déconnexion | `/api/auth/profile/`, `/api/auth/logout/` |

## Stack technique

|              |                                                              |
| ------------ | ------------------------------------------------------------ |
| **Frontend** | Next.js, TypeScript, Tailwind CSS, WebSocket                 |
| **Backend**  | Django, API REST, WebSocket                                  |
| **IA**       | YOLO (vision par ordinateur), PyTorch                        |
| **Infra**    | Docker et Render (backend), Vercel (frontend)                |

## Démarrage de l'application web

```bash
cp .env.example .env.local   # NEXT_PUBLIC_API_URL=http://localhost:8000 par défaut
npm install
npm run dev                  # http://localhost:3000
```

L'API doit tourner sur `NEXT_PUBLIC_API_URL` (`python manage.py runserver` dans `moramora_api/`) et autoriser l'origine du front dans `CORS_ALLOWED_ORIGINS` et `WEBSOCKET_ALLOWED_ORIGINS` (`localhost:3000` par défaut, plus l'adresse du site déployé en production).
