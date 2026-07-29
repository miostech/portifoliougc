"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { toast } from "sonner";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  Loader2,
  Sparkles,
  Wand2,
} from "lucide-react";
import {
  AGE_RANGES,
  BRAND_SEGMENTS,
  COMMUNICATION_STYLES,
  CONTENT_TYPES,
  EQUIPMENT,
  EXPERIENCE_LEVELS,
  LANGUAGES,
  NICHES,
  SOCIAL_PLATFORMS,
} from "@/lib/onboarding-options";
import { TEMPLATE_LIST } from "@/lib/templates";
import {
  finishOnboarding,
  generateCopy,
  saveOnboardingDraft,
} from "@/lib/actions/onboarding";
import type { AiCopyData, OnboardingData } from "@/lib/onboarding-schema";
import { slugify } from "@/lib/slug";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Progress } from "@/components/ui/progress";
import { ChipMultiSelect, ChipSingleSelect } from "@/components/onboarding/fields";
import { PortfolioRenderer } from "@/components/portfolio/portfolio-renderer";
import { resolveSections } from "@/lib/portfolio-view";

const STEPS = [
  "Informações pessoais",
  "Perfil profissional",
  "Redes sociais",
  "Equipamentos",
  "Estilo do portfólio",
  "Geração com IA",
];

export function OnboardingWizard({
  initialData,
  initialAi,
}: {
  initialData: OnboardingData;
  initialAi: AiCopyData | null;
}) {
  const router = useRouter();
  const { update } = useSession();
  const [step, setStep] = useState(0);
  const [data, setData] = useState<OnboardingData>(initialData);
  const [ai, setAi] = useState<AiCopyData | null>(initialAi);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [saving, startSaving] = useTransition();
  const [generating, setGenerating] = useState(false);

  const isFinal = step === STEPS.length; // 6 = preview/publish screen
  const progress = Math.round(((Math.min(step, STEPS.length) + 1) / STEPS.length) * 100);

  function set<K extends keyof OnboardingData>(key: K, value: OnboardingData[K]) {
    setData((d) => ({ ...d, [key]: value }));
  }

  function validateStep(current: number): boolean {
    const e: Record<string, string> = {};
    if (current === 0) {
      if (data.fullName.trim().length < 2) e.fullName = "Informe o seu nome.";
      if (data.username.trim().length < 3) e.username = "Escolha um nome de utilizador.";
      else if (!/^[a-z0-9-]+$/i.test(data.username))
        e.username = "Use apenas letras, números e hífen.";
    }
    if (current === 1 && data.niches.length === 0) {
      e.niches = "Escolha pelo menos um nicho.";
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  function persist(next: number) {
    startSaving(async () => {
      const res = await saveOnboardingDraft(data);
      if (!res.ok) {
        if (res.fieldErrors) setErrors(res.fieldErrors);
        toast.error(res.error ?? "Verifique os campos.");
        return;
      }
      if (res.slug && res.slug !== data.username) {
        set("username", res.slug);
        toast.info(`O seu link ficou: /p/${res.slug}`);
      }
      setStep(next);
    });
  }

  function handleNext() {
    if (!validateStep(step)) return;
    if (step < STEPS.length - 1) {
      persist(step + 1);
    } else if (step === STEPS.length - 1) {
      // Leaving the AI step → finish and go to preview.
      handleFinish();
    }
  }

  async function runGenerate() {
    setGenerating(true);
    const res = await generateCopy();
    setGenerating(false);
    if (!res.ok || !res.copy) {
      toast.error(res.error ?? "Falha ao gerar.");
      return;
    }
    setAi(res.copy);
  }

  function handleFinish() {
    if (!ai) {
      toast.error("Gere os textos com IA primeiro.");
      return;
    }
    startSaving(async () => {
      const res = await finishOnboarding(ai);
      if (!res.ok) {
        toast.error(res.error ?? "Não foi possível concluir.");
        return;
      }
      await update({ onboarded: true });
      setStep(STEPS.length); // final screen
      toast.success("Portfólio criado!");
    });
  }

  return (
    <div className="mx-auto max-w-2xl">
      {/* Progress */}
      {!isFinal && (
        <div className="mb-8">
          <div className="mb-2 flex items-center justify-between text-sm">
            <span className="font-medium">
              Passo {step + 1} de {STEPS.length}
            </span>
            <span className="text-muted-foreground">{STEPS[step]}</span>
          </div>
          <Progress value={progress} />
        </div>
      )}

      {step === 0 && (
        <StepCard title="Vamos começar por si" subtitle="Estas informações abrem o seu portfólio.">
          <Field label="Nome profissional" error={errors.fullName}>
            <Input
              value={data.fullName}
              onChange={(e) => {
                set("fullName", e.target.value);
                if (!data.username) set("username", slugify(e.target.value));
              }}
              placeholder="Ex.: Mariana Costa"
            />
          </Field>
          <Field
            label="Nome de utilizador (link público)"
            error={errors.username}
            hint={`O seu portfólio: /p/${slugify(data.username) || "o-seu-nome"}`}
          >
            <Input
              value={data.username}
              onChange={(e) => set("username", e.target.value)}
              placeholder="mariana-costa"
            />
          </Field>
          <Field label="Foto (URL, opcional)" hint="O upload de ficheiro chega na próxima fase.">
            <Input
              value={data.photo ?? ""}
              onChange={(e) => set("photo", e.target.value)}
              placeholder="https://…"
            />
          </Field>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Cidade">
              <Input value={data.city} onChange={(e) => set("city", e.target.value)} placeholder="Lisboa" />
            </Field>
            <Field label="País">
              <Input value={data.country} onChange={(e) => set("country", e.target.value)} placeholder="Portugal" />
            </Field>
          </div>
          <Field label="Idiomas">
            <ChipMultiSelect options={LANGUAGES} value={data.languages} onChange={(v) => set("languages", v)} />
          </Field>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Faixa etária">
              <ChipSingleSelect options={AGE_RANGES} value={data.ageRange} onChange={(v) => set("ageRange", v)} />
            </Field>
            <Field label="Pronomes (opcional)">
              <Input value={data.pronouns} onChange={(e) => set("pronouns", e.target.value)} placeholder="ela/dela" />
            </Field>
          </div>
        </StepCard>
      )}

      {step === 1 && (
        <StepCard title="O seu perfil profissional" subtitle="Ajuda a IA a escrever textos que soam a si.">
          <Field label="Nichos" error={errors.niches} hint="Escolha os que mais combinam consigo.">
            <ChipMultiSelect options={NICHES} value={data.niches} onChange={(v) => set("niches", v)} max={6} />
          </Field>
          <Field label="Experiência">
            <ChipSingleSelect options={EXPERIENCE_LEVELS} value={data.experience} onChange={(v) => set("experience", v)} />
          </Field>
          <Field label="Tipos de conteúdo">
            <ChipMultiSelect options={CONTENT_TYPES} value={data.contentTypes} onChange={(v) => set("contentTypes", v)} />
          </Field>
          <Field label="Segmentos de marcas de interesse">
            <ChipMultiSelect options={BRAND_SEGMENTS} value={data.brandSegments} onChange={(v) => set("brandSegments", v)} />
          </Field>
          <Field label="Estilo de comunicação">
            <ChipSingleSelect options={COMMUNICATION_STYLES} value={data.communicationStyle} onChange={(v) => set("communicationStyle", v)} />
          </Field>
          <div className="space-y-3 rounded-lg border p-4">
            <ToggleRow
              label="Disponível para viagens"
              checked={data.travelAvailability}
              onChange={(v) => set("travelAvailability", v)}
            />
            <ToggleRow
              label="Disponível para receber produtos"
              checked={data.productAvailability}
              onChange={(v) => set("productAvailability", v)}
            />
          </div>
        </StepCard>
      )}

      {step === 2 && (
        <StepCard title="As suas redes" subtitle="Onde as marcas podem encontrar o seu trabalho.">
          {SOCIAL_PLATFORMS.map((p) => {
            const current = data.socials.find((s) => s.platform === p.key)?.url ?? "";
            return (
              <Field key={p.key} label={p.label}>
                <Input
                  value={current}
                  placeholder={p.placeholder}
                  onChange={(e) => {
                    const others = data.socials.filter((s) => s.platform !== p.key);
                    const url = e.target.value;
                    set("socials", url ? [...others, { platform: p.key, url }] : others);
                  }}
                />
              </Field>
            );
          })}
        </StepCard>
      )}

      {step === 3 && (
        <StepCard title="Os seus equipamentos" subtitle="Mostrar o seu setup transmite profissionalismo.">
          <ChipMultiSelect options={EQUIPMENT} value={data.equipment} onChange={(v) => set("equipment", v)} />
        </StepCard>
      )}

      {step === 4 && (
        <StepCard title="Escolha o estilo" subtitle="Pode trocar de template quando quiser no editor.">
          <div className="grid gap-4 sm:grid-cols-2">
            {TEMPLATE_LIST.map((t) => {
              const active = data.templateSlug === t.slug;
              return (
                <button
                  key={t.slug}
                  type="button"
                  onClick={() => set("templateSlug", t.slug)}
                  className={cn(
                    "overflow-hidden rounded-xl border text-left transition-all",
                    active ? "border-primary ring-2 ring-primary/30" : "border-border hover:border-primary/40"
                  )}
                >
                  <div
                    className="relative aspect-[16/10] w-full"
                    style={{ backgroundImage: `linear-gradient(135deg, ${t.preview.from}, ${t.preview.to})` }}
                  >
                    {active && (
                      <span className="absolute right-2 top-2 flex size-6 items-center justify-center rounded-full bg-primary text-primary-foreground">
                        <Check className="size-4" />
                      </span>
                    )}
                  </div>
                  <div className="p-4">
                    <div className="flex items-center justify-between">
                      <h3 className="font-medium">{t.name}</h3>
                      <span className="text-xs uppercase text-muted-foreground">{t.minPlan}</span>
                    </div>
                    <p className="mt-1 text-sm text-muted-foreground">{t.description}</p>
                  </div>
                </button>
              );
            })}
          </div>
        </StepCard>
      )}

      {step === 5 && (
        <StepCard
          title="A IA vai escrever por si"
          subtitle="Gere os textos e edite o que quiser antes de publicar."
        >
          {!ai ? (
            <div className="flex flex-col items-center justify-center gap-4 rounded-xl border border-dashed py-12 text-center">
              <div className="flex size-14 items-center justify-center rounded-full bg-primary/10 text-primary">
                {generating ? <Loader2 className="size-7 animate-spin" /> : <Wand2 className="size-7" />}
              </div>
              <p className="max-w-sm text-sm text-muted-foreground">
                {generating
                  ? "A criar a sua headline, bio, sobre mim, especialidades e textos para marcas…"
                  : "Vamos usar o seu perfil para gerar todos os textos do portfólio."}
              </p>
              <Button onClick={runGenerate} disabled={generating}>
                <Sparkles className="size-4" />
                {generating ? "A gerar…" : "Gerar textos com IA"}
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              <Field label="Headline">
                <Input value={ai.headline} onChange={(e) => setAi({ ...ai, headline: e.target.value })} />
              </Field>
              <Field label="Bio profissional">
                <Textarea rows={3} value={ai.professionalBio} onChange={(e) => setAi({ ...ai, professionalBio: e.target.value })} />
              </Field>
              <Field label="Sobre mim">
                <Textarea rows={4} value={ai.aboutMe} onChange={(e) => setAi({ ...ai, aboutMe: e.target.value })} />
              </Field>
              <Field label="Especialidades (separadas por vírgula)">
                <Input
                  value={ai.specialties.join(", ")}
                  onChange={(e) => setAi({ ...ai, specialties: e.target.value.split(",").map((s) => s.trim()).filter(Boolean) })}
                />
              </Field>
              <Field label="Apresentação para marcas">
                <Textarea rows={3} value={ai.brandDescription} onChange={(e) => setAi({ ...ai, brandDescription: e.target.value })} />
              </Field>
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="CTA principal">
                  <Input value={ai.ctaPrimary} onChange={(e) => setAi({ ...ai, ctaPrimary: e.target.value })} />
                </Field>
                <Field label="CTA de contacto">
                  <Input value={ai.ctaContact} onChange={(e) => setAi({ ...ai, ctaContact: e.target.value })} />
                </Field>
              </div>
              <Button variant="ghost" size="sm" onClick={runGenerate} disabled={generating}>
                <Sparkles className="size-4" />
                {generating ? "A regenerar…" : "Regenerar tudo"}
              </Button>
            </div>
          )}
        </StepCard>
      )}

      {isFinal && (
        <div className="text-center">
          <div className="mx-auto mb-4 flex size-14 items-center justify-center rounded-full bg-primary/10 text-primary">
            <Check className="size-7" />
          </div>
          <h2 className="text-2xl font-semibold tracking-tight">O seu portfólio está pronto</h2>
          <p className="mt-2 text-muted-foreground">
            Publique agora e comece a enviá-lo às marcas.
          </p>
          <div className="mt-6 overflow-hidden rounded-2xl border shadow-sm">
            <PortfolioRenderer
              data={{
                slug: data.username,
                fullName: data.fullName,
                username: data.username,
                photo: data.photo,
                city: data.city,
                country: data.country,
                languages: data.languages,
                niches: data.niches,
                equipment: data.equipment,
                socials: data.socials,
                templateSlug: data.templateSlug,
                accent: null,
                font: null,
                sections: resolveSections(),
                media: [],
                testimonials: [],
                clients: [],
                cases: [],
                ...(ai ?? {}),
              }}
            />
          </div>
          <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
            <Button onClick={() => router.push("/app/assinatura")}>
              Publicar portfólio
            </Button>
            <Button variant="outline" onClick={() => router.push("/app")}>
              Ir para o painel
            </Button>
          </div>
        </div>
      )}

      {/* Nav */}
      {!isFinal && (
        <div className="mt-8 flex items-center justify-between">
          <Button
            variant="ghost"
            onClick={() => setStep((s) => Math.max(0, s - 1))}
            disabled={step === 0 || saving}
          >
            <ArrowLeft className="size-4" /> Voltar
          </Button>
          <Button onClick={handleNext} disabled={saving || generating}>
            {saving ? (
              <Loader2 className="size-4 animate-spin" />
            ) : step === STEPS.length - 1 ? (
              "Concluir"
            ) : (
              <>
                Continuar <ArrowRight className="size-4" />
              </>
            )}
          </Button>
        </div>
      )}
    </div>
  );
}

function StepCard({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl border bg-card p-6 sm:p-8">
      <div className="mb-6">
        <h2 className="text-xl font-semibold tracking-tight">{title}</h2>
        {subtitle && <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p>}
      </div>
      <div className="space-y-5">{children}</div>
    </div>
  );
}

function Field({
  label,
  hint,
  error,
  children,
}: {
  label: string;
  hint?: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-2">
      {/* Wrapping the control in the label gives implicit association, so
          clicking the label focuses the field — no id wiring needed. */}
      <Label className="flex flex-col items-stretch gap-2 font-normal">
        <span className="font-medium text-foreground">{label}</span>
        {children}
      </Label>
      {error ? (
        <p className="text-xs text-destructive">{error}</p>
      ) : hint ? (
        <p className="text-xs text-muted-foreground">{hint}</p>
      ) : null}
    </div>
  );
}

function ToggleRow({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-sm">{label}</span>
      <Switch checked={checked} onCheckedChange={onChange} aria-label={label} />
    </div>
  );
}
