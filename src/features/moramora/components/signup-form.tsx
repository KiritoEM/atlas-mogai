"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { ArrowRight } from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Form, FormField } from "@/components/ui/form";
import { Button, Notice, Spinner } from "@/components/ui";
import { signupSchema, type SignupValues } from "@/lib/form-schemas/auth-schemas";
import { useRedirectAuthenticated } from "@/hooks/use-redirect-authenticated";
import { ApiError, errorMessage } from "../api/client";
import { useAuth } from "../providers/auth-provider";
import { AuthCard, authLinkClass } from "./auth-card";
import { TextField } from "@/components/ui/text-field";

export function SignupForm() {
  const { signup } = useAuth();
  const [error, setError] = useState<string | null>(null);
  const errorRef = useRef<HTMLDivElement>(null);
  const form = useForm<SignupValues>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
      password_confirmation: "",
    },
  });
  useRedirectAuthenticated();

  async function onSubmit(values: SignupValues) {
    setError(null);
    try {
      await signup(values);
    } catch (caught) {
      setError(errorMessage(caught));
      if (caught instanceof ApiError) {
        for (const field of [
          "username",
          "email",
          "password",
          "password_confirmation",
        ] as const) {
          const message = caught.fieldErrors[field]?.[0];
          if (message) form.setError(field, { type: "server", message });
        }
      }
    }
  }

  useEffect(() => {
    if (error) errorRef.current?.focus();
  }, [error]);

  return (
    <AuthCard
      title="Créer un compte"
      description="Quelques secondes suffisent pour commencer à analyser photos, vidéos et flux caméra."
      footer={
        <>
          Déjà inscrit ?{" "}
          <Link href="/connexion" className={authLinkClass}>
            Se connecter
          </Link>
        </>
      }
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
          {error ? (
            <div ref={errorRef} tabIndex={-1} className="outline-none">
              <Notice tone="error" live>
                {error}
              </Notice>
            </div>
          ) : null}
          <FormField
            control={form.control}
            name="username"
            render={({ field, fieldState }) => (
              <TextField
                {...field}
                label="Nom d'utilisateur"
                placeholder="ex. rakoto"
                autoComplete="username"
                autoCapitalize="none"
                spellCheck={false}
                maxLength={150}
                hint="Lettres, chiffres et @ . + - _ uniquement."
                errors={fieldState.error?.message ? [fieldState.error.message] : []}
              />
            )}
          />
          <FormField
            control={form.control}
            name="email"
            render={({ field, fieldState }) => (
              <TextField
                {...field}
                label="Adresse email"
                type="email"
                placeholder="vous@exemple.mg"
                autoComplete="email"
                inputMode="email"
                errors={fieldState.error?.message ? [fieldState.error.message] : []}
              />
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field, fieldState }) => (
              <TextField
                {...field}
                label="Mot de passe"
                type="password"
                placeholder="8 caractères minimum"
                autoComplete="new-password"
                hint="8 caractères minimum, pas uniquement des chiffres."
                errors={fieldState.error?.message ? [fieldState.error.message] : []}
              />
            )}
          />
          <FormField
            control={form.control}
            name="password_confirmation"
            render={({ field, fieldState }) => (
              <TextField
                {...field}
                label="Confirmer le mot de passe"
                type="password"
                placeholder="Retapez votre mot de passe"
                autoComplete="new-password"
                errors={fieldState.error?.message ? [fieldState.error.message] : []}
              />
            )}
          />
          <Button
            type="submit"
            disabled={form.formState.isSubmitting}
            className="w-full"
          >
            {form.formState.isSubmitting ? (
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
      </Form>
    </AuthCard>
  );
}
