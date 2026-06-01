"use client";

import { useEffect, useState } from "react";

import { useCookies } from "react-cookie";
import { toast } from "sonner";

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useProfile } from "@/hooks/use-profile";
import { howl } from "@/lib/utils";
import type {
  InvestResponseData,
  LoanItem,
  MarketConvertData,
} from "@/types/auth";
import type { ApiResponse } from "@/types/base";

type Step = "invest" | "confirmed";
type Currency = "SOL" | "EUR";

export function InvestSheet({
  loan,
  children,
}: {
  loan: LoanItem;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState<Step>("invest");
  const [currency, setCurrency] = useState<Currency>("SOL");
  const [solAmount, setSolAmount] = useState("");
  const [eurAmount, setEurAmount] = useState("");
  const [eurToSol, setEurToSol] = useState<string | null>(null);
  const [convertLoading, setConvertLoading] = useState(false);
  const [isPending, setIsPending] = useState(false);
  const [result, setResult] = useState<InvestResponseData | null>(null);

  const [cookies] = useCookies(["auth_token"]);
  const token = cookies.auth_token as string | undefined;
  const { data: profileData } = useProfile();
  const balanceSol = profileData?.data?.wallet_balance_sol ?? "0";

  const solVal = parseFloat(solAmount) || 0;
  const aprDecimal = loan.apr_percent / 100;
  const monthlyPayment =
    solVal > 0 ? (solVal * aprDecimal) / 12 + solVal / loan.duration_months : 0;
  const totalInterest =
    solVal > 0 ? ((solVal * aprDecimal) / 12) * loan.duration_months : 0;
  const totalReturn = solVal + totalInterest;

  // EUR → SOL conversion (debounced, only when EUR mode)
  useEffect(() => {
    if (currency !== "EUR" || !eurAmount || Number(eurAmount) <= 0) return;
    const timer = setTimeout(async () => {
      setConvertLoading(true);
      try {
        const res = await howl<ApiResponse<MarketConvertData>>(
          `/market/convert?from=eur&to=sol&amount=${eurAmount}`,
          { token },
        );
        const sol = res.data.conversion.output_amount_sol;
        setEurToSol(sol);
        setSolAmount(sol);
      } catch {
        setEurToSol(null);
      } finally {
        setConvertLoading(false);
      }
    }, 600);
    return () => clearTimeout(timer);
  }, [eurAmount, currency, token]);

  async function handleConfirm() {
    const v = parseFloat(solAmount);
    if (!v || v <= 0) {
      toast.error("Enter a valid amount.");
      return;
    }
    if (v > parseFloat(balanceSol)) {
      toast.error("Insufficient balance.");
      return;
    }
    if (!token) return;

    setIsPending(true);
    try {
      const body =
        currency === "EUR"
          ? { amount_eur: parseFloat(eurAmount) }
          : { amount_sol: solAmount };

      const res = await howl<ApiResponse<InvestResponseData>>(
        `/loans/${loan.id}/invest`,
        {
          method: "POST",
          body,
          token,
        },
      );
      setResult(res.data);
      setStep("confirmed");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Investment failed.");
    } finally {
      setIsPending(false);
    }
  }

  function handleClose() {
    setOpen(false);
    setTimeout(() => {
      setStep("invest");
      setSolAmount("");
      setEurAmount("");
      setEurToSol(null);
      setCurrency("SOL");
      setResult(null);
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
          <SheetTitle>{loan.title}</SheetTitle>
        </SheetHeader>

        {step === "invest" && (
          <div className="space-y-5">
            {/* Tags */}
            <div className="flex items-center gap-2 flex-wrap">
              <span className="rounded-full border border-border bg-muted/60 px-2.5 py-0.5 text-xs font-medium">
                {loan.sector}
              </span>
              <span className="rounded-full border border-border bg-muted/60 px-2.5 py-0.5 text-xs font-mono font-medium">
                {loan.loan_number}
              </span>
            </div>

            {/* Title + description */}
            <div>
              <h2 className="text-2xl font-bold leading-tight">{loan.title}</h2>
              <p className="text-sm text-muted-foreground mt-1">
                {loan.description}
              </p>
            </div>

            {/* Stats row */}
            <div className="rounded-xl bg-muted/50 border border-border grid grid-cols-3 divide-x divide-border px-0 py-3">
              {[
                { label: "APR", value: `${loan.apr_percent}%` },
                { label: "TERM", value: `${loan.duration_months}mo` },
                {
                  label: "TARGET",
                  value: `${loan.target_amount_sol} SOL | ${loan.target_amount_eur} EUR`,
                },
              ].map((s) => (
                <div
                  key={s.label}
                  className="flex flex-col items-center gap-0.5 px-2"
                >
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
                <span>{loan.funded_percent_label}</span>
              </div>
              <div className="h-2 rounded-full bg-muted overflow-hidden">
                <div
                  className="h-full bg-foreground rounded-full"
                  style={{ width: `${Math.min(loan.funded_percent, 100)}%` }}
                />
              </div>
              <p className="text-xs text-muted-foreground">
                {loan.raised_amount_sol} of {loan.target_amount_sol} SOL raised
              </p>
            </div>

            {/* Amount input */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label
                  htmlFor="invest-amount"
                  className="text-xs font-semibold uppercase tracking-wider"
                >
                  Investment amount ({currency})
                </label>
                <button
                  type="button"
                  onClick={() => {
                    setCurrency((c) => (c === "SOL" ? "EUR" : "SOL"));
                    setEurToSol(null);
                  }}
                  className="flex items-center gap-1.5 rounded-full border border-border bg-card px-2.5 py-1 text-[11px] font-medium"
                >
                  <span
                    className={
                      currency === "SOL" ? "font-bold" : "text-muted-foreground"
                    }
                  >
                    SOL
                  </span>
                  <span className="text-muted-foreground">/</span>
                  <span
                    className={
                      currency === "EUR" ? "font-bold" : "text-muted-foreground"
                    }
                  >
                    EUR
                  </span>
                </button>
              </div>

              <input
                id="invest-amount"
                type="number"
                min="0"
                step="0.01"
                placeholder={currency === "SOL" ? "0.00 SOL" : "0.00 EUR"}
                value={currency === "SOL" ? solAmount : eurAmount}
                onChange={(e) => {
                  if (currency === "SOL") {
                    setSolAmount(e.target.value);
                    setEurToSol(null);
                  } else {
                    setEurAmount(e.target.value);
                  }
                }}
                className="w-full rounded-xl border border-border bg-card px-4 py-3 text-base outline-none focus:ring-2 focus:ring-ring"
              />

              {currency === "EUR" && convertLoading && (
                <p className="text-xs text-muted-foreground">Converting…</p>
              )}
              {currency === "EUR" && eurToSol && !convertLoading && (
                <p className="text-xs text-muted-foreground">
                  ≈{" "}
                  <span className="font-semibold text-foreground">
                    {eurToSol} SOL
                  </span>
                </p>
              )}

              <p className="text-xs text-muted-foreground">
                Available:{" "}
                <span className="font-semibold text-foreground">
                  {balanceSol} SOL
                </span>
              </p>
            </div>

            {/* Breakdown */}
            {solVal > 0 && (
              <div className="rounded-xl border border-border bg-card divide-y divide-border">
                {[
                  {
                    label: "Monthly payment",
                    value: `${monthlyPayment.toFixed(4)} SOL`,
                    green: false,
                  },
                  {
                    label: "Total interest earned",
                    value: `+${totalInterest.toFixed(4)} SOL`,
                    green: true,
                  },
                  {
                    label: `Total return after ${loan.duration_months}mo`,
                    value: `${totalReturn.toFixed(4)} SOL`,
                    green: false,
                  },
                ].map((r) => (
                  <div
                    key={r.label}
                    className="flex items-center justify-between px-4 py-2.5 text-sm"
                  >
                    <span className="text-muted-foreground">{r.label}</span>
                    <span
                      className={`font-semibold ${r.green ? "text-green-pos" : ""}`}
                    >
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
                disabled={isPending}
                className="rounded-2xl bg-foreground text-background py-3.5 font-semibold text-sm disabled:opacity-50"
              >
                {isPending ? "Submitting…" : "Submit investment"}
              </button>
            </div>
          </div>
        )}

        {step === "confirmed" && result && (
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
              <span className="font-bold text-foreground">
                {result.investment.amount_sol} SOL
              </span>{" "}
              in {loan.title}.
            </p>
            <div className="w-full rounded-2xl bg-card border border-border divide-y divide-border">
              {[
                {
                  label: "Amount",
                  value: `${result.investment.amount_sol} SOL`,
                  green: false,
                },
                {
                  label: "Expected return",
                  value: `${result.investment.expected_return_sol} SOL`,
                  green: true,
                },
                {
                  label: "APR",
                  value: `${result.investment.apr_percent}%`,
                  green: true,
                },
                {
                  label: "New balance",
                  value: `${result.wallet.balance_sol} SOL`,
                  green: false,
                },
                {
                  label: "Status",
                  value: result.investment.status,
                  green: false,
                },
              ].map((r) => (
                <div
                  key={r.label}
                  className="flex justify-between items-center px-4 py-3 text-sm"
                >
                  <span className="text-muted-foreground">{r.label}</span>
                  <span
                    className={`font-semibold capitalize ${r.green ? "text-green-pos" : ""}`}
                  >
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
