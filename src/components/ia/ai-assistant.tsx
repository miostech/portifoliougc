"use client";

import { useRef, useState, useTransition } from "react";
import { toast } from "sonner";
import { Send, Loader2, Sparkles, Bot, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

interface Message {
  role: "user" | "assistant";
  text: string;
}

const QUICK_ACTIONS = [
  { label: "Melhorar bio", action: "melhorar-bio", prompt: "Melhora a minha bio de UGC." },
  { label: "Criar headline", action: "criar-headline", prompt: "Cria uma headline profissional para o meu portfólio." },
  { label: "Mensagem para marca", action: "mensagem-marca", prompt: "Escreve uma mensagem de prospeção para uma marca." },
  { label: "Sugestão de nicho", action: "pergunta", prompt: "Que nichos estão em crescimento para UGC este ano?" },
];

async function callAssistant(action: string, prompt: string): Promise<string> {
  const res = await fetch("/api/assistant", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ action, prompt }),
  });
  if (!res.ok) throw new Error("Erro ao contactar assistente.");
  const data = (await res.json()) as { text?: string };
  return data.text ?? "Sem resposta.";
}

export function AIAssistant({ isPro }: { isPro: boolean }) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [pending, start] = useTransition();
  const bottomRef = useRef<HTMLDivElement>(null);

  function scrollToBottom() {
    setTimeout(() => bottomRef.current?.scrollIntoView({ behavior: "smooth" }), 50);
  }

  function send(action: string, prompt: string) {
    if (!prompt.trim()) return;
    const userMsg: Message = { role: "user", text: prompt };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    scrollToBottom();

    start(async () => {
      try {
        const text = await callAssistant(action, prompt);
        setMessages((prev) => [...prev, { role: "assistant", text }]);
        scrollToBottom();
      } catch {
        toast.error("Não foi possível obter resposta.");
      }
    });
  }

  if (!isPro) {
    return (
      <div className="flex flex-col items-center gap-4 rounded-2xl border border-dashed py-16 text-center">
        <Sparkles className="size-10 text-primary opacity-60" />
        <div>
          <p className="font-semibold">Assistente IA disponível no plano Pro</p>
          <p className="mt-1 text-sm text-muted-foreground">
            Melhore a sua bio, crie mensagens de prospeção e peça sugestões personalizadas.
          </p>
        </div>
        <a
          href="/app/assinatura"
          className="inline-flex h-9 items-center gap-2 rounded-lg bg-primary px-4 text-sm font-medium text-primary-foreground hover:bg-primary/90"
        >
          <Sparkles className="size-4" /> Ver plano Pro
        </a>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      {/* Quick actions */}
      <div className="flex flex-wrap gap-2">
        {QUICK_ACTIONS.map((qa) => (
          <button
            key={qa.action + qa.label}
            type="button"
            disabled={pending}
            onClick={() => send(qa.action, qa.prompt)}
            className="rounded-full border bg-card px-3 py-1.5 text-xs font-medium hover:bg-accent disabled:opacity-50"
          >
            {qa.label}
          </button>
        ))}
      </div>

      {/* Messages */}
      <div className="flex min-h-[320px] flex-col gap-3 rounded-2xl border bg-muted/20 p-4">
        {messages.length === 0 && (
          <div className="flex flex-1 flex-col items-center justify-center gap-2 text-center text-muted-foreground">
            <Bot className="size-8 opacity-40" />
            <p className="text-sm">
              Clique numa ação rápida ou escreva a sua pergunta abaixo.
            </p>
          </div>
        )}
        {messages.map((m, i) => (
          <div
            key={i}
            className={cn(
              "flex gap-2",
              m.role === "user" ? "flex-row-reverse" : "flex-row"
            )}
          >
            <div
              className={cn(
                "flex size-7 shrink-0 items-center justify-center rounded-full",
                m.role === "user"
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground"
              )}
            >
              {m.role === "user" ? <User className="size-3.5" /> : <Bot className="size-3.5" />}
            </div>
            <div
              className={cn(
                "max-w-[80%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed",
                m.role === "user"
                  ? "rounded-tr-sm bg-primary text-primary-foreground"
                  : "rounded-tl-sm bg-card border"
              )}
            >
              {m.text}
            </div>
          </div>
        ))}
        {pending && (
          <div className="flex gap-2">
            <div className="flex size-7 shrink-0 items-center justify-center rounded-full bg-muted">
              <Bot className="size-3.5 text-muted-foreground" />
            </div>
            <div className="flex items-center gap-1.5 rounded-2xl rounded-tl-sm border bg-card px-4 py-2.5">
              <Loader2 className="size-3.5 animate-spin text-muted-foreground" />
              <span className="text-xs text-muted-foreground">A pensar…</span>
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="flex gap-2">
        <Textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Pergunte qualquer coisa ao assistente…"
          className="min-h-[64px] resize-none"
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              send("pergunta", input);
            }
          }}
        />
        <Button
          onClick={() => send("pergunta", input)}
          disabled={!input.trim() || pending}
          className="self-end"
        >
          <Send className="size-4" />
        </Button>
      </div>
      <p className="text-xs text-muted-foreground">
        Em modo demo, as respostas são simuladas. Ligue a chave de IA para respostas reais.
      </p>
    </div>
  );
}
