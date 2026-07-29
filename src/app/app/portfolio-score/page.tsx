import type { Metadata } from "next";
import { Gauge } from "lucide-react";
import { PageHeader } from "@/components/app/page-header";
import { EmptyState } from "@/components/app/empty-state";

export const metadata: Metadata = { title: "Portfolio Score" };

export default function PortfolioScorePage() {
  return (
    <div className="mx-auto max-w-4xl">
      <PageHeader
        title="Portfolio Score"
        description="A sua pontuação de 0 a 100 com pontos fortes e recomendações prioritárias."
      />
      <EmptyState
        icon={Gauge}
        title="Score indisponível"
        description="Assim que tiver perfil e conteúdos, calculamos o seu score e sugestões. Chega na Fase 5."
        actionHref="/app/onboarding"
        actionLabel="Completar perfil"
      />
    </div>
  );
}
