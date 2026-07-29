import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { appNav } from "@/lib/nav";
import { DashboardShell } from "@/components/app/dashboard-shell";

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  if (!session?.user) {
    redirect("/login?callbackUrl=/app");
  }

  return (
    <DashboardShell
      groups={appNav}
      homeHref="/app"
      user={{
        name: session.user.name,
        email: session.user.email,
        image: session.user.image,
        isAdmin: session.user.role === "admin",
      }}
    >
      {children}
    </DashboardShell>
  );
}
