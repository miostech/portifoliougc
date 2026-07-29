"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { auth } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import { Portfolio } from "@/models/Portfolio";
import { Media } from "@/models/Media";
import { getStorageProvider } from "@/lib/services/storage";
import { getAIProvider } from "@/lib/services/ai";

async function requireUserId(): Promise<string> {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Não autenticado");
  return session.user.id;
}

async function getPortfolioId(userId: string): Promise<string | null> {
  await connectDB();
  const p = await Portfolio.findOne({ userId }).select("_id").lean<{
    _id: unknown;
  }>();
  return p ? String(p._id) : null;
}

export interface MediaItem {
  id: string;
  type: "video" | "image";
  url: string;
  thumbnail: string | null;
  title: string;
  description: string;
  category: string;
  niche: string;
  format: string;
  product: string;
  brand: string;
  featured: boolean;
  hidden: boolean;
  aiGenerated: boolean;
  status: string;
  order: number;
}

function toMediaItem(m: Record<string, unknown>): MediaItem {
  return {
    id: String(m._id),
    type: (m.type as "video" | "image") ?? "video",
    url: (m.url as string) ?? "",
    thumbnail: (m.thumbnail as string) ?? null,
    title: (m.title as string) ?? "",
    description: (m.description as string) ?? "",
    category: (m.category as string) ?? "",
    niche: (m.niche as string) ?? "",
    format: (m.format as string) ?? "",
    product: (m.product as string) ?? "",
    brand: (m.brand as string) ?? "",
    featured: Boolean(m.featured),
    hidden: Boolean(m.hidden),
    aiGenerated: Boolean(m.aiGenerated),
    status: (m.status as string) ?? "ready",
    order: (m.order as number) ?? 0,
  };
}

export interface ContentBundle {
  media: MediaItem[];
  testimonials: { id: string; author: string; role: string; quote: string }[];
  clients: { id: string; name: string; logo: string | null }[];
  cases: { id: string; title: string; brand: string; description: string; result: string }[];
  categories: string[];
}

export async function listContent(): Promise<ContentBundle> {
  const userId = await requireUserId();
  await connectDB();
  const p = await Portfolio.findOne({ userId }).lean<Record<string, unknown>>();
  if (!p) {
    return { media: [], testimonials: [], clients: [], cases: [], categories: [] };
  }
  const media = await Media.find({ portfolioId: p._id })
    .sort({ order: 1, createdAt: -1 })
    .lean<Record<string, unknown>[]>();

  const arr = (k: string) => ((p[k] as Record<string, unknown>[]) ?? []);
  return {
    media: media.map(toMediaItem),
    testimonials: arr("testimonials").map((t) => ({
      id: String(t._id),
      author: (t.author as string) ?? "",
      role: (t.role as string) ?? "",
      quote: (t.quote as string) ?? "",
    })),
    clients: arr("clients").map((c) => ({
      id: String(c._id),
      name: (c.name as string) ?? "",
      logo: (c.logo as string) ?? null,
    })),
    cases: arr("cases").map((c) => ({
      id: String(c._id),
      title: (c.title as string) ?? "",
      brand: (c.brand as string) ?? "",
      description: (c.description as string) ?? "",
      result: (c.result as string) ?? "",
    })),
    categories: (p.categories as string[]) ?? [],
  };
}

const uploadSchema = z.object({
  fileName: z.string().min(1),
  type: z.enum(["video", "image"]),
  sizeBytes: z.number().optional(),
  niche: z.string().optional(),
  format: z.string().optional(),
  product: z.string().optional(),
  brand: z.string().optional(),
  title: z.string().optional(),
  description: z.string().optional(),
  category: z.string().optional(),
  featured: z.boolean().optional(),
});

export type UploadInput = z.infer<typeof uploadSchema>;

/**
 * Simulated upload pipeline: store the file (mock S3), then have the AI
 * suggest title/description/category and a thumbnail. Works without any real
 * credentials so the flow is fully demonstrable.
 */
export async function uploadMedia(
  raw: UploadInput
): Promise<{ ok: boolean; media?: MediaItem; error?: string }> {
  const userId = await requireUserId();
  const parsed = uploadSchema.safeParse(raw);
  if (!parsed.success) return { ok: false, error: "Dados de upload inválidos." };
  const input = parsed.data;

  try {
    const portfolioId = await getPortfolioId(userId);
    if (!portfolioId) return { ok: false, error: "Crie o seu portfólio primeiro." };

    const storage = getStorageProvider();
    const stored = await storage.upload({
      fileName: input.fileName,
      contentType: input.type === "image" ? "image/jpeg" : "video/mp4",
      sizeBytes: input.sizeBytes ?? 0,
      folder: `portfolios/${portfolioId}`,
    });

    const ai = getAIProvider();
    const needsMeta = !input.title || !input.description || !input.category;
    const meta = needsMeta
      ? await ai.generateVideoMetadata({
          fileName: input.fileName,
          niche: input.niche,
          format: input.format,
          product: input.product,
          brand: input.brand,
        })
      : null;

    const count = await Media.countDocuments({ portfolioId });
    const doc = await Media.create({
      portfolioId,
      userId,
      type: input.type,
      url: stored.url,
      thumbnail: stored.url,
      title: input.title || meta?.title || input.fileName,
      description: input.description || meta?.description || "",
      category: input.category || meta?.category || "",
      niche: input.niche || "",
      format: input.format || "",
      product: input.product || "",
      brand: input.brand || "",
      featured: input.featured ?? false,
      aiGenerated: needsMeta,
      status: "ready",
      order: count,
    });

    revalidatePath("/app/conteudos");
    return { ok: true, media: toMediaItem(doc.toObject()) };
  } catch (e) {
    console.error("uploadMedia", e);
    return { ok: false, error: "Falha no upload. Tente novamente." };
  }
}

async function ownsMedia(userId: string, id: string) {
  await connectDB();
  return Media.findOne({ _id: id, userId });
}

export async function updateMedia(
  id: string,
  patch: Partial<Pick<MediaItem, "title" | "description" | "category" | "featured" | "hidden">>
): Promise<{ ok: boolean; error?: string }> {
  const userId = await requireUserId();
  const doc = await ownsMedia(userId, id);
  if (!doc) return { ok: false, error: "Conteúdo não encontrado." };
  Object.assign(doc, patch);
  await doc.save();
  revalidatePath("/app/conteudos");
  return { ok: true };
}

export async function deleteMedia(id: string): Promise<{ ok: boolean }> {
  const userId = await requireUserId();
  await connectDB();
  await Media.deleteOne({ _id: id, userId });
  revalidatePath("/app/conteudos");
  return { ok: true };
}

// ---- Embedded arrays: testimonials / clients / cases ----

export async function addTestimonial(input: {
  author: string;
  role?: string;
  quote: string;
}): Promise<{ ok: boolean; error?: string }> {
  const userId = await requireUserId();
  if (!input.author?.trim() || !input.quote?.trim())
    return { ok: false, error: "Preencha autor e depoimento." };
  await connectDB();
  await Portfolio.updateOne(
    { userId },
    { $push: { testimonials: { author: input.author, role: input.role ?? "", quote: input.quote } } }
  );
  revalidatePath("/app/conteudos");
  return { ok: true };
}

export async function addClient(input: {
  name: string;
}): Promise<{ ok: boolean; error?: string }> {
  const userId = await requireUserId();
  if (!input.name?.trim()) return { ok: false, error: "Informe o nome da marca." };
  await connectDB();
  await Portfolio.updateOne({ userId }, { $push: { clients: { name: input.name } } });
  revalidatePath("/app/conteudos");
  return { ok: true };
}

export async function addCase(input: {
  title: string;
  brand?: string;
  description?: string;
  result?: string;
}): Promise<{ ok: boolean; error?: string }> {
  const userId = await requireUserId();
  if (!input.title?.trim()) return { ok: false, error: "Informe o título do case." };
  await connectDB();
  await Portfolio.updateOne(
    { userId },
    {
      $push: {
        cases: {
          title: input.title,
          brand: input.brand ?? "",
          description: input.description ?? "",
          result: input.result ?? "",
        },
      },
    }
  );
  revalidatePath("/app/conteudos");
  return { ok: true };
}

export async function removeEmbedded(
  kind: "testimonials" | "clients" | "cases",
  id: string
): Promise<{ ok: boolean }> {
  const userId = await requireUserId();
  await connectDB();
  await Portfolio.updateOne({ userId }, { $pull: { [kind]: { _id: id } } });
  revalidatePath("/app/conteudos");
  return { ok: true };
}
