import type { Metadata } from "next";
import { Users, CreditCard, Globe, Film, BarChart3, Sparkles } from "lucide-react";
import { getAdminStats } from "@/lib/actions/admin";
import { PageHeader } from "@/components/app/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const metadata: Metadata = { title: "Admin — Visão geral" };

export default async function AdminOverviewPage() {
  let stats = null;
  try {
    stats = await getAdminStats();
  } catch {
    stats = null;
  }

  const statCards = [
    { label: "Utilizadores", value: stats?.totalUsers, icon: Users },
    { label: "Assinaturas ativas", value: stats?.activeSubscriptions, icon: CreditCard },
    { label: "Portfólios publicados", value: stats?.publishedPortfolios, icon: Globe },
    { label: "Vídeos enviados", value: stats?.totalMedia, icon: Film },
    { label: "Eventos de analytics", value: stats?.totalAnalyticsEvents, icon: BarChart3 },
    { label: "Gerações de IA", value: stats?.aiGenerations, icon: Sparkles },
  ];

  return (
    <div className="mx-auto max-w-6xl">
      <PageHeader
        title="Visão geral"
        description="Métricas da plataforma, utilizadores, assinaturas e uso da IA."
      />
      {!stats && (
        <div className="mb-4 rounded-lg border border-amber-200 bg-amber-50 px-4 py-2 text-sm text-amber-800 dark:border-amber-800 dark:bg-amber-900/20 dark:text-amber-400">
          Base de dados não acessível — inicie o MongoDB para ver dados reais.
        </div>
      )}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {statCards.map((s) => (
          <Card key={s.label}>
            <CardHeader className="flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {s.label}
              </CardTitle>
              <s.icon className="size-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-semibold">
                {s.value !== undefined && s.value !== null
                  ? s.value.toLocaleString("pt")
                  : "—"}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
