import type { Metadata } from "next";
import { VIDEO_MODELS, MODEL_NICHES, MODEL_FORMATS } from "@/lib/video-models";
import { PageHeader } from "@/components/app/page-header";

export const metadata: Metadata = { title: "Modelos de vídeos (admin)" };

const PLAN_BADGE: Record<string, string> = {
  essencial: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
  pro: "bg-violet-100 text-violet-700 dark:bg-violet-900/30 dark:text-violet-400",
};

export default function AdminVideoModelsPage() {
  return (
    <div className="mx-auto max-w-6xl">
      <PageHeader
        title="Modelos de vídeos"
        description={`${VIDEO_MODELS.length} modelos no catálogo — ${MODEL_NICHES.length} nichos · ${MODEL_FORMATS.length} formatos`}
      />

      <div className="rounded-xl border">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b bg-muted/40 text-xs font-medium uppercase tracking-wider text-muted-foreground">
              <th className="px-4 py-3 text-left">Título</th>
              <th className="px-4 py-3 text-left">Nicho</th>
              <th className="px-4 py-3 text-left">Formato</th>
              <th className="px-4 py-3 text-left">Duração</th>
              <th className="px-4 py-3 text-left">Plano</th>
              <th className="px-4 py-3 text-left">Câmara</th>
            </tr>
          </thead>
          <tbody>
            {VIDEO_MODELS.map((m) => (
              <tr key={m.id} className="border-b last:border-0 hover:bg-muted/20">
                <td className="px-4 py-3 font-medium">{m.title}</td>
                <td className="px-4 py-3 text-muted-foreground">{m.niche}</td>
                <td className="px-4 py-3 text-muted-foreground">{m.format}</td>
                <td className="px-4 py-3 text-muted-foreground">{m.durationSeconds}s</td>
                <td className="px-4 py-3">
                  <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${PLAN_BADGE[m.minPlan] ?? ""}`}>
                    {m.minPlan}
                  </span>
                </td>
                <td className="px-4 py-3 text-muted-foreground">
                  {m.onCamera ? "Com rosto" : "Sem rosto"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
