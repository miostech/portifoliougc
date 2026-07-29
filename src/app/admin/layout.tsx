import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { adminNav } from "@/lib/nav";
import { DashboardShell } from "@/components/app/dashboard-shell";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  if (!session?.user) {
    redirect("/login?callbackUrl=/admin");
  }
  if (session.user.role !== "admin") {
    redirect("/app");
  }

  return (
    <DashboardShell
      groups={adminNav}
      homeHref="/admin"
      brandSuffix="Admin"
      user={{
        name: session.user.name,
        email: session.user.email,
        image: session.user.image,
        isAdmin: true,
      }}
    >
      {children}
    </DashboardShell>
  );
}
