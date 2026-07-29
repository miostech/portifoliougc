import type { UserPlan } from "@/models/User";

/**
 * Plan catalog. There is intentionally NO free plan — creators can sign up,
 * onboard and preview, but publishing and the core features require a paid
 * plan. Stripe price IDs are read from env and are optional in demo mode.
 */

export type PlanKey = Exclude<UserPlan, "none">;

/** Feature flags gated by plan. */
export type Feature =
  | "publish"
  | "public_url"
  | "essential_templates"
  | "all_templates"
  | "ai_copy"
  | "media_upload"
  | "categories"
  | "contact_buttons"
  | "analytics_basic"
  | "analytics_advanced"
  | "portfolio_score"
  | "suggestions"
  | "video_library_basic"
  | "video_library_full"
  | "unlimited_updates"
  | "advanced_customization"
  | "auto_titles_descriptions"
  | "thumbnail_generation"
  | "custom_domain"
  | "media_kit"
  | "quote_form"
  | "remove_branding"
  | "multi_language"
  | "ai_assistant"
  | "custom_scripts"
  | "brand_outreach"
  | "advanced_positioning";

export interface PlanDefinition {
  key: PlanKey;
  name: string;
  tagline: string;
  priceMonthly: number; // EUR
  priceYearly: number;
  highlight?: boolean;
  storageGb: number;
  features: Feature[];
  /** Human-facing bullet list for the pricing page. */
  bullets: string[];
  stripePriceIdEnv: string;
}

const ESSENCIAL_FEATURES: Feature[] = [
  "publish",
  "public_url",
  "essential_templates",
  "ai_copy",
  "media_upload",
  "categories",
  "contact_buttons",
  "analytics_basic",
  "portfolio_score",
  "suggestions",
  "video_library_basic",
  "unlimited_updates",
];

const PRO_FEATURES: Feature[] = [
  ...ESSENCIAL_FEATURES,
  "all_templates",
  "advanced_customization",
  "auto_titles_descriptions",
  "thumbnail_generation",
  "analytics_advanced",
  "custom_domain",
  "media_kit",
  "quote_form",
  "remove_branding",
  "multi_language",
  "ai_assistant",
  "custom_scripts",
  "brand_outreach",
  "video_library_full",
  "advanced_positioning",
];

export const PLANS: Record<PlanKey, PlanDefinition> = {
  essencial: {
    key: "essencial",
    name: "Essencial",
    tagline: "Tudo para publicar o seu primeiro portfólio profissional.",
    priceMonthly: 12,
    priceYearly: 108,
    storageGb: 2,
    features: ESSENCIAL_FEATURES,
    stripePriceIdEnv: "STRIPE_PRICE_ESSENCIAL",
    bullets: [
      "Um portfólio público com URL no domínio Portfolio UGC",
      "Templates essenciais",
      "Geração de headline, bio e textos com IA",
      "Upload de fotografias e vídeos",
      "Organização por categorias",
      "Botões de contacto e redes sociais",
      "Analytics básico e Portfolio Score",
      "Sugestões de melhoria",
      "Biblioteca básica de modelos de vídeos",
      "Atualizações ilimitadas do portfólio",
    ],
  },
  pro: {
    key: "pro",
    name: "Pro",
    tagline: "Para criadoras que querem escalar as parcerias com marcas.",
    priceMonthly: 24,
    priceYearly: 228,
    highlight: true,
    storageGb: 20,
    features: PRO_FEATURES,
    stripePriceIdEnv: "STRIPE_PRICE_PRO",
    bullets: [
      "Tudo do Essencial, e mais:",
      "Acesso a todos os templates",
      "Personalização avançada de cores e fontes",
      "Geração automática de títulos, descrições e thumbnails",
      "Analytics avançado e domínio personalizado",
      "Media kit e formulário de orçamento",
      "Remoção da marca Portfolio UGC",
      "Portfólio em vários idiomas",
      "Assistente profissional de IA e roteiros personalizados",
      "Mensagens de prospeção para marcas",
      "Biblioteca completa de vídeos",
    ],
  },
};

export const PLAN_LIST: PlanDefinition[] = [PLANS.essencial, PLANS.pro];

/** Whether a plan grants a feature. `none` grants nothing gated. */
export function planHasFeature(plan: UserPlan, feature: Feature): boolean {
  if (plan === "none") return false;
  return PLANS[plan].features.includes(feature);
}

export function isPaid(plan: UserPlan): plan is PlanKey {
  return plan === "essencial" || plan === "pro";
}
