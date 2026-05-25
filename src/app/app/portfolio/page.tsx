"use client";

import { useState } from "react";

import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { useActiveInvestments } from "@/hooks/use-active-investments";
import { useActiveLoans } from "@/hooks/use-active-loans";
import { useEarningsHistory } from "@/hooks/use-earnings-history";
import { useInvestmentStats } from "@/hooks/use-investment-stats";
import { useProfile } from "@/hooks/use-profile";

export default function PortfolioPage() {
  const [investPage, setInvestPage] = useState(1);
  const [earningsPage, setEarningsPage] = useState(1);
  const [activeLoansPage, setActiveLoansPage] = useState(1);

  const { data: profileData } = useProfile();
  const { data: statsData } = useInvestmentStats();
  const { data: investmentsData, isLoading: investLoading } =
    useActiveInvestments(investPage);
  const { data: earningsData, isLoading: earningsLoading } =
    useEarningsHistory(earningsPage);
  const { data: activeLoansData, isLoading: activeLoansLoading } =
    useActiveLoans(activeLoansPage);

  const profile = profileData?.data;
  const stats = statsData?.data;

  const initials = profile?.name
    ? profile.name
        .split(" ")
        .map((w) => w[0])
        .join("")
        .slice(0, 2)
        .toUpperCase()
    : "";

  const investments = investmentsData?.data?.data ?? [];
  const investLastPage = investmentsData?.data?.last_page ?? 1;

  const earnings = earningsData?.data?.data ?? [];
  const earningsLastPage = earningsData?.data?.last_page ?? 1;

  const activeLoans = activeLoansData?.data?.data ?? [];
  const activeLoansLastPage = activeLoansData?.data?.last_page ?? 1;

  return (
    <div className="py-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold tracking-tight">My Portfolio</h1>
          <p className="text-sm text-muted-foreground">Your investments</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="text-right">
            <p className="text-[10px] text-muted-foreground uppercase tracking-wider">
              Balance
            </p>
            <p className="text-sm font-bold">
              {profile?.wallet_balance_sol ?? "0"} SOL
            </p>
          </div>
          <div className="w-9 h-9 rounded-full bg-foreground text-background flex items-center justify-center text-xs font-bold">
            {initials}
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-3">
        <div className="rounded-2xl bg-card border border-border p-4">
          <p className="text-[10px] uppercase tracking-widest text-muted-foreground">
            Earnings
          </p>
          <p className="text-2xl font-bold mt-1 text-green-pos">
            {stats?.earning_sol ?? "0"}
          </p>
          <p className="text-xs text-muted-foreground">SOL total</p>
        </div>
        <div className="rounded-2xl bg-card border border-border p-4">
          <p className="text-[10px] uppercase tracking-widest text-muted-foreground">
            Active Loans
          </p>
          <p className="text-2xl font-bold mt-1">
            {stats?.active_loans_count ?? 0}
          </p>
          <p className="text-xs text-muted-foreground">Positions</p>
        </div>
      </div>

      {/* Expected interest */}
      {stats && (
        <div className="rounded-2xl bg-card border border-border p-4 flex items-center justify-between">
          <div>
            <p className="text-[10px] uppercase tracking-widest text-muted-foreground">
              Expected interest
            </p>
            <p className="text-lg font-bold text-green-pos mt-0.5">
              +{stats.total_expected_interest_sol} SOL
            </p>
          </div>
          <div className="text-right">
            <p className="text-[10px] uppercase tracking-widest text-muted-foreground">
              Invested balance
            </p>
            <p className="text-lg font-bold mt-0.5">{stats.invested_balance_sol} SOL</p>
          </div>
        </div>
      )}

      {/* Active Investments */}
      <section>
        <h2 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-3">
          Active Investments
        </h2>
        {investLoading ? (
          <div className="space-y-4">
            {[1, 2].map((i) => (
              <div
                key={i}
                className="rounded-2xl bg-card border border-border p-4 h-28 animate-pulse"
              />
            ))}
          </div>
        ) : investments.length === 0 ? (
          <div className="rounded-2xl bg-card border border-border p-6 text-center text-sm text-muted-foreground">
            No active investments yet.
          </div>
        ) : (
          <>
            <div className="space-y-4">
              {investments.map((inv) => {
                const dueSchedule = inv.return_schedules.find(
                  (s) => s.status === "due",
                );

                return (
                  <div
                    key={inv.id}
                    className="rounded-2xl bg-card border border-border p-4 space-y-4"
                  >
                    {/* Top row */}
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="flex items-center gap-1.5 rounded-full bg-green-pos/10 text-green-pos text-xs font-medium px-2.5 py-0.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-green-pos" />
                          Active
                        </span>
                        <span className="text-xs text-muted-foreground font-mono">
                          {inv.loan.loan_number}
                        </span>
                      </div>
                      <div className="text-right">
                        <p className="text-[9px] uppercase tracking-widest text-muted-foreground">
                          Total Expected
                        </p>
                        <p className="text-lg font-bold text-green-pos leading-tight">
                          +{inv.expected_return_sol}
                        </p>
                        <p className="text-[9px] text-muted-foreground">SOL</p>
                      </div>
                    </div>

                    {/* Title */}
                    <div>
                      <h3 className="text-base font-bold">{inv.loan.title}</h3>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {inv.loan.description}
                      </p>
                    </div>

                    {/* Stats row */}
                    <div className="grid grid-cols-5 gap-1 border-t border-border pt-3">
                      {[
                        {
                          label: "INVESTED",
                          value: `${inv.amount_sol}`,
                          className: "",
                        },
                        {
                          label: "APR",
                          value: `${inv.apr_percent}%`,
                          className: "",
                        },
                        {
                          label: "TERM",
                          value: `${inv.loan.duraction_months} mo`,
                          className: "",
                        },
                        {
                          label: "RECEIVED",
                          value: `+${inv.received_sol}`,
                          className: "text-green-pos",
                        },
                        {
                          label: "REMAINING",
                          value: `${(parseFloat(inv.expected_return_sol) - parseFloat(inv.received_sol)).toFixed(6)}`,
                          className: "",
                        },
                      ].map((s) => (
                        <div key={s.label} className="flex flex-col gap-0.5">
                          <span className="text-[8px] uppercase tracking-widest text-muted-foreground">
                            {s.label}
                          </span>
                          <span
                            className={`text-xs font-bold tabular-nums ${s.className}`}
                          >
                            {s.value}
                          </span>
                        </div>
                      ))}
                    </div>

                    {/* Repayment schedule */}
                    <div className="space-y-2">
                      <p className="text-[9px] uppercase tracking-widest text-muted-foreground">
                        Repayment Schedule
                      </p>
                      <div className="flex gap-1.5 flex-wrap">
                        {inv.return_schedules.map((s) => (
                          <span
                            key={s.id}
                            title={`${s.month_label} · ${s.total_due_sol} SOL · ${s.due_date}`}
                            className={[
                              "rounded-lg px-2.5 py-1.5 text-[11px] font-semibold",
                              s.status === "paid"
                                ? "bg-green-pos text-white"
                                : s.status === "due"
                                  ? "bg-amber-400 text-white"
                                  : "bg-muted text-muted-foreground",
                            ].join(" ")}
                          >
                            {s.month_label}
                          </span>
                        ))}
                      </div>
                      <div className="flex items-center gap-4 text-[10px] text-muted-foreground flex-wrap">
                        <span className="flex items-center gap-1">
                          <span className="w-2 h-2 rounded-full bg-green-pos inline-block" />
                          Paid ({inv.summary.paid_count})
                        </span>
                        {dueSchedule && (
                          <span className="flex items-center gap-1">
                            <span className="w-2 h-2 rounded-full bg-amber-400 inline-block" />
                            Due · +{dueSchedule.total_due_sol} SOL
                          </span>
                        )}
                        <span className="flex items-center gap-1">
                          <span className="w-2 h-2 rounded-full bg-muted-foreground/40 inline-block" />
                          Upcoming ({inv.summary.upcoming_count})
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
            {investLastPage > 1 && (
              <Pagination className="mt-4">
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious
                      onClick={() => setInvestPage((p) => Math.max(1, p - 1))}
                      aria-disabled={investPage === 1}
                      className={
                        investPage === 1
                          ? "pointer-events-none opacity-50"
                          : "cursor-pointer"
                      }
                    />
                  </PaginationItem>
                  <PaginationItem>
                    <span className="px-3 py-2 text-sm">
                      {investPage} / {investLastPage}
                    </span>
                  </PaginationItem>
                  <PaginationItem>
                    <PaginationNext
                      onClick={() =>
                        setInvestPage((p) => Math.min(investLastPage, p + 1))
                      }
                      aria-disabled={investPage === investLastPage}
                      className={
                        investPage === investLastPage
                          ? "pointer-events-none opacity-50"
                          : "cursor-pointer"
                      }
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            )}
          </>
        )}
      </section>

      {/* Earnings History */}
      <section>
        <h2 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-3">
          Earnings History
        </h2>
        {earningsLoading ? (
          <div className="rounded-2xl bg-card border border-border p-4 h-20 animate-pulse" />
        ) : earnings.length === 0 ? (
          <div className="rounded-2xl bg-card border border-border p-6 text-center text-sm text-muted-foreground">
            No earnings yet.
          </div>
        ) : (
          <>
            <div className="rounded-2xl bg-card border border-border divide-y divide-border">
              {earnings.map((entry) => (
                <div
                  key={entry.month_key}
                  className="flex items-center justify-between px-4 py-3.5"
                >
                  <p className="text-sm font-medium">{entry.month}</p>
                  <p className="text-sm font-semibold text-green-pos">
                    +{entry.amount_sol} SOL
                  </p>
                </div>
              ))}
            </div>
            {earningsLastPage > 1 && (
              <Pagination className="mt-4">
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious
                      onClick={() => setEarningsPage((p) => Math.max(1, p - 1))}
                      aria-disabled={earningsPage === 1}
                      className={
                        earningsPage === 1
                          ? "pointer-events-none opacity-50"
                          : "cursor-pointer"
                      }
                    />
                  </PaginationItem>
                  <PaginationItem>
                    <span className="px-3 py-2 text-sm">
                      {earningsPage} / {earningsLastPage}
                    </span>
                  </PaginationItem>
                  <PaginationItem>
                    <PaginationNext
                      onClick={() =>
                        setEarningsPage((p) =>
                          Math.min(earningsLastPage, p + 1),
                        )
                      }
                      aria-disabled={earningsPage === earningsLastPage}
                      className={
                        earningsPage === earningsLastPage
                          ? "pointer-events-none opacity-50"
                          : "cursor-pointer"
                      }
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            )}
          </>
        )}
      </section>

      {/* Active Loans */}
      <section>
        <h2 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-3">
          Active Loans
        </h2>
        {activeLoansLoading ? (
          <div className="space-y-4">
            {[1, 2].map((i) => (
              <div
                key={i}
                className="rounded-2xl bg-card border border-border p-4 h-28 animate-pulse"
              />
            ))}
          </div>
        ) : activeLoans.length === 0 ? (
          <div className="rounded-2xl bg-card border border-border p-6 text-center text-sm text-muted-foreground">
            No active loans.
          </div>
        ) : (
          <>
            <div className="space-y-4">
              {activeLoans.map((loan) => (
                <div
                  key={loan.id}
                  className="rounded-2xl bg-card border border-border p-4 space-y-3"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-base font-bold">{loan.title}</h3>
                      <p className="text-[10px] font-mono text-muted-foreground mt-0.5">
                        {loan.loan_number}
                      </p>
                    </div>
                    <span className="rounded-full px-2.5 py-0.5 text-xs font-medium bg-green-pos/10 text-green-pos shrink-0">
                      active
                    </span>
                  </div>

                  <p className="text-xs text-muted-foreground">
                    {loan.sector} · {loan.duration_months} mo ·{" "}
                    {loan.investors_count} investors
                  </p>

                  <div className="flex items-center gap-3 text-sm">
                    <span>
                      Target{" "}
                      <span className="font-bold">
                        {loan.target_amount_sol} SOL
                      </span>
                    </span>
                    <span>
                      Raised{" "}
                      <span className="font-bold">
                        {loan.raised_amount_sol} SOL
                      </span>
                    </span>
                    <span className="text-green-pos font-bold">
                      APR {loan.apr_percent}%
                    </span>
                  </div>

                  <div className="space-y-1">
                    <div className="h-2 rounded-full bg-muted overflow-hidden">
                      <div
                        className="h-full bg-foreground rounded-full"
                        style={{
                          width: `${Math.min(loan.funded_percent, 100)}%`,
                        }}
                      />
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {loan.funded_percent}% funded
                    </p>
                  </div>
                </div>
              ))}
            </div>
            {activeLoansLastPage > 1 && (
              <Pagination className="mt-4">
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious
                      onClick={() =>
                        setActiveLoansPage((p) => Math.max(1, p - 1))
                      }
                      aria-disabled={activeLoansPage === 1}
                      className={
                        activeLoansPage === 1
                          ? "pointer-events-none opacity-50"
                          : "cursor-pointer"
                      }
                    />
                  </PaginationItem>
                  <PaginationItem>
                    <span className="px-3 py-2 text-sm">
                      {activeLoansPage} / {activeLoansLastPage}
                    </span>
                  </PaginationItem>
                  <PaginationItem>
                    <PaginationNext
                      onClick={() =>
                        setActiveLoansPage((p) =>
                          Math.min(activeLoansLastPage, p + 1),
                        )
                      }
                      aria-disabled={activeLoansPage === activeLoansLastPage}
                      className={
                        activeLoansPage === activeLoansLastPage
                          ? "pointer-events-none opacity-50"
                          : "cursor-pointer"
                      }
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            )}
          </>
        )}
      </section>
    </div>
  );
}
