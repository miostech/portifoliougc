import type { Metadata } from "next";
import { loadOnboardingDraft } from "@/lib/actions/onboarding";
import { EMPTY_ONBOARDING } from "@/lib/onboarding-schema";
import { OnboardingWizard } from "@/components/onboarding/onboarding-wizard";

export const metadata: Metadata = { title: "Onboarding" };

export default async function OnboardingPage() {
  let initialData = EMPTY_ONBOARDING;
  let initialAi = null;
  try {
    const draft = await loadOnboardingDraft();
    initialData = draft.data;
    initialAi = draft.ai;
  } catch (err) {
    // DB unavailable — start from an empty draft so the flow is still usable.
    console.error("loadOnboardingDraft failed:", err);
  }

  return (
    <div className="py-2">
      <div className="mb-8 text-center">
        <h1 className="text-2xl font-semibold tracking-tight">
          Vamos montar o seu portfólio
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Responda a algumas perguntas e a IA cria os textos por si.
        </p>
      </div>
      <OnboardingWizard initialData={initialData} initialAi={initialAi} />
    </div>
  );
}
