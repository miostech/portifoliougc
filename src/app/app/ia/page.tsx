import type { Metadata } from "next";
import { Sparkles } from "lucide-react";
import { auth } from "@/lib/auth";
import { planHasFeature } from "@/lib/plans";
import { PageHeader } from "@/components/app/page-header";
import { AIAssistant } from "@/components/ia/ai-assistant";

export const metadata: Metadata = { title: "Assistente IA" };

export default async function AssistenteIAPage() {
  const session = await auth();
  const plan = (session?.user as { plan?: string } | undefined)?.plan ?? "none";
  const isPro = planHasFeature(plan as never, "ai_assistant");

  return (
    <div className="mx-auto max-w-3xl">
      <PageHeader
        title="Assistente IA"
        description="Melhore a bio, crie headlines, roteiros e mensagens de prospeção para marcas."
      >
        <Sparkles className="size-5 text-primary opacity-70" />
      </PageHeader>
      <AIAssistant isPro={isPro} />
    </div>
  );
}
