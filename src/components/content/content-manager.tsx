"use client";

import { useRef, useState, useTransition } from "react";
import { toast } from "sonner";
import {
  Upload,
  Star,
  Eye,
  EyeOff,
  Trash2,
  Loader2,
  Plus,
  Film,
  Quote,
  Building2,
  Sparkles,
} from "lucide-react";
import {
  addCase,
  addClient,
  addTestimonial,
  deleteMedia,
  removeEmbedded,
  updateMedia,
  uploadMedia,
  type ContentBundle,
  type MediaItem,
} from "@/lib/actions/content";
import { NICHES, CONTENT_TYPES } from "@/lib/onboarding-options";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export function ContentManager({ initial }: { initial: ContentBundle }) {
  const [media, setMedia] = useState<MediaItem[]>(initial.media);
  const [testimonials, setTestimonials] = useState(initial.testimonials);
  const [clients, setClients] = useState(initial.clients);
  const [cases, setCases] = useState(initial.cases);

  return (
    <Tabs defaultValue="media">
      <TabsList>
        <TabsTrigger value="media">Vídeos e fotos</TabsTrigger>
        <TabsTrigger value="cases">Cases</TabsTrigger>
        <TabsTrigger value="testimonials">Depoimentos</TabsTrigger>
        <TabsTrigger value="clients">Clientes</TabsTrigger>
      </TabsList>

      <TabsContent value="media" className="mt-6">
        <MediaSection media={media} setMedia={setMedia} />
      </TabsContent>
      <TabsContent value="cases" className="mt-6">
        <CasesSection cases={cases} setCases={setCases} />
      </TabsContent>
      <TabsContent value="testimonials" className="mt-6">
        <TestimonialsSection items={testimonials} setItems={setTestimonials} />
      </TabsContent>
      <TabsContent value="clients" className="mt-6">
        <ClientsSection items={clients} setItems={setClients} />
      </TabsContent>
    </Tabs>
  );
}

/* ---------------- Media ---------------- */

function MediaSection({
  media,
  setMedia,
}: {
  media: MediaItem[];
  setMedia: React.Dispatch<React.SetStateAction<MediaItem[]>>;
}) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          {media.length} {media.length === 1 ? "item" : "itens"}
        </p>
        <UploadDialog onUploaded={(m) => setMedia((prev) => [m, ...prev])} />
      </div>

      {media.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed py-16 text-center">
          <Film className="mb-3 size-8 text-muted-foreground" />
          <p className="text-sm text-muted-foreground">
            Ainda sem vídeos. Faça o primeiro upload — a IA gera título,
            descrição e thumbnail.
          </p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {media.map((m) => (
            <MediaCard
              key={m.id}
              item={m}
              onChange={(patch) =>
                setMedia((prev) => prev.map((x) => (x.id === m.id ? { ...x, ...patch } : x)))
              }
              onDelete={() => setMedia((prev) => prev.filter((x) => x.id !== m.id))}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function MediaCard({
  item,
  onChange,
  onDelete,
}: {
  item: MediaItem;
  onChange: (patch: Partial<MediaItem>) => void;
  onDelete: () => void;
}) {
  const [pending, start] = useTransition();

  const toggle = (patch: Partial<MediaItem>) =>
    start(async () => {
      onChange(patch);
      await updateMedia(item.id, patch);
    });

  const del = () =>
    start(async () => {
      await deleteMedia(item.id);
      onDelete();
      toast.success("Conteúdo removido.");
    });

  return (
    <div className={cn("overflow-hidden rounded-xl border bg-card", item.hidden && "opacity-60")}>
      <div className="relative aspect-video bg-gradient-to-br from-muted to-muted/40">
        {item.thumbnail && item.type === "image" ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={item.thumbnail} alt={item.title} className="size-full object-cover" />
        ) : (
          <div className="flex size-full items-center justify-center">
            <Film className="size-8 text-muted-foreground/50" />
          </div>
        )}
        {item.status !== "ready" && (
          <span className="absolute left-2 top-2 flex items-center gap-1 rounded-md bg-black/70 px-2 py-0.5 text-xs text-white">
            <Loader2 className="size-3 animate-spin" /> {item.status}
          </span>
        )}
        {item.featured && (
          <span className="absolute right-2 top-2 rounded-md bg-primary px-1.5 py-0.5 text-[10px] font-semibold text-primary-foreground">
            Destaque
          </span>
        )}
      </div>
      <div className="space-y-2 p-3">
        <div className="flex items-start gap-1">
          <p className="line-clamp-2 flex-1 text-sm font-medium">{item.title || "Sem título"}</p>
        </div>
        {item.category && (
          <Badge variant="secondary" className="text-[10px]">{item.category}</Badge>
        )}
        {item.aiGenerated && (
          <p className="flex items-center gap-1 text-[11px] text-muted-foreground">
            <Sparkles className="size-3 text-primary" /> Metadados por IA
          </p>
        )}
        <div className="flex items-center gap-1 pt-1">
          <Button variant="ghost" size="icon-sm" aria-label="Destacar" disabled={pending}
            onClick={() => toggle({ featured: !item.featured })}>
            <Star className={cn("size-4", item.featured && "fill-primary text-primary")} />
          </Button>
          <Button variant="ghost" size="icon-sm" aria-label="Ocultar" disabled={pending}
            onClick={() => toggle({ hidden: !item.hidden })}>
            {item.hidden ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
          </Button>
          <Button variant="ghost" size="icon-sm" aria-label="Remover" disabled={pending}
            className="ml-auto text-destructive" onClick={del}>
            <Trash2 className="size-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}

function UploadDialog({ onUploaded }: { onUploaded: (m: MediaItem) => void }) {
  const [open, setOpen] = useState(false);
  const [pending, start] = useTransition();
  const fileRef = useRef<HTMLInputElement>(null);
  const [fileName, setFileName] = useState("");
  const [type, setType] = useState<"video" | "image">("video");
  const [sizeBytes, setSizeBytes] = useState(0);
  const [niche, setNiche] = useState("");
  const [format, setFormat] = useState("");
  const [product, setProduct] = useState("");
  const [brand, setBrand] = useState("");
  const [featured, setFeatured] = useState(false);

  function submit() {
    if (!fileName.trim()) {
      toast.error("Escolha um ficheiro ou dê um nome.");
      return;
    }
    start(async () => {
      const res = await uploadMedia({ fileName, type, sizeBytes, niche, format, product, brand, featured });
      if (!res.ok || !res.media) {
        toast.error(res.error ?? "Falha no upload.");
        return;
      }
      onUploaded(res.media);
      toast.success("Upload concluído! A IA gerou os metadados.");
      setOpen(false);
      setFileName(""); setNiche(""); setFormat(""); setProduct(""); setBrand(""); setFeatured(false);
    });
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={<Button size="sm" />}>
        <Upload className="size-4" /> Novo upload
      </DialogTrigger>
      <DialogContent className="max-h-[90dvh] overflow-y-auto sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Novo conteúdo</DialogTitle>
          <DialogDescription>
            Ao enviar, a IA sugere título, descrição, categoria e thumbnail.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Ficheiro</Label>
            <input
              ref={fileRef}
              type="file"
              accept="video/*,image/*"
              className="block w-full text-sm file:mr-3 file:rounded-md file:border-0 file:bg-primary file:px-3 file:py-1.5 file:text-sm file:text-primary-foreground"
              onChange={(e) => {
                const f = e.target.files?.[0];
                if (!f) return;
                setFileName(f.name);
                setSizeBytes(f.size);
                setType(f.type.startsWith("image/") ? "image" : "video");
              }}
            />
            {fileName && <p className="text-xs text-muted-foreground">{fileName}</p>}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <SelectField label="Nicho" value={niche} onChange={setNiche} options={NICHES} />
            <SelectField label="Formato" value={format} onChange={setFormat} options={CONTENT_TYPES} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label>Produto</Label>
              <Input value={product} onChange={(e) => setProduct(e.target.value)} placeholder="Ex.: sérum facial" />
            </div>
            <div className="space-y-2">
              <Label>Marca</Label>
              <Input value={brand} onChange={(e) => setBrand(e.target.value)} placeholder="Ex.: Glowly" />
            </div>
          </div>
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={featured} onChange={(e) => setFeatured(e.target.checked)} />
            Marcar como destaque
          </label>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)} disabled={pending}>Cancelar</Button>
          <Button onClick={submit} disabled={pending}>
            {pending ? <><Loader2 className="size-4 animate-spin" /> A processar…</> : "Enviar"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function SelectField({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: string[];
}) {
  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="h-9 w-full rounded-lg border border-input bg-background px-3 text-sm"
      >
        <option value="">Selecione…</option>
        {options.map((o) => (
          <option key={o} value={o}>{o}</option>
        ))}
      </select>
    </div>
  );
}

/* ---------------- Cases ---------------- */

function CasesSection({
  cases,
  setCases,
}: {
  cases: ContentBundle["cases"];
  setCases: React.Dispatch<React.SetStateAction<ContentBundle["cases"]>>;
}) {
  const [pending, start] = useTransition();
  const [title, setTitle] = useState("");
  const [brand, setBrand] = useState("");
  const [result, setResult] = useState("");
  const [description, setDescription] = useState("");

  function add() {
    if (!title.trim()) return toast.error("Informe o título do case.");
    start(async () => {
      const res = await addCase({ title, brand, description, result });
      if (!res.ok) {
        toast.error(res.error ?? "Erro.");
        return;
      }
      setCases((p) => [...p, { id: `tmp-${p.length}`, title, brand, description, result }]);
      setTitle(""); setBrand(""); setResult(""); setDescription("");
      toast.success("Case adicionado.");
    });
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_1.3fr]">
      <div className="space-y-3 rounded-xl border p-4">
        <h3 className="font-medium">Novo case</h3>
        <Input placeholder="Título" value={title} onChange={(e) => setTitle(e.target.value)} />
        <div className="grid grid-cols-2 gap-3">
          <Input placeholder="Marca" value={brand} onChange={(e) => setBrand(e.target.value)} />
          <Input placeholder="Resultado (ex.: +180%)" value={result} onChange={(e) => setResult(e.target.value)} />
        </div>
        <Textarea placeholder="Descrição" rows={3} value={description} onChange={(e) => setDescription(e.target.value)} />
        <Button size="sm" onClick={add} disabled={pending}><Plus className="size-4" /> Adicionar</Button>
      </div>
      <ItemList
        items={cases.map((c) => ({ id: c.id, title: c.title, subtitle: [c.brand, c.result].filter(Boolean).join(" · "), body: c.description }))}
        onRemove={(id) => { removeEmbedded("cases", id); setCases((p) => p.filter((x) => x.id !== id)); }}
        emptyIcon={Building2}
        emptyText="Nenhum case ainda."
      />
    </div>
  );
}

/* ---------------- Testimonials ---------------- */

function TestimonialsSection({
  items,
  setItems,
}: {
  items: ContentBundle["testimonials"];
  setItems: React.Dispatch<React.SetStateAction<ContentBundle["testimonials"]>>;
}) {
  const [pending, start] = useTransition();
  const [author, setAuthor] = useState("");
  const [role, setRole] = useState("");
  const [quote, setQuote] = useState("");

  function add() {
    if (!author.trim() || !quote.trim()) return toast.error("Preencha autor e depoimento.");
    start(async () => {
      const res = await addTestimonial({ author, role, quote });
      if (!res.ok) {
        toast.error(res.error ?? "Erro.");
        return;
      }
      setItems((p) => [...p, { id: `tmp-${p.length}`, author, role, quote }]);
      setAuthor(""); setRole(""); setQuote("");
      toast.success("Depoimento adicionado.");
    });
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_1.3fr]">
      <div className="space-y-3 rounded-xl border p-4">
        <h3 className="font-medium">Novo depoimento</h3>
        <Input placeholder="Autor" value={author} onChange={(e) => setAuthor(e.target.value)} />
        <Input placeholder="Cargo / marca" value={role} onChange={(e) => setRole(e.target.value)} />
        <Textarea placeholder="Depoimento" rows={3} value={quote} onChange={(e) => setQuote(e.target.value)} />
        <Button size="sm" onClick={add} disabled={pending}><Plus className="size-4" /> Adicionar</Button>
      </div>
      <ItemList
        items={items.map((t) => ({ id: t.id, title: t.author, subtitle: t.role, body: `“${t.quote}”` }))}
        onRemove={(id) => { removeEmbedded("testimonials", id); setItems((p) => p.filter((x) => x.id !== id)); }}
        emptyIcon={Quote}
        emptyText="Nenhum depoimento ainda."
      />
    </div>
  );
}

/* ---------------- Clients ---------------- */

function ClientsSection({
  items,
  setItems,
}: {
  items: ContentBundle["clients"];
  setItems: React.Dispatch<React.SetStateAction<ContentBundle["clients"]>>;
}) {
  const [pending, start] = useTransition();
  const [name, setName] = useState("");

  function add() {
    if (!name.trim()) return toast.error("Informe o nome da marca.");
    start(async () => {
      const res = await addClient({ name });
      if (!res.ok) {
        toast.error(res.error ?? "Erro.");
        return;
      }
      setItems((p) => [...p, { id: `tmp-${p.length}`, name, logo: null }]);
      setName("");
      toast.success("Cliente adicionado.");
    });
  }

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <Input placeholder="Nome da marca" value={name} onChange={(e) => setName(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && add()} className="max-w-xs" />
        <Button size="sm" onClick={add} disabled={pending}><Plus className="size-4" /> Adicionar</Button>
      </div>
      {items.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed py-12 text-center">
          <Building2 className="mb-2 size-7 text-muted-foreground" />
          <p className="text-sm text-muted-foreground">Nenhum cliente ainda.</p>
        </div>
      ) : (
        <div className="flex flex-wrap gap-2">
          {items.map((c) => (
            <span key={c.id} className="inline-flex items-center gap-2 rounded-full border bg-card px-3 py-1.5 text-sm">
              {c.name}
              <button aria-label="Remover" className="text-muted-foreground hover:text-destructive"
                onClick={() => { removeEmbedded("clients", c.id); setItems((p) => p.filter((x) => x.id !== c.id)); }}>
                <Trash2 className="size-3.5" />
              </button>
            </span>
          ))}
        </div>
      )}
    </div>
  );
}

/* ---------------- Shared list ---------------- */

function ItemList({
  items,
  onRemove,
  emptyIcon: EmptyIcon,
  emptyText,
}: {
  items: { id: string; title: string; subtitle?: string; body?: string }[];
  onRemove: (id: string) => void;
  emptyIcon: React.ComponentType<{ className?: string }>;
  emptyText: string;
}) {
  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-xl border border-dashed py-12 text-center">
        <EmptyIcon className="mb-2 size-7 text-muted-foreground" />
        <p className="text-sm text-muted-foreground">{emptyText}</p>
      </div>
    );
  }
  return (
    <div className="space-y-3">
      {items.map((it) => (
        <div key={it.id} className="flex items-start gap-3 rounded-xl border bg-card p-4">
          <div className="flex-1">
            <p className="font-medium">{it.title}</p>
            {it.subtitle && <p className="text-xs text-muted-foreground">{it.subtitle}</p>}
            {it.body && <p className="mt-1 text-sm text-muted-foreground">{it.body}</p>}
          </div>
          <button aria-label="Remover" className="text-muted-foreground hover:text-destructive" onClick={() => onRemove(it.id)}>
            <Trash2 className="size-4" />
          </button>
        </div>
      ))}
    </div>
  );
}
