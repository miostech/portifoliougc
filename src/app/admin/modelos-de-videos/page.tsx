import type { Metadata } from "next";
import { Film } from "lucide-react";
import { PageHeader } from "@/components/app/page-header";
import { EmptyState } from "@/components/app/empty-state";

export const metadata: Metadata = { title: "Modelos de vídeos (admin)" };

export default function AdminVideoModelsPage() {
  return (
    <div className="mx-auto max-w-6xl">
      <PageHeader
        title="Modelos de vídeos"
        description="Crie e organize modelos UGC: roteiro, cenas, equipamentos, nichos e plano necessário."
      />
      <EmptyState
        icon={Film}
        title="Gestão de modelos na Fase 6"
        description="CRUD completo dos modelos da biblioteca será implementado com o seed."
      />
    </div>
  );
}
