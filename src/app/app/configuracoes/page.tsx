import type { Metadata } from "next";
import { Settings } from "lucide-react";
import { PageHeader } from "@/components/app/page-header";
import { EmptyState } from "@/components/app/empty-state";

export const metadata: Metadata = { title: "Configurações" };

export default function ConfiguracoesPage() {
  return (
    <div className="mx-auto max-w-3xl">
      <PageHeader
        title="Configurações"
        description="Dados pessoais, conta, segurança, redes, domínio, idioma e notificações."
      />
      <EmptyState
        icon={Settings}
        title="Configurações em breve"
        description="As páginas de conta, segurança e preferências serão detalhadas ao longo das próximas fases."
        actionHref="/app"
        actionLabel="Voltar ao painel"
      />
    </div>
  );
}
