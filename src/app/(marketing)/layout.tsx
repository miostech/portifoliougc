import Link from "next/link";
import { auth } from "@/lib/auth";
import { Logo } from "@/components/logo";
import { ThemeToggle } from "@/components/theme-toggle";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default async function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  return (
    <div className="flex min-h-dvh flex-col">
      <header className="sticky top-0 z-50 border-b border-border/60 glass">
        <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between px-4 sm:px-6">
          <Logo href="/" />
          <nav className="hidden items-center gap-6 text-sm text-muted-foreground md:flex">
            <Link href="/como-funciona" className="hover:text-foreground">Como funciona</Link>
            <Link href="/templates" className="hover:text-foreground">Templates</Link>
            <Link href="/modelos-de-videos" className="hover:text-foreground">Modelos de vídeos</Link>
            <Link href="/precos" className="hover:text-foreground">Preços</Link>
          </nav>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            {session?.user ? (
              <Link href="/app" className={cn(buttonVariants({ size: "sm" }))}>
                Painel
              </Link>
            ) : (
              <>
                <Link
                  href="/login"
                  className={cn(
                    buttonVariants({ variant: "ghost", size: "sm" }),
                    "hidden sm:inline-flex"
                  )}
                >
                  Entrar
                </Link>
                <Link href="/cadastro" className={cn(buttonVariants({ size: "sm" }))}>
                  Criar portfólio
                </Link>
              </>
            )}
          </div>
        </div>
      </header>

      <main className="flex-1">{children}</main>

      <footer className="border-t border-border/60">
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-4 px-4 py-10 sm:px-6 md:flex-row md:items-center md:justify-between">
          <Logo href="/" />
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} Portfolio UGC. Feito para criadores.
          </p>
          <div className="flex gap-4 text-sm text-muted-foreground">
            <a href="#" className="hover:text-foreground">Termos</a>
            <a href="#" className="hover:text-foreground">Privacidade</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
