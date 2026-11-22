"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { ArrowRight } from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Form, FormField } from "@/components/ui/form";
import { Button, Notice, Spinner } from "@/components/ui";
import { loginSchema, type LoginValues } from "@/lib/form-schemas/auth-schemas";
import { useRedirectAuthenticated } from "@/hooks/use-redirect-authenticated";
import { ApiError, errorMessage } from "../api/client";
import { useAuth } from "../providers/auth-provider";
import { AuthCard, authLinkClass } from "./auth-card";
import { TextField } from "@/components/ui/text-field";

export function LoginForm() {
  const { login } = useAuth();
  const [error, setError] = useState<string | null>(null);
  const errorRef = useRef<HTMLDivElement>(null);
  const form = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });
  useRedirectAuthenticated();

  async function onSubmit(values: LoginValues) {
    setError(null);
    try {
      await login(values.email, values.password);
    } catch (caught) {
      setError(errorMessage(caught));
      if (caught instanceof ApiError) {
        for (const field of ["email", "password"] as const) {
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
      title="Se connecter"
      description="Accédez à l'analyse des infractions routières et à vos alertes en temps réel."
      footer={
        <>
          Pas encore de compte ?{" "}
          <Link href="/inscription" className={authLinkClass}>
            Créer un compte
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
                placeholder="Votre mot de passe"
                autoComplete="current-password"
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
      </Form>
    </AuthCard>
  );
}
