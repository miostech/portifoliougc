import type { Metadata } from "next";
import { CreditCard } from "lucide-react";
import { PageHeader } from "@/components/app/page-header";
import { EmptyState } from "@/components/app/empty-state";

export const metadata: Metadata = { title: "Assinaturas (admin)" };

export default function AdminSubscriptionsPage() {
  return (
    <div className="mx-auto max-w-6xl">
      <PageHeader
        title="Assinaturas"
        description="Acompanhe planos, estados, receita simulada e cancelamentos."
      />
      <EmptyState
        icon={CreditCard}
        title="Gestão de assinaturas na Fase 6"
        description="Lista de assinaturas e métricas de receita serão implementadas com o seed."
      />
    </div>
  );
}
