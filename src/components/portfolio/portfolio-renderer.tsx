import { getTemplate, type TemplateSlug } from "@/lib/templates";
import type { PortfolioView } from "@/lib/portfolio-view";
import { cn } from "@/lib/utils";

const roundedMap = {
  sm: "rounded-md",
  md: "rounded-lg",
  lg: "rounded-xl",
  xl: "rounded-2xl",
} as const;

function socialHref(platform: string, url: string): string {
  if (platform === "email") return url.startsWith("mailto:") ? url : `mailto:${url}`;
  if (platform === "whatsapp") {
    const digits = url.replace(/[^0-9]/g, "");
    return digits ? `https://wa.me/${digits}` : url;
  }
  return url;
}

const socialLabels: Record<string, string> = {
  instagram: "Instagram",
  tiktok: "TikTok",
  youtube: "YouTube",
  linkedin: "LinkedIn",
  website: "Website",
  whatsapp: "WhatsApp",
  email: "E-mail",
};

export function PortfolioRenderer({
  data,
  className,
}: {
  data: PortfolioView;
  className?: string;
}) {
  const template = getTemplate(data.templateSlug as TemplateSlug);
  const dark = template.style.surface === "dark";
  const rounded = roundedMap[template.style.rounded];
  const serif = (data.font ?? template.style.fontHeading) === "serif";
  const accent = data.accent ?? template.accent;
  const location = [data.city, data.country].filter(Boolean).join(", ");
  const initials = (data.fullName || "UGC")
    .split(" ")
    .map((p) => p[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  const enabled = new Set(
    data.sections.filter((s) => s.enabled).map((s) => s.key)
  );
  const order = data.sections
    .filter((s) => s.enabled)
    .sort((a, b) => a.order - b.order)
    .map((s) => s.key);

  const contactSocials = (data.socials ?? []).filter((s) => s.url.trim());
  const visibleMedia = data.media.filter((m) => m.type);

  const heading = (text: string) => (
    <h2 className="mb-4 text-xs font-semibold uppercase tracking-wider opacity-60">
      {text}
    </h2>
  );

  const sectionEls: Record<string, React.ReactNode> = {
    about:
      (data.professionalBio || data.aboutMe) && enabled.has("about") ? (
        <section key="about" className={cn("px-6 py-8 sm:px-10", dark ? "bg-white/5" : "bg-neutral-50")}>
          {data.professionalBio && <p className="leading-relaxed opacity-90">{data.professionalBio}</p>}
          {data.aboutMe && <p className="mt-3 leading-relaxed opacity-70">{data.aboutMe}</p>}
        </section>
      ) : null,

    specialties:
      data.specialties && data.specialties.length > 0 && enabled.has("specialties") ? (
        <section key="specialties" className="px-6 py-8 sm:px-10">
          {heading("Especialidades")}
          <div className="flex flex-wrap gap-2">
            {data.specialties.map((s) => (
              <span key={s} className={cn("border px-3 py-1 text-sm", rounded)} style={{ borderColor: accent }}>
                {s}
              </span>
            ))}
          </div>
        </section>
      ) : null,

    videos: enabled.has("videos") ? (
      <section key="videos" className="px-6 py-8 sm:px-10">
        {heading("Vídeos em destaque")}
        <div className={cn("grid gap-3", template.style.mediaGrid === "masonry" ? "grid-cols-2 sm:grid-cols-3" : "grid-cols-2 sm:grid-cols-4")}>
          {visibleMedia.length > 0
            ? visibleMedia.slice(0, 8).map((m) => (
                <div key={m.id} className={cn("group relative aspect-[9/16] overflow-hidden", rounded, dark ? "bg-white/10" : "bg-neutral-100")}>
                  {m.thumbnail ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={m.thumbnail} alt={m.title ?? ""} className="size-full object-cover" />
                  ) : null}
                  {m.title && (
                    <span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent p-2 text-[11px] font-medium text-white">
                      {m.title}
                    </span>
                  )}
                </div>
              ))
            : Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className={cn("aspect-[9/16]", rounded, dark ? "bg-white/10" : "bg-neutral-100")} />
              ))}
        </div>
      </section>
    ) : null,

    cases:
      data.cases.length > 0 && enabled.has("cases") ? (
        <section key="cases" className="px-6 py-8 sm:px-10">
          {heading("Cases")}
          <div className="grid gap-4 sm:grid-cols-2">
            {data.cases.map((c, i) => (
              <div key={i} className={cn("border p-4", rounded, dark ? "border-white/10" : "border-neutral-200")}>
                <div className="flex items-center justify-between">
                  <h3 className="font-medium">{c.title}</h3>
                  {c.result && <span className="text-sm font-semibold" style={{ color: accent }}>{c.result}</span>}
                </div>
                {c.brand && <p className="text-xs opacity-60">{c.brand}</p>}
                {c.description && <p className="mt-2 text-sm opacity-80">{c.description}</p>}
              </div>
            ))}
          </div>
        </section>
      ) : null,

    clients:
      data.clients.length > 0 && enabled.has("clients") ? (
        <section key="clients" className="px-6 py-8 sm:px-10">
          {heading("Marcas com quem já trabalhei")}
          <div className="flex flex-wrap gap-3">
            {data.clients.map((c, i) => (
              <span key={i} className={cn("px-4 py-2 text-sm", rounded, dark ? "bg-white/10" : "bg-neutral-100")}>
                {c.name}
              </span>
            ))}
          </div>
        </section>
      ) : null,

    testimonials:
      data.testimonials.length > 0 && enabled.has("testimonials") ? (
        <section key="testimonials" className={cn("px-6 py-8 sm:px-10", dark ? "bg-white/5" : "bg-neutral-50")}>
          {heading("Depoimentos")}
          <div className="grid gap-4 sm:grid-cols-2">
            {data.testimonials.map((t, i) => (
              <figure key={i} className={cn("border p-4", rounded, dark ? "border-white/10" : "border-neutral-200")}>
                <blockquote className="text-sm opacity-90">“{t.quote}”</blockquote>
                <figcaption className="mt-3 text-xs opacity-60">
                  {t.author}
                  {t.role ? ` · ${t.role}` : ""}
                </figcaption>
              </figure>
            ))}
          </div>
        </section>
      ) : null,

    equipment:
      data.equipment && data.equipment.length > 0 && enabled.has("equipment") ? (
        <section key="equipment" className="px-6 py-8 sm:px-10">
          {heading("Equipamentos")}
          <div className="flex flex-wrap gap-2">
            {data.equipment.map((e) => (
              <span key={e} className={cn("px-3 py-1 text-sm", rounded, dark ? "bg-white/10" : "bg-neutral-100")}>
                {e}
              </span>
            ))}
          </div>
        </section>
      ) : null,

    contact: enabled.has("contact") ? (
      <section key="contact" className="px-6 py-10 text-center sm:px-10">
        {data.brandDescription && (
          <p className="mx-auto mb-5 max-w-md text-sm opacity-80">{data.brandDescription}</p>
        )}
        <a
          href={contactSocials.find((s) => s.platform === "whatsapp" || s.platform === "email")
            ? socialHref(
                contactSocials.find((s) => s.platform === "whatsapp")?.platform ?? "email",
                contactSocials.find((s) => s.platform === "whatsapp")?.url ??
                  contactSocials.find((s) => s.platform === "email")?.url ??
                  ""
              )
            : "#"}
          className={cn("inline-block px-6 py-3 font-medium text-white", rounded)}
          style={{ backgroundColor: accent }}
        >
          {data.ctaContact || data.ctaPrimary || "Fale comigo"}
        </a>
        {contactSocials.length > 0 && (
          <div className="mt-5 flex flex-wrap justify-center gap-2">
            {contactSocials.map((s) => (
              <a
                key={s.platform}
                href={socialHref(s.platform, s.url)}
                target="_blank"
                rel="noreferrer"
                className={cn("border px-3 py-1.5 text-sm", rounded, dark ? "border-white/20" : "border-neutral-200")}
              >
                {socialLabels[s.platform] ?? s.platform}
              </a>
            ))}
          </div>
        )}
      </section>
    ) : null,
  };

  return (
    <div
      className={cn(
        "text-sm",
        dark ? "bg-neutral-950 text-neutral-100" : "bg-white text-neutral-900",
        className
      )}
    >
      {/* Hero (always first) */}
      {enabled.has("hero") && (
        <div
          className={cn(
            "px-6 py-10 sm:px-10",
            template.style.heroLayout === "split"
              ? "flex flex-col items-center gap-6 sm:flex-row"
              : "flex flex-col items-center text-center"
          )}
        >
          <div
            className={cn("flex size-24 shrink-0 items-center justify-center overflow-hidden text-2xl font-semibold text-white", rounded)}
            style={{ backgroundColor: accent }}
          >
            {data.photo ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={data.photo} alt={data.fullName} className="size-full object-cover" />
            ) : (
              initials
            )}
          </div>
          <div className={template.style.heroLayout === "split" ? "" : "mt-4"}>
            <h1 className={cn("text-2xl font-semibold", serif && "font-serif")}>
              {data.fullName || "O seu nome"}
            </h1>
            <p className="mt-1 font-medium" style={{ color: accent }}>
              {data.headline || "A sua headline aparece aqui"}
            </p>
            <p className="mt-1 text-xs opacity-70">
              {location || "Cidade, País"}
              {data.languages && data.languages.length > 0 ? ` · ${data.languages.join(", ")}` : ""}
            </p>
            {data.niches && data.niches.length > 0 && (
              <div className={cn("mt-3 flex flex-wrap gap-1.5", template.style.heroLayout === "centered" && "justify-center")}>
                {data.niches.slice(0, 5).map((n) => (
                  <span key={n} className={cn("px-2 py-0.5 text-xs", rounded, dark ? "bg-white/10" : "bg-neutral-100")}>
                    {n}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {order.filter((k) => k !== "hero").map((key) => sectionEls[key])}
    </div>
  );
}
