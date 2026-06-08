"use client";

import { ArrowDownLeft, ArrowUpRight, BarChart2 } from "lucide-react";
import Link from "next/link";

import { DepositSheet } from "@/components/sheets/deposit-sheet";
import { WithdrawSheet } from "@/components/sheets/withdraw-sheet";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useHomeStats } from "@/hooks/use-home-stats";
import { useProfile } from "@/hooks/use-profile";
import { useWalletStats } from "@/hooks/use-wallet-stats";
import { cn } from "@/lib/utils";

function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return "Good morning";
  if (h < 17) return "Good afternoon";
  return "Good evening";
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export default function HomePage() {
  const { data: profileData } = useProfile();
  const { data: statsData } = useHomeStats();
  const { data: walletStatsData } = useWalletStats();

  const profile = profileData?.data;
  const stats = statsData?.data;
  const walletStats = walletStatsData?.data;

  const firstName = profile?.name ? profile.name.split(" ")[0] : "";
  const initials = profile?.name
    ? profile.name
        .split(" ")
        .map((w) => w[0])
        .join("")
        .slice(0, 2)
        .toUpperCase()
    : "";

  const balanceSol =
    walletStats?.available_sol ?? profile?.wallet_balance_sol ?? "0";
  const balanceEur =
    walletStats?.available_eur ?? profile?.wallet_balance_eur ?? "0";

  return (
    <div className="py-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold tracking-tight">CryptoLend</h1>
          <p className="text-sm text-muted-foreground">
            {getGreeting()}
            {firstName ? `, ${firstName}` : ""}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="text-right">
            <p className="text-[10px] text-muted-foreground uppercase tracking-wider">
              Balance
            </p>
            <p className="text-sm font-bold">
              {parseFloat(balanceSol).toFixed(2) || 0} SOL
            </p>
          </div>
          <Avatar className="w-10 h-10">
            <AvatarImage src={profile?.profile_photo_url ?? ""} />
            <AvatarFallback>{initials || "??"}</AvatarFallback>
          </Avatar>
        </div>
      </div>

      {/* Balance Card */}
      <div className="rounded-2xl bg-foreground text-background p-5 space-y-4">
        <div>
          <p className="text-[11px] uppercase tracking-widest opacity-60">
            Available Balance
          </p>
          <p className="text-4xl font-bold mt-1">
            {parseFloat(balanceSol).toFixed(6) || 0}{" "}
            <span className="text-xl font-semibold">SOL</span>
          </p>
          <p className="text-xl font-bold mt-1 text-muted-foreground">
            {balanceEur} <span className="text-xl font-semibold">€</span>
          </p>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <DepositSheet>
            <button
              type="button"
              className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-white/15 hover:bg-white/25 transition-colors px-4 py-2.5 text-sm font-medium text-background"
            >
              <ArrowDownLeft size={16} />
              Deposit
            </button>
          </DepositSheet>
          <WithdrawSheet availableSol={balanceSol}>
            <button
              type="button"
              className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-white/15 hover:bg-white/25 transition-colors px-4 py-2.5 text-sm font-medium text-background"
            >
              <ArrowUpRight size={16} />
              Withdraw
            </button>
          </WithdrawSheet>
          <Link
            href="/app/invest"
            className="flex-1 col-span-2 flex items-center justify-center gap-2 rounded-xl bg-background text-foreground hover:bg-background/90 transition-colors px-4 py-2.5 text-sm font-medium"
          >
            <BarChart2 size={16} />
            Invest
          </Link>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-3">
        <div className="rounded-2xl bg-card border border-border p-4">
          <p className="text-[10px] uppercase tracking-widest text-muted-foreground">
            Invested
          </p>
          <p className="text-2xl font-bold mt-1">
            {parseFloat(stats?.total_invested_sol || "0").toFixed(2) || 0} SOL
          </p>
          <p className="text-xs text-muted-foreground ">SOL</p>
          <p className="text-sm font-semibold mt-1 text-muted-foreground">
            {stats?.total_invested_eur ?? "0"} €
          </p>
        </div>
        <div className="rounded-2xl bg-card border border-border p-4">
          <p className="text-[10px] uppercase tracking-widest text-muted-foreground">
            Earnings
          </p>
          <p className="text-2xl font-bold mt-1 text-green-pos">
            {parseFloat(stats?.total_earnings_sol || "0").toFixed(2) || 0} SOL
          </p>
          <p className="text-xs text-muted-foreground">SOL</p>
          <p className="text-sm font-semibold mt-1 text-muted-foreground">
            {stats?.total_earning_eur ?? "0"} €
          </p>
        </div>
      </div>

      {/* Recent Investments */}
      {stats?.recent_investments && stats.recent_investments.length > 0 && (
        <section>
          <h2 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-3">
            Active Investments
          </h2>
          <div className="rounded-2xl bg-card border border-border divide-y divide-border">
            {stats.recent_investments.map((inv) => (
              <div
                key={inv.id}
                className="flex items-center justify-between px-4 py-3.5"
              >
                <div>
                  <p className="text-sm font-semibold">Investment #{inv.id}</p>
                  <p className="text-xs text-muted-foreground">
                    {formatDate(inv.created_at)}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold text-green-pos">
                    {inv.amount_sol} SOL | {inv.amount_eur}€
                  </p>
                  <span className="inline-block mt-0.5 rounded-full bg-green-pos/10 text-green-pos text-[10px] px-2 py-0.5 font-medium capitalize">
                    {inv.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Recent Transactions */}
      {stats?.recent_transactions && stats.recent_transactions.length > 0 && (
        <section>
          <h2 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-3">
            Recent Transactions
          </h2>
          <div className="rounded-2xl bg-card border border-border divide-y divide-border">
            {stats.recent_transactions.map((tx) => (
              <div
                key={tx.id}
                className="flex items-center justify-between px-4 py-3.5"
              >
                <div>
                  <p className="text-sm font-medium capitalize">
                    {tx.category}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {formatDate(tx.created_at)}
                  </p>
                </div>
                <p
                  className={cn(
                    "text-sm font-semibold",
                    tx.direction === "credit"
                      ? "text-green-pos"
                      : "text-red-neg",
                  )}
                >
                  {tx.direction === "credit" ? "+" : "-"}
                  {tx.amount_sol} SOL | {tx.amount_eur}€
                </p>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
