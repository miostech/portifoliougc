"use client";

import { useMemo, useState, useTransition } from "react";
import { toast } from "sonner";
import { Trash2, KanbanSquare, List, GripVertical } from "lucide-react";
import {
  removePlanItem,
  updatePlanItem,
  updatePlanStatus,
  type PlanItem,
} from "@/lib/actions/video";
import type { PlanStatus } from "@/models/RecordingPlanItem";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const STATUS: { key: PlanStatus; label: string; color: string }[] = [
  { key: "quero_gravar", label: "Quero gravar", color: "bg-slate-400" },
  { key: "em_preparacao", label: "Em preparação", color: "bg-amber-400" },
  { key: "gravado", label: "Gravado", color: "bg-blue-400" },
  { key: "em_edicao", label: "Em edição", color: "bg-violet-400" },
  { key: "pronto", label: "Pronto", color: "bg-emerald-400" },
  { key: "adicionado", label: "No portfólio", color: "bg-primary" },
];

export function RecordingPlan({ initial }: { initial: PlanItem[] }) {
  const [items, setItems] = useState<PlanItem[]>(initial);
  const [view, setView] = useState<"kanban" | "list">("kanban");
  const [, start] = useTransition();

  const byStatus = useMemo(() => {
    const map: Record<string, PlanItem[]> = {};
    for (const s of STATUS) map[s.key] = [];
    for (const it of items) (map[it.status] ??= []).push(it);
    return map;
  }, [items]);

  function changeStatus(id: string, status: PlanStatus) {
    setItems((prev) => prev.map((x) => (x.id === id ? { ...x, status } : x)));
    start(async () => {
      const res = await updatePlanStatus(id, status);
      if (!res.ok) toast.error(res.error ?? "Erro.");
    });
  }

  function remove(id: string) {
    setItems((prev) => prev.filter((x) => x.id !== id));
    start(async () => { await removePlanItem(id); });
    toast.success("Item removido.");
  }

  function patch(id: string, p: Partial<PlanItem>) {
    setItems((prev) => prev.map((x) => (x.id === id ? { ...x, ...p } : x)));
    start(async () => { await updatePlanItem(id, p); });
  }

  if (items.length === 0) {
    return (
      <div className="rounded-xl border border-dashed py-16 text-center">
        <KanbanSquare className="mx-auto mb-3 size-8 text-muted-foreground" />
        <p className="text-sm text-muted-foreground">
          O seu plano está vazio. Vá aos modelos e adicione vídeos que quer gravar.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <div className="flex overflow-hidden rounded-lg border">
          <button type="button" onClick={() => setView("kanban")}
            className={cn("flex items-center gap-1.5 px-3 py-1.5 text-sm", view === "kanban" ? "bg-primary text-primary-foreground" : "hover:bg-accent")}>
            <KanbanSquare className="size-4" /> Kanban
          </button>
          <button type="button" onClick={() => setView("list")}
            className={cn("flex items-center gap-1.5 px-3 py-1.5 text-sm", view === "list" ? "bg-primary text-primary-foreground" : "hover:bg-accent")}>
            <List className="size-4" /> Lista
          </button>
        </div>
      </div>

      {view === "kanban" ? (
        <div className="grid gap-4 overflow-x-auto sm:grid-cols-2 xl:grid-cols-3">
          {STATUS.map((col) => (
            <div key={col.key} className="rounded-xl border bg-muted/30 p-3">
              <div className="mb-3 flex items-center gap-2 px-1">
                <span className={cn("size-2 rounded-full", col.color)} />
                <span className="text-sm font-medium">{col.label}</span>
                <span className="ml-auto text-xs text-muted-foreground">{byStatus[col.key]?.length ?? 0}</span>
              </div>
              <div className="space-y-2">
                {(byStatus[col.key] ?? []).map((it) => (
                  <PlanCard key={it.id} item={it} onStatus={(s) => changeStatus(it.id, s)} onRemove={() => remove(it.id)} onPatch={(p) => patch(it.id, p)} compact />
                ))}
                {(byStatus[col.key]?.length ?? 0) === 0 && (
                  <p className="px-1 py-2 text-xs text-muted-foreground/70">—</p>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="space-y-2">
          {items.map((it) => (
            <PlanCard key={it.id} item={it} onStatus={(s) => changeStatus(it.id, s)} onRemove={() => remove(it.id)} onPatch={(p) => patch(it.id, p)} />
          ))}
        </div>
      )}
    </div>
  );
}

function PlanCard({
  item,
  onStatus,
  onRemove,
  onPatch,
  compact,
}: {
  item: PlanItem;
  onStatus: (s: PlanStatus) => void;
  onRemove: () => void;
  onPatch: (p: Partial<PlanItem>) => void;
  compact?: boolean;
}) {
  const [open, setOpen] = useState(false);
  return (
    <div className="rounded-lg border bg-card p-3">
      <div className="flex items-start gap-2">
        {!compact && <GripVertical className="mt-0.5 size-4 shrink-0 text-muted-foreground/40" />}
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-medium">{item.title}</p>
          {(item.product || item.brand) && (
            <p className="truncate text-xs text-muted-foreground">
              {[item.product, item.brand].filter(Boolean).join(" · ")}
            </p>
          )}
        </div>
        <button aria-label="Remover" onClick={onRemove} className="text-muted-foreground hover:text-destructive">
          <Trash2 className="size-4" />
        </button>
      </div>

      <div className="mt-2 flex items-center gap-2">
        <select
          value={item.status}
          onChange={(e) => onStatus(e.target.value as PlanStatus)}
          className="h-7 flex-1 rounded-md border border-input bg-background px-2 text-xs"
        >
          {STATUS.map((s) => (
            <option key={s.key} value={s.key}>{s.label}</option>
          ))}
        </select>
        <button type="button" onClick={() => setOpen((v) => !v)} className="text-xs text-muted-foreground hover:text-foreground">
          {open ? "Fechar" : "Notas"}
        </button>
      </div>

      {open && (
        <div className="mt-2 space-y-2">
          <Input
            defaultValue={item.notes}
            placeholder="Notas…"
            className="h-8 text-xs"
            onBlur={(e) => e.target.value !== item.notes && onPatch({ notes: e.target.value })}
          />
          <Input
            defaultValue={item.contentLink}
            placeholder="Link do conteúdo…"
            className="h-8 text-xs"
            onBlur={(e) => e.target.value !== item.contentLink && onPatch({ contentLink: e.target.value })}
          />
        </div>
      )}
    </div>
  );
}
