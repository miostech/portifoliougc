import type { Metadata } from "next";
import Link from "next/link";
import { Gauge } from "lucide-react";
import { auth } from "@/lib/auth";
import { planHasFeature } from "@/lib/plans";
import { getPortfolioScore } from "@/lib/actions/score";
import { PageHeader } from "@/components/app/page-header";
import { EmptyState } from "@/components/app/empty-state";
import { ScoreDashboard } from "@/components/score/score-dashboard";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export const metadata: Metadata = { title: "Portfolio Score" };

export default async function PortfolioScorePage() {
  const session = await auth();
  const plan = (session?.user as { plan?: string } | undefined)?.plan ?? "none";

  if (!planHasFeature(plan as never, "portfolio_score")) {
    return (
      <div className="mx-auto max-w-4xl">
        <PageHeader
          title="Portfolio Score"
          description="A sua pontuação de 0 a 100 com pontos fortes e recomendações prioritárias."
        />
        <EmptyState
          icon={Gauge}
          title="Portfolio Score incluído no plano Essencial"
          description="Ative um plano para ver a sua pontuação detalhada e recomendações prioritárias para melhorar o seu portfólio."
          actionHref="/app/assinatura"
          actionLabel="Ver planos"
        />
      </div>
    );
  }

  let data = null;
  try {
    data = await getPortfolioScore();
  } catch {
    data = null;
  }

  if (!data) {
    return (
      <div className="mx-auto max-w-4xl">
        <PageHeader
          title="Portfolio Score"
          description="A sua pontuação de 0 a 100 com pontos fortes e recomendações prioritárias."
        />
        <EmptyState
          icon={Gauge}
          title="Complete o seu perfil primeiro"
          description="Finalize o onboarding e adicione alguns vídeos para calcularmos o seu score."
          actionHref="/app/onboarding"
          actionLabel="Completar perfil"
        />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl">
      <PageHeader
        title="Portfolio Score"
        description="Pontuação baseada no perfil, conteúdos, prova social, conversão e atualização."
      >
        <Link
          href="/app/conteudos"
          className={cn(buttonVariants({ variant: "outline", size: "sm" }))}
        >
          Melhorar conteúdo
        </Link>
      </PageHeader>
      <ScoreDashboard data={data} />
    </div>
  );
}
