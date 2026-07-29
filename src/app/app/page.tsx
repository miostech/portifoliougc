import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  CheckCircle2,
  Circle,
  Eye,
  MousePointerClick,
  Gauge,
  Sparkles,
} from "lucide-react";
import { auth } from "@/lib/auth";
import { PageHeader } from "@/components/app/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export const metadata: Metadata = { title: "Painel" };

interface ChecklistItem {
  label: string;
  href: string;
  done: boolean;
}

export default async function AppDashboardPage() {
  const session = await auth();
  const firstName = (session?.user?.name ?? "criadora").split(" ")[0];
  const isPaid = session?.user?.plan !== "none";

  // Until portfolio data is wired, derive from the session onboarding flag.
  const checklist: ChecklistItem[] = [
    { label: "Complete o seu perfil", href: "/app/onboarding", done: !!session?.user?.onboarded },
    { label: "Escolha um template", href: "/app/portfolio/editor", done: false },
    { label: "Adicione o primeiro vídeo", href: "/app/conteudos", done: false },
    { label: "Publique o portfólio", href: "/app/assinatura", done: false },
    { label: "Compartilhe com uma marca", href: "/app/portfolio", done: false },
  ];
  const doneCount = checklist.filter((c) => c.done).length;

  const metrics = [
    { label: "Visitas", value: "—", icon: Eye },
    { label: "Cliques", value: "—", icon: MousePointerClick },
    { label: "Portfolio Score", value: "—", icon: Gauge },
  ];

  return (
    <div className="mx-auto max-w-5xl">
      <PageHeader
        title={`Olá, ${firstName} 👋`}
        description="Bem-vinda ao seu estúdio de portfólio."
      >
        {!isPaid && (
          <Link href="/app/assinatura" className={cn(buttonVariants({ size: "sm" }))}>
            Ativar plano
          </Link>
        )}
      </PageHeader>

      <div className="grid gap-4 sm:grid-cols-3">
        {metrics.map((m) => (
          <Card key={m.label}>
            <CardHeader className="flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {m.label}
              </CardTitle>
              <m.icon className="size-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-semibold">{m.value}</div>
              <p className="text-xs text-muted-foreground">Disponível após publicar</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[1.4fr_1fr]">
        <Card>
          <CardHeader className="flex-row items-center justify-between space-y-0">
            <CardTitle>Comece por aqui</CardTitle>
            <Badge variant="secondary">
              {doneCount}/{checklist.length}
            </Badge>
          </CardHeader>
          <CardContent className="space-y-1">
            {checklist.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className="flex items-center gap-3 rounded-lg px-2 py-2.5 text-sm transition-colors hover:bg-accent/60"
              >
                {item.done ? (
                  <CheckCircle2 className="size-5 shrink-0 text-primary" />
                ) : (
                  <Circle className="size-5 shrink-0 text-muted-foreground/50" />
                )}
                <span className={cn("flex-1", item.done && "text-muted-foreground line-through")}>
                  {item.label}
                </span>
                <ArrowRight className="size-4 text-muted-foreground" />
              </Link>
            ))}
          </CardContent>
        </Card>

        <Card className="surface-soft">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="size-4 text-primary" /> Assistente IA
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Precisa de ajuda com a bio, uma headline ou uma mensagem para
              marcas? O assistente cria tudo por si.
            </p>
            <Link
              href="/app/ia"
              className={cn(buttonVariants({ variant: "outline", size: "sm" }))}
            >
              Abrir assistente
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
