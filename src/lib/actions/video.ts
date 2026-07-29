"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { auth } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import { Favourite } from "@/models/Favourite";
import { RecordingPlanItem, PLAN_STATUSES, type PlanStatus } from "@/models/RecordingPlanItem";
import { GeneratedScript } from "@/models/GeneratedScript";
import { getAIProvider, type GeneratedScriptResult } from "@/lib/services/ai";

async function requireUserId(): Promise<string> {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Não autenticado");
  return session.user.id;
}

/* ---------------- Favourites ---------------- */

export async function getFavouriteIds(): Promise<string[]> {
  const userId = await requireUserId();
  await connectDB();
  const favs = await Favourite.find({ userId }).select("modelId").lean<{ modelId: string }[]>();
  return favs.map((f) => f.modelId);
}

export async function toggleFavourite(
  modelId: string
): Promise<{ ok: boolean; favourited?: boolean; error?: string }> {
  const userId = await requireUserId();
  try {
    await connectDB();
    const existing = await Favourite.findOne({ userId, modelId });
    if (existing) {
      await existing.deleteOne();
      revalidatePath("/app/modelos");
      return { ok: true, favourited: false };
    }
    await Favourite.create({ userId, modelId });
    revalidatePath("/app/modelos");
    return { ok: true, favourited: true };
  } catch (e) {
    console.error("toggleFavourite", e);
    return { ok: false, error: "Não foi possível guardar o favorito." };
  }
}

/* ---------------- Recording plan ---------------- */

export interface PlanItem {
  id: string;
  sourceModelId: string | null;
  title: string;
  product: string;
  brand: string;
  status: PlanStatus;
  notes: string;
  contentLink: string;
  order: number;
}

function toPlanItem(d: Record<string, unknown>): PlanItem {
  return {
    id: String(d._id),
    sourceModelId: (d.sourceModelId as string) ?? null,
    title: (d.title as string) ?? "",
    product: (d.product as string) ?? "",
    brand: (d.brand as string) ?? "",
    status: (d.status as PlanStatus) ?? "quero_gravar",
    notes: (d.notes as string) ?? "",
    contentLink: (d.contentLink as string) ?? "",
    order: (d.order as number) ?? 0,
  };
}

export async function listPlan(): Promise<PlanItem[]> {
  const userId = await requireUserId();
  await connectDB();
  const items = await RecordingPlanItem.find({ userId })
    .sort({ order: 1, createdAt: -1 })
    .lean<Record<string, unknown>[]>();
  return items.map(toPlanItem);
}

const addToPlanSchema = z.object({
  sourceModelId: z.string().nullable().optional(),
  title: z.string().min(1),
  product: z.string().optional(),
  brand: z.string().optional(),
  generatedScriptId: z.string().nullable().optional(),
});

export async function addToPlan(
  raw: z.infer<typeof addToPlanSchema>
): Promise<{ ok: boolean; item?: PlanItem; error?: string }> {
  const userId = await requireUserId();
  const parsed = addToPlanSchema.safeParse(raw);
  if (!parsed.success) return { ok: false, error: "Dados inválidos." };
  try {
    await connectDB();
    const count = await RecordingPlanItem.countDocuments({ userId });
    const doc = await RecordingPlanItem.create({
      userId,
      sourceModelId: parsed.data.sourceModelId ?? null,
      title: parsed.data.title,
      product: parsed.data.product ?? "",
      brand: parsed.data.brand ?? "",
      generatedScriptId: parsed.data.generatedScriptId ?? null,
      status: "quero_gravar",
      order: count,
    });
    revalidatePath("/app/plano-de-gravacao");
    return { ok: true, item: toPlanItem(doc.toObject()) };
  } catch (e) {
    console.error("addToPlan", e);
    return { ok: false, error: "Não foi possível adicionar ao plano." };
  }
}

export async function updatePlanStatus(
  id: string,
  status: PlanStatus
): Promise<{ ok: boolean; error?: string }> {
  const userId = await requireUserId();
  if (!PLAN_STATUSES.includes(status)) return { ok: false, error: "Estado inválido." };
  try {
    await connectDB();
    await RecordingPlanItem.updateOne({ _id: id, userId }, { status });
    revalidatePath("/app/plano-de-gravacao");
    return { ok: true };
  } catch (e) {
    console.error("updatePlanStatus", e);
    return { ok: false, error: "Erro ao atualizar." };
  }
}

export async function updatePlanItem(
  id: string,
  patch: Partial<Pick<PlanItem, "notes" | "contentLink" | "product" | "brand">>
): Promise<{ ok: boolean }> {
  const userId = await requireUserId();
  await connectDB();
  await RecordingPlanItem.updateOne({ _id: id, userId }, patch);
  revalidatePath("/app/plano-de-gravacao");
  return { ok: true };
}

export async function removePlanItem(id: string): Promise<{ ok: boolean }> {
  const userId = await requireUserId();
  await connectDB();
  await RecordingPlanItem.deleteOne({ _id: id, userId });
  revalidatePath("/app/plano-de-gravacao");
  return { ok: true };
}

/* ---------------- AI script customization ---------------- */

const scriptSchema = z.object({
  sourceModelId: z.string().optional(),
  baseModelTitle: z.string().optional(),
  product: z.string().min(1, "Informe o produto"),
  brand: z.string().optional(),
  niche: z.string().min(1, "Informe o nicho"),
  audience: z.string().optional(),
  mainBenefit: z.string().optional(),
  problemSolved: z.string().optional(),
  tone: z.string().optional(),
  durationSeconds: z.coerce.number().optional(),
  onCamera: z.boolean().optional(),
  objective: z.string().optional(),
  platform: z.string().optional(),
});

export type ScriptFormInput = z.infer<typeof scriptSchema>;

export async function customizeScript(
  raw: ScriptFormInput
): Promise<{ ok: boolean; script?: GeneratedScriptResult; scriptId?: string; error?: string }> {
  const userId = await requireUserId();
  const parsed = scriptSchema.safeParse(raw);
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0]?.message ?? "Dados inválidos." };
  }

  // AI generation works without a database.
  const ai = getAIProvider();
  const script = await ai.customizeVideoScript(parsed.data);

  // Persist best-effort — if the DB is unavailable the script is still returned.
  let scriptId: string | undefined;
  try {
    await connectDB();
    const doc = await GeneratedScript.create({
      userId,
      sourceModelId: parsed.data.sourceModelId ?? null,
      title: script.title,
      input: parsed.data,
      result: script,
    });
    scriptId = String(doc._id);
    revalidatePath("/app/modelos");
  } catch (e) {
    console.error("customizeScript save (non-fatal)", e);
  }

  return { ok: true, script, scriptId };
}
