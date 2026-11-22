"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { LogOut } from "lucide-react";
import { api, errorMessage, isAbortError } from "../api/client";
import type { Profile } from "../api/types";
import { useAuth, useExpireOn401 } from "../auth/auth-provider";
import { Button, Notice, PageHeader, Panel, Spinner } from "./ui";

const dateFormat = new Intl.DateTimeFormat("fr-FR", {
  dateStyle: "long",
  timeStyle: "short",
});

export function ProfileView() {
  const { token, user, logout } = useAuth();
  const expireOn401 = useExpireOn401();
  const router = useRouter();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [leaving, setLeaving] = useState(false);

  useEffect(() => {
    if (!token) {
      return;
    }
    const controller = new AbortController();
    api
      .profile(token, controller.signal)
      .then(({ data }) => setProfile(data))
      .catch((caught: unknown) => {
        if (isAbortError(caught)) {
          return;
        }
        expireOn401(caught);
        setError(errorMessage(caught));
      });
    return () => controller.abort();
  }, [token, expireOn401]);

  async function onLogout() {
    setLeaving(true);
    await logout();
    router.replace("/connexion");
  }

  const rows = [
    { label: "Nom d'utilisateur", value: profile?.username ?? user?.username },
    { label: "Adresse email", value: profile?.email ?? user?.email },
    {
      label: "Membre depuis",
      value: profile ? dateFormat.format(new Date(profile.date_joined)) : undefined,
    },
    {
      label: "Dernière connexion",
      value: profile
        ? profile.last_login
          ? dateFormat.format(new Date(profile.last_login))
          : "—"
        : undefined,
    },
  ];

  return (
    <div className="max-w-[40rem] space-y-8">
      <PageHeader eyebrow="Compte" title="Mon profil" />

      {error ? (
        <Notice tone="error" live>
          {error}
        </Notice>
      ) : null}

      <Panel aria-labelledby="profile-title" className="p-5 sm:p-6">
        <h2 id="profile-title" className="sr-only">
          Informations du compte
        </h2>
        <dl className="divide-y divide-line">
          {rows.map((row) => (
            <div
              key={row.label}
              className="flex flex-col gap-1 py-3.5 first:pt-0 last:pb-0 sm:flex-row sm:items-baseline sm:justify-between sm:gap-6"
            >
              <dt className="text-[13px] text-fg-3">{row.label}</dt>
              <dd className="text-[15px] break-all text-fg sm:text-right">
                {row.value ?? (
                  <span className="inline-flex items-center gap-2 text-fg-3">
                    <Spinner className="size-3" />
                    <span className="sr-only">Chargement</span>
                  </span>
                )}
              </dd>
            </div>
          ))}
        </dl>
      </Panel>

      <Panel aria-labelledby="session-title" className="p-5 sm:p-6">
        <h2 id="session-title" className="text-[15px] font-medium text-fg">
          Session
        </h2>
        <p className="mt-1.5 text-sm leading-[1.6] text-fg-2">
          La déconnexion révoque immédiatement votre jeton d&apos;accès sur le serveur.
        </p>
        <Button variant="danger" onClick={onLogout} disabled={leaving} className="mt-5">
          {leaving ? <Spinner /> : <LogOut aria-hidden="true" />}
          Se déconnecter
        </Button>
      </Panel>
    </div>
  );
}
