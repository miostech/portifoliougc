import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getPublicPortfolio } from "@/lib/portfolio-data";
import { recordPortfolioVisit } from "@/lib/actions/analytics";
import { PortfolioRenderer } from "@/components/portfolio/portfolio-renderer";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const p = await getPublicPortfolio(slug).catch(() => null);
  if (!p) return { title: "Portfólio não encontrado" };

  const title = p.headline ? `${p.fullName} — ${p.headline}` : p.fullName;
  const description =
    p.professionalBio || `Portfólio UGC de ${p.fullName} no Portfolio UGC.`;
  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "profile",
      images: p.photo ? [{ url: p.photo }] : undefined,
    },
    twitter: { card: "summary_large_image", title, description },
  };
}

export default async function PublicPortfolioPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const portfolio = await getPublicPortfolio(slug).catch(() => null);
  if (!portfolio) notFound();

  // Record visit — fire-and-forget, never blocks rendering
  if (portfolio.portfolioId) void recordPortfolioVisit(portfolio.portfolioId);

  return (
    <div className="min-h-dvh bg-neutral-100 py-0 sm:py-8">
      <div className="mx-auto max-w-3xl overflow-hidden bg-white shadow-xl sm:rounded-2xl">
        <PortfolioRenderer data={portfolio} />
      </div>
      <div className="py-6 text-center">
        <Link
          href="/"
          className="text-xs text-neutral-500 hover:text-neutral-800"
        >
          Feito com <span className="font-semibold">Portfolio UGC</span>
        </Link>
      </div>
    </div>
  );
}
