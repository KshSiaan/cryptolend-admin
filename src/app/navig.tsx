"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function Navig() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const check = () => setScrolled(window.scrollY >= window.innerHeight * 0.9);
    check();
    window.addEventListener("scroll", check, { passive: true });
    return () => window.removeEventListener("scroll", check);
  }, []);

  return (
    <nav
      className={cn(
        "fixed top-0 left-0 w-dvw mx-auto py-4 flex justify-between xl:px-[15%] items-center gap-4 transition-colors duration-300",
        scrolled ? "bg-white shadow-sm" : "bg-[#203828]",
      )}
    >
      <div className="flex items-center gap-4">
        <Image
          src="/logo.svg"
          alt="Logo"
          width={100}
          height={50}
          className="h-10"
        />
        <div className="flex items-center gap-6 text-sm">
          {["Invest", "Smart Cash", "Security", "Learn", "About"].map(
            (label) => (
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
            ),
          )}
        </div>
      </div>
      <div className="flex items-center gap-4">
        <Button
          variant="outline"
          className={cn(
            "font-semibold !bg-transparent transition-colors",
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
    </nav>
  );
}
