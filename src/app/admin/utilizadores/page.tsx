import type { Metadata } from "next";
import { listUsers } from "@/lib/actions/admin";
import { PageHeader } from "@/components/app/page-header";
import { AdminUsersTable } from "@/components/admin/admin-users-table";

export const metadata: Metadata = { title: "Utilizadores (admin)" };

export default async function AdminUsersPage() {
  let users = null;
  try {
    users = await listUsers();
  } catch {
    users = null;
  }

  return (
    <div className="mx-auto max-w-6xl">
      <PageHeader
        title="Utilizadores"
        description="Pesquise, filtre, altere planos, suspenda ou promova utilizadores a admin."
      />
      <AdminUsersTable initialUsers={users ?? []} dbOffline={!users} />
    </div>
  );
}
