"use client";

import React from "react";

import {
  Bell,
  BotIcon,
  ChevronRight,
  HelpCircle,
  Lock,
  Pencil,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCookies } from "react-cookie";
import { toast } from "sonner";

import { useProfile } from "@/hooks/use-profile";
import { useAuthStore } from "@/store/auth-store";
import { Button } from "@/components/ui/button";

type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed"; platform?: string }>;
};

const menuItems = [
  { icon: Bell, label: "Notifications", href: "/app/notifications" },
  { icon: Lock, label: "Security", href: "/app/profile/security" },
  { icon: HelpCircle, label: "Help & support", href: "#" },
];

export default function ProfilePage() {
  const router = useRouter();
  const clearAuth = useAuthStore((s) => s.clearAuth);
  const [, , removeCookie] = useCookies(["auth_token"]);
  const { data } = useProfile();

  const profile = data?.data;

  const [deferredPrompt, setDeferredPrompt] =
    React.useState<BeforeInstallPromptEvent | null>(null);
  const [isIos, setIsIos] = React.useState(false);
  const [isInstalled, setIsInstalled] = React.useState(false);
  const [installHint, setInstallHint] = React.useState<string | null>(null);

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
    setInstallHint(null);

    if (isIos) {
      setInstallHint(
        "On iPhone or iPad, open Share and choose Add to Home Screen.",
      );
      return;
    }

    if (deferredPrompt) {
      try {
        await deferredPrompt.prompt();
        const choice = await deferredPrompt.userChoice;
        if (choice && choice.outcome === "accepted") {
          setIsInstalled(true);
          setInstallHint("Installed successfully.");
        } else {
          setInstallHint("Install was dismissed.");
        }
      } catch (err) {
        console.error("Install from profile failed", err);
        setInstallHint("The browser install prompt could not be opened.");
      }
    } else {
      setInstallHint(
        "Open the browser menu and choose Install app or Add to Home screen.",
      );
    }
  };

  const handleLogout = () => {
    clearAuth();
    removeCookie("auth_token", { path: "/" });
    toast.success("Logged out.");
    router.push("/auth/login");
  };

  const initials = profile?.name
    ? profile.name
        .split(" ")
        .map((w) => w[0])
        .join("")
        .slice(0, 2)
        .toUpperCase()
    : "??";

  return (
    <div className="py-6 space-y-6">
      <h1 className="text-xl font-bold tracking-tight">Profile</h1>
      <p className="text-sm text-muted-foreground -mt-4">Account settings</p>

      {/* User card */}
      <div className="rounded-2xl bg-card border border-border p-4 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-14 h-14 rounded-full bg-muted overflow-hidden flex items-center justify-center">
              {profile?.profile_photo_url ? (
                <Image
                  src={profile.profile_photo_url}
                  alt={profile.name}
                  width={56}
                  height={56}
                  unoptimized
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-muted-foreground/20 flex items-center justify-center text-lg font-bold text-muted-foreground">
                  {initials}
                </div>
              )}
            </div>
            <div>
              <p className="text-base font-bold">{profile?.name ?? ""}</p>
              <p className="text-sm text-muted-foreground">
                {profile?.email ?? ""}
              </p>
            </div>
          </div>
          <Link
            href="/app/profile/edit"
            className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors border border-border rounded-lg px-2.5 py-1.5"
          >
            <Pencil size={13} />
            Edit
          </Link>
        </div>

        <div className="divide-y divide-border">
          {[
            {
              label: "Account type",
              value: profile?.role ?? "—",
              badge: "neutral",
            },
            {
              label: "Member since",
              value: profile?.member_since ?? "—",
              badge: "none",
            },
          ].map((r) => (
            <div
              key={r.label}
              className="flex items-center justify-between py-3 text-sm"
            >
              <span className="text-muted-foreground">{r.label}</span>
              {r.badge === "neutral" ? (
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
      {profile?.role === "admin" && (
        <Button
          type="button"
          className="w-full rounded-full bg-white"
          size="lg"
          variant="outline"
          onClick={handleLogout}
        >
          Admin Panel <BotIcon />
        </Button>
      )}
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
          <div className="flex items-center gap-2 flex-wrap">
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
                setInstallHint(
                  isIos
                    ? "On iPhone or iPad, open Share and choose Add to Home Screen."
                    : "Open the browser menu and choose Install app or Add to Home screen.",
                );
              }}
              className="rounded-md border border-border px-3 py-2 text-sm"
            >
              How to install
            </button>
            {installHint ? (
              <p className="w-full text-xs text-muted-foreground">
                {installHint}
              </p>
            ) : null}
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

      <Button
        type="button"
        className="w-full rounded-full"
        onClick={handleLogout}
        size="lg"
        variant="destructive"
      >
        Log Out
      </Button>
    </div>
  );
}
