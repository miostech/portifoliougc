"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { ExternalLink, Copy, Globe, EyeOff, Rocket } from "lucide-react";
import { publishPortfolio, unpublishPortfolio } from "@/lib/actions/portfolio";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export function PublishControls({
  slug,
  published,
  isPaid,
  appUrl,
}: {
  slug: string;
  published: boolean;
  isPaid: boolean;
  appUrl: string;
}) {
  const router = useRouter();
  const [isPub, setIsPub] = useState(published);
  const [pending, start] = useTransition();
  const publicUrl = `${appUrl}/p/${slug}`;

  function onPublish() {
    start(async () => {
      const res = await publishPortfolio();
      if (!res.ok) {
        toast.error(res.error ?? "Não foi possível publicar.");
        return;
      }
      setIsPub(true);
      toast.success("Portfólio publicado!");
      router.refresh();
    });
  }

  function onUnpublish() {
    start(async () => {
      const res = await unpublishPortfolio();
      if (!res.ok) {
        toast.error(res.error ?? "Erro.");
        return;
      }
      setIsPub(false);
      toast.info("Portfólio despublicado.");
      router.refresh();
    });
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <span className="text-sm text-muted-foreground">Estado:</span>
        {isPub ? (
          <Badge className="gap-1"><Globe className="size-3" /> Publicado</Badge>
        ) : (
          <Badge variant="secondary">Rascunho</Badge>
        )}
      </div>

      <div className="flex items-center gap-2 rounded-lg border bg-muted/40 px-3 py-2">
        <Globe className="size-4 shrink-0 text-muted-foreground" />
        <span className="flex-1 truncate text-sm">{publicUrl}</span>
        <Button
          type="button"
          variant="ghost"
          size="icon-sm"
          aria-label="Copiar link"
          onClick={() => {
            navigator.clipboard?.writeText(publicUrl);
            toast.success("Link copiado!");
          }}
        >
          <Copy className="size-4" />
        </Button>
      </div>

      <div className="flex flex-wrap gap-2">
        {isPub ? (
          <>
            <Link
              href={`/p/${slug}`}
              target="_blank"
              className="inline-flex h-8 items-center gap-1.5 rounded-lg bg-primary px-3 text-sm font-medium text-primary-foreground hover:bg-primary/80"
            >
              Ver página <ExternalLink className="size-4" />
            </Link>
            <Button variant="outline" size="sm" onClick={onUnpublish} disabled={pending}>
              <EyeOff className="size-4" /> Despublicar
            </Button>
          </>
        ) : isPaid ? (
          <Button size="sm" onClick={onPublish} disabled={pending}>
            <Rocket className="size-4" /> {pending ? "A publicar…" : "Publicar portfólio"}
          </Button>
        ) : (
          <Link
            href="/app/assinatura"
            className="inline-flex h-8 items-center gap-1.5 rounded-lg bg-primary px-3 text-sm font-medium text-primary-foreground hover:bg-primary/80"
          >
            <Rocket className="size-4" /> Ative um plano para publicar
          </Link>
        )}
      </div>
    </div>
  );
}
