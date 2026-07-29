"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import { Eye, Users, MousePointerClick, Play, Share2 } from "lucide-react";
import type { AnalyticsSummary } from "@/lib/actions/analytics";
import { cn } from "@/lib/utils";

function shortDate(iso: string) {
  const [, m, d] = iso.split("-");
  return `${d}/${m}`;
}

interface StatCardProps {
  label: string;
  value: number;
  icon: React.ReactNode;
  className?: string;
}

function StatCard({ label, value, icon, className }: StatCardProps) {
  return (
    <div className={cn("rounded-xl border bg-card p-5", className)}>
      <div className="mb-3 flex items-center gap-2 text-muted-foreground">
        {icon}
        <span className="text-xs font-medium uppercase tracking-wider">{label}</span>
      </div>
      <p className="text-3xl font-bold tabular-nums">{value.toLocaleString("pt")}</p>
    </div>
  );
}

export function AnalyticsDashboard({ data }: { data: AnalyticsSummary }) {
  const maxVisits = Math.max(...data.recentVisits.map((d) => d.visits), 1);

  return (
    <div className="space-y-6">
      {/* Stat cards */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Visitas totais"
          value={data.totalVisits}
          icon={<Eye className="size-4" />}
        />
        <StatCard
          label="Visitantes únicos"
          value={data.uniqueVisitors}
          icon={<Users className="size-4" />}
        />
        <StatCard
          label="Cliques em redes"
          value={data.socialClicks}
          icon={<Share2 className="size-4" />}
        />
        <StatCard
          label="Vídeos vistos"
          value={data.videoViews}
          icon={<Play className="size-4" />}
        />
      </div>

      {/* Contact clicks */}
      <div className="rounded-xl border bg-card p-5">
        <div className="flex items-center gap-2 text-muted-foreground mb-1">
          <MousePointerClick className="size-4" />
          <span className="text-xs font-medium uppercase tracking-wider">Cliques em contacto</span>
        </div>
        <p className="text-3xl font-bold tabular-nums">{data.contactClicks.toLocaleString("pt")}</p>
      </div>

      {/* Visits chart */}
      <div className="rounded-xl border bg-card p-6">
        <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
          Visitas — últimos 7 dias
        </h2>
        {maxVisits === 0 ? (
          <p className="py-8 text-center text-sm text-muted-foreground">
            Ainda sem visitas registadas neste período.
          </p>
        ) : (
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={data.recentVisits} margin={{ top: 4, right: 4, bottom: 4, left: -20 }}>
              <XAxis
                dataKey="date"
                tickFormatter={shortDate}
                tick={{ fontSize: 11 }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                allowDecimals={false}
                tick={{ fontSize: 11 }}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip
                formatter={(v) => [v ?? 0, "Visitas"]}
                labelFormatter={(l) => shortDate(String(l))}
                cursor={{ fill: "oklch(0.55 0.22 285 / 0.08)" }}
                contentStyle={{
                  fontSize: 12,
                  borderRadius: 8,
                  border: "1px solid oklch(0.9 0.005 285)",
                }}
              />
              <Bar dataKey="visits" radius={[4, 4, 0, 0]} maxBarSize={40}>
                {data.recentVisits.map((entry, i) => (
                  <Cell
                    key={i}
                    fill={entry.visits > 0 ? "oklch(0.55 0.22 285)" : "oklch(0.9 0.005 285)"}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}
