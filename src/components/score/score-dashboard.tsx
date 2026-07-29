"use client";

import Link from "next/link";
import { ArrowRight, TrendingUp, Lightbulb } from "lucide-react";
import type { ScoreResult } from "@/lib/actions/score";
import { cn } from "@/lib/utils";

const PRIORITY_BADGE: Record<string, string> = {
  alta: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
  media: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
  baixa: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
};

function scoreColor(n: number) {
  if (n >= 75) return "text-emerald-600";
  if (n >= 50) return "text-amber-600";
  return "text-red-500";
}

function barColor(n: number) {
  if (n >= 75) return "bg-emerald-500";
  if (n >= 50) return "bg-amber-500";
  return "bg-red-400";
}

export function ScoreDashboard({ data }: { data: ScoreResult }) {
  const { score, suggestions } = data;

  return (
    <div className="space-y-8">
      {/* Score total */}
      <div className="flex flex-col items-center gap-3 rounded-2xl border bg-card py-10 text-center">
        <p className="text-sm font-medium uppercase tracking-wider text-muted-foreground">
          Portfolio Score
        </p>
        <p className={cn("text-8xl font-bold tabular-nums leading-none", scoreColor(score.total))}>
          {score.total}
        </p>
        <p className="max-w-xs text-sm text-muted-foreground">{score.message}</p>
        {score.strengths.length > 0 && (
          <div className="mt-2 flex flex-wrap justify-center gap-2">
            {score.strengths.map((s) => (
              <span
                key={s}
                className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-3 py-1 text-xs font-medium text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400"
              >
                <TrendingUp className="size-3" /> {s}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Category breakdown */}
      <div className="rounded-2xl border bg-card p-6">
        <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
          Detalhes por categoria
        </h2>
        <div className="space-y-4">
          {score.categories.map((cat) => (
            <div key={cat.key}>
              <div className="mb-1.5 flex justify-between text-sm">
                <span className="font-medium">{cat.label}</span>
                <span className={cn("font-semibold tabular-nums", scoreColor(cat.score))}>
                  {cat.score}
                </span>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-muted">
                <div
                  className={cn("h-full rounded-full transition-all", barColor(cat.score))}
                  style={{ width: `${cat.score}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Suggestions */}
      {suggestions.length > 0 && (
        <div className="rounded-2xl border bg-card p-6">
          <div className="mb-4 flex items-center gap-2">
            <Lightbulb className="size-4 text-primary" />
            <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
              Recomendações prioritárias
            </h2>
          </div>
          <div className="space-y-3">
            {suggestions.map((s) => (
              <div
                key={s.id}
                className="flex items-start justify-between gap-4 rounded-xl border p-4"
              >
                <div className="min-w-0 flex-1">
                  <div className="mb-1 flex flex-wrap items-center gap-2">
                    <span className="font-medium">{s.title}</span>
                    <span
                      className={cn(
                        "rounded-full px-2 py-0.5 text-xs font-medium capitalize",
                        PRIORITY_BADGE[s.priority]
                      )}
                    >
                      {s.priority}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground">{s.description}</p>
                </div>
                <Link
                  href={s.actionHref}
                  className="shrink-0 inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline"
                >
                  {s.actionLabel} <ArrowRight className="size-3.5" />
                </Link>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
