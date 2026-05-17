"use client";

import { user } from "@/lib/mock-data";
import { Bell, Lock, HelpCircle, ChevronRight, LogOut } from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";

const menuItems = [
  { icon: Bell, label: "Notifications", href: "#" },
  { icon: Lock, label: "Security", href: "#" },
  { icon: HelpCircle, label: "Help & support", href: "#" },
];

export default function ProfilePage() {
  return (
    <div className="py-6 space-y-6">
      <h1 className="text-xl font-bold tracking-tight">Profile</h1>
      <p className="text-sm text-muted-foreground -mt-4">Account settings</p>

      {/* User card */}
      <div className="rounded-2xl bg-card border border-border p-4 space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-14 h-14 rounded-full bg-muted overflow-hidden flex items-center justify-center">
            <div className="w-full h-full bg-muted-foreground/20 flex items-center justify-center text-lg font-bold text-muted-foreground">
              {user.initials}
            </div>
          </div>
          <div>
            <p className="text-base font-bold">{user.name}</p>
            <p className="text-sm text-muted-foreground">{user.email}</p>
          </div>
        </div>

        <div className="divide-y divide-border">
          {[
            {
              label: "Account type",
              value: user.accountType,
              badge: "neutral",
            },
            { label: "KYC status", value: user.kycStatus, badge: "green" },
            { label: "Member since", value: user.memberSince, badge: "none" },
          ].map((r) => (
            <div
              key={r.label}
              className="flex items-center justify-between py-3 text-sm"
            >
              <span className="text-muted-foreground">{r.label}</span>
              {r.badge === "green" ? (
                <span className="rounded-full bg-green-pos/10 text-green-pos text-xs px-2.5 py-0.5 font-medium">
                  {r.value}
                </span>
              ) : r.badge === "neutral" ? (
                <span className="rounded-full bg-muted text-foreground text-xs px-2.5 py-0.5 font-medium">
                  {r.value}
                </span>
              ) : (
                <span className="font-medium">{r.value}</span>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Menu items */}
      <div className="rounded-2xl bg-card border border-border divide-y divide-border">
        {menuItems.map(({ icon: Icon, label, href }) => (
          <Link
            key={label}
            href={href}
            className="flex items-center justify-between px-4 py-4 hover:bg-muted/40 transition-colors"
          >
            <div className="flex items-center gap-3">
              <Icon size={18} className="text-muted-foreground" />
              <span className="text-sm font-medium">{label}</span>
            </div>
            <ChevronRight size={16} className="text-muted-foreground" />
          </Link>
        ))}
      </div>

      {/* Log out */}
      <button
        type="button"
        onClick={() => toast.info("Logged out")}
        className="w-full rounded-2xl bg-destructive text-white py-3.5 font-semibold text-sm"
      >
        Log Out
      </button>
    </div>
  );
}
