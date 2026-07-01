"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, ExternalLink, Calendar, PieChart, Banknote } from "lucide-react";

import { useAdminLoan, useAdminLoanInvestments } from "@/hooks/use-admin-loans";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import Image from "next/image";

const statusBadge: Record<string, string> = {
  active: "bg-blue-100 text-blue-700",
  funded: "bg-indigo-100 text-indigo-700",
  funding_failed: "bg-red-100 text-red-700",
  repaying: "bg-yellow-100 text-yellow-700",
  closed: "bg-green-100 text-green-700",
};

function UserAvatar({ user, className = "size-8" }: { user: any; className?: string }) {
  const [error, setError] = useState(false);
  const photoUrl = user?.profile_photo_url || user?.profile_photo_path;
  
  if (photoUrl && !error) {
    return (
      <img
        src={photoUrl}
        alt={user.name ?? ""}
        width={32}
        height={32}
        className={`${className} rounded-full object-cover shrink-0 border border-border`}
        onError={() => setError(true)}
      />
    );
  }

  const initials = (user?.name ?? "?")
    .split(" ")
    .map((n: string) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
  
  return (
    <div className={`${className} rounded-full bg-muted flex items-center justify-center shrink-0 border border-border`}>
      <span className="text-sm font-semibold text-muted-foreground">
        {initials}
      </span>
    </div>
  );
}

function formatStatusLabel(s: string) {
  if (s === "funding_failed") return "Failed";
  return s;
}

function formatDate(dateStr?: string | null) {
  if (!dateStr) return "N/A";
  const date = new Date(dateStr);
  return date.toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function formatLamports(lamports: number | string) {
  return (Number(lamports) / 1_000_000_000).toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 4,
  });
}

export default function AdminLoanBreakdownPage() {
  const router = useRouter();
  const params = useParams();
  const id = Number(params.id);

  const [page, setPage] = useState(1);
  const { data: loanData, isLoading: loanLoading } = useAdminLoan(id);
  const { data: invData, isLoading: invLoading } = useAdminLoanInvestments(id, page);

  const loan = (loanData?.data as any)?.loan;
  const investments = invData?.data?.data ?? [];
  const lastPage = invData?.data?.last_page ?? 1;
  const total = invData?.data?.total ?? 0;

  if (loanLoading) {
    return (
      <div className="p-6 max-w-5xl mx-auto space-y-6 animate-pulse">
        <div className="h-8 w-40 bg-muted rounded"></div>
        <div className="h-48 bg-muted rounded"></div>
        <div className="h-64 bg-muted rounded"></div>
      </div>
    );
  }

  if (!loan) {
    return (
      <div className="p-6 text-center text-muted-foreground">
        Loan not found.
      </div>
    );
  }

  // Calculate percentages
  const targetSol = Number(loan.target_amount_sol) || 1;
  const fundedSol = Number(loan.total_funded_amount_sol) || 0;
  const pct = Math.min(100, Math.round((fundedSol / targetSol) * 100));

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" onClick={() => router.back()}>
          <ArrowLeft className="w-4 h-4" />
        </Button>
        <h1 className="text-2xl font-semibold tracking-tight flex items-center gap-2">
          {loan.title}
          <Badge className={`${statusBadge[loan.status] ?? ""} border-0 capitalize ml-2`}>
            {formatStatusLabel(loan.status)}
          </Badge>
        </h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left Column: Loan Details */}
        <div className="space-y-6 md:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <PieChart className="w-4 h-4" /> Overview
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-1">
                <div className="text-sm text-muted-foreground">Loan Number</div>
                <div className="font-mono text-sm">{loan.loan_number}</div>
              </div>
              <div className="space-y-1">
                <div className="text-sm text-muted-foreground">Sector</div>
                <div className="font-medium">{loan.sector}</div>
              </div>
              <div className="space-y-1">
                <div className="text-sm text-muted-foreground">Description</div>
                <div className="text-sm leading-relaxed whitespace-pre-wrap">{loan.description}</div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Calendar className="w-4 h-4" /> Timeline
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-sm">
              <div className="flex justify-between border-b pb-2">
                <span className="text-muted-foreground">Created</span>
                <span className="font-medium">{formatDate(loan.created_at)}</span>
              </div>
              {/* <div className="flex justify-between border-b pb-2">
                <span className="text-muted-foreground">Funding Starts</span>
                <span className="font-medium">{formatDate(loan.funding_starts_at)}</span>
              </div> */}
              <div className="flex justify-between border-b pb-2">
                <span className="text-muted-foreground">Funding Ends</span>
                <span className="font-medium">{formatDate(loan.funding_ends_at)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Duration</span>
                <span className="font-medium">{loan.duraction_months} months</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Funding Progress & Investors */}
        <div className="space-y-6 md:col-span-2">
          
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Banknote className="w-4 h-4" /> Financial Metrics
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-center">
                <div className="space-y-1 p-3 bg-muted/30 rounded-lg border overflow-hidden flex flex-col justify-center">
                  <div className="text-[10px] sm:text-xs text-muted-foreground font-medium uppercase tracking-wider truncate">Target</div>
                  <div className="text-sm sm:text-base font-bold truncate" title={`${loan.target_amount_sol} SOL`}>
                    {loan.target_amount_sol} <span className="text-[10px] sm:text-xs font-normal">SOL</span>
                  </div>
                  {loan.target_amount_eur && (
                    <div className="text-[10px] sm:text-xs font-normal text-muted-foreground opacity-75 truncate" title={`${loan.target_amount_eur} €`}>
                      ≈ {loan.target_amount_eur} €
                    </div>
                  )}
                </div>
                <div className="space-y-1 p-3 bg-muted/30 rounded-lg border overflow-hidden flex flex-col justify-center">
                  <div className="text-[10px] sm:text-xs text-muted-foreground font-medium uppercase tracking-wider truncate">Initial</div>
                  <div className="text-sm sm:text-base font-bold truncate" title={`${loan.initial_funded_amount_sol || 0} SOL`}>
                    {loan.initial_funded_amount_sol || 0} <span className="text-[10px] sm:text-xs font-normal">SOL</span>
                  </div>
                  {loan.initial_funded_amount_eur && (
                    <div className="text-[10px] sm:text-xs font-normal text-muted-foreground opacity-75 truncate" title={`${loan.initial_funded_amount_eur} €`}>
                      ≈ {loan.initial_funded_amount_eur} €
                    </div>
                  )}
                </div>
                <div className="space-y-1 p-3 bg-muted/30 rounded-lg border overflow-hidden flex flex-col justify-center">
                  <div className="text-[10px] sm:text-xs text-muted-foreground font-medium uppercase tracking-wider truncate">Invested</div>
                  <div className="text-sm sm:text-base font-bold truncate" title={`${loan.investor_funded_amount_sol || 0} SOL`}>
                    {loan.investor_funded_amount_sol || 0} <span className="text-[10px] sm:text-xs font-normal">SOL</span>
                  </div>
                  {loan.investor_funded_amount_eur && (
                    <div className="text-[10px] sm:text-xs font-normal text-muted-foreground opacity-75 truncate" title={`${loan.investor_funded_amount_eur} €`}>
                      ≈ {loan.investor_funded_amount_eur} €
                    </div>
                  )}
                </div>
                <div className="space-y-1 p-3 bg-muted/30 rounded-lg border overflow-hidden flex flex-col justify-center">
                  <div className="text-[10px] sm:text-xs text-muted-foreground font-medium uppercase tracking-wider truncate">Total</div>
                  <div className="text-sm sm:text-base font-bold text-primary truncate" title={`${loan.total_funded_amount_sol || 0} SOL`}>
                    {loan.total_funded_amount_sol || 0} <span className="text-[10px] sm:text-xs font-normal">SOL</span>
                  </div>
                  {loan.total_funded_amount_eur && (
                    <div className="text-[10px] sm:text-xs font-normal text-muted-foreground opacity-75 truncate" title={`${loan.total_funded_amount_eur} €`}>
                      ≈ {loan.total_funded_amount_eur} €
                    </div>
                  )}
                </div>
                <div className="space-y-1 p-3 bg-muted/30 rounded-lg border overflow-hidden">
                  <div className="text-[10px] sm:text-xs text-muted-foreground font-medium uppercase tracking-wider truncate">APR</div>
                  <div className="text-sm sm:text-base font-bold text-green-600 truncate" title={`${loan.apr_percent}%`}>
                    {loan.apr_percent}%
                  </div>
                </div>
                <div className="space-y-1 p-3 bg-muted/30 rounded-lg border overflow-hidden">
                  <div className="text-[10px] sm:text-xs text-muted-foreground font-medium uppercase tracking-wider truncate">Investors</div>
                  <div className="text-sm sm:text-base font-bold truncate" title={`${total}`}>
                    {total}
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-sm font-medium">
                  <span>Funding Progress</span>
                  <span>{pct}%</span>
                </div>
                <div className="w-full h-3 bg-muted rounded-full overflow-hidden">
                  <div
                    className="h-full bg-primary rounded-full transition-all duration-500 ease-out"
                    style={{ width: `${pct}%` }}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-base">Investor Roster</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              {invLoading ? (
                <div className="p-6 space-y-3">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="h-12 bg-muted animate-pulse rounded" />
                  ))}
                </div>
              ) : investments.length === 0 ? (
                <div className="p-10 text-center text-muted-foreground text-sm">
                  No investments found for this loan.
                </div>
              ) : (
                <div className="divide-y divide-border">
                  <div className="grid grid-cols-12 gap-4 p-4 text-xs font-medium text-muted-foreground bg-muted/20 uppercase tracking-wider">
                    <div className="col-span-5 sm:col-span-4">Investor</div>
                    <div className="col-span-3 text-right">Amount</div>
                    <div className="col-span-3 text-right hidden sm:block">Exp. Return</div>
                    <div className="col-span-4 sm:col-span-2 text-right">Date</div>
                  </div>
                  {investments.map((inv: any) => (
                    <div key={inv.id} className="grid grid-cols-12 gap-4 p-4 items-center text-sm hover:bg-muted/10 transition-colors">
                      <div className="col-span-5 sm:col-span-4 flex items-center gap-3 overflow-hidden">
                        <UserAvatar user={inv.user} className="h-8 w-8 shrink-0" />
                        <div className="truncate">
                          <div className="font-medium truncate">{inv.user?.name ?? "Unknown"}</div>
                          <div className="text-xs text-muted-foreground truncate">{inv.user?.email ?? ""}</div>
                        </div>
                      </div>
                      <div className="col-span-3 text-right font-medium text-primary flex flex-col items-end">
                        <div>
                          {formatLamports(inv.amount_lamports)} <span className="text-[10px] uppercase">SOL</span>
                        </div>
                        {inv.amount_eur && (
                          <div className="text-[10px] sm:text-xs font-normal text-muted-foreground opacity-75 mt-0.5 truncate" title={`${inv.amount_eur} €`}>
                            ≈ {inv.amount_eur} €
                          </div>
                        )}
                      </div>
                      <div className="col-span-3 text-right font-medium text-green-600 hidden sm:flex flex-col items-end">
                        <div>
                          {formatLamports(inv.excepted_return)} <span className="text-[10px] uppercase">SOL</span>
                        </div>
                        {inv.excepted_return_eur && (
                          <div className="text-[10px] sm:text-xs font-normal text-muted-foreground opacity-75 mt-0.5 truncate" title={`${inv.excepted_return_eur} €`}>
                            ≈ {inv.excepted_return_eur} €
                          </div>
                        )}
                      </div>
                      <div className="col-span-4 sm:col-span-2 text-right text-muted-foreground text-xs">
                        {formatDate(inv.created_at)}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {lastPage > 1 && (
                <div className="p-4 border-t border-border">
                  <Pagination>
                    <PaginationContent>
                      <PaginationItem>
                        <PaginationPrevious
                          onClick={() => setPage((p) => Math.max(1, p - 1))}
                          className={page === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                        />
                      </PaginationItem>
                      <PaginationItem>
                        <span className="text-sm text-muted-foreground px-4">
                          Page {page} of {lastPage}
                        </span>
                      </PaginationItem>
                      <PaginationItem>
                        <PaginationNext
                          onClick={() => setPage((p) => Math.min(lastPage, p + 1))}
                          className={page === lastPage ? "pointer-events-none opacity-50" : "cursor-pointer"}
                        />
                      </PaginationItem>
                    </PaginationContent>
                  </Pagination>
                </div>
              )}
            </CardContent>
          </Card>

        </div>
      </div>
    </div>
  );
}
