import type { PlanKey } from "@/lib/plans";

export type TemplateSlug = "minimal" | "creator" | "premium" | "professional";

export interface TemplateDefinition {
  slug: TemplateSlug;
  name: string;
  description: string;
  /** Minimum plan required to use this template. */
  minPlan: PlanKey;
  accent: string; // oklch/hex used as the portfolio accent
  /** Preview gradient for cards. */
  preview: { from: string; to: string };
  /** Visual traits the public renderer reads. */
  style: {
    surface: "light" | "dark";
    fontHeading: "sans" | "serif";
    heroLayout: "centered" | "split";
    mediaGrid: "grid" | "masonry";
    rounded: "sm" | "md" | "lg" | "xl";
  };
}

export const TEMPLATES: Record<TemplateSlug, TemplateDefinition> = {
  minimal: {
    slug: "minimal",
    name: "Minimal",
    description: "Fundo claro, tipografia elegante, muito espaço em branco.",
    minPlan: "essencial",
    accent: "oklch(0.55 0.22 285)",
    preview: { from: "oklch(0.97 0.01 285)", to: "oklch(0.9 0.03 285)" },
    style: {
      surface: "light",
      fontHeading: "sans",
      heroLayout: "centered",
      mediaGrid: "grid",
      rounded: "lg",
    },
  },
  creator: {
    slug: "creator",
    name: "Creator",
    description: "Visual expressivo, cards maiores, destaque para redes sociais.",
    minPlan: "essencial",
    accent: "oklch(0.62 0.2 330)",
    preview: { from: "oklch(0.6 0.2 285)", to: "oklch(0.66 0.17 330)" },
    style: {
      surface: "light",
      fontHeading: "sans",
      heroLayout: "split",
      mediaGrid: "masonry",
      rounded: "xl",
    },
  },
  premium: {
    slug: "premium",
    name: "Premium",
    description: "Aparência sofisticada, tipografia editorial, tons escuros.",
    minPlan: "pro",
    accent: "oklch(0.72 0.15 25)",
    preview: { from: "oklch(0.28 0.05 285)", to: "oklch(0.4 0.08 320)" },
    style: {
      surface: "dark",
      fontHeading: "serif",
      heroLayout: "split",
      mediaGrid: "grid",
      rounded: "md",
    },
  },
  professional: {
    slug: "professional",
    name: "Professional",
    description: "Visual corporativo e objetivo, ideal para tech, saúde e educação.",
    minPlan: "pro",
    accent: "oklch(0.62 0.12 230)",
    preview: { from: "oklch(0.62 0.12 230)", to: "oklch(0.7 0.14 200)" },
    style: {
      surface: "light",
      fontHeading: "sans",
      heroLayout: "centered",
      mediaGrid: "grid",
      rounded: "sm",
    },
  },
};

export const TEMPLATE_LIST: TemplateDefinition[] = [
  TEMPLATES.minimal,
  TEMPLATES.creator,
  TEMPLATES.premium,
  TEMPLATES.professional,
];

export function getTemplate(slug?: string | null): TemplateDefinition {
  if (slug && slug in TEMPLATES) return TEMPLATES[slug as TemplateSlug];
  return TEMPLATES.minimal;
}
