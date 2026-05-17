"use client";

import { useState } from "react";
import { AlertTriangle, Clock } from "lucide-react";
import { toast } from "sonner";
import { user } from "@/lib/mock-data";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

type Step = "form" | "confirm" | "submitted";

export function WithdrawSheet({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState<Step>("form");
  const [amount, setAmount] = useState("");
  const [address, setAddress] = useState("");
  const [note, setNote] = useState("");

  const parsedAmount = parseFloat(amount) || 0;
  const balanceAfter = user.availableBalance - parsedAmount;

  function handleNext() {
    if (!amount || parsedAmount <= 0) {
      toast.error("Enter a valid amount");
      return;
    }
    if (parsedAmount > user.availableBalance) {
      toast.error("Insufficient balance");
      return;
    }
    if (!address.trim()) {
      toast.error("Enter withdrawal address");
      return;
    }
    setStep("confirm");
  }

  function handleSubmit() {
    setStep("submitted");
  }

  function handleClose() {
    setOpen(false);
    setTimeout(() => {
      setStep("form");
      setAmount("");
      setAddress("");
      setNote("");
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
                  Amount (SOL)
                </label>
                <input
                  id="withdraw-amount"
                  type="number"
                  placeholder="0.00"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="w-full rounded-xl border border-border bg-card px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-ring"
                />
                <p className="text-xs text-muted-foreground">
                  Available: {user.availableBalance.toFixed(4)} SOL
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

              <div className="space-y-1.5">
                <label htmlFor="withdraw-note" className="text-sm font-medium">
                  Note{" "}
                  <span className="text-muted-foreground font-normal">
                    (optional)
                  </span>
                </label>
                <input
                  id="withdraw-note"
                  type="text"
                  placeholder="Optional note"
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
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
                { label: "Amount", value: `${parsedAmount.toFixed(4)} SOL` },
                { label: "To", value: address },
                { label: "Balance after", value: `${balanceAfter.toFixed(4)} SOL` },
                { label: "Note", value: note || "—" },
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
                className="rounded-2xl border border-border bg-card py-3.5 font-semibold text-sm"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSubmit}
                className="rounded-2xl bg-foreground text-background py-3.5 font-semibold text-sm"
              >
                Submit
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
                {parsedAmount.toFixed(4)} SOL
              </span>{" "}
              is awaiting admin approval.
            </p>
            <div className="grid grid-cols-2 gap-3 w-full mt-4">
              <button
                type="button"
                onClick={handleClose}
                className="rounded-2xl border border-border bg-card py-3.5 font-semibold text-sm"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleClose}
                className="rounded-2xl bg-foreground text-background py-3.5 font-semibold text-sm"
              >
                Done
              </button>
            </div>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}
