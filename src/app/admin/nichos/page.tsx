import type { Metadata } from "next";
import { Tags } from "lucide-react";
import { PageHeader } from "@/components/app/page-header";
import { EmptyState } from "@/components/app/empty-state";

export const metadata: Metadata = { title: "Nichos (admin)" };

export default function AdminNichesPage() {
  return (
    <div className="mx-auto max-w-5xl">
      <PageHeader
        title="Nichos"
        description="Gerencie os nichos usados no onboarding, na biblioteca e nos filtros."
      />
      <EmptyState
        icon={Tags}
        title="Gestão de nichos na Fase 6"
        description="CRUD de nichos será implementado com o seed inicial."
      />
    </div>
  );
}
