"use client";

import { useState } from "react";
import { toast } from "sonner";
import type { loans } from "@/lib/mock-data";
import { user } from "@/lib/mock-data";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

type Loan = (typeof loans)[number];
type Step = "invest" | "confirmed";
type Currency = "SOL" | "EUR";

const SOL_TO_EUR = 130;

export function InvestSheet({
  loan,
  children,
}: {
  loan: Loan;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState<Step>("invest");
  const [currency, setCurrency] = useState<Currency>("SOL");
  const [solAmount, setSolAmount] = useState("");
  const [eurAmount, setEurAmount] = useState("");

  const solVal = parseFloat(solAmount) || 0;
  const monthlyPayment = solVal > 0
    ? (solVal * (loan.apr / 100)) / 12 + solVal / loan.durationMonths
    : 0;
  const totalInterest = solVal > 0
    ? ((solVal * loan.apr) / 100 / 12) * loan.durationMonths
    : 0;
  const totalReturn = solVal + totalInterest;

  const pct = Math.round((loan.raised / loan.target) * 100);

  function handleSolChange(v: string) {
    setSolAmount(v);
    const n = parseFloat(v);
    setEurAmount(n > 0 ? (n * SOL_TO_EUR).toFixed(2) : "");
  }

  function handleEurChange(v: string) {
    setEurAmount(v);
    const n = parseFloat(v);
    setSolAmount(n > 0 ? (n / SOL_TO_EUR).toFixed(6) : "");
  }

  function handleConfirm() {
    const v = parseFloat(solAmount);
    if (!v || v <= 0) {
      toast.error("Enter a valid amount");
      return;
    }
    if (v > user.availableBalance) {
      toast.error("Insufficient balance");
      return;
    }
    setStep("confirmed");
  }

  function handleClose() {
    setOpen(false);
    setTimeout(() => {
      setStep("invest");
      setSolAmount("");
      setEurAmount("");
      setCurrency("SOL");
    }, 300);
  }

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>{children}</SheetTrigger>
      <SheetContent
        side="bottom"
        className="rounded-t-3xl max-h-[92dvh] overflow-y-auto px-5 pb-8 pt-6"
      >
        <SheetHeader className="hidden">
          <SheetTitle></SheetTitle>
        </SheetHeader>
        {step === "invest" && (
          <div className="space-y-5">
            {/* Tags + close row */}
            <div className="flex items-center gap-2 flex-wrap">
              <span className="rounded-full border border-border bg-muted/60 px-2.5 py-0.5 text-xs font-medium">
                {loan.sector}
              </span>
              <span className="rounded-full border border-border bg-muted/60 px-2.5 py-0.5 text-xs font-medium">
                {loan.grade}
              </span>
              <span className="rounded-full border border-border bg-muted/60 px-2.5 py-0.5 text-xs font-medium font-mono">
                LN-{String(loan.id).padStart(4, "0")}
              </span>
            </div>

            {/* Title + description */}
            <div>
              <h2 className="text-2xl font-bold leading-tight">{loan.title}</h2>
              <p className="text-sm text-muted-foreground mt-1">{loan.description}</p>
            </div>

            {/* Stats row */}
            <div className="rounded-xl bg-muted/50 border border-border grid grid-cols-4 divide-x divide-border px-0 py-3">
              {[
                { label: "PRINCIPAL", value: `${loan.target}` },
                { label: "APR", value: `${loan.apr}%` },
                { label: "TERM", value: `${loan.durationMonths}mo` },
                { label: "MIN.", value: `${loan.minInvestment}` },
              ].map((s) => (
                <div key={s.label} className="flex flex-col items-center gap-0.5 px-2">
                  <span className="text-[9px] uppercase tracking-widest text-muted-foreground">
                    {s.label}
                  </span>
                  <span className="text-sm font-bold">{s.value}</span>
                </div>
              ))}
            </div>

            {/* Funding progress */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-[10px] uppercase tracking-widest text-muted-foreground">
                <span>Funding</span>
                <span>{pct}%</span>
              </div>
              <div className="h-2 rounded-full bg-muted overflow-hidden">
                <div
                  className="h-full bg-foreground rounded-full"
                  style={{ width: `${Math.min(pct, 100)}%` }}
                />
              </div>
              <p className="text-xs text-muted-foreground">
                {loan.raised} of {loan.target} SOL · closes {loan.nextPayment ?? "TBD"}
              </p>
            </div>

            {/* Amount input */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label htmlFor="invest-sol" className="text-xs font-semibold uppercase tracking-wider">
                  Your investment amount ({currency})
                </label>
                <button
                  type="button"
                  onClick={() => setCurrency((c) => (c === "SOL" ? "EUR" : "SOL"))}
                  className="flex items-center gap-1.5 rounded-full border border-border bg-card px-2.5 py-1 text-[11px] font-medium"
                >
                  <span className={currency === "SOL" ? "font-bold" : "text-muted-foreground"}>SOL</span>
                  <span className="text-muted-foreground">/</span>
                  <span className={currency === "EUR" ? "font-bold" : "text-muted-foreground"}>EUR</span>
                </button>
              </div>

              <input
                id="invest-sol"
                type="number"
                min="0"
                step="0.01"
                placeholder={currency === "SOL" ? "0.00 SOL" : "0.00 EUR"}
                value={currency === "SOL" ? solAmount : eurAmount}
                onChange={(e) =>
                  currency === "SOL"
                    ? handleSolChange(e.target.value)
                    : handleEurChange(e.target.value)
                }
                className="w-full rounded-xl border border-border bg-card px-4 py-3 text-base outline-none focus:ring-2 focus:ring-ring"
              />

              <p className="text-xs text-muted-foreground">
                Available: <span className="font-semibold text-foreground">{user.availableBalance.toFixed(4)} SOL</span>
                <span className="ml-1">≈ €{(user.availableBalance * SOL_TO_EUR).toFixed(2)}</span>
                <span className="ml-2 text-[10px]">· Rate: 1 SOL = €{SOL_TO_EUR} (mock)</span>
              </p>
            </div>

            {/* Breakdown */}
            {solVal > 0 && (
              <div className="rounded-xl border border-border bg-card divide-y divide-border">
                {[
                  { label: "Monthly payment", value: `${monthlyPayment.toFixed(4)} SOL`, green: false },
                  { label: "Total interest earned", value: `+${totalInterest.toFixed(4)} SOL`, green: true },
                  { label: `Total return after ${loan.durationMonths}mo`, value: `${totalReturn.toFixed(4)} SOL`, green: false, bold: true },
                ].map((r) => (
                  <div key={r.label} className="flex items-center justify-between px-4 py-2.5 text-sm">
                    <span className="text-muted-foreground">{r.label}</span>
                    <span className={`font-semibold ${r.green ? "text-green-pos" : ""} ${r.bold ? "font-bold" : ""}`}>
                      {r.value}
                    </span>
                  </div>
                ))}
              </div>
            )}

            {/* Actions */}
            <div className="grid grid-cols-2 gap-3 pt-1">
              <button
                type="button"
                onClick={handleClose}
                className="rounded-2xl border border-border bg-card py-3.5 font-semibold text-sm"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirm}
                className="rounded-2xl bg-foreground text-background py-3.5 font-semibold text-sm"
              >
                Submit application
              </button>
            </div>

            <p className="text-center text-[10px] text-muted-foreground">
              Applications are reviewed within 48 hours. Funds held in escrow upon submission.
            </p>
          </div>
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
              <span className="font-bold text-foreground">{solAmount} SOL</span>
              {eurAmount && (
                <span className="text-muted-foreground"> (≈ €{eurAmount})</span>
              )}{" "}
              in {loan.title}.
            </p>
            <div className="w-full rounded-2xl bg-card border border-border divide-y divide-border">
              {[
                { label: "Amount", value: `${solAmount} SOL`, green: false },
                { label: "EUR equiv.", value: `€${eurAmount || (parseFloat(solAmount) * SOL_TO_EUR).toFixed(2)}`, green: false },
                { label: "Monthly payment", value: `${monthlyPayment.toFixed(4)} SOL`, green: false },
                { label: "Total interest", value: `+${totalInterest.toFixed(4)} SOL`, green: true },
                { label: "Total return", value: `${totalReturn.toFixed(4)} SOL`, green: false },
                { label: "APR", value: `${loan.apr}%`, green: true },
              ].map((r) => (
                <div key={r.label} className="flex justify-between items-center px-4 py-3 text-sm">
                  <span className="text-muted-foreground">{r.label}</span>
                  <span className={r.green ? "font-semibold text-green-pos" : "font-semibold"}>
                    {r.value}
                  </span>
                </div>
              ))}
            </div>
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
                Continue
              </button>
            </div>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}
