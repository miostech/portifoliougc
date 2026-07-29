import type { Metadata } from "next";
import { PencilRuler } from "lucide-react";
import { getMyPortfolioView } from "@/lib/actions/portfolio";
import { PageHeader } from "@/components/app/page-header";
import { EmptyState } from "@/components/app/empty-state";
import { PortfolioEditor } from "@/components/portfolio/portfolio-editor";

export const metadata: Metadata = { title: "Editor" };

export default async function EditorPage() {
  let portfolio = null;
  try {
    portfolio = await getMyPortfolioView();
  } catch {
    portfolio = null;
  }

  return (
    <div className="mx-auto max-w-6xl">
      <PageHeader
        title="Editor de portfólio"
        description="Edite textos, ative e reordene seções, e ajuste o estilo — com pré-visualização em tempo real."
      />
      {portfolio ? (
        <PortfolioEditor initial={portfolio} />
      ) : (
        <EmptyState
          icon={PencilRuler}
          title="Nenhum portfólio para editar"
          description="Complete o onboarding para gerar o seu portfólio e depois personalize-o aqui."
          actionHref="/app/onboarding"
          actionLabel="Começar onboarding"
        />
      )}
    </div>
  );
}
