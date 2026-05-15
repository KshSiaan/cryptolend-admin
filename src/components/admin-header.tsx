"use client";
import { usePathname } from "next/navigation";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";

const segmentLabel: Record<string, string> = {
  dashboard: "",
  loans: "Loans",
  withdrawal: "Withdrawal",
  users: "Users",
  transactions: "Transactions",
  settings: "Settings",
};

export function AdminHeader() {
  const pathname = usePathname();
  const segments = pathname.split("/").filter(Boolean);
  const sub = segments[1];
  const subLabel = sub ? segmentLabel[sub] : null;

  return (
    <header className="flex h-14 shrink-0 items-center gap-2 border-b px-4 bg-background">
      <SidebarTrigger className="-ml-1" />
      <Separator orientation="vertical" className="h-4" />
      <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
        <span className="flex items-center gap-1.5">
          <span>Dashboard</span>
        </span>
        {subLabel && (
          <>
            <span className="text-muted-foreground/50">/</span>
            <span className="font-semibold text-foreground">{subLabel}</span>
          </>
        )}
      </div>
    </header>
  );
}
