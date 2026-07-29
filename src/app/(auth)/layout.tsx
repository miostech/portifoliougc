import Link from "next/link";
import { Logo } from "@/components/logo";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="grid min-h-dvh lg:grid-cols-2">
      {/* Brand panel */}
      <div className="relative hidden overflow-hidden brand-gradient lg:flex lg:flex-col lg:justify-between p-10 text-white">
        <div
          className="pointer-events-none absolute inset-0 opacity-20"
          style={{
            backgroundImage:
              "radial-gradient(circle at 20% 20%, white 0, transparent 40%), radial-gradient(circle at 80% 60%, white 0, transparent 35%)",
          }}
        />
        <Logo href="/" className="relative text-white [&_span]:text-white" />
        <div className="relative space-y-6">
          <h2 className="text-3xl font-semibold leading-tight">
            Seu portfólio profissional de UGC, pronto em menos de 10 minutos.
          </h2>
          <p className="max-w-md text-white/80">
            Onboarding rápido, textos gerados por IA e uma página pública linda
            para conquistar as marcas dos seus sonhos.
          </p>
          <ul className="space-y-2 text-sm text-white/80">
            <li>✦ Bio, headline e especialidades escritas pela IA</li>
            <li>✦ Upload de vídeos com thumbnail e título automáticos</li>
            <li>✦ Score do portfólio com sugestões de melhoria</li>
          </ul>
        </div>
        <p className="relative text-sm text-white/60">
          © {new Date().getFullYear()} Portfolio UGC
        </p>
      </div>

      {/* Form panel */}
      <div className="flex flex-col">
        <header className="flex items-center justify-between p-6 lg:hidden">
          <Logo href="/" />
          <Link
            href="/"
            className="text-sm text-muted-foreground hover:text-foreground"
          >
            Voltar
          </Link>
        </header>
        <main className="flex flex-1 items-center justify-center p-6">
          <div className="w-full max-w-sm">{children}</div>
        </main>
      </div>
    </div>
  );
}
