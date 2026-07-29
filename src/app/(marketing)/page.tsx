import Link from "next/link";
import {
  Sparkles,
  Clapperboard,
  Gauge,
  BarChart3,
  Wand2,
  LayoutTemplate,
  Check,
  ArrowRight,
} from "lucide-react";
import { PLAN_LIST } from "@/lib/plans";
import { TEMPLATE_LIST } from "@/lib/templates";
import { buttonVariants } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const problems = [
  "Não sabe como organizar o portfólio",
  "Não sabe o que escrever",
  "Não sabe quais vídeos gravar",
  "Não tem conhecimentos de design",
  "Não sabe criar ou hospedar um site",
  "Tem dificuldade em apresentar-se às marcas",
];

const solution = [
  { n: "01", t: "Responda ao onboarding", d: "Perfil, nichos, redes e equipamentos em minutos." },
  { n: "02", t: "Escolha um template", d: "Estilos profissionais, todos editáveis." },
  { n: "03", t: "Receba os textos da IA", d: "Headline, bio, especialidades e mais." },
  { n: "04", t: "Adicione os seus conteúdos", d: "Vídeos, cases, clientes e depoimentos." },
  { n: "05", t: "Publique e envie às marcas", d: "Um link público, bonito e otimizado." },
];

const aiGenerates = [
  "Headline", "Bio profissional", "Sobre mim", "Especialidades",
  "Apresentação para marcas", "Títulos de vídeos", "Descrições", "CTAs",
  "Sugestões de melhoria",
];

const faqs = [
  { q: "Quanto tempo demora a criar o portfólio?", a: "Menos de 10 minutos. O onboarding guiado e a IA fazem o trabalho pesado por si." },
  { q: "Preciso de saber programar?", a: "Não. Não precisa de qualquer conhecimento técnico nem de design." },
  { q: "Onde fica hospedado?", a: "Nós hospedamos por si, com uma URL pública no domínio Portfolio UGC. No plano Pro pode usar domínio próprio." },
  { q: "Posso fazer upload de vídeos?", a: "Sim. Faz upload dos seus vídeos e a IA gera thumbnail, título e descrição." },
  { q: "Posso cancelar quando quiser?", a: "Sim, a qualquer momento. Mantém o acesso até ao fim do período contratado." },
  { q: "De quem são os conteúdos?", a: "Seus. Mantém sempre a propriedade de tudo o que carrega." },
];

export default function LandingPage() {
  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden surface-soft">
        <div className="mx-auto w-full max-w-6xl px-4 py-20 sm:px-6 md:py-28">
          <div className="mx-auto max-w-3xl text-center">
            <Badge variant="secondary" className="mb-6 rounded-full px-4 py-1.5">
              ✨ Do primeiro vídeo ao portfólio pronto para as marcas
            </Badge>
            <h1 className="text-balance text-4xl font-semibold tracking-tight sm:text-5xl md:text-6xl">
              Seu portfólio profissional de UGC criado com IA em{" "}
              <span className="brand-text-gradient">menos de 10 minutos</span>
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-pretty text-lg text-muted-foreground">
              Responda a algumas perguntas, escolha um template e receba uma
              página profissional pronta para apresentar o seu trabalho às marcas.
            </p>
            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Link href="/cadastro" className={cn(buttonVariants({ size: "lg" }), "h-12 px-8 text-base")}>
                Criar meu portfólio
              </Link>
              <Link href="/p/exemplo" className={cn(buttonVariants({ variant: "outline", size: "lg" }), "h-12 px-8 text-base")}>
                Ver portfólio de exemplo
              </Link>
            </div>
          </div>

          {/* Hero mockup */}
          <div className="mx-auto mt-16 max-w-4xl">
            <div className="rounded-2xl border border-border/60 bg-card/60 p-2 shadow-2xl shadow-primary/10 backdrop-blur">
              <div className="overflow-hidden rounded-xl border border-border/60">
                <div className="flex items-center gap-1.5 border-b border-border/60 bg-muted/50 px-4 py-3">
                  <span className="size-3 rounded-full bg-red-400/70" />
                  <span className="size-3 rounded-full bg-yellow-400/70" />
                  <span className="size-3 rounded-full bg-green-400/70" />
                  <span className="ml-3 truncate rounded-md bg-background/60 px-3 py-1 text-xs text-muted-foreground">
                    portfoliougc.com/p/mariana
                  </span>
                </div>
                <div className="grid gap-4 bg-background p-6 md:grid-cols-[1fr_1.4fr]">
                  <div className="space-y-3">
                    <div className="brand-gradient aspect-square w-full rounded-xl" />
                    <div className="h-4 w-2/3 rounded bg-muted" />
                    <div className="h-3 w-full rounded bg-muted/70" />
                    <div className="h-3 w-5/6 rounded bg-muted/70" />
                    <div className="flex gap-2 pt-1">
                      <div className="h-8 flex-1 rounded-md bg-primary/80" />
                      <div className="h-8 w-8 rounded-md bg-muted" />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    {Array.from({ length: 4 }).map((_, i) => (
                      <div key={i} className="aspect-video rounded-lg border border-border/60 bg-gradient-to-br from-muted to-muted/40" />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Problema */}
      <section className="border-y border-border/60 bg-muted/30">
        <div className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-6">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
              Criar um portfólio não devia ser tão difícil
            </h2>
            <p className="mt-4 text-muted-foreground">
              A maioria das criadoras trava exatamente aqui:
            </p>
          </div>
          <div className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {problems.map((p) => (
              <div key={p} className="flex items-center gap-3 rounded-xl border border-border/60 bg-card p-4 text-sm">
                <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-coral/15 text-coral">✕</span>
                {p}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Solução */}
      <section id="solucao" className="mx-auto w-full max-w-6xl px-4 py-20 sm:px-6">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">Como funciona</h2>
          <p className="mt-4 text-muted-foreground">Cinco passos entre você e um portfólio que impressiona.</p>
        </div>
        <div className="mt-12 grid gap-6 md:grid-cols-5">
          {solution.map((s) => (
            <div key={s.n} className="rounded-2xl border border-border/60 bg-card p-5">
              <span className="text-3xl font-bold brand-text-gradient">{s.n}</span>
              <h3 className="mt-3 text-sm font-medium">{s.t}</h3>
              <p className="mt-1 text-xs text-muted-foreground">{s.d}</p>
            </div>
          ))}
        </div>
      </section>

      {/* IA */}
      <section className="border-y border-border/60 bg-muted/30">
        <div className="mx-auto grid w-full max-w-6xl gap-10 px-4 py-20 sm:px-6 lg:grid-cols-2 lg:items-center">
          <div>
            <Badge variant="secondary" className="mb-4"><Sparkles className="size-3.5" /> Inteligência artificial</Badge>
            <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
              A IA escreve o portfólio por si
            </h2>
            <p className="mt-4 text-muted-foreground">
              A partir do seu perfil, geramos automaticamente todos os textos —
              e você edita o que quiser antes de publicar.
            </p>
            <div className="mt-6 flex flex-wrap gap-2">
              {aiGenerates.map((a) => (
                <span key={a} className="inline-flex items-center gap-1.5 rounded-full border border-border/60 bg-card px-3 py-1.5 text-sm">
                  <Check className="size-3.5 text-primary" /> {a}
                </span>
              ))}
            </div>
          </div>
          <div className="rounded-2xl border border-border/60 bg-card p-6 shadow-sm">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Wand2 className="size-4 text-primary" /> Gerado por IA
            </div>
            <p className="mt-3 text-lg font-medium">
              “Criadora de conteúdo UGC especializada em beleza e skincare”
            </p>
            <p className="mt-3 text-sm text-muted-foreground">
              Produzo vídeos autênticos que geram conexão e resultado para marcas,
              cuidando de tudo — do roteiro à edição. Baseada em Lisboa.
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              {["Unboxing", "Reviews honestas", "Storytelling de produto"].map((s) => (
                <span key={s} className="rounded-md border border-primary/30 px-2 py-1 text-xs">{s}</span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Biblioteca de vídeos (destaque) */}
      <section className="mx-auto w-full max-w-6xl px-4 py-20 sm:px-6">
        <div className="overflow-hidden rounded-3xl border border-border/60 bg-card">
          <div className="grid gap-8 p-8 sm:p-12 lg:grid-cols-2 lg:items-center">
            <div>
              <Badge className="mb-4"><Clapperboard className="size-3.5" /> Biblioteca de vídeos</Badge>
              <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
                Não sabe o que gravar? Nós mostramos.
              </h2>
              <p className="mt-4 text-muted-foreground">
                Modelos de vídeos UGC para vários nichos, com roteiro, cenas,
                enquadramentos, gancho, CTA e orientações. E você ainda
                personaliza cada roteiro com IA.
              </p>
              <Link href="/modelos-de-videos" className={cn(buttonVariants({ variant: "outline" }), "mt-6")}>
                Explorar biblioteca <ArrowRight className="size-4" />
              </Link>
            </div>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
              {["Unboxing", "Review", "Tutorial", "Antes e depois", "Voice-over", "Gancho viral"].map((f, i) => (
                <div key={f} className="rounded-xl border border-border/60 p-4">
                  <div className={cn("mb-3 aspect-[9/16] rounded-lg", i % 2 ? "bg-primary/10" : "bg-coral/10")} />
                  <p className="text-xs font-medium">{f}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Templates */}
      <section id="templates" className="border-y border-border/60 bg-muted/30">
        <div className="mx-auto w-full max-w-6xl px-4 py-20 sm:px-6">
          <div className="mx-auto max-w-2xl text-center">
            <Badge variant="secondary" className="mb-4"><LayoutTemplate className="size-3.5" /> Templates</Badge>
            <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">Estilos que te representam</h2>
            <p className="mt-4 text-muted-foreground">Escolha um e personalize. Todos responsivos e prontos para SEO.</p>
          </div>
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {TEMPLATE_LIST.map((t) => (
              <div key={t.slug} className="overflow-hidden rounded-2xl border border-border/60 bg-card">
                <div className="aspect-[3/4] w-full" style={{ backgroundImage: `linear-gradient(135deg, ${t.preview.from}, ${t.preview.to})` }} />
                <div className="p-4">
                  <div className="flex items-center justify-between">
                    <h3 className="font-medium">{t.name}</h3>
                    <Badge variant={t.minPlan === "pro" ? "default" : "secondary"} className="text-[10px] uppercase">{t.minPlan}</Badge>
                  </div>
                  <p className="mt-1 text-xs text-muted-foreground">{t.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Score + Analytics */}
      <section className="mx-auto grid w-full max-w-6xl gap-6 px-4 py-20 sm:px-6 lg:grid-cols-2">
        <div className="rounded-2xl border border-border/60 bg-card p-8">
          <Badge variant="secondary" className="mb-4"><Gauge className="size-3.5" /> Portfolio Score</Badge>
          <div className="flex items-end gap-3">
            <span className="text-5xl font-semibold brand-text-gradient">82</span>
            <span className="pb-1 text-muted-foreground">/ 100</span>
          </div>
          <p className="mt-2 text-sm text-muted-foreground">O seu portfólio está quase pronto para impressionar marcas.</p>
          <ul className="mt-4 space-y-2 text-sm">
            {["Adicione dois vídeos de demonstração", "Inclua um depoimento", "Melhore o CTA principal", "Complete a seção de equipamentos"].map((s) => (
              <li key={s} className="flex items-center gap-2"><span className="text-coral">•</span> {s}</li>
            ))}
          </ul>
        </div>
        <div className="rounded-2xl border border-border/60 bg-card p-8">
          <Badge variant="secondary" className="mb-4"><BarChart3 className="size-3.5" /> Analytics</Badge>
          <div className="grid grid-cols-2 gap-4">
            {[["1.248", "Visitas"], ["936", "Únicos"], ["214", "Cliques"], ["87%", "Vídeos vistos"]].map(([v, l]) => (
              <div key={l} className="rounded-xl bg-muted/50 p-4">
                <div className="text-2xl font-semibold">{v}</div>
                <div className="text-xs text-muted-foreground">{l}</div>
              </div>
            ))}
          </div>
          <p className="mt-4 text-sm text-muted-foreground">
            Acompanhe visitas, cliques, vídeos vistos e origem do tráfego em tempo real.
          </p>
        </div>
      </section>

      {/* Preços */}
      <section id="precos" className="border-y border-border/60 bg-muted/30">
        <div className="mx-auto w-full max-w-4xl px-4 py-20 sm:px-6">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">Planos feitos para criadoras</h2>
            <p className="mt-4 text-muted-foreground">Comece a publicar hoje. Cancele quando quiser.</p>
          </div>
          <div className="mt-12 grid gap-6 sm:grid-cols-2">
            {PLAN_LIST.map((plan) => (
              <div key={plan.key} className={cn("relative flex flex-col rounded-2xl border bg-card p-6", plan.highlight ? "border-primary/50 shadow-xl shadow-primary/10" : "border-border/60")}>
                {plan.highlight && <Badge className="absolute -top-3 left-6">Mais popular</Badge>}
                <h3 className="text-lg font-semibold">{plan.name}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{plan.tagline}</p>
                <div className="mt-4 flex items-baseline gap-1">
                  <span className="text-4xl font-semibold">€{plan.priceMonthly}</span>
                  <span className="text-muted-foreground">/mês</span>
                </div>
                <ul className="mt-6 flex-1 space-y-2 text-sm">
                  {plan.bullets.map((b) => (
                    <li key={b} className="flex items-start gap-2"><Check className="mt-0.5 size-4 shrink-0 text-primary" /><span>{b}</span></li>
                  ))}
                </ul>
                <Link href="/cadastro" className={cn(buttonVariants({ variant: plan.highlight ? "default" : "outline" }), "mt-6 w-full")}>
                  Começar com {plan.name}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="mx-auto w-full max-w-3xl px-4 py-20 sm:px-6">
        <div className="text-center">
          <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">Perguntas frequentes</h2>
        </div>
        <div className="mt-10 space-y-3">
          {faqs.map((f) => (
            <details key={f.q} className="group rounded-xl border border-border/60 bg-card p-5">
              <summary className="flex cursor-pointer items-center justify-between font-medium marker:content-none">
                {f.q}
                <span className="text-muted-foreground transition-transform group-open:rotate-45">+</span>
              </summary>
              <p className="mt-3 text-sm text-muted-foreground">{f.a}</p>
            </details>
          ))}
        </div>
      </section>

      {/* Final CTA */}
      <section className="mx-auto w-full max-w-6xl px-4 pb-20 sm:px-6">
        <div className="brand-gradient relative overflow-hidden rounded-3xl px-8 py-16 text-center text-white">
          <div className="pointer-events-none absolute inset-0 opacity-20" style={{ backgroundImage: "radial-gradient(circle at 30% 20%, white 0, transparent 40%), radial-gradient(circle at 70% 80%, white 0, transparent 35%)" }} />
          <div className="relative">
            <h2 className="text-3xl font-semibold sm:text-4xl">A sua próxima parceria começa com um bom portfólio</h2>
            <p className="mx-auto mt-4 max-w-xl text-white/80">Junte-se às criadoras que já estão a fechar com marcas usando o Portfolio UGC.</p>
            <Link href="/cadastro" className={cn(buttonVariants({ variant: "secondary", size: "lg" }), "mt-8 h-12 px-8 text-base")}>
              Criar o meu portfólio
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
