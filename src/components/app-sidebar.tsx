"use client";
import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Landmark,
  ArrowDownToLine,
  Users,
  ArrowLeftRight,
  Settings,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  SidebarGroup,
  SidebarGroupLabel,
} from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";

const navItems = [
  { title: "Dashboard", url: "/admin/dashboard", icon: LayoutDashboard },
  { title: "Loans", url: "/admin/loans", icon: Landmark },
  { title: "Withdrawal", url: "/admin/withdrawal", icon: ArrowDownToLine },
  { title: "Users", url: "/admin/users", icon: Users },
  { title: "Transactions", url: "/admin/transactions", icon: ArrowLeftRight },
  { title: "Settings", url: "/admin/settings", icon: Settings },
];

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const pathname = usePathname();

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader className="px-4 py-4">
        <div className="flex items-center gap-2.5 group-data-[collapsible=icon]:justify-center">
          <div className="size-8 rounded-full bg-sidebar-primary items-center justify-center shrink-0 hidden group-data-[collapsible=icon]:flex">
            <span className="text-sidebar-primary-foreground font-bold text-sm ">
              C
            </span>
          </div>
          <span className="font-bold text-base tracking-tight text-sidebar-foreground group-data-[collapsible=icon]:hidden">
            CryptoLend
          </span>
        </div>
      </SidebarHeader>

      <SidebarContent className="px-2 py-3">
        <SidebarGroup className="p-0">
          <SidebarGroupLabel className="px-3 text-xs font-semibold uppercase tracking-widest text-sidebar-foreground/40 mb-1 group-data-[collapsible=icon]:hidden">
            Platform
          </SidebarGroupLabel>
          <SidebarMenu>
            {navItems.map((item) => {
              const active =
                pathname === item.url || pathname.startsWith(`${item.url}/`);
              return (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    isActive={active}
                    tooltip={item.title}
                    className={cn(
                      "gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                      active
                        ? "bg-sidebar-primary text-sidebar-primary-foreground hover:bg-sidebar-primary/90 hover:text-sidebar-primary-foreground"
                        : "text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                    )}
                  >
                    <Link href={item.url}>
                      <item.icon className="size-4 shrink-0" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              );
            })}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="px-3 py-3">
        <div className="flex items-center gap-2.5 px-1 group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:px-0">
          <div className="size-8 rounded-full bg-sidebar-accent flex items-center justify-center shrink-0">
            <span className="text-sidebar-accent-foreground font-semibold text-xs">
              A
            </span>
          </div>
          <div className="flex-1 min-w-0 group-data-[collapsible=icon]:hidden">
            <p className="text-sm font-semibold text-sidebar-foreground truncate">
              Admin
            </p>
            <p className="text-xs text-sidebar-foreground/50 truncate">
              admin@gmail.com
            </p>
          </div>
          {/* <ChevronsUpDown className="size-4 text-sidebar-foreground/40 shrink-0 group-data-[collapsible=icon]:hidden" /> */}
        </div>
      </SidebarFooter>

      {/* <SidebarRail /> */}
    </Sidebar>
  );
}
