"use client";

import { Menu, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const NAV_LINKS = ["Invest", "Smart Cash", "Security", "Learn", "About"];

export default function Navig() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const check = () => setScrolled(window.scrollY >= window.innerHeight * 0.9);
    check();
    window.addEventListener("scroll", check, { passive: true });
    return () => window.removeEventListener("scroll", check);
  }, []);

  return (
    <>
      <nav
        className={cn(
          "fixed top-0 left-0 w-dvw z-50 py-4 flex justify-between px-4 md:px-[7%] xl:px-[15%] items-center gap-4 transition-colors duration-300",
          scrolled ? "bg-white shadow-sm" : "bg-[#203828]",
        )}
      >
        <div className="flex items-center gap-4 md:gap-6">
          <Link href="/">
            <Image
              src="/logo.svg"
              alt="Logo"
              width={100}
              height={50}
              className="h-8 md:h-10 w-auto"
            />
          </Link>
          {/* Desktop nav links */}
          <div className="hidden md:flex items-center gap-6 text-sm">
            {NAV_LINKS.map((label) => (
              <Link
                key={label}
                className={cn(
                  "font-semibold transition-colors",
                  scrolled
                    ? "text-[#111827] hover:text-[#111827]/70"
                    : "text-white hover:text-white/80",
                )}
                href="/invest"
              >
                {label}
              </Link>
            ))}
          </div>
        </div>

        {/* Desktop buttons */}
        <div className="hidden md:flex items-center gap-4">
          <Button
            variant="outline"
            className={cn(
              "font-semibold bg-transparent! transition-colors",
              scrolled
                ? "text-[#111827] border-[#111827] hover:text-[#111827]/80"
                : "text-white border-white hover:text-white/80",
            )}
          >
            Log in
          </Button>
          <Button
            className="px-4 bg-[#35de8d] hover:bg-[#35de8d]/90 text-foreground font-semibold"
            size="lg"
          >
            Create account
          </Button>
        </div>

        {/* Mobile hamburger */}
        <button
          type="button"
          className={cn(
            "md:hidden p-2 rounded-lg transition-colors",
            scrolled ? "text-[#111827]" : "text-white",
          )}
          onClick={() => setMobileOpen((o) => !o)}
          aria-label={mobileOpen ? "Close menu" : "Open menu"}
        >
          {mobileOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </nav>

      {/* Mobile menu */}
      {mobileOpen && (
        <div
          className={cn(
            "fixed top-15 left-0 right-0 z-40 md:hidden flex flex-col gap-1 p-4 shadow-xl",
            scrolled ? "bg-white border-b border-[#f0f0ef]" : "bg-[#203828]",
          )}
        >
          {NAV_LINKS.map((label) => (
            <Link
              key={label}
              href="/invest"
              className={cn(
                "font-semibold px-4 py-3 rounded-lg text-sm transition-colors",
                scrolled
                  ? "text-[#111827] hover:bg-[#f5f5f5]"
                  : "text-white hover:bg-white/10",
              )}
              onClick={() => setMobileOpen(false)}
            >
              {label}
            </Link>
          ))}
          <div
            className={cn(
              "flex flex-col gap-3 mt-4 pt-4 border-t",
              scrolled ? "border-[#e5e7eb]" : "border-white/20",
            )}
          >
            <Button
              variant="outline"
              className={cn(
                "font-semibold bg-transparent! w-full",
                scrolled
                  ? "text-[#111827] border-[#111827]"
                  : "text-white border-white",
              )}
            >
              Log in
            </Button>
            <Button
              className="w-full bg-[#35de8d] hover:bg-[#35de8d]/90 text-foreground font-semibold"
              size="lg"
            >
              Create account
            </Button>
          </div>
        </div>
      )}
    </>
  );
}
