"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState, type FormEvent, type ReactNode } from "react";
import { ArrowRight } from "lucide-react";
import { ApiError, errorMessage, type FieldErrors } from "../api/client";
import { useAuth } from "../auth/auth-provider";
import { TextField } from "./text-field";
import { Button, Notice, Spinner, focusRing } from "./ui";

const HOME = "/moramora";

/** Where to go after authenticating: `?suivant=` when it targets the platform. */
function nextPath(): string {
  const next = new URLSearchParams(window.location.search).get("suivant");
  return next && next.startsWith(HOME) && !next.startsWith("//") ? next : HOME;
}

function useRedirectWhenAuthenticated() {
  const { status } = useAuth();
  const router = useRouter();
  useEffect(() => {
    if (status === "authenticated") {
      router.replace(nextPath());
    }
  }, [status, router]);
}

function AuthCard({
  title,
  description,
  children,
  footer,
}: {
  title: string;
  description: string;
  children: ReactNode;
  footer: ReactNode;
}) {
  return (
    <div className="w-full max-w-[26rem]">
      <h1 className="text-[1.75rem] leading-[1.15] font-medium tracking-[-0.015em] text-fg">
        {title}
      </h1>
      <p className="mt-2 text-[15px] leading-[1.6] text-fg-2">{description}</p>
      <div className="mt-8">{children}</div>
      <p className="mt-8 border-t border-line pt-6 text-sm text-fg-2">{footer}</p>
    </div>
  );
}

const linkClass = `font-medium text-fg underline decoration-ember/60 underline-offset-4 transition-colors hover:decoration-ember rounded-[4px] ${focusRing}`;

export function LoginForm() {
  const { login } = useAuth();
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const errorRef = useRef<HTMLDivElement>(null);
  useRedirectWhenAuthenticated();

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    setPending(true);
    setError(null);
    setFieldErrors({});
    try {
      await login(String(form.get("email")), String(form.get("password")));
    } catch (caught) {
      setError(errorMessage(caught));
      if (caught instanceof ApiError) {
        setFieldErrors(caught.fieldErrors);
      }
      setPending(false);
      requestAnimationFrame(() => errorRef.current?.focus());
    }
  }

  return (
    <AuthCard
      title="Se connecter"
      description="Accédez à l'analyse des infractions routières et à vos alertes en temps réel."
      footer={
        <>
          Pas encore de compte ?{" "}
          <Link href="/inscription" className={linkClass}>
            Créer un compte
          </Link>
        </>
      }
    >
      <form onSubmit={onSubmit} className="space-y-5">
        {error ? (
          <div ref={errorRef} tabIndex={-1} className="outline-none">
            <Notice tone="error" live>
              {error}
            </Notice>
          </div>
        ) : null}
        <TextField
          label="Adresse email"
          name="email"
          type="email"
          autoComplete="email"
          inputMode="email"
          required
          errors={fieldErrors.email}
        />
        <TextField
          label="Mot de passe"
          name="password"
          type="password"
          autoComplete="current-password"
          required
          errors={fieldErrors.password}
        />
        <Button type="submit" disabled={pending} className="w-full">
          {pending ? (
            <>
              <Spinner />
              Connexion…
            </>
          ) : (
            <>
              Se connecter
              <ArrowRight aria-hidden="true" />
            </>
          )}
        </Button>
      </form>
    </AuthCard>
  );
}

export function SignupForm() {
  const { signup } = useAuth();
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const errorRef = useRef<HTMLDivElement>(null);
  useRedirectWhenAuthenticated();

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const input = {
      username: String(form.get("username")).trim(),
      email: String(form.get("email")).trim(),
      password: String(form.get("password")),
      password_confirmation: String(form.get("password_confirmation")),
    };
    setError(null);
    setFieldErrors({});
    if (input.password !== input.password_confirmation) {
      setFieldErrors({
        password_confirmation: ["Les mots de passe ne correspondent pas."],
      });
      return;
    }
    setPending(true);
    try {
      await signup(input);
    } catch (caught) {
      setError(errorMessage(caught));
      if (caught instanceof ApiError) {
        setFieldErrors(caught.fieldErrors);
      }
      setPending(false);
      requestAnimationFrame(() => errorRef.current?.focus());
    }
  }

  return (
    <AuthCard
      title="Créer un compte"
      description="Quelques secondes suffisent pour commencer à analyser photos, vidéos et flux caméra."
      footer={
        <>
          Déjà inscrit ?{" "}
          <Link href="/connexion" className={linkClass}>
            Se connecter
          </Link>
        </>
      }
    >
      <form onSubmit={onSubmit} className="space-y-5">
        {error ? (
          <div ref={errorRef} tabIndex={-1} className="outline-none">
            <Notice tone="error" live>
              {error}
            </Notice>
          </div>
        ) : null}
        <TextField
          label="Nom d'utilisateur"
          name="username"
          autoComplete="username"
          autoCapitalize="none"
          spellCheck={false}
          required
          maxLength={150}
          pattern="[\w.@+\-]+"
          hint="Lettres, chiffres et @ . + - _ uniquement."
          errors={fieldErrors.username}
        />
        <TextField
          label="Adresse email"
          name="email"
          type="email"
          autoComplete="email"
          inputMode="email"
          required
          errors={fieldErrors.email}
        />
        <TextField
          label="Mot de passe"
          name="password"
          type="password"
          autoComplete="new-password"
          required
          minLength={8}
          hint="8 caractères minimum, pas uniquement des chiffres."
          errors={fieldErrors.password}
        />
        <TextField
          label="Confirmer le mot de passe"
          name="password_confirmation"
          type="password"
          autoComplete="new-password"
          required
          minLength={8}
          errors={fieldErrors.password_confirmation}
        />
        <Button type="submit" disabled={pending} className="w-full">
          {pending ? (
            <>
              <Spinner />
              Création du compte…
            </>
          ) : (
            <>
              Créer mon compte
              <ArrowRight aria-hidden="true" />
            </>
          )}
        </Button>
      </form>
    </AuthCard>
  );
}
