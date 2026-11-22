# MogAI · Moramora

Landing MogAI + plateforme **Moramora** (détection d'infractions routières par l'IA), branchée sur l'API Django `DEVFEST-MORAMORA-API`.

## Démarrer

```bash
cp .env.example .env.local   # NEXT_PUBLIC_API_URL=http://localhost:8000 par défaut
npm install
npm run dev                  # http://localhost:3000
```

L'API doit tourner sur `NEXT_PUBLIC_API_URL` (`python manage.py runserver` dans `moramora_api/`) et autoriser l'origine du front dans `CORS_ALLOWED_ORIGINS` et `WEBSOCKET_ALLOWED_ORIGINS` (localhost:3000 par défaut).

## Pages

| Route | Rôle | Backend |
|---|---|---|
| `/connexion`, `/inscription` | Authentification (JWT stocké localement, révoqué à la déconnexion) | `/api/auth/login/`, `/api/auth/signup/` |
| `/moramora` | Vue d'ensemble : journal des alertes temps réel, état du service | WebSocket `/ws/detection/`, `/api/health/` |
| `/moramora/photo` | Analyse d'une photo | `POST /api/detection/image/` |
| `/moramora/video` | Analyse d'une vidéo, frise des infractions, alertes en direct | `POST /api/detection/video/` + WebSocket |
| `/moramora/direct` | Caméra analysée en continu | WebSocket (trames JPEG binaires) |
| `/moramora/profil` | Profil et déconnexion | `/api/auth/profile/`, `/api/auth/logout/` |

Code : `src/features/moramora/` (`api/` client et types, `auth/` session, `realtime/` WebSocket, `components/` UI).

---

This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
