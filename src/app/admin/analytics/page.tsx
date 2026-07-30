import type { Metadata } from "next";
import { getPlatformAnalytics } from "@/lib/actions/admin";
import { PageHeader } from "@/components/app/page-header";
import { AdminPlatformAnalytics } from "@/components/admin/admin-platform-analytics";

export const metadata: Metadata = { title: "Analytics da plataforma (admin)" };

export default async function AdminAnalyticsPage() {
  let data = null;
  try {
    data = await getPlatformAnalytics();
  } catch {
    data = null;
  }

  return (
    <div className="mx-auto max-w-6xl">
      <PageHeader
        title="Analytics da plataforma"
        description="Visitas, eventos e uso agregado de todos os portfólios."
      />
      <AdminPlatformAnalytics data={data} />
    </div>
  );
}
