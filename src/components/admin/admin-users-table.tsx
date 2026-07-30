"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { ShieldCheck, Ban, Search } from "lucide-react";
import {
  adminUpdateUserPlan,
  adminToggleSuspend,
  adminPromoteToAdmin,
  type AdminUser,
} from "@/lib/actions/admin";
import type { UserPlan } from "@/models/User";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

const PLAN_OPTS: { value: string; label: string }[] = [
  { value: "", label: "Todos os planos" },
  { value: "none", label: "Sem plano" },
  { value: "essencial", label: "Essencial" },
  { value: "pro", label: "Pro" },
];

const PLAN_BADGE: Record<string, string> = {
  none: "bg-muted text-muted-foreground",
  essencial: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
  pro: "bg-violet-100 text-violet-700 dark:bg-violet-900/30 dark:text-violet-400",
};

export function AdminUsersTable({
  initialUsers,
  dbOffline,
}: {
  initialUsers: AdminUser[];
  dbOffline: boolean;
}) {
  const router = useRouter();
  const [pending, start] = useTransition();
  const [search, setSearch] = useState("");
  const [planFilter, setPlanFilter] = useState("");

  const filtered = initialUsers.filter((u) => {
    if (planFilter && u.plan !== planFilter) return false;
    if (search) {
      const q = search.toLowerCase();
      if (!u.name.toLowerCase().includes(q) && !u.email.toLowerCase().includes(q)) return false;
    }
    return true;
  });

  function changePlan(userId: string, plan: string) {
    start(async () => {
      const res = await adminUpdateUserPlan(userId, plan as UserPlan);
      if (!res.ok) { toast.error(res.error ?? "Erro."); return; }
      toast.success("Plano atualizado.");
      router.refresh();
    });
  }

  function toggleSuspend(userId: string, currentlySuspended: boolean) {
    start(async () => {
      const res = await adminToggleSuspend(userId);
      if (!res.ok) { toast.error(res.error ?? "Erro."); return; }
      toast.success(currentlySuspended ? "Utilizador reativado." : "Utilizador suspenso.");
      router.refresh();
    });
  }

  function promote(userId: string) {
    start(async () => {
      const res = await adminPromoteToAdmin(userId);
      if (!res.ok) { toast.error(res.error ?? "Erro."); return; }
      toast.success("Utilizador promovido a admin.");
      router.refresh();
    });
  }

  if (dbOffline) {
    return (
      <div className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-8 text-center text-sm text-amber-800 dark:border-amber-800 dark:bg-amber-900/20 dark:text-amber-400">
        Base de dados offline. Execute <code className="font-mono">npm run seed</code> após iniciar o MongoDB para ver utilizadores.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Pesquisar por nome ou email…" className="pl-9" />
        </div>
        <select
          value={planFilter}
          onChange={(e) => setPlanFilter(e.target.value)}
          className="h-10 rounded-lg border border-input bg-background px-3 text-sm"
        >
          {PLAN_OPTS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
        </select>
      </div>

      <p className="text-sm text-muted-foreground">{filtered.length} utilizadores</p>

      <div className="overflow-x-auto rounded-xl border">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b bg-muted/40 text-xs font-medium uppercase tracking-wider text-muted-foreground">
              <th className="px-4 py-3 text-left">Nome / Email</th>
              <th className="px-4 py-3 text-left">Plano</th>
              <th className="px-4 py-3 text-left">Role</th>
              <th className="px-4 py-3 text-left">Estado</th>
              <th className="px-4 py-3 text-left">Criado</th>
              <th className="px-4 py-3 text-left">Ações</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 && (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-muted-foreground">
                  Nenhum utilizador encontrado.
                </td>
              </tr>
            )}
            {filtered.map((u) => (
              <tr key={u.id} className={cn("border-b last:border-0 hover:bg-muted/20", u.suspended && "opacity-60")}>
                <td className="px-4 py-3">
                  <p className="font-medium">{u.name || "—"}</p>
                  <p className="text-xs text-muted-foreground">{u.email}</p>
                </td>
                <td className="px-4 py-3">
                  <select
                    value={u.plan}
                    onChange={(e) => changePlan(u.id, e.target.value)}
                    disabled={pending}
                    className={cn(
                      "rounded-full px-2 py-0.5 text-xs font-medium border-none outline-none cursor-pointer",
                      PLAN_BADGE[u.plan] ?? "bg-muted"
                    )}
                  >
                    <option value="none">Nenhum</option>
                    <option value="essencial">Essencial</option>
                    <option value="pro">Pro</option>
                  </select>
                </td>
                <td className="px-4 py-3 capitalize text-muted-foreground">{u.role}</td>
                <td className="px-4 py-3">
                  <span className={cn(
                    "rounded-full px-2 py-0.5 text-xs font-medium",
                    u.suspended
                      ? "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                      : "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400"
                  )}>
                    {u.suspended ? "Suspenso" : "Ativo"}
                  </span>
                </td>
                <td className="px-4 py-3 text-xs text-muted-foreground">
                  {u.createdAt ? new Date(u.createdAt).toLocaleDateString("pt") : "—"}
                </td>
                <td className="px-4 py-3">
                  <div className="flex gap-2">
                    <button
                      type="button"
                      disabled={pending}
                      onClick={() => toggleSuspend(u.id, u.suspended)}
                      title={u.suspended ? "Reativar" : "Suspender"}
                      className="text-muted-foreground hover:text-foreground disabled:opacity-50"
                    >
                      <Ban className="size-4" />
                    </button>
                    {u.role !== "admin" && (
                      <button
                        type="button"
                        disabled={pending}
                        onClick={() => promote(u.id)}
                        title="Promover a admin"
                        className="text-muted-foreground hover:text-primary disabled:opacity-50"
                      >
                        <ShieldCheck className="size-4" />
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
