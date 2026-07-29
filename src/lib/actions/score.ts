"use server";

import { auth } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import { Portfolio } from "@/models/Portfolio";
import { Media } from "@/models/Media";
import { getAIProvider } from "@/lib/services/ai";
import type {
  PortfolioScoreResult,
  PortfolioSuggestion,
} from "@/lib/services/ai/types";

export type { PortfolioScoreResult, PortfolioSuggestion };

export interface ScoreResult {
  score: PortfolioScoreResult;
  suggestions: PortfolioSuggestion[];
}

export async function getPortfolioScore(): Promise<ScoreResult | null> {
  const session = await auth();
  if (!session?.user?.id) return null;
  const userId = session.user.id;

  await connectDB();

  const p = await Portfolio.findOne({ userId }).lean<Record<string, unknown>>();
  if (!p) return null;

  const media = await Media.find({ portfolioId: p._id, status: "ready" })
    .lean<Record<string, unknown>[]>();

  const profile = (p.profile ?? {}) as Record<string, unknown>;
  const ai = (p.ai ?? {}) as Record<string, unknown>;
  const scoreDoc = (p.score ?? {}) as Record<string, unknown>;
  const cases = (p.cases as unknown[]) ?? [];
  const testimonials = (p.testimonials as unknown[]) ?? [];
  const clients = (p.clients as unknown[]) ?? [];

  const now = new Date();
  const updatedRef = scoreDoc.updatedAt
    ? new Date(scoreDoc.updatedAt as string)
    : now;
  const daysSinceUpdate = Math.floor(
    (now.getTime() - updatedRef.getTime()) / 86_400_000
  );

  const videos = media.filter((m) => m.type === "video");
  const formats = new Set(videos.map((v) => v.format).filter(Boolean));
  const niches = new Set(videos.map((v) => v.niche).filter(Boolean));
  const thumbCount = videos.filter((v) => v.thumbnail).length;
  const socials = (profile.socials as unknown[]) ?? [];

  const input = {
    hasPhoto: !!(profile.photo),
    hasHeadline: !!(ai.headline),
    hasBio: !!(ai.professionalBio),
    hasAboutMe: !!(ai.aboutMe),
    nicheCount: ((profile.niches as unknown[]) ?? []).length,
    equipmentCount: ((profile.equipment as unknown[]) ?? []).length,
    videoCount: videos.length,
    formatDiversity: formats.size,
    nicheDiversity: niches.size,
    thumbnailQuality: videos.length > 0 ? thumbCount / videos.length : 0,
    caseCount: cases.length,
    testimonialCount: testimonials.length,
    clientCount: clients.length,
    hasCta: !!(ai.ctaPrimary),
    contactCount: socials.filter(
      (s) => (s as Record<string, unknown>).url
    ).length,
    socialCount: socials.length,
    daysSinceUpdate,
  };

  const aiProvider = getAIProvider();
  const [score, suggestions] = await Promise.all([
    aiProvider.calculatePortfolioScore(input),
    aiProvider.generatePortfolioSuggestions(input),
  ]);

  try {
    await Portfolio.findByIdAndUpdate(p._id, {
      "score.total": score.total,
      "score.updatedAt": now,
    });
  } catch { /* best effort */ }

  return { score, suggestions };
}
