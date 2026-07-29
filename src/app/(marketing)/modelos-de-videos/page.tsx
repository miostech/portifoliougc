import type { Metadata } from "next";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Modelos de vídeos",
  description:
    "Não sabe o que gravar? Modelos de vídeos UGC com roteiro, cenas, gancho e CTA para vários nichos.",
};

const niches = [
  "Beleza e skincare", "Maquiagem", "Moda", "Fitness", "Bem-estar",
  "Alimentação", "Restaurantes", "Viagens", "Tecnologia", "Finanças",
  "Educação", "Saúde", "Casa e decoração", "Maternidade",
];

const formats = [
  "Unboxing", "Review", "Tutorial", "Antes e depois", "Storytelling",
  "Voice-over", "Sem mostrar o rosto", "Gancho viral",
];

export default function ModelosDeVideosPage() {
  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-16 sm:px-6 md:py-24">
      <div className="text-center">
        <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
          Não sabe o que gravar? Nós mostramos.
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">
          Uma biblioteca de modelos de vídeos UGC para vários nichos — com
          roteiro, cenas, enquadramentos, gancho, CTA e orientações. E você
          ainda personaliza cada roteiro com IA.
        </p>
      </div>

      <div className="mt-12 grid gap-8 sm:grid-cols-2">
        <div className="rounded-2xl border border-border/60 bg-card p-6">
          <h2 className="font-medium">Nichos</h2>
          <div className="mt-4 flex flex-wrap gap-2">
            {niches.map((n) => (
              <Badge key={n} variant="secondary">{n}</Badge>
            ))}
          </div>
        </div>
        <div className="rounded-2xl border border-border/60 bg-card p-6">
          <h2 className="font-medium">Formatos</h2>
          <div className="mt-4 flex flex-wrap gap-2">
            {formats.map((f) => (
              <Badge key={f} variant="secondary">{f}</Badge>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-12 text-center">
        <Link href="/cadastro" className={cn(buttonVariants({ size: "lg" }))}>
          Explorar a biblioteca
        </Link>
      </div>
    </div>
  );
}
