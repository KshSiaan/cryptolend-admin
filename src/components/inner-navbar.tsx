"use client";

import { Menu, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { Button } from "@/components/ui/button";

const NAV_LINKS = ["Invest", "Security", "About"];

export function InnerNavbar() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <>
      <nav className="sticky top-0 z-50 bg-white shadow-sm py-4 flex justify-between px-4 md:px-[7%] xl:px-[15%] items-center gap-4">
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
          <div className="hidden md:flex items-center gap-6 text-sm">
            {NAV_LINKS.map((label) => (
              <Link
                key={label}
                href={`/${label.toLowerCase()}`}
                className="font-semibold text-[#111827] hover:text-[#111827]/70 transition-colors"
              >
                {label}
              </Link>
            ))}
          </div>
        </div>
        <div className="hidden md:flex items-center gap-4">
          <Button
            variant="outline"
            className="font-semibold text-[#111827] border-[#111827] hover:text-[#111827]/80"
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
        <button
          type="button"
          className="md:hidden p-2 rounded-lg text-[#111827] transition-colors"
          onClick={() => setMobileOpen((o) => !o)}
          aria-label={mobileOpen ? "Close menu" : "Open menu"}
        >
          {mobileOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </nav>

      {mobileOpen && (
        <div className="fixed top-[61px] left-0 right-0 z-40 md:hidden flex flex-col gap-1 p-4 bg-white shadow-xl border-b border-[#f0f0ef]">
          {NAV_LINKS.map((label) => (
            <Link
              key={label}
              href={`/${label.toLowerCase()}`}
              className="font-semibold px-4 py-3 rounded-lg text-sm text-[#111827] hover:bg-[#f5f5f5] transition-colors"
              onClick={() => setMobileOpen(false)}
            >
              {label}
            </Link>
          ))}
          <div className="flex flex-col gap-3 mt-4 pt-4 border-t border-[#e5e7eb]">
            <Button variant="outline" className="font-semibold text-[#111827] border-[#111827] w-full">
              Log in
            </Button>
            <Button className="w-full bg-[#35de8d] hover:bg-[#35de8d]/90 text-foreground font-semibold" size="lg">
              Create account
            </Button>
          </div>
        </div>
      )}
    </>
  );
}
