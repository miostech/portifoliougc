import { z } from "zod";

export const socialSchema = z.object({
  platform: z.string(),
  url: z.string(),
});

export const onboardingSchema = z.object({
  fullName: z.string().trim().min(2, "Informe o seu nome profissional"),
  username: z
    .string()
    .trim()
    .min(3, "Escolha um nome de utilizador")
    .regex(/^[a-z0-9-]+$/i, "Use apenas letras, números e hífen"),
  photo: z.string().nullable().optional(),
  city: z.string().trim().optional().default(""),
  country: z.string().trim().optional().default(""),
  languages: z.array(z.string()).default([]),
  ageRange: z.string().optional().default(""),
  pronouns: z.string().optional().default(""),

  niches: z.array(z.string()).default([]),
  experience: z.string().optional().default(""),
  contentTypes: z.array(z.string()).default([]),
  brandSegments: z.array(z.string()).default([]),
  communicationStyle: z.string().optional().default(""),
  travelAvailability: z.boolean().default(false),
  productAvailability: z.boolean().default(false),

  socials: z.array(socialSchema).default([]),
  equipment: z.array(z.string()).default([]),

  templateSlug: z.string().default("minimal"),
});

export type OnboardingData = z.infer<typeof onboardingSchema>;

export const aiCopySchema = z.object({
  headline: z.string().default(""),
  professionalBio: z.string().default(""),
  aboutMe: z.string().default(""),
  specialties: z.array(z.string()).default([]),
  brandDescription: z.string().default(""),
  ctaPrimary: z.string().default(""),
  ctaContact: z.string().default(""),
});

export type AiCopyData = z.infer<typeof aiCopySchema>;

export const EMPTY_ONBOARDING: OnboardingData = {
  fullName: "",
  username: "",
  photo: null,
  city: "",
  country: "",
  languages: [],
  ageRange: "",
  pronouns: "",
  niches: [],
  experience: "",
  contentTypes: [],
  brandSegments: [],
  communicationStyle: "",
  travelAvailability: false,
  productAvailability: false,
  socials: [],
  equipment: [],
  templateSlug: "minimal",
};
