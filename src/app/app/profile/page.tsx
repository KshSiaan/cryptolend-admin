"use client";

import { user } from "@/lib/mock-data";
import { Bell, Lock, HelpCircle, ChevronRight } from "lucide-react";
import Image from "next/image";
import { toast } from "sonner";
import Link from "next/link";
import React from "react";

type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed"; platform?: string }>;
};

const menuItems = [
  { icon: Bell, label: "Notifications", href: "#" },
  { icon: Lock, label: "Security", href: "#" },
  { icon: HelpCircle, label: "Help & support", href: "#" },
];

export default function ProfilePage() {
  const [deferredPrompt, setDeferredPrompt] =
    React.useState<BeforeInstallPromptEvent | null>(null);
  const [isIos, setIsIos] = React.useState(false);
  const [isInstalled, setIsInstalled] = React.useState(false);

  React.useEffect(() => {
    const ua =
      typeof navigator !== "undefined" ? navigator.userAgent.toLowerCase() : "";
    setIsIos(/iphone|ipad|ipod/.test(ua));

    const onBeforeInstallPrompt = (e: BeforeInstallPromptEvent) => {
      e.preventDefault?.();
      setDeferredPrompt(e);
    };

    const onAppInstalled = () => {
      setIsInstalled(true);
    };

    window.addEventListener(
      "beforeinstallprompt",
      onBeforeInstallPrompt as EventListener,
    );
    window.addEventListener("appinstalled", onAppInstalled);

    const isStandalone =
      window.matchMedia?.("(display-mode: standalone)")?.matches ?? false;
    const iosStandalone = Boolean(
      (window.navigator as Navigator & { standalone?: boolean }).standalone,
    );
    if (isStandalone || iosStandalone) setIsInstalled(true);

    return () => {
      window.removeEventListener(
        "beforeinstallprompt",
        onBeforeInstallPrompt as EventListener,
      );
      window.removeEventListener("appinstalled", onAppInstalled);
    };
  }, []);

  const handleInstallFromProfile = async () => {
    if (isIos) {
      // Show the persistent instructions for iOS users
      alert("To install: open the Share menu and choose 'Add to Home Screen'.");
      return;
    }

    if (deferredPrompt) {
      try {
        await deferredPrompt.prompt();
        const choice = await deferredPrompt.userChoice;
        if (choice && choice.outcome === "accepted") {
          setIsInstalled(true);
        }
      } catch (err) {
        console.error("Install from profile failed", err);
      }
    } else {
      // Fallback: instruct user to use browser menu
      alert(
        "Use your browser menu and choose 'Install app' or 'Add to Home screen'.",
      );
    }
  };

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

      {/* Persistent PWA install section (shows when not installed) */}
      {!isInstalled && (
        <div className="rounded-2xl bg-card border border-border p-4 space-y-3">
          <div className="flex items-start gap-3">
            <div className="w-12 h-12 rounded-lg bg-muted flex items-center justify-center">
              <Image
                src="/icon-192.png"
                alt="CryptoLend app icon"
                width={32}
                height={32}
              />
            </div>
            <div className="flex-1">
              <div className="font-semibold">Install CryptoLend</div>
              <p className="text-sm text-muted-foreground mt-1">
                Install this app to your device for faster access and a
                native-like experience. This message stays here until you
                install the app.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleInstallFromProfile}
              className="rounded-md bg-primary text-primary-foreground px-3 py-2 text-sm font-medium"
            >
              Install
            </button>
            <button
              type="button"
              onClick={() => {
                // secondary help: show instructions
                if (isIos) {
                  alert("iOS: Share → Add to Home Screen");
                } else {
                  alert("Use browser menu → Install app / Add to Home screen");
                }
              }}
              className="rounded-md border border-border px-3 py-2 text-sm"
            >
              How to install
            </button>
          </div>
        </div>
      )}

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
