import type { Metadata } from "next";
import { BarChart3 } from "lucide-react";
import { PageHeader } from "@/components/app/page-header";
import { EmptyState } from "@/components/app/empty-state";

export const metadata: Metadata = { title: "Analytics" };

export default function AnalyticsPage() {
  return (
    <div className="mx-auto max-w-6xl">
      <PageHeader
        title="Analytics"
        description="Visitas, visitantes únicos, cliques, vídeos vistos e origem do tráfego."
      />
      <EmptyState
        icon={BarChart3}
        title="Sem dados ainda"
        description="Publique o seu portfólio para começar a registar visitas e interações. Dashboards completos na Fase 5."
        actionHref="/app/assinatura"
        actionLabel="Publicar portfólio"
      />
    </div>
  );
}
