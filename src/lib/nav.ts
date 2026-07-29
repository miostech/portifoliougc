import type { LucideIcon } from "lucide-react";
import {
  LayoutDashboard,
  UserRound,
  PencilRuler,
  Images,
  Clapperboard,
  ClipboardList,
  BarChart3,
  Gauge,
  Sparkles,
  Settings,
  CreditCard,
  Users,
  LayoutTemplate,
  Film,
  Tags,
  ScrollText,
  Cog,
} from "lucide-react";

export interface NavItem {
  href: string;
  label: string;
  icon: LucideIcon;
  /** Match nested routes as active (default true for non-root). */
  exact?: boolean;
}

export interface NavGroup {
  title?: string;
  items: NavItem[];
}

export const appNav: NavGroup[] = [
  {
    items: [
      { href: "/app", label: "Painel", icon: LayoutDashboard, exact: true },
      { href: "/app/portfolio", label: "Portfólio", icon: UserRound },
      { href: "/app/portfolio/editor", label: "Editor", icon: PencilRuler },
      { href: "/app/conteudos", label: "Conteúdos", icon: Images },
    ],
  },
  {
    title: "Criação",
    items: [
      { href: "/app/modelos", label: "Modelos de vídeos", icon: Clapperboard },
      {
        href: "/app/plano-de-gravacao",
        label: "Plano de gravação",
        icon: ClipboardList,
      },
      { href: "/app/ia", label: "Assistente IA", icon: Sparkles },
    ],
  },
  {
    title: "Desempenho",
    items: [
      { href: "/app/analytics", label: "Analytics", icon: BarChart3 },
      { href: "/app/portfolio-score", label: "Portfolio Score", icon: Gauge },
    ],
  },
  {
    title: "Conta",
    items: [
      { href: "/app/assinatura", label: "Assinatura", icon: CreditCard },
      { href: "/app/configuracoes", label: "Configurações", icon: Settings },
    ],
  },
];

export const adminNav: NavGroup[] = [
  {
    items: [
      { href: "/admin", label: "Visão geral", icon: LayoutDashboard, exact: true },
      { href: "/admin/utilizadores", label: "Utilizadores", icon: Users },
      { href: "/admin/assinaturas", label: "Assinaturas", icon: CreditCard },
      { href: "/admin/analytics", label: "Analytics", icon: BarChart3 },
    ],
  },
  {
    title: "Catálogo",
    items: [
      { href: "/admin/templates", label: "Templates", icon: LayoutTemplate },
      { href: "/admin/modelos-de-videos", label: "Modelos de vídeos", icon: Film },
      { href: "/admin/nichos", label: "Nichos", icon: Tags },
    ],
  },
  {
    title: "Sistema",
    items: [
      { href: "/admin/prompts", label: "Prompts de IA", icon: ScrollText },
      { href: "/admin/configuracoes", label: "Configurações", icon: Cog },
    ],
  },
];
