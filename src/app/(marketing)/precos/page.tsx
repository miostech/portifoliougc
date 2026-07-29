import type { Metadata } from "next";
import Link from "next/link";
import { Check } from "lucide-react";
import { PLAN_LIST } from "@/lib/plans";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Preços",
  description:
    "Planos Essencial e Pro do Portfolio UGC. Sem plano gratuito — comece a publicar o seu portfólio profissional.",
};

export default function PrecosPage() {
  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-16 sm:px-6 md:py-24">
      <div className="mx-auto max-w-2xl text-center">
        <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
          Planos simples, feitos para criadoras
        </h1>
        <p className="mt-4 text-muted-foreground">
          Escolha o plano ideal para publicar e evoluir o seu portfólio. Cancele
          quando quiser.
        </p>
      </div>

      <div className="mx-auto mt-12 grid max-w-3xl gap-6 sm:grid-cols-2">
        {PLAN_LIST.map((plan) => (
          <div
            key={plan.key}
            className={cn(
              "relative flex flex-col rounded-2xl border bg-card p-6",
              plan.highlight
                ? "border-primary/50 shadow-xl shadow-primary/10"
                : "border-border/60"
            )}
          >
            {plan.highlight && (
              <Badge className="absolute -top-3 left-6">Mais popular</Badge>
            )}
            <h2 className="text-lg font-semibold">{plan.name}</h2>
            <p className="mt-1 text-sm text-muted-foreground">{plan.tagline}</p>
            <div className="mt-4 flex items-baseline gap-1">
              <span className="text-4xl font-semibold">€{plan.priceMonthly}</span>
              <span className="text-muted-foreground">/mês</span>
            </div>
            <ul className="mt-6 flex-1 space-y-2 text-sm">
              {plan.bullets.map((b) => (
                <li key={b} className="flex items-start gap-2">
                  <Check className="mt-0.5 size-4 shrink-0 text-primary" />
                  <span>{b}</span>
                </li>
              ))}
            </ul>
            <Link
              href="/cadastro"
              className={cn(
                buttonVariants({ variant: plan.highlight ? "default" : "outline" }),
                "mt-6 w-full"
              )}
            >
              Começar com {plan.name}
            </Link>
          </div>
        ))}
      </div>

      <p className="mt-8 text-center text-sm text-muted-foreground">
        Precisa de algo à medida?{" "}
        <a href="mailto:ola@portfoliougc.com" className="text-primary hover:underline">
          Fale connosco
        </a>
        .
      </p>
    </div>
  );
}
