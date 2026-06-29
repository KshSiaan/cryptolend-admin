"use client";

import { useEffect, useState } from "react";

import { useQueryClient } from "@tanstack/react-query";
import { AlertTriangle, Clock } from "lucide-react";
import { useCookies } from "react-cookie";
import { toast } from "sonner";

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { howl } from "@/lib/utils";
import type { ApiResponse } from "@/types/base";

type Step = "form" | "confirm" | "submitted";

interface WithdrawResponseData {
  withdrawal_request: {
    id: number;
    status: string;
    amount_sol: string;
    recipient_address: string;
  };
  wallet: {
    available_balance_sol: string;
  };
}

export function WithdrawSheet({
  children,
  availableSol = "0",
  availableEur = "0",
}: {
  children: React.ReactNode;
  availableSol?: string;
  availableEur?: string;
}) {
  const queryClient = useQueryClient();
  const [cookies] = useCookies(["auth_token"]);
  const token = cookies.auth_token as string | undefined;

  const [open, setOpen] = useState(false);
  const [step, setStep] = useState<Step>("form");
  const [currency, setCurrency] = useState<"sol" | "eur">("sol");
  const [amount, setAmount] = useState("");
  const [address, setAddress] = useState("");
  const [isPending, setIsPending] = useState(false);
  const [rate, setRate] = useState<number | null>(null);

  useEffect(() => {
    if (!token) return;
    howl<ApiResponse<any>>("/market/convert?from=sol&to=eur&amount=1", { token })
      .then((res) => {
        const r = parseFloat(res.data?.conversion?.output_amount_eur);
        if (!isNaN(r)) setRate(r);
      })
      .catch(() => {});
  }, [token]);

  const availableSolVal = parseFloat(availableSol) || 0;
  const availableEurVal = parseFloat(availableEur) || 0;
  const available = currency === "sol" ? availableSolVal : availableEurVal;
  const parsedAmount = parseFloat(amount) || 0;
  const balanceAfter = available - parsedAmount;

  function handleNext() {
    if (!amount || parsedAmount <= 0) {
      toast.error("Enter a valid amount.");
      return;
    }
    if (parsedAmount > available) {
      toast.error("Insufficient balance.");
      return;
    }
    if (!address.trim()) {
      toast.error("Enter a recipient address.");
      return;
    }
    setStep("confirm");
  }

  async function handleSubmit() {
    if (!token) return;
    setIsPending(true);
    try {
      const body = currency === "sol" 
        ? { amount_sol: parsedAmount, recipient_address: address.trim() } 
        : { amount_eur: parsedAmount, recipient_address: address.trim() };

      await howl<ApiResponse<WithdrawResponseData>>("/wallet/withdraw", {
        method: "POST",
        token,
        body,
      });
      toast.success("Withdrawal request submitted.");
      void queryClient.invalidateQueries({ queryKey: ["wallet-stats"] });
      void queryClient.invalidateQueries({ queryKey: ["wallet-transactions"] });
      void queryClient.invalidateQueries({ queryKey: ["withdrawal-requests"] });
      setStep("submitted");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Submission failed.");
    } finally {
      setIsPending(false);
    }
  }

  function handleClose() {
    setOpen(false);
    setTimeout(() => {
      setStep("form");
      setAmount("");
      setAddress("");
    }, 300);
  }

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>{children}</SheetTrigger>
      <SheetContent
        side="bottom"
        className="rounded-t-3xl max-h-[92dvh] overflow-y-auto px-4 pb-8"
      >
        {step === "form" && (
          <>
            <SheetHeader className="pb-4">
              <SheetTitle className="text-xl font-bold text-left">
                Withdraw
              </SheetTitle>
            </SheetHeader>

            <div className="space-y-4 mb-6">
              <div className="space-y-1.5">
                <label htmlFor="withdraw-amount" className="text-sm font-medium">
                  Amount
                </label>
                <div className="flex gap-2">
                  <input
                    id="withdraw-amount"
                    type="number"
                    placeholder="0.00"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="flex-1 rounded-xl border border-border bg-card px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-ring"
                  />
                  <select
                    value={currency}
                    onChange={(e) => {
                      const newCurrency = e.target.value as "sol" | "eur";
                      setCurrency(newCurrency);
                      if (amount && rate) {
                        const parsed = parseFloat(amount);
                        if (!isNaN(parsed)) {
                          if (newCurrency === "eur") {
                            setAmount((parsed * rate).toFixed(2));
                          } else {
                            setAmount((parsed / rate).toFixed(4));
                          }
                        }
                      }
                    }}
                    className="w-20 rounded-xl border border-border bg-card px-2 py-2.5 text-sm outline-none focus:ring-2 focus:ring-ring"
                  >
                    <option value="sol">SOL</option>
                    <option value="eur">EUR</option>
                  </select>
                </div>
                <p className="text-xs text-muted-foreground">
                  Available: {available.toFixed(4)} {currency.toUpperCase()}
                </p>
              </div>

              <div className="space-y-1.5">
                <label htmlFor="withdraw-address" className="text-sm font-medium">
                  Recipient address
                </label>
                <input
                  id="withdraw-address"
                  type="text"
                  placeholder="Solana wallet address"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full rounded-xl border border-border bg-card px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-ring"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={handleClose}
                className="rounded-2xl border border-border bg-card py-3.5 font-semibold text-sm"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleNext}
                className="rounded-2xl bg-foreground text-background py-3.5 font-semibold text-sm"
              >
                Continue
              </button>
            </div>
          </>
        )}

        {step === "confirm" && (
          <>
            <SheetHeader className="pb-4">
              <SheetTitle className="text-xl font-bold text-left">
                Confirm Withdrawal
              </SheetTitle>
            </SheetHeader>

            <div className="rounded-xl border border-orange-border bg-orange-bg p-3 flex gap-2 mb-5">
              <AlertTriangle size={16} className="text-orange shrink-0 mt-0.5" />
              <p className="text-sm text-orange">
                Funds won&apos;t move until an admin approves this request.
              </p>
            </div>

            <div className="rounded-2xl bg-card border border-border divide-y divide-border mb-6">
              {[
                { label: "Amount", value: `${parsedAmount.toFixed(4)} ${currency.toUpperCase()}` },
                { label: "To", value: address },
                { label: "Balance after", value: `${balanceAfter.toFixed(4)} ${currency.toUpperCase()}` },
              ].map((r) => (
                <div
                  key={r.label}
                  className="flex justify-between items-center px-4 py-3 text-sm"
                >
                  <span className="text-muted-foreground">{r.label}</span>
                  <span className="font-semibold text-right max-w-[60%] break-all">
                    {r.value}
                  </span>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setStep("form")}
                disabled={isPending}
                className="rounded-2xl border border-border bg-card py-3.5 font-semibold text-sm disabled:opacity-50"
              >
                Back
              </button>
              <button
                type="button"
                onClick={handleSubmit}
                disabled={isPending}
                className="rounded-2xl bg-foreground text-background py-3.5 font-semibold text-sm disabled:opacity-50"
              >
                {isPending ? "Submitting…" : "Submit"}
              </button>
            </div>
          </>
        )}

        {step === "submitted" && (
          <div className="py-8 flex flex-col items-center text-center space-y-4">
            <div className="w-20 h-20 rounded-full bg-orange-bg flex items-center justify-center">
              <Clock size={36} className="text-orange" />
            </div>
            <h2 className="text-xl font-bold">Request Submitted</h2>
            <p className="text-muted-foreground text-sm max-w-xs">
              Your withdrawal of{" "}
              <span className="font-bold text-foreground">
                {parsedAmount.toFixed(4)} {currency.toUpperCase()}
              </span>{" "}
              is awaiting admin approval.
            </p>
            <button
              type="button"
              onClick={handleClose}
              className="w-full rounded-2xl bg-foreground text-background py-3.5 font-semibold text-sm mt-4"
            >
              Done
            </button>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}
