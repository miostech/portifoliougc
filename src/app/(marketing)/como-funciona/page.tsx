import type { Metadata } from "next";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Como funciona",
  description:
    "Do onboarding à publicação: veja como criar o seu portfólio UGC em menos de 10 minutos.",
};

const steps = [
  {
    n: "01",
    title: "Responda ao onboarding",
    desc: "Nome, foto, cidade, nichos, idiomas, equipamentos e redes sociais — em poucos minutos.",
  },
  {
    n: "02",
    title: "Escolha um template",
    desc: "Selecione o estilo que mais combina com o seu trabalho. Todos são editáveis.",
  },
  {
    n: "03",
    title: "Receba os textos da IA",
    desc: "Headline, bio, sobre mim, especialidades e apresentação para marcas gerados automaticamente.",
  },
  {
    n: "04",
    title: "Adicione os seus conteúdos",
    desc: "Vídeos, fotografias, cases, clientes e depoimentos, organizados por categorias.",
  },
  {
    n: "05",
    title: "Publique e envie para as marcas",
    desc: "Um link público, bonito e otimizado para SEO, pronto para partilhar.",
  },
];

export default function ComoFuncionaPage() {
  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-16 sm:px-6 md:py-24">
      <div className="text-center">
        <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
          Como funciona
        </h1>
        <p className="mx-auto mt-4 max-w-xl text-muted-foreground">
          Cinco passos simples entre você e um portfólio profissional pronto para
          impressionar marcas.
        </p>
      </div>

      <ol className="mt-12 space-y-4">
        {steps.map((s) => (
          <li
            key={s.n}
            className="flex gap-5 rounded-2xl border border-border/60 bg-card p-6"
          >
            <span className="text-3xl font-bold brand-text-gradient">{s.n}</span>
            <div>
              <h2 className="font-medium">{s.title}</h2>
              <p className="mt-1 text-sm text-muted-foreground">{s.desc}</p>
            </div>
          </li>
        ))}
      </ol>

      <div className="mt-12 text-center">
        <Link href="/cadastro" className={cn(buttonVariants({ size: "lg" }))}>
          Criar o meu portfólio
        </Link>
      </div>
    </div>
  );
}
