/**
 * Section keys the public renderer knows how to render, in default order.
 * Defined here (not in the Mongoose model) so client components can import it
 * without pulling mongoose into the browser bundle.
 */
export const DEFAULT_SECTIONS = [
  "hero",
  "about",
  "specialties",
  "videos",
  "cases",
  "clients",
  "testimonials",
  "equipment",
  "contact",
];

export interface MediaView {
  id: string;
  type: "video" | "image";
  url: string;
  thumbnail?: string | null;
  title?: string;
  description?: string;
  category?: string;
  featured?: boolean;
}

export interface TestimonialView {
  author: string;
  role?: string;
  avatar?: string | null;
  quote: string;
}

export interface ClientView {
  name: string;
  logo?: string | null;
}

export interface CaseView {
  title: string;
  brand?: string;
  description?: string;
  result?: string;
  thumbnail?: string | null;
}

export interface SectionView {
  key: string;
  enabled: boolean;
  order: number;
}

export interface PortfolioView {
  slug: string;
  fullName: string;
  username: string;
  photo?: string | null;
  city?: string;
  country?: string;
  languages?: string[];
  niches?: string[];
  equipment?: string[];
  socials?: { platform: string; url: string }[];

  headline?: string;
  professionalBio?: string;
  aboutMe?: string;
  specialties?: string[];
  brandDescription?: string;
  ctaPrimary?: string;
  ctaContact?: string;

  templateSlug?: string;
  accent?: string | null;
  font?: string | null;

  sections: SectionView[];
  media: MediaView[];
  testimonials: TestimonialView[];
  clients: ClientView[];
  cases: CaseView[];

  published?: boolean;
}

/** Normalized section list (fills defaults, sorts by order). */
export function resolveSections(raw?: SectionView[]): SectionView[] {
  if (!raw || raw.length === 0) {
    return DEFAULT_SECTIONS.map((key, i) => ({ key, enabled: true, order: i }));
  }
  // Ensure every known section exists, keeping stored enabled/order.
  const byKey = new Map(raw.map((s) => [s.key, s]));
  const merged = DEFAULT_SECTIONS.map((key, i) => {
    const found = byKey.get(key);
    return found ?? { key, enabled: true, order: i };
  });
  return merged.sort((a, b) => a.order - b.order);
}

type AnyRecord = Record<string, unknown>;

/** Build a PortfolioView from a lean Portfolio doc + its media docs. */
export function toPortfolioView(
  p: AnyRecord,
  media: AnyRecord[] = []
): PortfolioView {
  const profile = (p.profile ?? {}) as AnyRecord;
  const ai = (p.ai ?? {}) as AnyRecord;
  const theme = (p.theme ?? {}) as AnyRecord;

  return {
    slug: (p.slug as string) ?? "",
    fullName: (profile.fullName as string) ?? "",
    username: (profile.username as string) ?? (p.slug as string) ?? "",
    photo: (profile.photo as string) ?? null,
    city: (profile.city as string) ?? "",
    country: (profile.country as string) ?? "",
    languages: (profile.languages as string[]) ?? [],
    niches: (profile.niches as string[]) ?? [],
    equipment: (profile.equipment as string[]) ?? [],
    socials: (profile.socials as { platform: string; url: string }[]) ?? [],

    headline: (ai.headline as string) ?? "",
    professionalBio: (ai.professionalBio as string) ?? "",
    aboutMe: (ai.aboutMe as string) ?? "",
    specialties: (ai.specialties as string[]) ?? [],
    brandDescription: (ai.brandDescription as string) ?? "",
    ctaPrimary: (ai.ctaPrimary as string) ?? "",
    ctaContact: (ai.ctaContact as string) ?? "",

    templateSlug: (p.templateSlug as string) ?? "minimal",
    accent: (theme.accent as string) ?? null,
    font: (theme.font as string) ?? null,

    sections: resolveSections(p.sections as SectionView[] | undefined),
    media: media.map((m) => ({
      id: String(m._id),
      type: (m.type as "video" | "image") ?? "video",
      url: (m.url as string) ?? "",
      thumbnail: (m.thumbnail as string) ?? null,
      title: (m.title as string) ?? "",
      description: (m.description as string) ?? "",
      category: (m.category as string) ?? "",
      featured: Boolean(m.featured),
    })),
    testimonials: ((p.testimonials as AnyRecord[]) ?? []).map((t) => ({
      author: (t.author as string) ?? "",
      role: (t.role as string) ?? "",
      avatar: (t.avatar as string) ?? null,
      quote: (t.quote as string) ?? "",
    })),
    clients: ((p.clients as AnyRecord[]) ?? []).map((c) => ({
      name: (c.name as string) ?? "",
      logo: (c.logo as string) ?? null,
    })),
    cases: ((p.cases as AnyRecord[]) ?? []).map((c) => ({
      title: (c.title as string) ?? "",
      brand: (c.brand as string) ?? "",
      description: (c.description as string) ?? "",
      result: (c.result as string) ?? "",
      thumbnail: (c.thumbnail as string) ?? null,
    })),

    published: Boolean(p.published),
  };
}
