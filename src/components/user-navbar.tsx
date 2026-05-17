"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, BarChart2, TrendingUp, Wallet, User } from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/app/home", label: "Home", icon: Home },
  { href: "/app/invest", label: "Invest", icon: BarChart2 },
  { href: "/app/portfolio", label: "Portfolio", icon: TrendingUp },
  { href: "/app/wallet", label: "Wallet", icon: Wallet },
  { href: "/app/profile", label: "Profile", icon: User },
];

export function UserNavbar() {
  const pathname = usePathname();

  return (
    <nav className="sticky bottom-0 z-50 w-full bg-white backdrop-blur border-b border-border">
      <div className="max-w-lg mx-auto px-4">
        <div className="flex items-center justify-between h-14">
          {navItems.map(({ href, label, icon: Icon }) => {
            const active = pathname === href || pathname.startsWith(href + "/");
            return (
              <Link
                key={href}
                href={href}
                className={cn(
                  "flex flex-col items-center gap-0.5 px-2 py-1 rounded-lg transition-colors min-w-0",
                  active
                    ? "text-foreground"
                    : "text-muted-foreground hover:text-foreground",
                )}
              >
                <Icon
                  size={20}
                  strokeWidth={active ? 2.2 : 1.8}
                  className={cn(active && "text-foreground")}
                />
                <span
                  className={cn(
                    "text-[10px] font-medium leading-none",
                    active ? "text-foreground" : "text-muted-foreground",
                  )}
                >
                  {label}
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
