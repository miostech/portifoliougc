"use server";

import { auth } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import { User } from "@/models/User";
import { Portfolio } from "@/models/Portfolio";
import { Media } from "@/models/Media";
import { AnalyticsEvent } from "@/models/AnalyticsEvent";
import { GeneratedScript } from "@/models/GeneratedScript";
import type { UserPlan } from "@/models/User";
import { revalidatePath } from "next/cache";

async function requireAdmin(): Promise<string> {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Não autenticado.");
  if (session.user.role !== "admin") throw new Error("Sem permissão.");
  return session.user.id;
}

// ---- Stats ----

export interface AdminStats {
  totalUsers: number;
  activeSubscriptions: number;
  publishedPortfolios: number;
  totalMedia: number;
  totalAnalyticsEvents: number;
  aiGenerations: number;
}

export async function getAdminStats(): Promise<AdminStats> {
  await requireAdmin();
  await connectDB();

  const [
    totalUsers,
    activeSubscriptions,
    publishedPortfolios,
    totalMedia,
    totalAnalyticsEvents,
    aiGenerations,
  ] = await Promise.all([
    User.countDocuments({ deletedAt: null }),
    User.countDocuments({ plan: { $in: ["essencial", "pro"] }, deletedAt: null }),
    Portfolio.countDocuments({ published: true }),
    Media.countDocuments({ status: "ready" }),
    AnalyticsEvent.countDocuments({}),
    GeneratedScript.countDocuments({}),
  ]);

  return {
    totalUsers,
    activeSubscriptions,
    publishedPortfolios,
    totalMedia,
    totalAnalyticsEvents,
    aiGenerations,
  };
}

// ---- Users ----

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  plan: string;
  role: string;
  suspended: boolean;
  createdAt: string;
}

export interface ListUsersFilter {
  plan?: string;
  role?: string;
  search?: string;
}

export async function listUsers(filter: ListUsersFilter = {}): Promise<AdminUser[]> {
  await requireAdmin();
  await connectDB();

  const query: Record<string, unknown> = { deletedAt: null };
  if (filter.plan) query.plan = filter.plan;
  if (filter.role) query.role = filter.role;
  if (filter.search) {
    query.$or = [
      { name: { $regex: filter.search, $options: "i" } },
      { email: { $regex: filter.search, $options: "i" } },
    ];
  }

  const users = await User.find(query)
    .select("name email plan role suspended createdAt")
    .sort({ createdAt: -1 })
    .limit(100)
    .lean<{
      _id: { toString(): string };
      name?: string;
      email?: string;
      plan?: string;
      role?: string;
      suspended?: boolean;
      createdAt?: Date;
    }[]>();

  return users.map((u) => ({
    id: u._id.toString(),
    name: u.name ?? "",
    email: u.email ?? "",
    plan: u.plan ?? "none",
    role: u.role ?? "user",
    suspended: u.suspended ?? false,
    createdAt: u.createdAt ? new Date(u.createdAt).toISOString() : "",
  }));
}

type Result = { ok: boolean; error?: string };

export async function adminUpdateUserPlan(userId: string, plan: UserPlan): Promise<Result> {
  await requireAdmin();
  try {
    await connectDB();
    await User.findByIdAndUpdate(userId, { plan });
    revalidatePath("/admin/utilizadores");
    return { ok: true };
  } catch {
    return { ok: false, error: "Não foi possível atualizar o plano." };
  }
}

export async function adminToggleSuspend(userId: string): Promise<Result> {
  await requireAdmin();
  try {
    await connectDB();
    const user = await User.findById(userId).select("suspended").lean<{ suspended?: boolean }>();
    if (!user) return { ok: false, error: "Utilizador não encontrado." };
    await User.findByIdAndUpdate(userId, { suspended: !user.suspended });
    revalidatePath("/admin/utilizadores");
    return { ok: true };
  } catch {
    return { ok: false, error: "Não foi possível alterar o estado." };
  }
}

export async function adminPromoteToAdmin(userId: string): Promise<Result> {
  await requireAdmin();
  try {
    await connectDB();
    await User.findByIdAndUpdate(userId, { role: "admin" });
    revalidatePath("/admin/utilizadores");
    return { ok: true };
  } catch {
    return { ok: false, error: "Não foi possível promover o utilizador." };
  }
}

// ---- Subscriptions ----

export interface SubscriptionSummary {
  essencial: number;
  pro: number;
  none: number;
  simulatedMrrEur: number;
}

export interface AdminSubscription {
  id: string;
  name: string;
  email: string;
  plan: string;
  status: string;
  since: string;
}

export async function getSubscriptionSummary(): Promise<SubscriptionSummary> {
  await requireAdmin();
  await connectDB();

  const [essencial, pro, none] = await Promise.all([
    User.countDocuments({ plan: "essencial", deletedAt: null }),
    User.countDocuments({ plan: "pro", deletedAt: null }),
    User.countDocuments({ plan: "none", deletedAt: null }),
  ]);

  return {
    essencial,
    pro,
    none,
    simulatedMrrEur: essencial * 12 + pro * 24,
  };
}

export async function listSubscriptions(): Promise<AdminSubscription[]> {
  await requireAdmin();
  await connectDB();

  const users = await User.find({ plan: { $in: ["essencial", "pro"] }, deletedAt: null })
    .select("name email plan subscriptionStatus createdAt")
    .sort({ createdAt: -1 })
    .limit(100)
    .lean<{
      _id: { toString(): string };
      name?: string;
      email?: string;
      plan?: string;
      subscriptionStatus?: string;
      createdAt?: Date;
    }[]>();

  return users.map((u) => ({
    id: u._id.toString(),
    name: u.name ?? "",
    email: u.email ?? "",
    plan: u.plan ?? "none",
    status: u.subscriptionStatus ?? "active",
    since: u.createdAt ? new Date(u.createdAt).toLocaleDateString("pt") : "",
  }));
}

// ---- Platform analytics ----

export interface PlatformStats {
  visitsByDay: { date: string; visits: number }[];
  topPortfolios: { slug: string; visits: number }[];
  eventBreakdown: { type: string; count: number }[];
}

export async function getPlatformAnalytics(): Promise<PlatformStats> {
  await requireAdmin();
  await connectDB();

  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 6);

  const [recentEvents, breakdown] = await Promise.all([
    AnalyticsEvent.find({ type: "visit", createdAt: { $gte: sevenDaysAgo } })
      .select("createdAt")
      .lean<{ createdAt: Date }[]>(),
    AnalyticsEvent.aggregate([
      { $group: { _id: "$type", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
    ]) as Promise<{ _id: string; count: number }[]>,
  ]);

  // Group visits by day
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

  return {
    visitsByDay: Object.entries(dayMap)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([date, visits]) => ({ date, visits })),
    topPortfolios: [], // would require a join with Portfolio
    eventBreakdown: breakdown.map((b) => ({ type: b._id, count: b.count })),
  };
}
