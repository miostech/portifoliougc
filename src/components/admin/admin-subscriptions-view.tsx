"use client";

import { TrendingUp, Users, Euro } from "lucide-react";
import type { SubscriptionSummary, AdminSubscription } from "@/lib/actions/admin";
import { cn } from "@/lib/utils";

const PLAN_BADGE: Record<string, string> = {
  essencial: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
  pro: "bg-violet-100 text-violet-700 dark:bg-violet-900/30 dark:text-violet-400",
};

export function AdminSubscriptionsView({
  summary,
  subs,
  dbOffline,
}: {
  summary: SubscriptionSummary | null;
  subs: AdminSubscription[];
  dbOffline: boolean;
}) {
  if (dbOffline) {
    return (
      <div className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-8 text-center text-sm text-amber-800 dark:border-amber-800 dark:bg-amber-900/20 dark:text-amber-400">
        Base de dados offline. Dados de assinaturas indisponíveis.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {summary && (
        <div className="grid gap-4 sm:grid-cols-3">
          <StatCard label="MRR simulado" value={`€${summary.simulatedMrrEur}`} icon={<Euro className="size-4" />} />
          <StatCard label="Planos Essencial" value={String(summary.essencial)} icon={<Users className="size-4" />} />
          <StatCard label="Planos Pro" value={String(summary.pro)} icon={<TrendingUp className="size-4" />} />
        </div>
      )}

      <div className="overflow-x-auto rounded-xl border">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b bg-muted/40 text-xs font-medium uppercase tracking-wider text-muted-foreground">
              <th className="px-4 py-3 text-left">Utilizador</th>
              <th className="px-4 py-3 text-left">Plano</th>
              <th className="px-4 py-3 text-left">Estado</th>
              <th className="px-4 py-3 text-left">Desde</th>
            </tr>
          </thead>
          <tbody>
            {subs.length === 0 && (
              <tr>
                <td colSpan={4} className="px-4 py-8 text-center text-muted-foreground">
                  Sem assinaturas ativas.
                </td>
              </tr>
            )}
            {subs.map((s) => (
              <tr key={s.id} className="border-b last:border-0 hover:bg-muted/20">
                <td className="px-4 py-3">
                  <p className="font-medium">{s.name || "—"}</p>
                  <p className="text-xs text-muted-foreground">{s.email}</p>
                </td>
                <td className="px-4 py-3">
                  <span className={cn("rounded-full px-2 py-0.5 text-xs font-medium capitalize", PLAN_BADGE[s.plan] ?? "")}>
                    {s.plan}
                  </span>
                </td>
                <td className="px-4 py-3 text-xs capitalize text-muted-foreground">{s.status}</td>
                <td className="px-4 py-3 text-xs text-muted-foreground">{s.since}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function StatCard({ label, value, icon }: { label: string; value: string; icon: React.ReactNode }) {
  return (
    <div className="rounded-xl border bg-card p-5">
      <div className="mb-2 flex items-center gap-2 text-muted-foreground">
        {icon}
        <span className="text-xs font-medium uppercase tracking-wider">{label}</span>
      </div>
      <p className="text-3xl font-bold">{value}</p>
    </div>
  );
}
