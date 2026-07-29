import { cache } from "react";
import { connectDB } from "@/lib/db";
import { Portfolio } from "@/models/Portfolio";
import { Media } from "@/models/Media";
import { toPortfolioView, type PortfolioView } from "@/lib/portfolio-view";

/**
 * Public read of a published portfolio by slug. Returns null when the
 * portfolio does not exist or is not published. Cached per-request so the
 * page and its generateMetadata share a single DB read.
 */
export const getPublicPortfolio = cache(async function getPublicPortfolio(
  slug: string
): Promise<PortfolioView | null> {
  await connectDB();
  const p = await Portfolio.findOne({ slug, published: true }).lean<
    Record<string, unknown>
  >();
  if (!p) return null;

  const media = await Media.find({
    portfolioId: p._id,
    hidden: { $ne: true },
    status: "ready",
  })
    .sort({ featured: -1, order: 1, createdAt: -1 })
    .lean<Record<string, unknown>[]>();

  return toPortfolioView(p, media);
});
