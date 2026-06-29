"use client";

import { useEffect, useState } from "react";

import { AlertTriangle, Copy, ExternalLink, Zap } from "lucide-react";
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
import type {
  DepositBody,
  DepositInstructions,
  DepositResponseData,
  MarketConvertData,
} from "@/types/auth";
import type { ApiResponse } from "@/types/base";

type Step = "select" | "processing" | "confirmed";

export function DepositSheet({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState<Step>("select");
  const [txSignature, setTxSignature] = useState("");
  const [senderAddr, setSenderAddr] = useState("");
  const [isPending, setIsPending] = useState(false);
  const [instructions, setInstructions] = useState<DepositInstructions | null>(null);
  const [eurAmount, setEurAmount] = useState("");
  const [solEquiv, setSolEquiv] = useState<string | null>(null);
  const [convertLoading, setConvertLoading] = useState(false);
  const [depositResult, setDepositResult] = useState<DepositResponseData | null>(null);

  const [cookies] = useCookies(["auth_token"]);
  const token = cookies.auth_token as string | undefined;

  useEffect(() => {
    if (!open) return;
    howl<ApiResponse<DepositInstructions>>("/wallet/deposits/instructions", { token })
      .then((res) => setInstructions(res.data))
      .catch(() => toast.error("Failed to load deposit instructions."));
  }, [open, token]);

  useEffect(() => {
    if (!eurAmount || Number.isNaN(Number(eurAmount)) || Number(eurAmount) <= 0) {
      setSolEquiv(null);
      return;
    }
    const timer = setTimeout(async () => {
      setConvertLoading(true);
      try {
        const res = await howl<ApiResponse<MarketConvertData>>(
          `/market/convert?from=eur&to=sol&amount=${eurAmount}`,
          { token },
        );
        setSolEquiv(res.data.conversion.output_amount_sol);
      } catch {
        setSolEquiv(null);
      } finally {
        setConvertLoading(false);
      }
    }, 600);
    return () => clearTimeout(timer);
  }, [eurAmount, token]);

  function handleCopy() {
    if (!instructions?.deposit_address) return;
    navigator.clipboard.writeText(instructions.deposit_address);
    toast.success("Address copied");
  }

  async function handleSubmit() {
    if (!txSignature || !senderAddr) {
      toast.error("Fill in transaction signature and sender address.");
      return;
    }
    if (!token) return;

    setIsPending(true);
    setStep("processing");
    try {
      const body: DepositBody = {
        tx_signature: txSignature,
        from_address: senderAddr,
        input_amount: eurAmount || solEquiv || "",
        input_currency: eurAmount ? "eur" : solEquiv ? "sol" : "",
      };
      const res = await howl<ApiResponse<DepositResponseData>>("/wallet/deposits", {
        method: "POST",
        body,
        token,
      });
      setDepositResult(res.data);
      setStep("confirmed");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Deposit failed.");
      setStep("select");
    } finally {
      setIsPending(false);
    }
  }

  function handleClose() {
    setOpen(false);
    setTimeout(() => {
      setStep("select");
      setTxSignature("");
      setSenderAddr("");
      setEurAmount("");
      setSolEquiv(null);
      setDepositResult(null);
    }, 300);
  }

  const depositAddress = instructions?.deposit_address ?? "";

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
                Deposit SOL
              </SheetTitle>
            </SheetHeader>

            {instructions?.messages?.[0] && (
              <div className="rounded-xl bg-purple-bg border border-purple/20 p-3 flex gap-2 mb-5">
                <Zap size={16} className="text-purple shrink-0 mt-0.5" />
                <p className="text-sm text-purple">
                  <span className="font-bold">Solana is fast &amp; cheap.</span>{" "}
                  {instructions.messages[0]}
                </p>
              </div>
            )}

            {/* EUR → SOL converter */}
            <div className="rounded-2xl bg-card border border-border p-4 mb-5 space-y-3">
              <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                EUR → SOL Estimator
              </p>
              <div className="space-y-1.5">
                <label htmlFor="eur-amount" className="text-sm text-muted-foreground">
                  Amount in EUR
                </label>
                <input
                  id="eur-amount"
                  type="number"
                  placeholder="100"
                  value={eurAmount}
                  onChange={(e) => setEurAmount(e.target.value)}
                  className="w-full rounded-xl border border-border bg-card px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-ring"
                />
              </div>
              {convertLoading && (
                <p className="text-xs text-muted-foreground">Converting…</p>
              )}
              {solEquiv && !convertLoading && (
                <p className="text-sm font-semibold text-green-pos">
                  ≈ {solEquiv} SOL
                </p>
              )}
            </div>

            <p className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground mb-3">
              Step 1 — Send SOL to this address
            </p>
            <div className="rounded-2xl bg-card border border-border p-4 mb-4 space-y-3">
              <p className="text-xs text-muted-foreground">Platform wallet (Solana)</p>
              <p className="text-xs font-mono break-all text-foreground bg-muted rounded-lg px-3 py-2">
                {depositAddress || "Loading…"}
              </p>
              <button
                type="button"
                onClick={handleCopy}
                disabled={!depositAddress}
                className="w-full flex items-center justify-center gap-2 bg-foreground text-background rounded-xl py-2.5 text-sm font-medium disabled:opacity-50"
              >
                <Copy size={14} />
                Copy Address
              </button>

              {instructions?.warnings?.map((w) => (
                <div key={w} className="rounded-xl border border-orange-border bg-orange-bg p-3 flex gap-2">
                  <AlertTriangle size={14} className="text-orange shrink-0 mt-0.5" />
                  <p className="text-xs text-orange">{w}</p>
                </div>
              ))}
            </div>

            {instructions?.wallet_links && instructions.wallet_links.length > 0 && (
              <>
                <p className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground mb-3">
                  Step 2 — Open your Solana wallet app
                </p>
                <div className="rounded-2xl bg-card border border-border divide-y divide-border mb-6">
                  {instructions.wallet_links.map((w) => {
                    const ua = typeof navigator !== "undefined" ? navigator.userAgent : "";
                    const isIos = /iPhone|iPad|iPod/i.test(ua);
                    const isAndroid = /Android/i.test(ua);
                    const href = isIos ? w.ios_url : isAndroid ? w.android_url : w.fallback_url;
                    return (
                      <a
                        key={w.name}
                        href={href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-between px-4 py-3"
                      >
                        <p className="text-sm font-semibold">{w.name}</p>
                        <ExternalLink size={14} className="text-muted-foreground" />
                      </a>
                    );
                  })}
                </div>
              </>
            )}

            <p className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground mb-3">
              Step 3 — Confirm your deposit
            </p>
            <div className="space-y-3 mb-6">
              <div className="space-y-1.5">
                <label htmlFor="deposit-tx" className="text-sm text-muted-foreground">
                  Transaction signature
                </label>
                <input
                  id="deposit-tx"
                  type="text"
                  placeholder="Paste Solana tx signature"
                  value={txSignature}
                  onChange={(e) => setTxSignature(e.target.value)}
                  className="w-full rounded-xl border border-border bg-card px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-ring font-mono"
                />
              </div>
              <div className="space-y-1.5">
                <label htmlFor="deposit-sender" className="text-sm text-muted-foreground">
                  Your Solana wallet address (sender)
                </label>
                <input
                  id="deposit-sender"
                  type="text"
                  placeholder="7XkZ… (address you sent from)"
                  value={senderAddr}
                  onChange={(e) => setSenderAddr(e.target.value)}
                  className="w-full rounded-xl border border-border bg-card px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-ring font-mono"
                />
                <p className="text-[11px] text-muted-foreground">
                  We match this address to your account on the blockchain.
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={handleSubmit}
              disabled={isPending}
              className="w-full bg-foreground text-background rounded-2xl py-3.5 font-semibold text-sm disabled:opacity-50"
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
              Verifying your transaction on the Solana blockchain.
            </p>
            <p className="text-green-pos font-semibold text-sm">
              Usually takes 1–2 seconds.
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
                aria-label="Success checkmark"
                className="w-10 h-10 text-green-pos"
              >
                <title>Success</title>
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </div>
            <h2 className="text-xl font-bold">Deposit Submitted!</h2>
            <p className="text-destructive font-medium text-sm">
              Your deposit is pending blockchain confirmation.
            </p>

            {depositResult && (
              <div className="w-full rounded-2xl bg-card border border-border divide-y divide-border">
                {[
                  { label: "Status", value: depositResult.deposit.status },
                  ...(depositResult.deposit.input_amount
                    ? [
                        {
                          label: "Intended",
                          value: `${depositResult.deposit.input_amount} ${depositResult.deposit.input_currency?.toUpperCase()}`,
                        },
                      ]
                    : []),
                  {
                    label: "Amount",
                    value:
                      depositResult.deposit.amount_sol === "0"
                        ? "Processing..."
                        : `${depositResult.deposit.amount_sol} SOL`,
                  },
                  { label: "Network", value: "Solana" },
                  {
                    label: "Tx Signature",
                    value: `${depositResult.deposit.tx_signature.slice(0, 12)}…`,
                  },
                ].map((r) => (
                  <div key={r.label} className="flex justify-between px-4 py-3 text-sm">
                    <span className="text-muted-foreground">{r.label}</span>
                    <span className="font-medium capitalize">{r.value}</span>
                  </div>
                ))}
              </div>
            )}

            <button
              type="button"
              onClick={handleClose}
              className="w-full bg-foreground text-background rounded-2xl py-3.5 font-semibold text-sm"
            >
              Back to wallet
            </button>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}
