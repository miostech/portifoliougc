import type { Metadata } from "next";
import { ScrollText } from "lucide-react";
import { PageHeader } from "@/components/app/page-header";
import { EmptyState } from "@/components/app/empty-state";

export const metadata: Metadata = { title: "Prompts de IA (admin)" };

export default function AdminPromptsPage() {
  return (
    <div className="mx-auto max-w-4xl">
      <PageHeader
        title="Prompts de IA"
        description="Edite os prompts de bio, headline, roteiros, títulos, score e sugestões."
      />
      <EmptyState
        icon={ScrollText}
        title="Gestão de prompts na Fase 6"
        description="Editor dos prompts usados pelo serviço de IA será implementado com o AdminSetting."
      />
    </div>
  );
}
