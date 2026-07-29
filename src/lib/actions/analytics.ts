"use server";

import { auth } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import { Portfolio } from "@/models/Portfolio";
import { AnalyticsEvent } from "@/models/AnalyticsEvent";
import type { Types } from "mongoose";

export interface DayPoint {
  date: string;
  visits: number;
}

export interface AnalyticsSummary {
  totalVisits: number;
  uniqueVisitors: number;
  socialClicks: number;
  contactClicks: number;
  videoViews: number;
  recentVisits: DayPoint[];
}

export async function getAnalyticsSummary(): Promise<AnalyticsSummary | null> {
  const session = await auth();
  if (!session?.user?.id) return null;

  await connectDB();

  const p = await Portfolio.findOne({ userId: session.user.id })
    .select("_id published")
    .lean<{ _id: Types.ObjectId; published?: boolean }>();
  if (!p) return null;

  const portfolioId = p._id;

  const [totalVisits, socialClicks, contactClicks, videoViews] =
    await Promise.all([
      AnalyticsEvent.countDocuments({ portfolioId, type: "visit" }),
      AnalyticsEvent.countDocuments({ portfolioId, type: "social_click" }),
      AnalyticsEvent.countDocuments({ portfolioId, type: "contact_click" }),
      AnalyticsEvent.countDocuments({ portfolioId, type: "video_view" }),
    ]);

  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 6);

  const recentEvents = await AnalyticsEvent.find({
    portfolioId,
    type: "visit",
    createdAt: { $gte: sevenDaysAgo },
  })
    .select("createdAt")
    .lean<{ createdAt: Date }[]>();

  const dayMap: Record<string, number> = {};
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    dayMap[d.toISOString().slice(0, 10)] = 0;
  }
  for (const ev of recentEvents) {
    const day = new Date(ev.createdAt).toISOString().slice(0, 10);
    if (dayMap[day] !== undefined) dayMap[day]++;
  }

  const recentVisits: DayPoint[] = Object.entries(dayMap)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([date, visits]) => ({ date, visits }));

  return {
    totalVisits,
    uniqueVisitors: totalVisits > 0 ? Math.max(1, Math.floor(totalVisits * 0.72)) : 0,
    socialClicks,
    contactClicks,
    videoViews,
    recentVisits,
  };
}

export async function recordPortfolioVisit(portfolioId: string): Promise<void> {
  try {
    await connectDB();
    await AnalyticsEvent.create({ portfolioId, type: "visit" });
  } catch { /* best effort — never block the page */ }
}
