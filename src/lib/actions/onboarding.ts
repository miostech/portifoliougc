"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import { Portfolio } from "@/models/Portfolio";
import { User } from "@/models/User";
import { slugify } from "@/lib/slug";
import { getAIProvider } from "@/lib/services/ai";
import {
  onboardingSchema,
  aiCopySchema,
  EMPTY_ONBOARDING,
  type OnboardingData,
  type AiCopyData,
} from "@/lib/onboarding-schema";

async function requireUserId(): Promise<string> {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Não autenticado");
  return session.user.id;
}

/** Ensure the slug is unique, ignoring the current user's own portfolio. */
async function uniqueSlug(base: string, userId: string): Promise<string> {
  const root = slugify(base) || "criador";
  for (let n = 1; n < 1000; n++) {
    const candidate = n === 1 ? root : `${root}-${n}`;
    const clash = await Portfolio.findOne({
      slug: candidate,
      userId: { $ne: userId },
    })
      .select("_id")
      .lean();
    if (!clash) return candidate;
  }
  return `${root}-${Date.now()}`;
}

export async function loadOnboardingDraft(): Promise<{
  data: OnboardingData;
  ai: AiCopyData | null;
}> {
  const userId = await requireUserId();
  await connectDB();
  const p = await Portfolio.findOne({ userId }).lean<Record<string, unknown>>();
  if (!p) return { data: EMPTY_ONBOARDING, ai: null };

  const profile = (p.profile ?? {}) as Record<string, unknown>;
  const ai = (p.ai ?? {}) as Record<string, unknown>;

  const data: OnboardingData = {
    ...EMPTY_ONBOARDING,
    fullName: (profile.fullName as string) ?? "",
    username: (profile.username as string) ?? (p.slug as string) ?? "",
    photo: (profile.photo as string) ?? null,
    city: (profile.city as string) ?? "",
    country: (profile.country as string) ?? "",
    languages: (profile.languages as string[]) ?? [],
    ageRange: (profile.ageRange as string) ?? "",
    pronouns: (profile.pronouns as string) ?? "",
    niches: (profile.niches as string[]) ?? [],
    experience: (profile.experience as string) ?? "",
    contentTypes: (profile.contentTypes as string[]) ?? [],
    brandSegments: (profile.brandSegments as string[]) ?? [],
    communicationStyle: (profile.communicationStyle as string) ?? "",
    travelAvailability: Boolean(profile.travelAvailability),
    productAvailability: Boolean(profile.productAvailability),
    socials: (profile.socials as { platform: string; url: string }[]) ?? [],
    equipment: (profile.equipment as string[]) ?? [],
    templateSlug: (p.templateSlug as string) ?? "minimal",
  };

  const hasAi = Boolean(ai.headline || ai.professionalBio);
  return {
    data,
    ai: hasAi
      ? {
          headline: (ai.headline as string) ?? "",
          professionalBio: (ai.professionalBio as string) ?? "",
          aboutMe: (ai.aboutMe as string) ?? "",
          specialties: (ai.specialties as string[]) ?? [],
          brandDescription: (ai.brandDescription as string) ?? "",
          ctaPrimary: (ai.ctaPrimary as string) ?? "",
          ctaContact: (ai.ctaContact as string) ?? "",
        }
      : null,
  };
}

export type SaveResult = {
  ok: boolean;
  slug?: string;
  error?: string;
  fieldErrors?: Record<string, string>;
};

export async function saveOnboardingDraft(
  raw: OnboardingData
): Promise<SaveResult> {
  const userId = await requireUserId();
  const parsed = onboardingSchema.safeParse(raw);
  if (!parsed.success) {
    const fieldErrors: Record<string, string> = {};
    for (const issue of parsed.error.issues) {
      const key = String(issue.path[0]);
      if (!fieldErrors[key]) fieldErrors[key] = issue.message;
    }
    return { ok: false, fieldErrors };
  }

  const data = parsed.data;
  try {
    await connectDB();
    const slug = await uniqueSlug(data.username, userId);

    await Portfolio.findOneAndUpdate(
      { userId },
      {
        userId,
        slug,
        templateSlug: data.templateSlug,
        "profile.fullName": data.fullName,
        "profile.username": slug,
        "profile.photo": data.photo ?? null,
        "profile.city": data.city,
        "profile.country": data.country,
        "profile.languages": data.languages,
        "profile.ageRange": data.ageRange,
        "profile.pronouns": data.pronouns,
        "profile.niches": data.niches,
        "profile.experience": data.experience,
        "profile.contentTypes": data.contentTypes,
        "profile.brandSegments": data.brandSegments,
        "profile.communicationStyle": data.communicationStyle,
        "profile.travelAvailability": data.travelAvailability,
        "profile.productAvailability": data.productAvailability,
        "profile.socials": data.socials.filter((s) => s.url.trim()),
        "profile.equipment": data.equipment,
      },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    return { ok: true, slug };
  } catch (err) {
    console.error("saveOnboardingDraft error:", err);
    return { ok: false, error: "Não foi possível guardar. Tente novamente." };
  }
}

export async function generateCopy(): Promise<{
  ok: boolean;
  copy?: AiCopyData;
  error?: string;
}> {
  const userId = await requireUserId();
  try {
    await connectDB();
    const p = await Portfolio.findOne({ userId });
    if (!p) return { ok: false, error: "Complete os passos anteriores primeiro." };

    const profile = p.profile ?? {};
    const ai = getAIProvider();
    const copy = await ai.generatePortfolioCopy({
      fullName: profile.fullName || "Criadora",
      niches: profile.niches ?? [],
      city: profile.city,
      country: profile.country,
      languages: profile.languages ?? [],
      contentTypes: profile.contentTypes ?? [],
      communicationStyle: profile.communicationStyle,
      experience: profile.experience,
      equipment: profile.equipment ?? [],
      rawBio: profile.bio,
    });

    p.ai = { ...copy, generatedAt: new Date() };
    await p.save();

    return { ok: true, copy };
  } catch (err) {
    console.error("generateCopy error:", err);
    return { ok: false, error: "Falha ao gerar os textos. Tente novamente." };
  }
}

export async function finishOnboarding(
  rawCopy: AiCopyData
): Promise<{ ok: boolean; error?: string }> {
  const userId = await requireUserId();
  const parsed = aiCopySchema.safeParse(rawCopy);
  if (!parsed.success) return { ok: false, error: "Textos inválidos." };

  try {
    await connectDB();
    const p = await Portfolio.findOne({ userId });
    if (!p) return { ok: false, error: "Portfólio não encontrado." };

    // parsed.data already contains every copy field, so assign it directly
    // instead of spreading the Mongoose subdocument.
    p.ai = { ...parsed.data, generatedAt: new Date() };
    await p.save();

    await User.findByIdAndUpdate(userId, { onboarded: true });

    revalidatePath("/app");
    return { ok: true };
  } catch (err) {
    console.error("finishOnboarding error:", err);
    return { ok: false, error: "Não foi possível concluir. Tente novamente." };
  }
}
