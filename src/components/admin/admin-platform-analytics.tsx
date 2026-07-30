"use client";

import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from "recharts";
import type { PlatformStats } from "@/lib/actions/admin";

const EVENT_LABELS: Record<string, string> = {
  visit: "Visitas",
  social_click: "Cliques em redes",
  contact_click: "Cliques em contacto",
  video_view: "Vídeos vistos",
};

function shortDate(iso: string) {
  const [, m, d] = iso.split("-");
  return `${d}/${m}`;
}

export function AdminPlatformAnalytics({ data }: { data: PlatformStats | null }) {
  if (!data) {
    return (
      <div className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-8 text-center text-sm text-amber-800 dark:border-amber-800 dark:bg-amber-900/20 dark:text-amber-400">
        Base de dados offline. Dados de analytics indisponíveis.
      </div>
    );
  }

  const maxVisits = Math.max(...data.visitsByDay.map((d) => d.visits), 1);

  return (
    <div className="space-y-6">
      <div className="rounded-xl border bg-card p-6">
        <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
          Visitas — últimos 7 dias (todos os portfólios)
        </h2>
        {maxVisits === 0 ? (
          <p className="py-8 text-center text-sm text-muted-foreground">Sem visitas neste período.</p>
        ) : (
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={data.visitsByDay} margin={{ top: 4, right: 4, bottom: 4, left: -20 }}>
              <XAxis dataKey="date" tickFormatter={shortDate} tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis allowDecimals={false} tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip formatter={(v) => [v ?? 0, "Visitas"]} labelFormatter={(l) => shortDate(String(l))} cursor={{ fill: "oklch(0.55 0.22 285 / 0.08)" }} contentStyle={{ fontSize: 12, borderRadius: 8 }} />
              <Bar dataKey="visits" radius={[4, 4, 0, 0]} maxBarSize={40}>
                {data.visitsByDay.map((entry, i) => (
                  <Cell key={i} fill={entry.visits > 0 ? "oklch(0.55 0.22 285)" : "oklch(0.9 0.005 285)"} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>

      {data.eventBreakdown.length > 0 && (
        <div className="rounded-xl border bg-card p-6">
          <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
            Eventos por tipo (total)
          </h2>
          <div className="space-y-3">
            {data.eventBreakdown.map((ev) => (
              <div key={ev.type} className="flex items-center justify-between">
                <span className="text-sm">{EVENT_LABELS[ev.type] ?? ev.type}</span>
                <span className="font-semibold tabular-nums">{ev.count.toLocaleString("pt")}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {data.eventBreakdown.length === 0 && (
        <p className="py-4 text-center text-sm text-muted-foreground">Sem eventos registados ainda.</p>
      )}
    </div>
  );
}
