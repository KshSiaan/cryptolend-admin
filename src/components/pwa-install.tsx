"use client";

import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";

export default function PwaInstall() {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [visible, setVisible] = useState(false);
  const [isIos, setIsIos] = useState(false);

  useEffect(() => {
    const ua =
      typeof navigator !== "undefined" ? navigator.userAgent.toLowerCase() : "";
    setIsIos(/iphone|ipad|ipod/.test(ua));

    const onBeforeInstallPrompt = (e: Event) => {
      e.preventDefault?.();
      setDeferredPrompt(e);
      const dismissed = localStorage.getItem("pwa_install_dismissed");
      // show only on mobile screens and if not dismissed
      if (!dismissed && window.innerWidth <= 900) setVisible(true);
    };

    const onAppInstalled = () => {
      localStorage.removeItem("pwa_install_dismissed");
      setVisible(false);
      setDeferredPrompt(null);
    };

    window.addEventListener(
      "beforeinstallprompt",
      onBeforeInstallPrompt as any,
    );
    window.addEventListener("appinstalled", onAppInstalled as any);

    // hide if already installed
    const isStandalone =
      window.matchMedia &&
      window.matchMedia("(display-mode: standalone)").matches;
    // iOS has navigator.standalone
    const iosStandalone = (window as any).navigator?.standalone;
    const dismissed = localStorage.getItem("pwa_install_dismissed");

    // If not installed and not dismissed, show banner on mobile sizes even
    // when `beforeinstallprompt` hasn't fired yet. This gives a local web
    // install CTA for users browsing the site.
    if (
      !(isStandalone || iosStandalone) &&
      !dismissed &&
      window.innerWidth <= 900
    ) {
      setVisible(true);
    }

    return () => {
      window.removeEventListener(
        "beforeinstallprompt",
        onBeforeInstallPrompt as any,
      );
      window.removeEventListener("appinstalled", onAppInstalled as any);
    };
  }, []);

  const onInstallClick = async () => {
    if (isIos) {
      // show hint for iOS add-to-home
      alert("To install: tap Share → Add to Home Screen, then confirm.");
      localStorage.setItem("pwa_install_dismissed", "1");
      setVisible(false);
      return;
    }

    if (deferredPrompt) {
      try {
        await (deferredPrompt as any).prompt();
        const choice = await (deferredPrompt as any).userChoice;
        if (choice && choice.outcome === "accepted") {
          setVisible(false);
          localStorage.removeItem("pwa_install_dismissed");
        } else {
          // user dismissed
          localStorage.setItem("pwa_install_dismissed", "1");
          setVisible(false);
        }
      } catch (err) {
        console.error("PWA prompt error", err);
        localStorage.setItem("pwa_install_dismissed", "1");
        setVisible(false);
      }
      return;
    }

    // fallback: guide user to install via browser UI
    try {
      alert(
        "To install this app: open your browser menu and choose 'Install app' or 'Add to Home screen'.",
      );
      localStorage.setItem("pwa_install_dismissed", "1");
      setVisible(false);
    } catch (err) {
      console.error(err);
    }
  };

  const onDismiss = () => {
    localStorage.setItem("pwa_install_dismissed", "1");
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 w-[92%] max-w-xl">
      <div className="bg-white/95 dark:bg-slate-900/95 border rounded-lg p-3 shadow-md flex items-center gap-3">
        <div className="flex-1">
          <div className="font-semibold">Install CryptoLend</div>
          <div className="text-sm text-slate-600 dark:text-slate-300">
            Install this app to your mobile device for a native-like experience
            and faster access.
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button onClick={onInstallClick} variant="default">
            Install
          </Button>
          <Button onClick={onDismiss} variant="ghost">
            Dismiss
          </Button>
        </div>
      </div>
    </div>
  );
}
