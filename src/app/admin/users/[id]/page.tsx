"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { toast } from "sonner";
import { useCookies } from "react-cookie";
import { ArrowLeft, CheckCircle2, XCircle } from "lucide-react";

import { useAdminUser, useAdminUserInvestments } from "@/hooks/use-admin-user";
import { useAdminTransactions } from "@/hooks/use-admin-transactions";
import { howl } from "@/lib/utils";
import type { AdminUser } from "@/types/auth";
import type { ApiResponse } from "@/types/base";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

const statusBadge: Record<string, string> = {
  active: "bg-green-100 text-green-700",
  suspended: "bg-red-100 text-red-600",
};

function UserAvatar({ user }: { user: AdminUser }) {
  if (user.profile_photo_url) {
    return (
      <Image
        src={user.profile_photo_url}
        alt={user.name}
        width={64}
        height={64}
        className="size-16 rounded-full object-cover shrink-0 border border-border"
      />
    );
  }
  const initials = user.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
  return (
    <div className="size-16 rounded-full bg-muted flex items-center justify-center shrink-0 border border-border">
      <span className="text-xl font-semibold text-muted-foreground">
        {initials}
      </span>
    </div>
  );
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export default function UserProfilePage() {
  const params = useParams();
  const router = useRouter();
  const id = Number(params.id);

  const [cookies] = useCookies(["auth_token"]);
  const token = cookies.auth_token as string | undefined;

  const { data: userData, isLoading: userLoading, refetch: refetchUser } = useAdminUser(id);
  const user = userData?.data;

  // Pagination state for investments
  const [invPage, setInvPage] = useState(1);
  const { data: invData, isLoading: invLoading } = useAdminUserInvestments(id, invPage);
  
  const investments = invData?.data?.data ?? [];
  const invLastPage = invData?.data?.last_page ?? 1;
  const invTotal = invData?.data?.total ?? 0;

  // Pagination state for transactions
  const [txPage, setTxPage] = useState(1);
  const { data: txData, isLoading: txLoading } = useAdminTransactions(txPage, id);

  const transactions = txData?.data?.data ?? [];
  const txLastPage = txData?.data?.last_page ?? 1;
  const txTotal = txData?.data?.total ?? 0;

  // Actions state
  const [pending, setPending] = useState(false);
  const [adjustPending, setAdjustPending] = useState(false);
  const [amount, setAmount] = useState("");
  const [currency, setCurrency] = useState<"sol" | "eur">("sol");
  const [reasonType, setReasonType] = useState("Deposit Correction");
  const [reason, setReason] = useState("");

  if (userLoading) {
    return (
      <div className="p-6 space-y-6 animate-pulse">
        <div className="h-8 w-40 bg-muted rounded"></div>
        <div className="h-48 bg-muted rounded"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="p-6 text-center text-muted-foreground">
        User not found.
      </div>
    );
  }

  async function handleStatusUpdate(newStatus: "active" | "suspended") {
    if (!token) return;
    setPending(true);
    try {
      const res = await howl<ApiResponse<AdminUser>>(
        `/admin/users/${user!.id}/status`,
        { method: "PATCH", token, body: { status: newStatus } },
      );
      toast.success(`User ${newStatus === "active" ? "activated" : "suspended"}.`);
      void refetchUser();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Status update failed.");
    } finally {
      setPending(false);
    }
  }

  async function handleAdjustBalance(e: React.FormEvent) {
    e.preventDefault();
    const finalReason = reasonType === "Custom..." ? reason : reasonType;
    if (!token || !amount || !finalReason) return;
    setAdjustPending(true);
    try {
      await howl(`/admin/users/${user!.id}/balance`, {
        method: "POST",
        token,
        body: {
          amount: Number(amount),
          amount_currency: currency,
          reason: finalReason,
        },
      });
      toast.success("Balance adjusted successfully.");
      setAmount("");
      setReason("");
      setReasonType("Deposit Correction");
      void refetchUser();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Adjustment failed.");
    } finally {
      setAdjustPending(false);
    }
  }

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" onClick={() => router.back()}>
          <ArrowLeft className="w-4 h-4" />
        </Button>
        <h1 className="text-2xl font-semibold tracking-tight">User Profile</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        
        {/* Left Column: Overview & Actions */}
        <div className="space-y-6 lg:col-span-1 lg:sticky lg:top-6">
          <Card>
            <CardContent className="p-6 flex flex-col items-center text-center space-y-4">
              <UserAvatar user={user} />
              <div>
                <h2 className="font-semibold text-lg">{user.name}</h2>
                <p className="text-muted-foreground text-sm">{user.email}</p>
                <div className="mt-2 flex items-center justify-center gap-2">
                  <Badge className={`${statusBadge[user.status] ?? ""} border-0 capitalize`}>
                    {user.status}
                  </Badge>
                  <Badge variant="outline" className="capitalize">{user.role}</Badge>
                </div>
              </div>

              <div className="w-full pt-4 border-t border-border flex flex-col gap-2 text-sm text-left">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Email Status</span>
                  <span className="font-medium flex items-center gap-1.5">
                    {user.email_verified_at ? (
                      <><CheckCircle2 className="w-4 h-4 text-green-500" /> Verified</>
                    ) : (
                      <><XCircle className="w-4 h-4 text-red-500" /> Unverified</>
                    )}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Joined</span>
                  <span className="font-medium">{formatDate(user.created_at)}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Wallet Balances</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Available</span>
                <span className="font-medium text-right">
                  {user.wallet.balance_sol} SOL<br/>
                  {user.wallet.balance_eur && <span className="text-xs text-muted-foreground">≈ {user.wallet.balance_eur} €</span>}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Frozen</span>
                <span className="font-medium text-right">
                  {user.wallet.frozen_balance_sol} SOL<br/>
                  {user.wallet.frozen_balance_eur && <span className="text-xs text-muted-foreground">≈ {user.wallet.frozen_balance_eur} €</span>}
                </span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base text-destructive">Danger Zone</CardTitle>
            </CardHeader>
            <CardContent>
              {user.status === "active" ? (
                <Button 
                  variant="destructive" 
                  className="w-full" 
                  disabled={pending}
                  onClick={() => handleStatusUpdate("suspended")}
                >
                  Suspend User
                </Button>
              ) : (
                <Button 
                  className="w-full bg-green-600 hover:bg-green-700 text-white" 
                  disabled={pending}
                  onClick={() => handleStatusUpdate("active")}
                >
                  Activate User
                </Button>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Adjust Balance & Investments */}
        <div className="space-y-6 lg:col-span-2">
          
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Adjust Balance</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleAdjustBalance} className="space-y-4 max-w-sm">
                <div className="space-y-2">
                  <Label>Amount</Label>
                  <div className="flex gap-2">
                    <Input 
                      type="number" 
                      step="any" 
                      value={amount} 
                      onChange={(e) => setAmount(e.target.value)}
                      placeholder="e.g. 50 or -50"
                      required
                    />
                    <select
                      value={currency}
                      onChange={(e) => setCurrency(e.target.value as "sol" | "eur")}
                      className="rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                    >
                      <option value="sol">SOL</option>
                      <option value="eur">EUR</option>
                    </select>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Reason (Admin Note)</Label>
                  <select
                    value={reasonType}
                    onChange={(e) => {
                      setReasonType(e.target.value);
                      if (e.target.value !== "Custom...") {
                        setReason("");
                      }
                    }}
                    className="w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                  >
                    <option>Deposit Correction</option>
                    <option>Withdrawal Refund</option>
                    <option>Manual Bonus</option>
                    <option>Penalty Fee</option>
                    <option>Custom...</option>
                  </select>
                  {reasonType === "Custom..." && (
                    <Input 
                      value={reason} 
                      onChange={(e) => setReason(e.target.value)}
                      placeholder="E.g. Correcting missing deposit..."
                      required
                      minLength={5}
                      className="mt-2"
                    />
                  )}
                </div>
                <Button type="submit" disabled={adjustPending}>
                  {adjustPending ? "Adjusting..." : "Adjust Balance"}
                </Button>
              </form>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-base">Referrals</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              {user.referral_code && (
                <div className="flex justify-between py-1 border-b border-border">
                  <span className="text-muted-foreground">Referral Code</span>
                  <span className="font-medium capitalize">{user.referral_code}</span>
                </div>
              )}
              {user.referrals_count !== undefined && (
                <div className="flex justify-between py-1 border-b border-border items-center">
                  <span className="text-muted-foreground">Total Referred</span>
                  {user.referrals_count > 0 ? (
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{user.referrals_count}</span>
                      <Link 
                        href={`/admin/users?referrer_id=${user.id}&referrer_name=${encodeURIComponent(user.name)}`}
                        className="text-[10px] font-bold bg-primary/10 text-primary hover:bg-primary/20 px-2 py-0.5 rounded transition-colors"
                      >
                        View All
                      </Link>
                    </div>
                  ) : (
                    <span className="font-medium">{user.referrals_count}</span>
                  )}
                </div>
              )}
              {user.referred_by && (
                <div className="flex justify-between py-1 border-b border-border">
                  <span className="text-muted-foreground">Referred By</span>
                  <span className="font-medium capitalize">
                    <Link href={`/admin/users/${user.referred_by.id}`} className="text-primary hover:underline">
                      {user.referred_by.name} ({user.referred_by.email})
                    </Link>
                  </span>
                </div>
              )}
              {!user.referral_code && user.referrals_count === undefined && !user.referred_by && (
                <div className="text-muted-foreground py-2">No referral data found.</div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-base">Loan Investments</CardTitle>
              <Badge variant="secondary">{invTotal} total</Badge>
            </CardHeader>
            <CardContent>
              {invLoading ? (
                <div className="h-20 animate-pulse bg-muted rounded-lg"></div>
              ) : investments.length === 0 ? (
                <div className="text-center py-6 text-muted-foreground text-sm">
                  This user hasn't made any investments yet.
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="border border-border rounded-lg overflow-hidden divide-y divide-border">
                    {investments.map(inv => (
                      <div key={inv.id} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-card hover:bg-muted/30 transition-colors">
                        <div>
                          <p className="font-semibold">{inv.loan?.title ?? `Loan #${inv.loan_id}`}</p>
                          <p className="text-sm text-muted-foreground mt-1 font-mono">
                            {inv.amount_sol} SOL <span className="text-xs">(≈ {inv.amount_eur} €)</span>
                          </p>
                        </div>
                        <div className="text-left sm:text-right">
                          <Badge variant="outline" className="capitalize mb-1">{inv.status}</Badge>
                          <p className="text-sm font-medium text-green-pos">
                            +{inv.excepted_return_sol} SOL Expected
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  {invTotal > 0 && invLastPage > 1 && (
                    <Pagination>
                      <PaginationContent>
                        <PaginationItem>
                          <PaginationPrevious
                            onClick={() => setInvPage((p) => Math.max(1, p - 1))}
                            aria-disabled={invPage === 1}
                            className={invPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                          />
                        </PaginationItem>
                        <PaginationItem>
                          <span className="px-3 py-2 text-sm">
                            {invPage} / {invLastPage}
                          </span>
                        </PaginationItem>
                        <PaginationItem>
                          <PaginationNext
                            onClick={() => setInvPage((p) => Math.min(invLastPage, p + 1))}
                            aria-disabled={invPage === invLastPage}
                            className={invPage === invLastPage ? "pointer-events-none opacity-50" : "cursor-pointer"}
                          />
                        </PaginationItem>
                      </PaginationContent>
                    </Pagination>
                  )}
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-base">Wallet Transactions</CardTitle>
              <Badge variant="secondary">{txTotal} total</Badge>
            </CardHeader>
            <CardContent>
              {txLoading ? (
                <div className="flex justify-center p-8">
                  <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
                </div>
              ) : transactions.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground border border-dashed rounded-lg">
                  No wallet transactions found for this user.
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="space-y-2">
                    {transactions.map((tx) => (
                      <div key={tx.id} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-card hover:bg-muted/30 transition-colors border-b last:border-b-0 border-border">
                        <div>
                          <div className="flex items-center gap-2">
                            <p className="font-semibold capitalize">{tx.category.replace('_', ' ')}</p>
                            {tx.meta?.reason && (
                              <span className="text-sm text-muted-foreground truncate max-w-[200px] sm:max-w-[300px]" title={tx.meta.reason}>
                                — {tx.meta.reason}
                              </span>
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground mt-1 font-mono">
                            {tx.direction === "credit" ? "+" : "-"}{tx.amount_sol} SOL
                          </p>
                        </div>
                        <div className="text-left sm:text-right">
                          <Badge variant="outline" className={`capitalize mb-1 ${tx.status === 'confirmed' ? 'text-green-600 border-green-600' : 'text-yellow-600 border-yellow-600'}`}>{tx.status}</Badge>
                          <p className="text-xs text-muted-foreground">
                            {formatDate(tx.created_at)}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  {txTotal > 0 && txLastPage > 1 && (
                    <Pagination>
                      <PaginationContent>
                        <PaginationItem>
                          <PaginationPrevious
                            onClick={() => setTxPage((p) => Math.max(1, p - 1))}
                            aria-disabled={txPage === 1}
                            className={txPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                          />
                        </PaginationItem>
                        <PaginationItem>
                          <span className="px-3 py-2 text-sm">
                            {txPage} / {txLastPage}
                          </span>
                        </PaginationItem>
                        <PaginationItem>
                          <PaginationNext
                            onClick={() => setTxPage((p) => Math.min(txLastPage, p + 1))}
                            aria-disabled={txPage === txLastPage}
                            className={txPage === txLastPage ? "pointer-events-none opacity-50" : "cursor-pointer"}
                          />
                        </PaginationItem>
                      </PaginationContent>
                    </Pagination>
                  )}
                </div>
              )}
            </CardContent>
          </Card>

        </div>
      </div>
    </div>
  );
}
