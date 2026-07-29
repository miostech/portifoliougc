import type { Metadata } from "next";
import { Check } from "lucide-react";
import { auth } from "@/lib/auth";
import { PLAN_LIST } from "@/lib/plans";
import { PageHeader } from "@/components/app/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export const metadata: Metadata = { title: "Assinatura" };

export default async function AssinaturaPage() {
  const session = await auth();
  const currentPlan = session?.user?.plan ?? "none";

  return (
    <div className="mx-auto max-w-4xl">
      <PageHeader
        title="Assinatura"
        description="Escolha um plano para publicar o seu portfólio e ativar as funcionalidades."
      >
        <Badge variant={currentPlan === "none" ? "secondary" : "default"}>
          Plano atual: {currentPlan === "none" ? "Nenhum" : currentPlan}
        </Badge>
      </PageHeader>

      <div className="grid gap-6 sm:grid-cols-2">
        {PLAN_LIST.map((plan) => {
          const active = currentPlan === plan.key;
          return (
            <Card
              key={plan.key}
              className={cn(
                "relative flex flex-col",
                plan.highlight && "border-primary/50 shadow-lg shadow-primary/5"
              )}
            >
              {plan.highlight && (
                <Badge className="absolute -top-3 left-6">Mais popular</Badge>
              )}
              <CardHeader>
                <CardTitle className="flex items-baseline justify-between">
                  <span>{plan.name}</span>
                  <span className="text-2xl font-semibold">
                    €{plan.priceMonthly}
                    <span className="text-sm font-normal text-muted-foreground">/mês</span>
                  </span>
                </CardTitle>
                <p className="text-sm text-muted-foreground">{plan.tagline}</p>
              </CardHeader>
              <CardContent className="flex flex-1 flex-col">
                <ul className="flex-1 space-y-2 text-sm">
                  {plan.bullets.map((b) => (
                    <li key={b} className="flex items-start gap-2">
                      <Check className="mt-0.5 size-4 shrink-0 text-primary" />
                      <span>{b}</span>
                    </li>
                  ))}
                </ul>
                <div className="mt-6">
                  <button
                    type="button"
                    disabled
                    className={cn(
                      "w-full rounded-lg px-4 py-2 text-sm font-medium",
                      active
                        ? "bg-accent text-accent-foreground"
                        : "bg-primary text-primary-foreground opacity-90"
                    )}
                  >
                    {active ? "Plano ativo" : "Ativar (demo) — em breve"}
                  </button>
                  <p className="mt-2 text-center text-xs text-muted-foreground">
                    Integração Stripe + ativação em modo demo chegam na Fase 5.
                  </p>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
