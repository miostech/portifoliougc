import type { Metadata } from "next";
import Link from "next/link";
import { UserRound, PencilRuler } from "lucide-react";
import { auth } from "@/lib/auth";
import { getMyPortfolioView } from "@/lib/actions/portfolio";
import { isPaid } from "@/lib/plans";
import { PageHeader } from "@/components/app/page-header";
import { EmptyState } from "@/components/app/empty-state";
import { PublishControls } from "@/components/portfolio/publish-controls";
import { PortfolioRenderer } from "@/components/portfolio/portfolio-renderer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export const metadata: Metadata = { title: "Portfólio" };

const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

export default async function PortfolioPage() {
  const session = await auth();
  let portfolio = null;
  try {
    portfolio = await getMyPortfolioView();
  } catch {
    portfolio = null;
  }

  if (!portfolio) {
    return (
      <div className="mx-auto max-w-4xl">
        <PageHeader title="O seu portfólio" description="Visão geral, link público e publicação." />
        <EmptyState
          icon={UserRound}
          title="Ainda não há portfólio criado"
          description="Complete o onboarding para gerar o seu portfólio automaticamente com IA."
          actionHref="/app/onboarding"
          actionLabel="Começar onboarding"
        />
      </div>
    );
  }

  const paid = isPaid(session?.user?.plan ?? "none");

  return (
    <div className="mx-auto max-w-5xl">
      <PageHeader title="O seu portfólio" description="Visão geral, link público e publicação.">
        <Link href="/app/portfolio/editor" className={cn(buttonVariants({ size: "sm" }))}>
          <PencilRuler className="size-4" /> Editar
        </Link>
      </PageHeader>

      <div className="grid gap-6 lg:grid-cols-[1fr_1.2fr]">
        <Card>
          <CardHeader>
            <CardTitle>Publicação</CardTitle>
          </CardHeader>
          <CardContent>
            <PublishControls
              slug={portfolio.slug}
              published={!!portfolio.published}
              isPaid={paid}
              appUrl={appUrl}
            />
          </CardContent>
        </Card>

        <Card className="overflow-hidden">
          <CardHeader>
            <CardTitle>Pré-visualização</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="max-h-[520px] overflow-y-auto border-t">
              <PortfolioRenderer data={portfolio} />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
