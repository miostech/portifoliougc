import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Política de privacidade",
  description: "Política de privacidade do Portfolio UGC.",
};

export default function PrivacidadePage() {
  return (
    <article className="mx-auto w-full max-w-2xl px-4 py-16 sm:px-6 md:py-20">
      <h1 className="text-3xl font-semibold tracking-tight">
        Política de privacidade
      </h1>
      <p className="mt-2 text-sm text-muted-foreground">
        Última atualização: julho de 2026
      </p>
      <div className="mt-8 space-y-6 text-sm leading-relaxed text-muted-foreground">
        <p>
          Respeitamos a sua privacidade. Esta política explica que dados
          recolhemos e como os utilizamos para prestar o serviço Portfolio UGC.
        </p>
        <section>
          <h2 className="text-base font-medium text-foreground">Dados recolhidos</h2>
          <p className="mt-2">
            Nome, e-mail e as informações que fornece no onboarding e no
            portfólio (foto, nichos, redes, conteúdos). Métricas de visita do seu
            portfólio público, de forma agregada.
          </p>
        </section>
        <section>
          <h2 className="text-base font-medium text-foreground">Utilização</h2>
          <p className="mt-2">
            Usamos os dados para criar e hospedar o seu portfólio, gerar textos
            com IA e apresentar as suas métricas. Não vendemos os seus dados.
          </p>
        </section>
        <section>
          <h2 className="text-base font-medium text-foreground">Os seus direitos</h2>
          <p className="mt-2">
            Pode aceder, corrigir ou eliminar os seus dados a qualquer momento nas
            configurações da conta.
          </p>
        </section>
        <p>Este é um documento de demonstração.</p>
      </div>
    </article>
  );
}
