"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import { User } from "@/models/User";
import type { UserPlan } from "@/models/User";

type Result = { ok: boolean; error?: string };

/**
 * Demo-mode plan activation. In production this would go through Stripe.
 * Allows the creator to test the full experience without a payment integration.
 */
export async function activateDemoPlan(plan: UserPlan): Promise<Result> {
  const session = await auth();
  if (!session?.user?.id) return { ok: false, error: "Não autenticado." };
  if (plan !== "essencial" && plan !== "pro") {
    return { ok: false, error: "Plano inválido." };
  }

  try {
    await connectDB();
    await User.findByIdAndUpdate(session.user.id, {
      plan,
      subscriptionStatus: "active",
    });
    revalidatePath("/app/assinatura");
    revalidatePath("/app");
    return { ok: true };
  } catch (e) {
    console.error("activateDemoPlan", e);
    return { ok: false, error: "Não foi possível ativar o plano." };
  }
}

export async function cancelDemoPlan(): Promise<Result> {
  const session = await auth();
  if (!session?.user?.id) return { ok: false, error: "Não autenticado." };

  try {
    await connectDB();
    await User.findByIdAndUpdate(session.user.id, {
      plan: "none",
      subscriptionStatus: "canceled",
    });
    revalidatePath("/app/assinatura");
    revalidatePath("/app");
    return { ok: true };
  } catch (e) {
    console.error("cancelDemoPlan", e);
    return { ok: false, error: "Não foi possível cancelar." };
  }
}
