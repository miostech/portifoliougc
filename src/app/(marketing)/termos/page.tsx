import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Termos de utilização",
  description: "Termos de utilização do Portfolio UGC.",
};

export default function TermosPage() {
  return (
    <article className="mx-auto w-full max-w-2xl px-4 py-16 sm:px-6 md:py-20">
      <h1 className="text-3xl font-semibold tracking-tight">Termos de utilização</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        Última atualização: julho de 2026
      </p>
      <div className="mt-8 space-y-6 text-sm leading-relaxed text-muted-foreground">
        <p>
          Ao criar uma conta no Portfolio UGC, concorda com estes termos. O
          serviço destina-se à criação e hospedagem de portfólios profissionais
          para criadoras e criadores de conteúdo UGC.
        </p>
        <section>
          <h2 className="text-base font-medium text-foreground">1. Conta</h2>
          <p className="mt-2">
            É responsável por manter a confidencialidade das suas credenciais e
            por toda a atividade na sua conta.
          </p>
        </section>
        <section>
          <h2 className="text-base font-medium text-foreground">2. Conteúdos</h2>
          <p className="mt-2">
            Mantém a propriedade de todos os conteúdos que carrega. Concede-nos
            apenas a licença necessária para hospedar e exibir o seu portfólio.
          </p>
        </section>
        <section>
          <h2 className="text-base font-medium text-foreground">3. Assinaturas</h2>
          <p className="mt-2">
            As funcionalidades principais requerem um plano pago. Pode cancelar a
            qualquer momento; o acesso mantém-se até ao fim do período contratado.
          </p>
        </section>
        <p>
          Este é um documento de demonstração e não constitui aconselhamento
          jurídico.
        </p>
      </div>
    </article>
  );
}
