import type { Metadata } from "next";
import Link from "next/link";
import { BarChart3 } from "lucide-react";
import { auth } from "@/lib/auth";
import { planHasFeature } from "@/lib/plans";
import { getAnalyticsSummary } from "@/lib/actions/analytics";
import { PageHeader } from "@/components/app/page-header";
import { EmptyState } from "@/components/app/empty-state";
import { AnalyticsDashboard } from "@/components/analytics/analytics-dashboard";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export const metadata: Metadata = { title: "Analytics" };

export default async function AnalyticsPage() {
  const session = await auth();
  const plan = (session?.user as { plan?: string } | undefined)?.plan ?? "none";

  if (!planHasFeature(plan as never, "analytics_basic")) {
    return (
      <div className="mx-auto max-w-6xl">
        <PageHeader
          title="Analytics"
          description="Visitas, visitantes únicos, cliques, vídeos vistos e origem do tráfego."
        />
        <EmptyState
          icon={BarChart3}
          title="Analytics incluído no plano Essencial"
          description="Publique o seu portfólio e ative um plano para ver o painel de analytics."
          actionHref="/app/assinatura"
          actionLabel="Ver planos"
        />
      </div>
    );
  }

  let data = null;
  try {
    data = await getAnalyticsSummary();
  } catch {
    data = null;
  }

  if (!data) {
    return (
      <div className="mx-auto max-w-6xl">
        <PageHeader
          title="Analytics"
          description="Visitas, visitantes únicos, cliques, vídeos vistos e origem do tráfego."
        />
        <EmptyState
          icon={BarChart3}
          title="Sem dados ainda"
          description="Publique o seu portfólio para começar a registar visitas e interações."
          actionHref="/app/portfolio"
          actionLabel="Publicar portfólio"
        />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl">
      <PageHeader
        title="Analytics"
        description="Visitas, visitantes únicos, cliques e vídeos vistos no seu portfólio público."
      >
        <Link
          href="/app/portfolio"
          className={cn(buttonVariants({ variant: "outline", size: "sm" }))}
        >
          Ver portfólio
        </Link>
      </PageHeader>
      <AnalyticsDashboard data={data} />
    </div>
  );
}
