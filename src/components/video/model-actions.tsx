"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Heart, ClipboardPlus, Sparkles, Loader2, Copy, Wand2 } from "lucide-react";
import type { VideoModel } from "@/lib/video-models";
import type { GeneratedScriptResult } from "@/lib/services/ai";
import {
  addToPlan,
  customizeScript,
  toggleFavourite,
  type ScriptFormInput,
} from "@/lib/actions/video";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export function ModelActions({
  model,
  initiallyFavourited,
}: {
  model: VideoModel;
  initiallyFavourited: boolean;
}) {
  const [fav, setFav] = useState(initiallyFavourited);
  const [pending, start] = useTransition();

  function onFav() {
    setFav((v) => !v);
    start(async () => {
      const res = await toggleFavourite(model.id);
      if (!res.ok) toast.error(res.error ?? "Erro.");
    });
  }

  function onWantToRecord() {
    start(async () => {
      const res = await addToPlan({ sourceModelId: model.id, title: model.title });
      if (!res.ok) {
        toast.error(res.error ?? "Não foi possível adicionar.");
        return;
      }
      toast.success("Adicionado ao plano de gravação!");
    });
  }

  return (
    <div className="flex flex-wrap gap-2">
      <Button variant={fav ? "secondary" : "outline"} onClick={onFav} disabled={pending}>
        <Heart className={cn("size-4", fav && "fill-red-400 text-red-400")} />
        {fav ? "Guardado" : "Guardar nos favoritos"}
      </Button>
      <Button variant="outline" onClick={onWantToRecord} disabled={pending}>
        <ClipboardPlus className="size-4" /> Quero gravar este vídeo
      </Button>
      <ScriptDialog model={model} />
    </div>
  );
}

function ScriptDialog({ model }: { model: VideoModel }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [pending, start] = useTransition();
  const [script, setScript] = useState<GeneratedScriptResult | null>(null);
  const [scriptId, setScriptId] = useState<string | undefined>();

  const [form, setForm] = useState<ScriptFormInput>({
    sourceModelId: model.id,
    baseModelTitle: model.title,
    product: "",
    brand: "",
    niche: model.niche,
    audience: "",
    mainBenefit: "",
    problemSolved: "",
    tone: "",
    durationSeconds: model.durationSeconds,
    onCamera: model.onCamera,
    objective: model.objective,
    platform: "",
  });

  const set = <K extends keyof ScriptFormInput>(k: K, v: ScriptFormInput[K]) =>
    setForm((f) => ({ ...f, [k]: v }));

  async function generate() {
    if (!form.product?.trim()) {
      toast.error("Informe o produto.");
      return;
    }
    setGenerating(true);
    const res = await customizeScript(form);
    setGenerating(false);
    if (!res.ok || !res.script) {
      toast.error(res.error ?? "Falha ao gerar.");
      return;
    }
    setScript(res.script);
    setScriptId(res.scriptId);
  }

  function addGeneratedToPlan() {
    if (!script) return;
    start(async () => {
      const res = await addToPlan({
        sourceModelId: model.id,
        title: script.title,
        product: form.product,
        brand: form.brand,
        generatedScriptId: scriptId ?? null,
      });
      if (!res.ok) {
        toast.error(res.error ?? "Erro.");
        return;
      }
      toast.success("Roteiro adicionado ao plano!");
      setOpen(false);
      router.refresh();
    });
  }

  function exportScript() {
    if (!script) return;
    const text = [
      `${script.title}`,
      `\nObjetivo: ${script.objective}`,
      `\nGancho: ${script.hook}`,
      `\nRoteiro: ${script.script}`,
      `\nCenas:`,
      ...script.scenes.map((s) => `  ${s.order}. ${s.description} — ${s.shot}${s.line ? ` | ${s.line}` : ""}`),
      `\nVoice-over: ${script.voiceOver}`,
      `\nEnquadramento: ${script.framing}`,
      `\nCTA: ${script.cta}`,
      `\nLegenda: ${script.caption}`,
      `\nDicas:`,
      ...script.recordingTips.map((t) => `  - ${t}`),
    ].join("\n");
    navigator.clipboard?.writeText(text);
    toast.success("Roteiro copiado!");
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={<Button />}>
        <Sparkles className="size-4" /> Personalizar roteiro com IA
      </DialogTrigger>
      <DialogContent className="max-h-[90dvh] overflow-y-auto sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Personalizar roteiro com IA</DialogTitle>
          <DialogDescription>
            Baseado em “{model.title}”. Preencha os detalhes e a IA adapta o roteiro ao seu produto.
          </DialogDescription>
        </DialogHeader>

        {!script ? (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <FormField label="Produto *"><Input value={form.product} onChange={(e) => set("product", e.target.value)} placeholder="Ex.: sérum facial" /></FormField>
              <FormField label="Marca"><Input value={form.brand} onChange={(e) => set("brand", e.target.value)} placeholder="Ex.: Glowly" /></FormField>
              <FormField label="Nicho"><Input value={form.niche} onChange={(e) => set("niche", e.target.value)} /></FormField>
              <FormField label="Público"><Input value={form.audience} onChange={(e) => set("audience", e.target.value)} placeholder="Ex.: mulheres 25-35" /></FormField>
              <FormField label="Benefício principal"><Input value={form.mainBenefit} onChange={(e) => set("mainBenefit", e.target.value)} /></FormField>
              <FormField label="Problema resolvido"><Input value={form.problemSolved} onChange={(e) => set("problemSolved", e.target.value)} /></FormField>
              <FormField label="Tom"><Input value={form.tone} onChange={(e) => set("tone", e.target.value)} placeholder="Ex.: próximo e honesto" /></FormField>
              <FormField label="Plataforma"><Input value={form.platform} onChange={(e) => set("platform", e.target.value)} placeholder="Ex.: TikTok" /></FormField>
            </div>
            <div className="flex items-center gap-4">
              <label className="flex items-center gap-2 text-sm">
                <input type="checkbox" checked={form.onCamera} onChange={(e) => set("onCamera", e.target.checked)} /> Com aparição
              </label>
              <div className="flex items-center gap-2 text-sm">
                <span>Duração (s):</span>
                <Input type="number" value={form.durationSeconds ?? 30} onChange={(e) => set("durationSeconds", Number(e.target.value))} className="h-8 w-20" />
              </div>
            </div>
            <Button onClick={generate} disabled={generating} className="w-full">
              {generating ? <><Loader2 className="size-4 animate-spin" /> A gerar roteiro…</> : <><Wand2 className="size-4" /> Gerar roteiro</>}
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            <ScriptResult script={script} />
            <div className="flex flex-wrap gap-2">
              <Button onClick={addGeneratedToPlan} disabled={pending}>
                <ClipboardPlus className="size-4" /> Adicionar ao plano
              </Button>
              <Button variant="outline" onClick={exportScript}>
                <Copy className="size-4" /> Exportar texto
              </Button>
              <Button variant="ghost" onClick={() => setScript(null)}>Editar dados</Button>
              <Button variant="ghost" onClick={generate} disabled={generating}>
                <Sparkles className="size-4" /> Regenerar
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}

function ScriptResult({ script }: { script: GeneratedScriptResult }) {
  return (
    <div className="space-y-3 rounded-xl border bg-muted/30 p-4 text-sm">
      <h3 className="text-base font-semibold">{script.title}</h3>
      <Row label="Objetivo" value={script.objective} />
      <Row label="Gancho" value={script.hook} />
      <Row label="Roteiro" value={script.script} />
      <div>
        <p className="font-medium">Cenas</p>
        <ol className="mt-1 space-y-1">
          {script.scenes.map((s) => (
            <li key={s.order} className="text-muted-foreground">
              <span className="font-medium text-foreground">{s.order}.</span> {s.description} — <em>{s.shot}</em>
              {s.line ? ` · “${s.line}”` : ""}
            </li>
          ))}
        </ol>
      </div>
      <Row label="Voice-over" value={script.voiceOver} />
      <Row label="Enquadramento" value={script.framing} />
      <Row label="CTA" value={script.cta} />
      <Row label="Legenda" value={script.caption} />
      <div>
        <p className="font-medium">Dicas de gravação</p>
        <ul className="mt-1 list-disc pl-5 text-muted-foreground">
          {script.recordingTips.map((t, i) => <li key={i}>{t}</li>)}
        </ul>
      </div>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  if (!value) return null;
  return (
    <div>
      <p className="font-medium">{label}</p>
      <p className="text-muted-foreground">{value}</p>
    </div>
  );
}

function FormField({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <Label className="text-xs">{label}</Label>
      {children}
    </div>
  );
}
