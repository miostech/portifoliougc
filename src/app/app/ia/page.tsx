import type { Metadata } from "next";
import { Sparkles } from "lucide-react";
import { PageHeader } from "@/components/app/page-header";
import { EmptyState } from "@/components/app/empty-state";

export const metadata: Metadata = { title: "Assistente IA" };

export default function AssistenteIAPage() {
  return (
    <div className="mx-auto max-w-4xl">
      <PageHeader
        title="Assistente IA"
        description="Melhore a bio, crie headlines, roteiros e mensagens de prospeção para marcas."
      />
      <EmptyState
        icon={Sparkles}
        title="Assistente a caminho"
        description="O chat com ações rápidas e histórico chega na Fase 5. No modo demo, respostas são simuladas."
        actionHref="/app"
        actionLabel="Voltar ao painel"
      />
    </div>
  );
}
