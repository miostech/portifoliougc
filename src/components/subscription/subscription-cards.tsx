"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Check, Loader2, Zap } from "lucide-react";
import type { PlanDefinition } from "@/lib/plans";
import { activateDemoPlan, cancelDemoPlan } from "@/lib/actions/subscription";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

export function SubscriptionCards({
  plans,
  currentPlan,
}: {
  plans: PlanDefinition[];
  currentPlan: string;
}) {
  const router = useRouter();
  const [pending, start] = useTransition();

  function activate(key: string) {
    start(async () => {
      const res = await activateDemoPlan(key as "essencial" | "pro");
      if (!res.ok) {
        toast.error(res.error ?? "Erro ao ativar plano.");
        return;
      }
      toast.success(`Plano ${key} ativado em modo demo!`);
      router.refresh();
    });
  }

  function cancel() {
    start(async () => {
      const res = await cancelDemoPlan();
      if (!res.ok) {
        toast.error(res.error ?? "Erro ao cancelar.");
        return;
      }
      toast.success("Plano cancelado.");
      router.refresh();
    });
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-6 sm:grid-cols-2">
        {plans.map((plan) => {
          const active = currentPlan === plan.key;
          return (
            <div
              key={plan.key}
              className={cn(
                "relative flex flex-col rounded-2xl border bg-card p-6",
                plan.highlight && "border-primary/50 shadow-lg shadow-primary/5"
              )}
            >
              {plan.highlight && (
                <Badge className="absolute -top-3 left-6">Mais popular</Badge>
              )}

              <div className="mb-4">
                <div className="flex items-baseline justify-between">
                  <h3 className="text-lg font-semibold">{plan.name}</h3>
                  <span className="text-2xl font-bold">
                    €{plan.priceMonthly}
                    <span className="text-sm font-normal text-muted-foreground">/mês</span>
                  </span>
                </div>
                <p className="mt-1 text-sm text-muted-foreground">{plan.tagline}</p>
              </div>

              <ul className="mb-6 flex-1 space-y-2 text-sm">
                {plan.bullets.map((b) => (
                  <li key={b} className="flex items-start gap-2">
                    <Check className="mt-0.5 size-4 shrink-0 text-primary" />
                    <span>{b}</span>
                  </li>
                ))}
              </ul>

              <div className="space-y-2">
                {active ? (
                  <>
                    <div className="flex items-center justify-center gap-2 rounded-lg bg-primary/10 py-2.5 text-sm font-medium text-primary">
                      <Zap className="size-4" /> Plano ativo (demo)
                    </div>
                    <button
                      type="button"
                      disabled={pending}
                      onClick={cancel}
                      className="w-full rounded-lg border py-2 text-xs text-muted-foreground hover:bg-accent disabled:opacity-50"
                    >
                      {pending ? (
                        <Loader2 className="mx-auto size-3.5 animate-spin" />
                      ) : (
                        "Cancelar plano"
                      )}
                    </button>
                  </>
                ) : (
                  <button
                    type="button"
                    disabled={pending}
                    onClick={() => activate(plan.key)}
                    className={cn(
                      "w-full rounded-lg py-2.5 text-sm font-medium transition-colors disabled:opacity-50",
                      plan.highlight
                        ? "bg-primary text-primary-foreground hover:bg-primary/90"
                        : "border hover:bg-accent"
                    )}
                  >
                    {pending ? (
                      <Loader2 className="mx-auto size-4 animate-spin" />
                    ) : (
                      `Ativar ${plan.name} (demo)`
                    )}
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
