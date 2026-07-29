"use client";

import { useState, useTransition } from "react";
import { toast } from "sonner";
import {
  Save,
  Monitor,
  Smartphone,
  ArrowUp,
  ArrowDown,
  Eye,
  EyeOff,
  Type,
  LayoutList,
  Palette,
} from "lucide-react";
import type { PortfolioView, SectionView } from "@/lib/portfolio-view";
import { TEMPLATE_LIST } from "@/lib/templates";
import {
  updatePortfolioTexts,
  updatePortfolioTheme,
  updateSections,
} from "@/lib/actions/portfolio";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PortfolioRenderer } from "@/components/portfolio/portfolio-renderer";

const SECTION_LABELS: Record<string, string> = {
  hero: "Cabeçalho",
  about: "Sobre mim",
  specialties: "Especialidades",
  videos: "Vídeos",
  cases: "Cases",
  clients: "Clientes",
  testimonials: "Depoimentos",
  equipment: "Equipamentos",
  contact: "Contacto",
};

const ACCENTS = [
  "oklch(0.55 0.22 285)",
  "oklch(0.62 0.2 330)",
  "oklch(0.72 0.15 25)",
  "oklch(0.62 0.12 230)",
  "oklch(0.6 0.16 160)",
  "oklch(0.55 0.02 285)",
];

export function PortfolioEditor({ initial }: { initial: PortfolioView }) {
  const [view, setView] = useState<PortfolioView>(initial);
  const [device, setDevice] = useState<"desktop" | "mobile">("desktop");
  const [pending, start] = useTransition();

  const patch = (p: Partial<PortfolioView>) => setView((v) => ({ ...v, ...p }));

  function saveTexts() {
    start(async () => {
      const res = await updatePortfolioTexts({
        headline: view.headline ?? "",
        professionalBio: view.professionalBio ?? "",
        aboutMe: view.aboutMe ?? "",
        specialties: view.specialties ?? [],
        brandDescription: view.brandDescription ?? "",
        ctaPrimary: view.ctaPrimary ?? "",
        ctaContact: view.ctaContact ?? "",
      });
      toast[res.ok ? "success" : "error"](res.ok ? "Textos guardados." : res.error ?? "Erro.");
    });
  }

  function saveStyle(next: Partial<PortfolioView>) {
    patch(next);
    start(async () => {
      const res = await updatePortfolioTheme({
        accent: (next.accent ?? view.accent) ?? null,
        font: (next.font ?? view.font) ?? null,
        templateSlug: next.templateSlug ?? view.templateSlug,
      });
      if (!res.ok) toast.error(res.error ?? "Erro.");
    });
  }

  function moveSection(index: number, dir: -1 | 1) {
    const arr = [...view.sections];
    const j = index + dir;
    if (j < 0 || j >= arr.length) return;
    [arr[index], arr[j]] = [arr[j], arr[index]];
    const reordered = arr.map((s, i) => ({ ...s, order: i }));
    patch({ sections: reordered });
    start(async () => {
      await updateSections(reordered);
    });
  }

  function toggleSection(key: string) {
    const reordered = view.sections.map((s) =>
      s.key === key ? { ...s, enabled: !s.enabled } : s
    );
    patch({ sections: reordered });
    start(async () => {
      await updateSections(reordered);
    });
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(340px,420px)_1fr]">
      {/* Controls */}
      <div>
        <Tabs defaultValue="texts">
          <TabsList className="w-full">
            <TabsTrigger value="texts" className="flex-1"><Type className="size-4" /> Textos</TabsTrigger>
            <TabsTrigger value="sections" className="flex-1"><LayoutList className="size-4" /> Seções</TabsTrigger>
            <TabsTrigger value="style" className="flex-1"><Palette className="size-4" /> Estilo</TabsTrigger>
          </TabsList>

          <TabsContent value="texts" className="mt-4 space-y-4">
            <TextField label="Headline" value={view.headline ?? ""} onChange={(v) => patch({ headline: v })} />
            <AreaField label="Bio profissional" value={view.professionalBio ?? ""} onChange={(v) => patch({ professionalBio: v })} />
            <AreaField label="Sobre mim" value={view.aboutMe ?? ""} onChange={(v) => patch({ aboutMe: v })} />
            <TextField
              label="Especialidades (vírgulas)"
              value={(view.specialties ?? []).join(", ")}
              onChange={(v) => patch({ specialties: v.split(",").map((s) => s.trim()).filter(Boolean) })}
            />
            <AreaField label="Apresentação para marcas" value={view.brandDescription ?? ""} onChange={(v) => patch({ brandDescription: v })} />
            <div className="grid grid-cols-2 gap-3">
              <TextField label="CTA principal" value={view.ctaPrimary ?? ""} onChange={(v) => patch({ ctaPrimary: v })} />
              <TextField label="CTA de contacto" value={view.ctaContact ?? ""} onChange={(v) => patch({ ctaContact: v })} />
            </div>
            <Button onClick={saveTexts} disabled={pending} className="w-full">
              <Save className="size-4" /> Guardar textos
            </Button>
          </TabsContent>

          <TabsContent value="sections" className="mt-4 space-y-2">
            <p className="text-sm text-muted-foreground">Ative, desative e reordene as seções.</p>
            {view.sections.map((s, i) => (
              <SectionRow
                key={s.key}
                section={s}
                first={i === 0}
                last={i === view.sections.length - 1}
                onUp={() => moveSection(i, -1)}
                onDown={() => moveSection(i, 1)}
                onToggle={() => toggleSection(s.key)}
              />
            ))}
          </TabsContent>

          <TabsContent value="style" className="mt-4 space-y-6">
            <div className="space-y-2">
              <Label>Template</Label>
              <div className="grid grid-cols-2 gap-2">
                {TEMPLATE_LIST.map((t) => (
                  <button
                    key={t.slug}
                    type="button"
                    onClick={() => saveStyle({ templateSlug: t.slug })}
                    className={cn(
                      "rounded-lg border p-2 text-left text-sm transition-colors",
                      view.templateSlug === t.slug ? "border-primary ring-1 ring-primary/30" : "hover:bg-accent"
                    )}
                  >
                    <div className="mb-1 h-10 rounded" style={{ backgroundImage: `linear-gradient(135deg, ${t.preview.from}, ${t.preview.to})` }} />
                    {t.name}
                  </button>
                ))}
              </div>
            </div>
            <div className="space-y-2">
              <Label>Cor de destaque</Label>
              <div className="flex flex-wrap gap-2">
                {ACCENTS.map((a) => (
                  <button
                    key={a}
                    type="button"
                    aria-label={`Cor ${a}`}
                    onClick={() => saveStyle({ accent: a })}
                    className={cn("size-8 rounded-full ring-offset-2", view.accent === a && "ring-2 ring-foreground")}
                    style={{ backgroundColor: a }}
                  />
                ))}
                <button
                  type="button"
                  onClick={() => saveStyle({ accent: null })}
                  className="rounded-full border px-3 text-xs text-muted-foreground"
                >
                  Padrão
                </button>
              </div>
            </div>
            <div className="space-y-2">
              <Label>Tipografia dos títulos</Label>
              <div className="flex gap-2">
                {[
                  { v: "sans", l: "Moderna" },
                  { v: "serif", l: "Editorial" },
                ].map((f) => (
                  <button
                    key={f.v}
                    type="button"
                    onClick={() => saveStyle({ font: f.v })}
                    className={cn(
                      "flex-1 rounded-lg border py-2 text-sm",
                      (view.font ?? "sans") === f.v ? "border-primary ring-1 ring-primary/30" : "hover:bg-accent"
                    )}
                  >
                    {f.l}
                  </button>
                ))}
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Live preview */}
      <div>
        <div className="mb-3 flex items-center justify-between">
          <span className="text-sm text-muted-foreground">Pré-visualização em tempo real</span>
          <div className="flex gap-1 rounded-lg border p-0.5">
            <button
              type="button"
              aria-label="Desktop"
              onClick={() => setDevice("desktop")}
              className={cn("rounded-md p-1.5", device === "desktop" && "bg-accent")}
            >
              <Monitor className="size-4" />
            </button>
            <button
              type="button"
              aria-label="Mobile"
              onClick={() => setDevice("mobile")}
              className={cn("rounded-md p-1.5", device === "mobile" && "bg-accent")}
            >
              <Smartphone className="size-4" />
            </button>
          </div>
        </div>
        <div className="rounded-2xl border bg-muted/30 p-4">
          <div
            className={cn(
              "mx-auto overflow-hidden rounded-xl border bg-white shadow-sm transition-all",
              device === "mobile" ? "max-w-[380px]" : "max-w-full"
            )}
          >
            <div className="max-h-[70dvh] overflow-y-auto">
              <PortfolioRenderer data={view} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function TextField({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <div className="space-y-2">
      <Label className="flex flex-col items-stretch gap-2 font-normal">
        <span className="font-medium text-foreground">{label}</span>
        <Input value={value} onChange={(e) => onChange(e.target.value)} />
      </Label>
    </div>
  );
}

function AreaField({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <div className="space-y-2">
      <Label className="flex flex-col items-stretch gap-2 font-normal">
        <span className="font-medium text-foreground">{label}</span>
        <Textarea rows={3} value={value} onChange={(e) => onChange(e.target.value)} />
      </Label>
    </div>
  );
}

function SectionRow({
  section,
  first,
  last,
  onUp,
  onDown,
  onToggle,
}: {
  section: SectionView;
  first: boolean;
  last: boolean;
  onUp: () => void;
  onDown: () => void;
  onToggle: () => void;
}) {
  const isHero = section.key === "hero";
  return (
    <div className="flex items-center gap-2 rounded-lg border bg-card px-3 py-2">
      <div className="flex flex-col">
        <button type="button" aria-label="Subir" disabled={first} onClick={onUp} className="text-muted-foreground disabled:opacity-30">
          <ArrowUp className="size-3.5" />
        </button>
        <button type="button" aria-label="Descer" disabled={last} onClick={onDown} className="text-muted-foreground disabled:opacity-30">
          <ArrowDown className="size-3.5" />
        </button>
      </div>
      <span className="flex-1 text-sm">{SECTION_LABELS[section.key] ?? section.key}</span>
      {isHero ? (
        <span className="text-xs text-muted-foreground">Fixo</span>
      ) : (
        <div className="flex items-center gap-2">
          {section.enabled ? <Eye className="size-4 text-muted-foreground" /> : <EyeOff className="size-4 text-muted-foreground" />}
          <Switch checked={section.enabled} onCheckedChange={onToggle} aria-label={`Mostrar ${section.key}`} />
        </div>
      )}
    </div>
  );
}
