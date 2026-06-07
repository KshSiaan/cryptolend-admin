"use client";

import { useState } from "react";

import { cn } from "@/lib/utils";
import type { LoanItem } from "@/types/auth";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

const statusStyles: Record<string, string> = {
  active: "bg-green-pos/10 text-green-pos",
  funded: "bg-purple-bg text-purple",
  repaying: "bg-orange-bg text-orange",
  closed: "bg-muted text-muted-foreground",
};

export function LoanDetailSheet({
  loan,
  children,
}: {
  loan: LoanItem;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>{children}</SheetTrigger>
      <SheetContent
        side="bottom"
        className="rounded-t-3xl max-h-[92dvh] overflow-y-auto px-4 pb-8"
      >
        <SheetHeader className="pb-4">
          <SheetTitle className="text-xl font-bold text-left">
            {loan.title}
          </SheetTitle>
        </SheetHeader>

        <p className="text-sm text-muted-foreground mb-4">{loan.description}</p>

        <div className="rounded-2xl bg-card border border-border divide-y divide-border mb-6">
          {[
            {
              label: "Loan number",
              value: loan.loan_number,
              green: false,
              badge: false,
            },
            { label: "Sector", value: loan.sector, green: false, badge: false },
            {
              label: "Target",
              value: `${loan.target_amount_sol} SOL | ${loan.target_amount_eur} EUR`,
              green: false,
              badge: false,
            },
            {
              label: "Raised",
              value: `${loan.raised_amount_sol} SOL | ${loan.raised_amount_eur} EUR (${loan.funded_percent}%)`,
              green: false,
              badge: false,
            },
            {
              label: "APR",
              value: `${loan.apr_percent}%`,
              green: true,
              badge: false,
            },
            {
              label: "Duration",
              value: `${loan.duration_months} months`,
              green: false,
              badge: false,
            },
            {
              label: "Investors",
              value: `${loan.investors_count}`,
              green: false,
              badge: false,
            },
            { label: "Status", value: loan.status, green: false, badge: true },
          ].map((r) => (
            <div
              key={r.label}
              className="flex justify-between items-center px-4 py-3 text-sm"
            >
              <span className="text-muted-foreground">{r.label}</span>
              {r.badge ? (
                <span
                  className={cn(
                    "rounded-full px-2.5 py-0.5 text-xs font-medium capitalize",
                    statusStyles[loan.status] ?? statusStyles.closed,
                  )}
                >
                  {loan.status}
                </span>
              ) : (
                <span
                  className={cn(
                    "font-semibold",
                    r.green ? "text-green-pos" : "",
                  )}
                >
                  {r.value}
                </span>
              )}
            </div>
          ))}
        </div>
      </SheetContent>
    </Sheet>
  );
}
