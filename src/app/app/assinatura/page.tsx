import type { Metadata } from "next";
import { auth } from "@/lib/auth";
import { PLAN_LIST } from "@/lib/plans";
import { PageHeader } from "@/components/app/page-header";
import { Badge } from "@/components/ui/badge";
import { SubscriptionCards } from "@/components/subscription/subscription-cards";

export const metadata: Metadata = { title: "Assinatura" };

export default async function AssinaturaPage() {
  const session = await auth();
  const currentPlan = (session?.user as { plan?: string } | undefined)?.plan ?? "none";

  return (
    <div className="mx-auto max-w-4xl">
      <PageHeader
        title="Assinatura"
        description="Escolha um plano para publicar o seu portfólio e ativar as funcionalidades."
      >
        <Badge variant={currentPlan === "none" ? "secondary" : "default"}>
          Plano atual:{" "}
          {currentPlan === "none"
            ? "Nenhum"
            : currentPlan.charAt(0).toUpperCase() + currentPlan.slice(1)}
        </Badge>
      </PageHeader>

      <SubscriptionCards plans={PLAN_LIST} currentPlan={currentPlan} />

      <p className="mt-6 text-center text-xs text-muted-foreground">
        Modo demo — nenhuma cobrança real é efetuada. Integração Stripe disponível em produção.
      </p>
    </div>
  );
}
