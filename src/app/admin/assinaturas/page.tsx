import type { Metadata } from "next";
import { getSubscriptionSummary, listSubscriptions } from "@/lib/actions/admin";
import { PageHeader } from "@/components/app/page-header";
import { AdminSubscriptionsView } from "@/components/admin/admin-subscriptions-view";

export const metadata: Metadata = { title: "Assinaturas (admin)" };

export default async function AdminSubscriptionsPage() {
  let summary = null;
  let subs = null;
  try {
    [summary, subs] = await Promise.all([
      getSubscriptionSummary(),
      listSubscriptions(),
    ]);
  } catch {
    summary = null;
    subs = null;
  }

  return (
    <div className="mx-auto max-w-6xl">
      <PageHeader
        title="Assinaturas"
        description="Acompanhe planos, estados e receita simulada (MRR demo)."
      />
      <AdminSubscriptionsView summary={summary} subs={subs ?? []} dbOffline={!summary} />
    </div>
  );
}
