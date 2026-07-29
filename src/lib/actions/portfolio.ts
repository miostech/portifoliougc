"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import { Portfolio } from "@/models/Portfolio";
import { Media } from "@/models/Media";
import { User } from "@/models/User";
import { isPaid } from "@/lib/plans";
import { toPortfolioView, type PortfolioView } from "@/lib/portfolio-view";
import { aiCopySchema, type AiCopyData } from "@/lib/onboarding-schema";

async function requireUserId(): Promise<string> {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Não autenticado");
  return session.user.id;
}

export async function getMyPortfolioView(): Promise<PortfolioView | null> {
  const userId = await requireUserId();
  await connectDB();
  const p = await Portfolio.findOne({ userId }).lean<Record<string, unknown>>();
  if (!p) return null;
  const media = await Media.find({ portfolioId: p._id })
    .sort({ featured: -1, order: 1, createdAt: -1 })
    .lean<Record<string, unknown>[]>();
  return toPortfolioView(p, media);
}

type Result = { ok: boolean; error?: string };

export async function updatePortfolioTexts(raw: AiCopyData): Promise<Result> {
  const userId = await requireUserId();
  const parsed = aiCopySchema.safeParse(raw);
  if (!parsed.success) return { ok: false, error: "Textos inválidos." };
  try {
    await connectDB();
    await Portfolio.findOneAndUpdate(
      { userId },
      {
        "ai.headline": parsed.data.headline,
        "ai.professionalBio": parsed.data.professionalBio,
        "ai.aboutMe": parsed.data.aboutMe,
        "ai.specialties": parsed.data.specialties,
        "ai.brandDescription": parsed.data.brandDescription,
        "ai.ctaPrimary": parsed.data.ctaPrimary,
        "ai.ctaContact": parsed.data.ctaContact,
      }
    );
    revalidatePath("/app/portfolio/editor");
    return { ok: true };
  } catch (e) {
    console.error("updatePortfolioTexts", e);
    return { ok: false, error: "Não foi possível guardar." };
  }
}

export async function updatePortfolioTheme(theme: {
  accent?: string | null;
  font?: string | null;
  templateSlug?: string;
}): Promise<Result> {
  const userId = await requireUserId();
  try {
    await connectDB();
    const update: Record<string, unknown> = {};
    if (theme.accent !== undefined) update["theme.accent"] = theme.accent;
    if (theme.font !== undefined) update["theme.font"] = theme.font;
    if (theme.templateSlug) update["templateSlug"] = theme.templateSlug;
    await Portfolio.findOneAndUpdate({ userId }, update);
    revalidatePath("/app/portfolio/editor");
    return { ok: true };
  } catch (e) {
    console.error("updatePortfolioTheme", e);
    return { ok: false, error: "Não foi possível guardar." };
  }
}

export async function updateSections(
  sections: { key: string; enabled: boolean; order: number }[]
): Promise<Result> {
  const userId = await requireUserId();
  try {
    await connectDB();
    await Portfolio.findOneAndUpdate({ userId }, { sections });
    revalidatePath("/app/portfolio/editor");
    return { ok: true };
  } catch (e) {
    console.error("updateSections", e);
    return { ok: false, error: "Não foi possível guardar." };
  }
}

export async function publishPortfolio(): Promise<
  Result & { url?: string }
> {
  const userId = await requireUserId();
  try {
    await connectDB();
    const user = await User.findById(userId).select("plan").lean<{
      plan?: string;
    }>();
    if (!user || !isPaid((user.plan ?? "none") as never)) {
      return {
        ok: false,
        error: "Ative um plano para publicar o seu portfólio.",
      };
    }
    const p = await Portfolio.findOneAndUpdate(
      { userId },
      { published: true },
      { new: true }
    ).lean<{ slug?: string }>();
    if (!p) return { ok: false, error: "Portfólio não encontrado." };
    revalidatePath("/app/portfolio");
    revalidatePath(`/p/${p.slug}`);
    return { ok: true, url: `/p/${p.slug}` };
  } catch (e) {
    console.error("publishPortfolio", e);
    return { ok: false, error: "Não foi possível publicar." };
  }
}

export async function unpublishPortfolio(): Promise<Result> {
  const userId = await requireUserId();
  try {
    await connectDB();
    const p = await Portfolio.findOneAndUpdate(
      { userId },
      { published: false },
      { new: true }
    ).lean<{ slug?: string }>();
    revalidatePath("/app/portfolio");
    if (p?.slug) revalidatePath(`/p/${p.slug}`);
    return { ok: true };
  } catch (e) {
    console.error("unpublishPortfolio", e);
    return { ok: false, error: "Não foi possível despublicar." };
  }
}
