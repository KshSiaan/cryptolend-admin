"use client";

import { useState } from "react";
import { toast } from "sonner";
import type { loans } from "@/lib/mock-data";
import { cn } from "@/lib/utils";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

type Loan = (typeof loans)[number];
type Step = "detail" | "invest" | "confirmed";

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
  loan: Loan;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState<Step>("detail");
  const [investAmount, setInvestAmount] = useState("");

  const pct = Math.round((loan.raised / loan.target) * 100);
  const canInvest = loan.status === "active";

  function handleInvestSubmit() {
    const v = parseFloat(investAmount);
    if (!v || v <= 0) {
      toast.error("Enter a valid amount");
      return;
    }
    setStep("confirmed");
  }

  function handleClose() {
    setOpen(false);
    setTimeout(() => {
      setStep("detail");
      setInvestAmount("");
    }, 300);
  }

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>{children}</SheetTrigger>
      <SheetContent
        side="bottom"
        className="rounded-t-3xl max-h-[92dvh] overflow-y-auto px-4 pb-8"
      >
        {step === "detail" && (
          <>
            <SheetHeader className="pb-4">
              <SheetTitle className="text-xl font-bold text-left">
                Invest in {loan.title}
              </SheetTitle>
            </SheetHeader>

            <div className="rounded-2xl bg-card border border-border divide-y divide-border mb-6">
              {[
                { label: "Sector", value: loan.sector, green: false, badge: false },
                { label: "Target", value: `${loan.target} SOL`, green: false, badge: false },
                { label: "Raised", value: `${loan.raised} SOL (${pct}%)`, green: false, badge: false },
                { label: "APR", value: `${loan.apr}%`, green: true, badge: false },
                { label: "Duration", value: `${loan.durationMonths} months`, green: false, badge: false },
                { label: "Investors", value: `${loan.investors}`, green: false, badge: false },
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
                        "rounded-full px-2.5 py-0.5 text-xs font-medium",
                        statusStyles[loan.status],
                      )}
                    >
                      {loan.status}
                    </span>
                  ) : (
                    <span className={cn("font-semibold", r.green ? "text-green-pos" : "")}>
                      {r.value}
                    </span>
                  )}
                </div>
              ))}
            </div>

            {canInvest ? (
              <button
                type="button"
                onClick={() => setStep("invest")}
                className="w-full bg-foreground text-background rounded-2xl py-3.5 font-semibold text-sm"
              >
                Invest Now
              </button>
            ) : (
              <button
                type="button"
                disabled
                className="w-full bg-muted text-muted-foreground rounded-2xl py-3.5 font-semibold text-sm cursor-not-allowed"
              >
                {loan.status === "funded"
                  ? "Fully Funded"
                  : loan.status === "repaying"
                    ? "Currently Repaying"
                    : "Closed"}
              </button>
            )}
          </>
        )}

        {step === "invest" && (
          <>
            <SheetHeader className="pb-4">
              <SheetTitle className="text-xl font-bold text-left">
                Invest in {loan.title}
              </SheetTitle>
            </SheetHeader>
            <div className="space-y-4 mb-6">
              <div className="space-y-1.5">
                <label htmlFor="invest-amount" className="text-sm font-medium">
                  Investment amount (SOL)
                </label>
                <input
                  id="invest-amount"
                  type="number"
                  placeholder="0.00"
                  value={investAmount}
                  onChange={(e) => setInvestAmount(e.target.value)}
                  className="w-full rounded-xl border border-border bg-card px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-ring"
                />
              </div>
              <div className="rounded-xl bg-muted p-3 text-xs text-muted-foreground space-y-1">
                <p>
                  APR:{" "}
                  <span className="text-green-pos font-medium">{loan.apr}%</span>
                </p>
                <p>Duration: {loan.durationMonths} months</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setStep("detail")}
                className="rounded-2xl border border-border bg-card py-3.5 font-semibold text-sm"
              >
                Back
              </button>
              <button
                type="button"
                onClick={handleInvestSubmit}
                className="rounded-2xl bg-foreground text-background py-3.5 font-semibold text-sm"
              >
                Confirm Investment
              </button>
            </div>
          </>
        )}

        {step === "confirmed" && (
          <div className="py-8 flex flex-col items-center text-center space-y-4">
            <div className="w-20 h-20 rounded-full bg-green-pos/10 flex items-center justify-center">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                aria-hidden="true"
                className="w-10 h-10 text-green-pos"
              >
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </div>
            <h2 className="text-xl font-bold">Investment confirmed!</h2>
            <p className="text-muted-foreground text-sm max-w-xs">
              Invested{" "}
              <span className="font-bold text-foreground">{investAmount} SOL</span>{" "}
              in {loan.title} on Solana.
            </p>
            <div className="grid grid-cols-2 gap-3 w-full mt-4">
              <button
                type="button"
                onClick={handleClose}
                className="rounded-2xl border border-border bg-card py-3.5 font-semibold text-sm"
              >
                View portfolio
              </button>
              <button
                type="button"
                onClick={handleClose}
                className="rounded-2xl bg-foreground text-background py-3.5 font-semibold text-sm"
              >
                Continue browsing
              </button>
            </div>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}
