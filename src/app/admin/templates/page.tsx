import type { Metadata } from "next";
import { LayoutTemplate } from "lucide-react";
import { PageHeader } from "@/components/app/page-header";
import { EmptyState } from "@/components/app/empty-state";

export const metadata: Metadata = { title: "Templates (admin)" };

export default function AdminTemplatesPage() {
  return (
    <div className="mx-auto max-w-6xl">
      <PageHeader
        title="Templates"
        description="Crie, edite, duplique, ative e defina se cada template é Essencial ou Pro."
      />
      <EmptyState
        icon={LayoutTemplate}
        title="Gestão de templates na Fase 6"
        description="CRUD de templates com preview e configurações será implementado com o seed."
      />
    </div>
  );
}
