"use client";

import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

export function ChipMultiSelect({
  options,
  value,
  onChange,
  max,
}: {
  options: string[];
  value: string[];
  onChange: (next: string[]) => void;
  max?: number;
}) {
  const toggle = (opt: string) => {
    if (value.includes(opt)) {
      onChange(value.filter((v) => v !== opt));
    } else {
      if (max && value.length >= max) return;
      onChange([...value, opt]);
    }
  };
  return (
    <div className="flex flex-wrap gap-2">
      {options.map((opt) => {
        const active = value.includes(opt);
        return (
          <button
            key={opt}
            type="button"
            onClick={() => toggle(opt)}
            aria-pressed={active}
            className={cn(
              "inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-sm transition-colors",
              active
                ? "border-primary bg-primary text-primary-foreground"
                : "border-border bg-background hover:bg-accent"
            )}
          >
            {active && <Check className="size-3.5" />}
            {opt}
          </button>
        );
      })}
    </div>
  );
}

export function ChipSingleSelect({
  options,
  value,
  onChange,
}: {
  options: { value: string; label: string }[] | string[];
  value: string;
  onChange: (next: string) => void;
}) {
  const opts = options.map((o) =>
    typeof o === "string" ? { value: o, label: o } : o
  );
  return (
    <div className="flex flex-wrap gap-2">
      {opts.map((opt) => {
        const active = value === opt.value;
        return (
          <button
            key={opt.value}
            type="button"
            onClick={() => onChange(opt.value)}
            aria-pressed={active}
            className={cn(
              "rounded-full border px-3 py-1.5 text-sm transition-colors",
              active
                ? "border-primary bg-primary text-primary-foreground"
                : "border-border bg-background hover:bg-accent"
            )}
          >
            {opt.label}
          </button>
        );
      })}
    </div>
  );
}
