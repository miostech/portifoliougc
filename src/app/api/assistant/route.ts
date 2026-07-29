import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { planHasFeature } from "@/lib/plans";
import { getAIProvider } from "@/lib/services/ai";

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Não autenticado." }, { status: 401 });
  }

  const plan = (session.user as { plan?: string }).plan ?? "none";
  if (!planHasFeature(plan as never, "ai_assistant")) {
    return NextResponse.json(
      { error: "Assistente IA disponível apenas no plano Pro." },
      { status: 403 }
    );
  }

  let body: { action?: string; prompt?: string };
  try {
    body = (await req.json()) as { action?: string; prompt?: string };
  } catch {
    return NextResponse.json({ error: "Payload inválido." }, { status: 400 });
  }

  const action = body.action?.trim() || "pergunta";
  const prompt = body.prompt?.trim() || "";
  if (!prompt) {
    return NextResponse.json({ error: "Prompt obrigatório." }, { status: 400 });
  }

  const ai = getAIProvider();
  const result = await ai.runAssistant({ action, prompt });
  return NextResponse.json({ text: result.text });
}
