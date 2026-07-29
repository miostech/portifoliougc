import type { NavGroup } from "@/lib/nav";
import { Logo } from "@/components/logo";
import { ThemeToggle } from "@/components/theme-toggle";
import { SidebarNav } from "@/components/app/sidebar-nav";
import { MobileSidebar } from "@/components/app/mobile-sidebar";
import { UserMenu } from "@/components/app/user-menu";

export function DashboardShell({
  groups,
  homeHref,
  brandSuffix,
  user,
  children,
}: {
  groups: NavGroup[];
  homeHref: string;
  brandSuffix?: string;
  user: {
    name?: string | null;
    email?: string | null;
    image?: string | null;
    isAdmin?: boolean;
  };
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-dvh lg:grid lg:grid-cols-[16rem_1fr]">
      {/* Desktop sidebar */}
      <aside className="sticky top-0 hidden h-dvh flex-col border-r border-border/60 bg-card/40 lg:flex">
        <div className="flex h-16 items-center gap-2 border-b border-border/60 px-5">
          <Logo href={homeHref} />
          {brandSuffix && (
            <span className="rounded-md bg-primary/10 px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-primary">
              {brandSuffix}
            </span>
          )}
        </div>
        <div className="flex-1 overflow-y-auto p-4">
          <SidebarNav groups={groups} />
        </div>
      </aside>

      <div className="flex min-h-dvh flex-col">
        {/* Topbar */}
        <header className="sticky top-0 z-40 flex h-16 items-center justify-between border-b border-border/60 glass px-4 sm:px-6">
          <div className="flex items-center gap-2 lg:hidden">
            <MobileSidebar groups={groups} />
            <Logo href={homeHref} />
          </div>
          <div className="hidden lg:block" />
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <UserMenu
              name={user.name}
              email={user.email}
              image={user.image}
              isAdmin={user.isAdmin}
            />
          </div>
        </header>

        <main className="flex-1 p-4 sm:p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
