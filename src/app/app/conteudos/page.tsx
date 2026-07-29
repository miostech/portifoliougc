import type { Metadata } from "next";
import { Images } from "lucide-react";
import { listContent } from "@/lib/actions/content";
import { PageHeader } from "@/components/app/page-header";
import { EmptyState } from "@/components/app/empty-state";
import { ContentManager } from "@/components/content/content-manager";

export const metadata: Metadata = { title: "Conteúdos" };

export default async function ConteudosPage() {
  let bundle = null;
  try {
    bundle = await listContent();
  } catch {
    bundle = null;
  }

  return (
    <div className="mx-auto max-w-5xl">
      <PageHeader
        title="Conteúdos"
        description="Vídeos, fotografias, cases, depoimentos e clientes. O upload gera título, descrição e thumbnail com IA."
      />
      {bundle ? (
        <ContentManager initial={bundle} />
      ) : (
        <EmptyState
          icon={Images}
          title="Não foi possível carregar"
          description="Verifique a ligação à base de dados e tente novamente."
          actionHref="/app/onboarding"
          actionLabel="Completar perfil"
        />
      )}
    </div>
  );
}
