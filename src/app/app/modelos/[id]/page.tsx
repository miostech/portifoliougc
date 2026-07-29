import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  Clock,
  Video,
  VideoOff,
  Gauge,
  Wrench,
} from "lucide-react";
import { getVideoModel, DIFFICULTY_LABELS } from "@/lib/video-models";
import { getFavouriteIds } from "@/lib/actions/video";
import { buttonVariants } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ModelActions } from "@/components/video/model-actions";
import { cn } from "@/lib/utils";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const model = getVideoModel(id);
  return { title: model ? model.title : "Modelo de vídeo" };
}

export default async function ModeloDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const model = getVideoModel(id);
  if (!model) notFound();

  let favourited = false;
  try {
    favourited = (await getFavouriteIds()).includes(id);
  } catch {
    favourited = false;
  }

  return (
    <div className="mx-auto max-w-3xl">
      <Link href="/app/modelos" className={cn(buttonVariants({ variant: "ghost", size: "sm" }), "mb-4")}>
        <ArrowLeft className="size-4" /> Voltar aos modelos
      </Link>

      <div
        className="mb-6 flex aspect-[21/9] items-end rounded-2xl p-6"
        style={{ backgroundImage: `linear-gradient(135deg, ${model.preview.from}, ${model.preview.to})` }}
      >
        <div className="flex flex-wrap gap-2">
          <Badge className="bg-black/40 text-white backdrop-blur">{model.format}</Badge>
          <Badge className="bg-black/40 text-white backdrop-blur">{model.niche}</Badge>
        </div>
      </div>

      <h1 className="text-2xl font-semibold tracking-tight">{model.title}</h1>
      <p className="mt-2 text-muted-foreground">{model.description}</p>

      <div className="mt-4 flex flex-wrap gap-4 text-sm text-muted-foreground">
        <span className="inline-flex items-center gap-1.5"><Clock className="size-4" /> {model.durationSeconds}s</span>
        <span className="inline-flex items-center gap-1.5"><Gauge className="size-4" /> {DIFFICULTY_LABELS[model.difficulty]}</span>
        <span className="inline-flex items-center gap-1.5">
          {model.onCamera ? <Video className="size-4" /> : <VideoOff className="size-4" />}
          {model.onCamera ? "Com aparição" : "Sem aparição"}
        </span>
        <span className="inline-flex items-center gap-1.5"><Wrench className="size-4" /> {model.equipment.join(", ")}</span>
      </div>

      <div className="mt-6">
        <ModelActions model={model} initiallyFavourited={favourited} />
      </div>

      <div className="mt-8 space-y-6">
        <Section title="Objetivo"><p>{model.objective}</p></Section>
        <Section title="Gancho"><p className="font-medium">{model.hook}</p></Section>
        <Section title="Roteiro"><p>{model.script}</p></Section>

        <Section title="Cenas">
          <ol className="space-y-3">
            {model.scenes.map((s) => (
              <li key={s.order} className="rounded-lg border bg-card p-3">
                <div className="flex items-baseline gap-2">
                  <span className="font-semibold text-primary">{s.order}.</span>
                  <div>
                    <p className="font-medium">{s.description}</p>
                    <p className="text-sm text-muted-foreground">{s.shot}</p>
                    {s.line && <p className="mt-1 text-sm italic">“{s.line}”</p>}
                  </div>
                </div>
              </li>
            ))}
          </ol>
        </Section>

        <div className="grid gap-6 sm:grid-cols-2">
          <Section title="Enquadramento"><p>{model.framing}</p></Section>
          <Section title="Iluminação"><p>{model.lighting}</p></Section>
          <Section title="Edição"><p>{model.editing}</p></Section>
          <Section title="CTA"><p>{model.cta}</p></Section>
        </div>

        {model.voiceOver && (
          <Section title="Texto de voice-over">
            <p className="rounded-lg bg-muted/50 p-3 italic">{model.voiceOver}</p>
          </Section>
        )}

        <Section title="Legenda sugerida">
          <p className="rounded-lg bg-muted/50 p-3">{model.caption}</p>
        </Section>

        <Section title="Dicas de gravação">
          <ul className="list-disc space-y-1 pl-5 text-muted-foreground">
            {model.tips.map((t, i) => <li key={i}>{t}</li>)}
          </ul>
        </Section>
      </div>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section>
      <h2 className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">{title}</h2>
      <div className="text-sm leading-relaxed">{children}</div>
    </section>
  );
}
