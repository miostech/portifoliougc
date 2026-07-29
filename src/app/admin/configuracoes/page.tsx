import type { Metadata } from "next";
import { Cog } from "lucide-react";
import { PageHeader } from "@/components/app/page-header";
import { EmptyState } from "@/components/app/empty-state";

export const metadata: Metadata = { title: "Configurações (admin)" };

export default function AdminSettingsPage() {
  return (
    <div className="mx-auto max-w-4xl">
      <PageHeader
        title="Configurações"
        description="Definições globais da plataforma."
      />
      <EmptyState
        icon={Cog}
        title="Configurações globais na Fase 6"
        description="Definições da plataforma via AdminSetting serão implementadas com o seed."
      />
    </div>
  );
}
