"use client";

import { useState } from "react";
import { Menu } from "lucide-react";
import type { NavGroup } from "@/lib/nav";
import { Logo } from "@/components/logo";
import { SidebarNav } from "@/components/app/sidebar-nav";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

export function MobileSidebar({ groups }: { groups: NavGroup[] }) {
  const [open, setOpen] = useState(false);
  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger
        render={
          <Button variant="ghost" size="icon" aria-label="Abrir menu" />
        }
      >
        <Menu className="size-5" />
      </SheetTrigger>
      <SheetContent side="left" className="w-72 p-0">
        <SheetHeader className="border-b">
          <SheetTitle className="text-left">
            <Logo href="/app" />
          </SheetTitle>
        </SheetHeader>
        <div className="overflow-y-auto p-4">
          <SidebarNav groups={groups} onNavigate={() => setOpen(false)} />
        </div>
      </SheetContent>
    </Sheet>
  );
}
