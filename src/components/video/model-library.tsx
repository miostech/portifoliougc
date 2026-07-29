"use client";

import { useMemo, useState, useTransition } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { Heart, Clock, Video, VideoOff, Search, Filter } from "lucide-react";
import {
  DIFFICULTY_LABELS,
  type VideoModel,
} from "@/lib/video-models";
import { toggleFavourite } from "@/lib/actions/video";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

const DURATIONS = [
  { key: "all", label: "Qualquer duração" },
  { key: "short", label: "Até 30s" },
  { key: "medium", label: "30–45s" },
  { key: "long", label: "45s+" },
];

export function ModelLibrary({
  models,
  niches,
  formats,
  initialFavourites,
}: {
  models: VideoModel[];
  niches: string[];
  formats: string[];
  initialFavourites: string[];
}) {
  const [q, setQ] = useState("");
  const [niche, setNiche] = useState("");
  const [format, setFormat] = useState("");
  const [difficulty, setDifficulty] = useState("");
  const [camera, setCamera] = useState<"all" | "on" | "off">("all");
  const [duration, setDuration] = useState("all");
  const [favs, setFavs] = useState<Set<string>>(new Set(initialFavourites));
  const [, start] = useTransition();

  const filtered = useMemo(() => {
    return models.filter((m) => {
      if (q && !`${m.title} ${m.niche} ${m.format}`.toLowerCase().includes(q.toLowerCase())) return false;
      if (niche && m.niche !== niche) return false;
      if (format && m.format !== format) return false;
      if (difficulty && m.difficulty !== difficulty) return false;
      if (camera === "on" && !m.onCamera) return false;
      if (camera === "off" && m.onCamera) return false;
      if (duration === "short" && m.durationSeconds > 30) return false;
      if (duration === "medium" && (m.durationSeconds <= 30 || m.durationSeconds > 45)) return false;
      if (duration === "long" && m.durationSeconds <= 45) return false;
      return true;
    });
  }, [models, q, niche, format, difficulty, camera, duration]);

  function onToggleFav(id: string) {
    setFavs((prev) => {
      const next = new Set(prev);
      if (next.has(id)) { next.delete(id); } else { next.add(id); }
      return next;
    });
    start(async () => {
      const res = await toggleFavourite(id);
      if (!res.ok) toast.error(res.error ?? "Erro ao guardar favorito.");
    });
  }

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="space-y-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Pesquisar modelos…" className="pl-9" />
        </div>
        <div className="flex flex-wrap gap-2">
          <FilterSelect label="Nicho" value={niche} onChange={setNiche} options={niches} />
          <FilterSelect label="Formato" value={format} onChange={setFormat} options={formats} />
          <FilterSelect
            label="Dificuldade"
            value={difficulty}
            onChange={setDifficulty}
            options={Object.entries(DIFFICULTY_LABELS).map(([v, l]) => ({ value: v, label: l }))}
          />
          <select
            value={duration}
            onChange={(e) => setDuration(e.target.value)}
            className="h-9 rounded-lg border border-input bg-background px-3 text-sm"
          >
            {DURATIONS.map((d) => (
              <option key={d.key} value={d.key}>{d.label}</option>
            ))}
          </select>
          <div className="flex overflow-hidden rounded-lg border">
            {([["all", "Todos"], ["on", "Com rosto"], ["off", "Sem rosto"]] as const).map(([v, l]) => (
              <button
                key={v}
                type="button"
                onClick={() => setCamera(v)}
                className={cn("px-3 text-sm", camera === v ? "bg-primary text-primary-foreground" : "hover:bg-accent")}
              >
                {l}
              </button>
            ))}
          </div>
        </div>
      </div>

      <p className="flex items-center gap-2 text-sm text-muted-foreground">
        <Filter className="size-4" /> {filtered.length} {filtered.length === 1 ? "modelo" : "modelos"}
      </p>

      {filtered.length === 0 ? (
        <div className="rounded-xl border border-dashed py-16 text-center text-sm text-muted-foreground">
          Nenhum modelo com estes filtros.
        </div>
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((m) => (
            <ModelCard key={m.id} model={m} favourited={favs.has(m.id)} onFav={() => onToggleFav(m.id)} />
          ))}
        </div>
      )}
    </div>
  );
}

function ModelCard({
  model,
  favourited,
  onFav,
}: {
  model: VideoModel;
  favourited: boolean;
  onFav: () => void;
}) {
  return (
    <div className="group overflow-hidden rounded-2xl border bg-card transition-shadow hover:shadow-lg hover:shadow-primary/5">
      <div className="relative aspect-video" style={{ backgroundImage: `linear-gradient(135deg, ${model.preview.from}, ${model.preview.to})` }}>
        <button
          type="button"
          onClick={onFav}
          aria-label="Guardar nos favoritos"
          className="absolute right-2 top-2 flex size-8 items-center justify-center rounded-full bg-black/30 text-white backdrop-blur transition hover:bg-black/50"
        >
          <Heart className={cn("size-4", favourited && "fill-current text-red-400")} />
        </button>
        <div className="absolute bottom-2 left-2 flex items-center gap-1.5">
          <Badge className="bg-black/40 text-white backdrop-blur">{model.format}</Badge>
        </div>
      </div>
      <div className="space-y-2 p-4">
        <h3 className="line-clamp-2 font-medium leading-snug">
          <Link href={`/app/modelos/${model.id}`} className="hover:underline">
            {model.title}
          </Link>
        </h3>
        <p className="text-xs text-muted-foreground">{model.niche}</p>
        <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
          <span className="inline-flex items-center gap-1"><Clock className="size-3" /> {model.durationSeconds}s</span>
          <span>·</span>
          <span>{DIFFICULTY_LABELS[model.difficulty]}</span>
          <span>·</span>
          <span className="inline-flex items-center gap-1">
            {model.onCamera ? <Video className="size-3" /> : <VideoOff className="size-3" />}
            {model.onCamera ? "Com rosto" : "Sem rosto"}
          </span>
        </div>
        <Link
          href={`/app/modelos/${model.id}`}
          className="mt-1 inline-block text-sm font-medium text-primary hover:underline"
        >
          Ver modelo →
        </Link>
      </div>
    </div>
  );
}

function FilterSelect({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: (string | { value: string; label: string })[];
}) {
  const opts = options.map((o) => (typeof o === "string" ? { value: o, label: o } : o));
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="h-9 rounded-lg border border-input bg-background px-3 text-sm"
    >
      <option value="">{label}</option>
      {opts.map((o) => (
        <option key={o.value} value={o.value}>{o.label}</option>
      ))}
    </select>
  );
}
