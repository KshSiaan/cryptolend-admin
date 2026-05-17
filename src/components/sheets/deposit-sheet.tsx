"use client";

import { useState } from "react";
import { AlertTriangle, Copy, ExternalLink, QrCode, Zap } from "lucide-react";
import { toast } from "sonner";
import { platformWallet } from "@/lib/mock-data";
import { cn } from "@/lib/utils";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

type Method = "copy" | "qr";
type Step = "select" | "processing" | "confirmed";

export function DepositSheet({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const [method, setMethod] = useState<Method>("copy");
  const [step, setStep] = useState<Step>("select");
  const [amountSent, setAmountSent] = useState("");
  const [senderAddr, setSenderAddr] = useState("");

  function handleCopy() {
    navigator.clipboard.writeText(platformWallet);
    toast.success("Address copied");
  }

  function handleSubmit() {
    if (!amountSent || !senderAddr) {
      toast.error("Fill in amount and sender address");
      return;
    }
    setStep("processing");
    setTimeout(() => setStep("confirmed"), 2000);
  }

  function handleClose() {
    setOpen(false);
    setTimeout(() => {
      setStep("select");
      setAmountSent("");
      setSenderAddr("");
    }, 300);
  }

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>{children}</SheetTrigger>
      <SheetContent
        side="bottom"
        className="rounded-t-3xl max-h-[92dvh] overflow-y-auto px-4 pb-8"
      >
        {step === "select" && (
          <>
            <SheetHeader className="pb-2">
              <SheetTitle className="text-xl font-bold text-left">
                Deposit USDT
              </SheetTitle>
            </SheetHeader>

            <div className="rounded-xl bg-purple-bg border border-purple/20 p-3 flex gap-2 mb-5">
              <Zap size={16} className="text-purple shrink-0 mt-0.5" />
              <p className="text-sm text-purple">
                <span className="font-bold">Solana is fast &amp; cheap.</span>{" "}
                Deposits confirm in ~1–2 seconds. Transaction fee is less than
                $0.001.
              </p>
            </div>

            <p className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground mb-3">
              Step 1 — Choose Method
            </p>
            <div className="grid grid-cols-2 gap-3 mb-6">
              {(["copy", "qr"] as Method[]).map((m) => (
                <button
                  key={m}
                  type="button"
                  onClick={() => setMethod(m)}
                  className={cn(
                    "flex flex-col items-center gap-2 p-4 rounded-2xl border-2 transition-colors",
                    method === m
                      ? "border-purple bg-purple-bg"
                      : "border-border bg-card hover:border-purple/40",
                  )}
                >
                  {m === "copy" ? (
                    <Copy size={24} className="text-muted-foreground" />
                  ) : (
                    <QrCode size={24} className="text-muted-foreground" />
                  )}
                  <span className="text-sm font-medium">
                    {m === "copy" ? "Copy address" : "Scan QR code"}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {m === "copy" ? "Paste in wallet app" : "Use wallet camera"}
                  </span>
                </button>
              ))}
            </div>

            <p className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground mb-3">
              Step 2 — Send SOL to this address
            </p>
            <div className="rounded-2xl bg-card border border-border p-4 mb-4 space-y-3">
              <p className="text-xs text-muted-foreground">
                Platform wallet (Solana)
              </p>
              <p className="text-xs font-mono break-all text-foreground bg-muted rounded-lg px-3 py-2">
                {platformWallet}
              </p>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={handleCopy}
                  className="flex items-center justify-center gap-2 bg-foreground text-background rounded-xl py-2.5 text-sm font-medium"
                >
                  <Copy size={14} />
                  Copy Address
                </button>
                <button
                  type="button"
                  className="flex items-center justify-center gap-2 bg-foreground text-background rounded-xl py-2.5 text-sm font-medium"
                >
                  <QrCode size={14} />
                  Show QR
                </button>
              </div>

              {method === "qr" && (
                <div className="rounded-xl bg-muted h-32 flex items-center justify-center mt-1">
                  <div className="text-center text-muted-foreground">
                    <QrCode size={40} className="mx-auto mb-1 opacity-40" />
                    <p className="text-xs">Tap to simulate wallet scan</p>
                  </div>
                </div>
              )}

              <div className="rounded-xl border border-orange-border bg-orange-bg p-3 flex gap-2">
                <AlertTriangle
                  size={14}
                  className="text-orange shrink-0 mt-0.5"
                />
                <p className="text-xs text-orange">
                  Only send SOL on the{" "}
                  <span className="font-bold">Solana mainnet.</span> Do not send
                  ETH, USDT or tokens from other networks.
                </p>
              </div>
            </div>

            <p className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground mb-3">
              Step 3 — Open your Solana wallet app
            </p>
            <div className="rounded-2xl bg-card border border-border divide-y divide-border mb-6">
              {[
                { name: "Phantom", desc: "Most popular Solana wallet" },
                { name: "Solflare", desc: "Web & mobile Solana wallet" },
                { name: "Backpack", desc: "Next-gen Solana wallet" },
              ].map((w) => (
                <div
                  key={w.name}
                  className="flex items-center justify-between px-4 py-3"
                >
                  <div>
                    <p className="text-sm font-semibold">{w.name}</p>
                    <p className="text-xs text-muted-foreground">{w.desc}</p>
                  </div>
                  <ExternalLink size={14} className="text-muted-foreground" />
                </div>
              ))}
            </div>

            <p className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground mb-3">
              Step 4 — Confirm your deposit
            </p>
            <div className="space-y-3 mb-6">
              <div className="space-y-1.5">
                <label
                  htmlFor="deposit-amount"
                  className="text-sm text-muted-foreground"
                >
                  Amount sent (SOL)
                </label>
                <input
                  id="deposit-amount"
                  type="number"
                  placeholder="0.0"
                  value={amountSent}
                  onChange={(e) => setAmountSent(e.target.value)}
                  className="w-full rounded-xl border border-border bg-card px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-ring"
                />
              </div>
              <div className="space-y-1.5">
                <label
                  htmlFor="deposit-sender"
                  className="text-sm text-muted-foreground"
                >
                  Your Solana wallet address (sender)
                </label>
                <input
                  id="deposit-sender"
                  type="text"
                  placeholder="7XkZ.. (address you sent from)"
                  value={senderAddr}
                  onChange={(e) => setSenderAddr(e.target.value)}
                  className="w-full rounded-xl border border-border bg-card px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-ring"
                />
                <p className="text-[11px] text-muted-foreground">
                  We match this address to your account on the blockchain. Only
                  needs to be registered once.
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={handleSubmit}
              className="w-full bg-foreground text-background rounded-2xl py-3.5 font-semibold text-sm"
            >
              Submit Deposit
            </button>
          </>
        )}

        {step === "processing" && (
          <div className="py-8 flex flex-col items-center text-center space-y-4">
            <div className="w-20 h-20 rounded-full bg-purple-bg flex items-center justify-center">
              <div className="w-8 h-8 border-4 border-purple border-t-transparent rounded-full animate-spin" />
            </div>
            <h2 className="text-xl font-bold">Processing Deposit</h2>
            <p className="text-muted-foreground text-sm max-w-xs">
              Your SOL is being verified on the Solana blockchain.
            </p>
            <p className="text-green-pos font-semibold text-sm">
              Usually takes 1–2 seconds.
            </p>
            <div className="w-full rounded-2xl bg-card border border-border divide-y divide-border mt-4">
              {[
                { label: "Amount", value: `${amountSent} SOL` },
                { label: "Network", value: "Solana" },
                { label: "Confirmations", value: "Waiting..." },
                { label: "Est. time", value: "≈1–2 seconds" },
                { label: "Fee paid", value: "≈$0.00025" },
              ].map((r) => (
                <div
                  key={r.label}
                  className="flex justify-between px-4 py-3 text-sm"
                >
                  <span className="text-muted-foreground">{r.label}</span>
                  <span
                    className={cn(
                      "font-medium",
                      r.label === "Est. time" || r.label === "Fee paid"
                        ? "text-green-pos"
                        : "",
                    )}
                  >
                    {r.value}
                  </span>
                </div>
              ))}
            </div>
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
                aria-label="Success checkmark"
                className="w-10 h-10 text-green-pos"
              >
                <title>Success</title>
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </div>
            <h2 className="text-xl font-bold">Deposit Confirmed!</h2>
            <p className="text-muted-foreground text-sm">
              Verified on Solana in{" "}
              <span className="font-bold">1 confirmation.</span> Balance updated
              instantly.
            </p>

            <div className="w-full rounded-2xl bg-card border border-border divide-y divide-border">
              {[
                { label: "Amount credited", value: `+${amountSent} SOL`, green: true },
                {
                  label: "New balance",
                  value: `${(1.842 + parseFloat(amountSent || "0")).toFixed(4)} SOL`,
                  green: false,
                },
                { label: "Confirmations", value: "1 / 1 ✓", green: false },
                { label: "Network", value: "Solana mainnet", green: false },
                { label: "View on explorer", value: "Solscan ✓", green: true },
              ].map((r) => (
                <div
                  key={r.label}
                  className="flex justify-between items-center px-4 py-3 text-sm"
                >
                  <span className="text-muted-foreground">{r.label}</span>
                  <span className={cn("font-medium", r.green ? "text-green-pos" : "")}>
                    {r.value}
                  </span>
                </div>
              ))}
            </div>

            <div className="w-full rounded-2xl bg-foreground text-background p-4 mt-2">
              <p className="text-[10px] uppercase tracking-widest opacity-60">
                New Balance
              </p>
              <p className="text-3xl font-bold mt-1">
                {(1.842 + parseFloat(amountSent || "0")).toFixed(4)}{" "}
                <span className="text-base font-semibold">SOL</span>
              </p>
              <p className="text-sm opacity-60">≈ $2,582.76 USD</p>
            </div>

            <div className="grid grid-cols-2 gap-3 w-full mt-2">
              <button
                type="button"
                onClick={handleClose}
                className="bg-foreground text-background rounded-2xl py-3.5 font-semibold text-sm"
              >
                Back to wallet
              </button>
              <button
                type="button"
                onClick={handleClose}
                className="bg-foreground text-background rounded-2xl py-3.5 font-semibold text-sm"
              >
                Invest Now
              </button>
            </div>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}
