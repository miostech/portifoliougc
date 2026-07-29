import type { Metadata } from "next";
import {
  Users,
  CreditCard,
  Globe,
  Film,
  Clapperboard,
  Sparkles,
} from "lucide-react";
import { PageHeader } from "@/components/app/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const metadata: Metadata = { title: "Admin" };

const stats = [
  { label: "Utilizadores", value: "—", icon: Users },
  { label: "Assinaturas ativas", value: "—", icon: CreditCard },
  { label: "Portfólios publicados", value: "—", icon: Globe },
  { label: "Vídeos enviados", value: "—", icon: Film },
  { label: "Modelos de vídeos", value: "—", icon: Clapperboard },
  { label: "Gerações de IA", value: "—", icon: Sparkles },
];

export default function AdminOverviewPage() {
  return (
    <div className="mx-auto max-w-6xl">
      <PageHeader
        title="Visão geral"
        description="Métricas da plataforma, utilizadores, assinaturas e uso da IA."
      />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {stats.map((s) => (
          <Card key={s.label}>
            <CardHeader className="flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {s.label}
              </CardTitle>
              <s.icon className="size-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-semibold">{s.value}</div>
              <p className="text-xs text-muted-foreground">
                Preenchido pelo seed na Fase 6
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
