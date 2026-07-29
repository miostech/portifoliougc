import type { Metadata } from "next";
import { BarChart3 } from "lucide-react";
import { PageHeader } from "@/components/app/page-header";
import { EmptyState } from "@/components/app/empty-state";

export const metadata: Metadata = { title: "Analytics (admin)" };

export default function AdminAnalyticsPage() {
  return (
    <div className="mx-auto max-w-6xl">
      <PageHeader
        title="Analytics da plataforma"
        description="Crescimento de utilizadores, uso da IA, templates e modelos mais usados."
      />
      <EmptyState
        icon={BarChart3}
        title="Analytics administrativo na Fase 6"
        description="Gráficos agregados da plataforma serão implementados com o seed."
      />
    </div>
  );
}
