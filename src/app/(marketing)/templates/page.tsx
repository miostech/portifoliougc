import type { Metadata } from "next";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Templates",
  description: "Templates profissionais e editáveis para o seu portfólio UGC.",
};

const templates = [
  { name: "Minimal", tag: "Clean & minimal", plan: "Essencial", from: "oklch(0.97 0.01 285)", to: "oklch(0.9 0.03 285)" },
  { name: "Creator", tag: "Expressivo & dinâmico", plan: "Essencial", from: "oklch(0.6 0.2 285)", to: "oklch(0.66 0.17 330)" },
  { name: "Premium", tag: "Editorial & sofisticado", plan: "Pro", from: "oklch(0.28 0.05 285)", to: "oklch(0.4 0.08 320)" },
  { name: "Professional", tag: "Corporativo & objetivo", plan: "Pro", from: "oklch(0.62 0.12 230)", to: "oklch(0.7 0.14 200)" },
];

export default function TemplatesPage() {
  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-16 sm:px-6 md:py-24">
      <div className="text-center">
        <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
          Templates que te representam
        </h1>
        <p className="mx-auto mt-4 max-w-xl text-muted-foreground">
          Escolha um estilo e personalize do seu jeito. Todos responsivos,
          acessíveis e prontos para SEO.
        </p>
      </div>

      <div className="mt-12 grid gap-6 sm:grid-cols-2">
        {templates.map((t) => (
          <div
            key={t.name}
            className="overflow-hidden rounded-2xl border border-border/60 bg-card"
          >
            <div
              className="aspect-[16/10] w-full"
              style={{ backgroundImage: `linear-gradient(135deg, ${t.from}, ${t.to})` }}
            />
            <div className="flex items-center justify-between p-5">
              <div>
                <h2 className="font-medium">{t.name}</h2>
                <p className="text-sm text-muted-foreground">{t.tag}</p>
              </div>
              <Badge variant={t.plan === "Pro" ? "default" : "secondary"}>
                {t.plan}
              </Badge>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-12 text-center">
        <Link href="/cadastro" className={cn(buttonVariants({ size: "lg" }))}>
          Escolher um template
        </Link>
      </div>
    </div>
  );
}
