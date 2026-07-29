import type { Metadata } from "next";
import Link from "next/link";
import { listPlan, type PlanItem } from "@/lib/actions/video";
import { PageHeader } from "@/components/app/page-header";
import { RecordingPlan } from "@/components/video/recording-plan";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export const metadata: Metadata = { title: "Plano de gravação" };

export default async function PlanoDeGravacaoPage() {
  let items: PlanItem[] = [];
  try {
    items = await listPlan();
  } catch {
    items = [];
  }

  return (
    <div className="mx-auto max-w-6xl">
      <PageHeader
        title="Plano de gravação"
        description="Acompanhe os conteúdos que quer produzir, do “quero gravar” ao “no portfólio”."
      >
        <Link href="/app/modelos" className={cn(buttonVariants({ size: "sm" }))}>
          Explorar modelos
        </Link>
      </PageHeader>
      <RecordingPlan initial={items} />
    </div>
  );
}
