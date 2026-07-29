import type { Metadata } from "next";
import { Users } from "lucide-react";
import { PageHeader } from "@/components/app/page-header";
import { EmptyState } from "@/components/app/empty-state";

export const metadata: Metadata = { title: "Utilizadores" };

export default function AdminUsersPage() {
  return (
    <div className="mx-auto max-w-6xl">
      <PageHeader
        title="Utilizadores"
        description="Pesquise, filtre, altere planos, suspenda ou promova utilizadores."
      />
      <EmptyState
        icon={Users}
        title="Gestão de utilizadores na Fase 6"
        description="A tabela com pesquisa, filtros e ações administrativas será implementada com o seed."
      />
    </div>
  );
}
