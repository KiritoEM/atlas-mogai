import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email("Saisissez une adresse email valide."),
  password: z.string().min(1, "Saisissez votre mot de passe."),
});

export const signupSchema = z
  .object({
    username: z
      .string()
      .trim()
      .min(1, "Saisissez un nom d'utilisateur.")
      .max(150, "Le nom d'utilisateur est trop long.")
      .regex(
        /^[\w.@+-]+$/,
        "Utilisez lettres, chiffres et @ . + - _ uniquement.",
      ),
    email: z.string().trim().email("Saisissez une adresse email valide."),
    password: z
      .string()
      .min(8, "Le mot de passe doit contenir au moins 8 caractères.")
      .regex(
        /\D/,
        "Le mot de passe ne peut pas contenir uniquement des chiffres.",
      ),
    password_confirmation: z.string().min(1, "Confirmez votre mot de passe."),
  })
  .refine((values) => values.password === values.password_confirmation, {
    path: ["password_confirmation"],
    message: "Les mots de passe ne correspondent pas.",
  });

export type LoginValues = z.infer<typeof loginSchema>;
export type SignupValues = z.infer<typeof signupSchema>;
