"use client";

import { useState, useEffect, Suspense } from "react";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useCookies } from "react-cookie";
import { toast } from "sonner";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { CheckCircle2, XCircle } from "lucide-react";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { useAdminUsers } from "@/hooks/use-admin-users";
import { howl } from "@/lib/utils";
import type { AdminUser } from "@/types/auth";
import type { ApiResponse } from "@/types/base";

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
        width={36}
        height={36}
        className="size-9 rounded-full object-cover shrink-0 border border-border"
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
    <div className="size-9 rounded-full bg-muted flex items-center justify-center shrink-0 border border-border">
      <span className="text-xs font-semibold text-muted-foreground">
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

function UserDetailDialog({
  user,
  onClose,
  onViewReferrals,
}: {
  user: AdminUser;
  onClose: () => void;
  onViewReferrals?: (user: AdminUser) => void;
}) {
  return (
    <Dialog open onOpenChange={(o) => { if (!o) onClose(); }}>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle>Quick View</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <UserAvatar user={user} />
            <div>
              <p className="text-sm font-semibold">{user.name}</p>
              <p className="text-xs text-muted-foreground">{user.email}</p>
            </div>
          </div>
          <div className="rounded-lg border border-border divide-y divide-border text-sm">
            {[
              { label: "Role", value: user.role },
              { label: "Status", value: user.status },
              { label: "Balance", value: `${user.wallet.balance_sol} SOL${user.wallet.balance_eur ? ` (≈ ${user.wallet.balance_eur} €)` : ""}` },
              {
                label: "Frozen",
                value: `${user.wallet.frozen_balance_sol} SOL${user.wallet.frozen_balance_eur ? ` (≈ ${user.wallet.frozen_balance_eur} €)` : ""}`,
              },
              { label: "Joined", value: formatDate(user.created_at) },
            ].map((r) => (
              <div key={r.label} className="flex justify-between px-3 py-2">
                <span className="text-muted-foreground">{r.label}</span>
                <span className="font-medium capitalize">{r.value}</span>
              </div>
            ))}
            <div className="flex justify-between px-3 py-2">
              <span className="text-muted-foreground">Email Status</span>
              <span className="font-medium flex items-center gap-1.5 text-sm">
                {user.email_verified_at ? (
                  <><CheckCircle2 className="w-4 h-4 text-green-500" /> Verified</>
                ) : (
                  <><XCircle className="w-4 h-4 text-red-500" /> Unverified</>
                )}
              </span>
            </div>
            {user.referral_code && (
              <div className="flex justify-between px-3 py-2">
                <span className="text-muted-foreground">Referral Code</span>
                <span className="font-medium capitalize">{user.referral_code}</span>
              </div>
            )}
            {user.referrals_count !== undefined && (
              <div className="flex justify-between px-3 py-2">
                <span className="text-muted-foreground">Total Referred</span>
                {user.referrals_count > 0 && onViewReferrals ? (
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{user.referrals_count}</span>
                    <button
                      onClick={() => {
                        onViewReferrals(user);
                        onClose();
                      }}
                      className="text-[10px] font-bold bg-primary/10 text-primary hover:bg-primary/20 px-2 py-0.5 rounded transition-colors"
                    >
                      View All
                    </button>
                  </div>
                ) : (
                  <span className="font-medium">{user.referrals_count}</span>
                )}
              </div>
            )}
            {user.referred_by && (
              <div className="flex justify-between px-3 py-2">
                <span className="text-muted-foreground">Referred By</span>
                <span className="font-medium capitalize">{user.referred_by.name} ({user.referred_by.email})</span>
              </div>
            )}
          </div>
        </div>
        <DialogFooter className="sm:justify-between items-center mt-4">
          <Link href={`/admin/users/${user.id}`}>
            <Button variant="default">Full Profile</Button>
          </Link>
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function UsersContent() {
  const searchParams = useSearchParams();
  const initialRefId = searchParams.get("referrer_id");
  const initialRefName = searchParams.get("referrer_name");

  const [page, setPage] = useState(1);
  const [viewing, setViewing] = useState<AdminUser | null>(null);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [referrerFilter, setReferrerFilter] = useState<Partial<AdminUser> | null>(
    initialRefId && initialRefName ? { id: Number(initialRefId), name: initialRefName } : null
  );

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(search), 300);
    return () => clearTimeout(timer);
  }, [search]);

  const { data, isLoading, refetch } = useAdminUsers(page, debouncedSearch, referrerFilter?.id);

  const users = data?.data?.data ?? [];
  const lastPage = data?.data?.last_page ?? 1;
  const total = data?.data?.total ?? 0;



  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h1 className="text-2xl font-semibold tracking-tight">Users</h1>
        <div className="flex items-center gap-4">
          {referrerFilter && (
            <div className="flex items-center gap-2 bg-primary/10 text-primary px-3 py-1.5 rounded-full text-sm">
              <span>Referrals by: <span className="font-semibold">{referrerFilter.name}</span></span>
              <button 
                onClick={() => {
                  setReferrerFilter(null);
                  setPage(1);
                }}
                className="hover:text-primary/70 font-bold ml-1"
              >
                &times;
              </button>
            </div>
          )}
          <Input
            placeholder="Search users by name or email..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            className="max-w-xs"
          />
        </div>
      </div>

      <Card className="shadow-none">
        <CardContent className="p-0">
          {isLoading ? (
            <div className="p-6 space-y-3">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="h-14 rounded bg-muted animate-pulse" />
              ))}
            </div>
          ) : users.length === 0 ? (
            <div className="p-10 text-center text-sm text-muted-foreground">
              No users found.
            </div>
          ) : (
            <div className="divide-y divide-border">
              {users.map((user) => (
                <div
                  key={user.id}
                  className="flex items-center justify-between px-5 py-3.5 gap-4"
                >
                  <div className="flex items-center gap-3 min-w-0 flex-1">
                    <UserAvatar user={user} />
                    <div className="min-w-0 space-y-0.5">
                      <p className="text-sm font-semibold truncate">
                        {user.name}
                      </p>
                      <p className="text-xs text-muted-foreground truncate flex items-center gap-1">
                        {user.email}
                        {user.email_verified_at ? (
                          <span title="Verified" className="flex items-center">
                            <CheckCircle2 className="w-3 h-3 text-green-500" />
                          </span>
                        ) : (
                          <span title="Unverified" className="flex items-center">
                            <XCircle className="w-3 h-3 text-red-500" />
                          </span>
                        )}
                      </p>
                      {user.referred_by && (
                        <p className="text-[10px] text-muted-foreground truncate">
                          Referred by: {user.referred_by.name}
                        </p>
                      )}
                      {(user.referrals_count ?? 0) > 0 && (
                        <button 
                          onClick={() => {
                            setReferrerFilter(user);
                            setPage(1);
                          }}
                          className="text-[10px] truncate text-primary hover:underline font-medium text-left cursor-pointer"
                        >
                          Total Referred: {user.referrals_count}
                        </button>
                      )}
                    </div>
                  </div>
                  <div className="hidden sm:flex items-center gap-4 text-right shrink-0">
                    <div className="flex flex-col gap-0.5">
                      <span className="text-xs font-semibold text-foreground">{user.wallet.balance_sol} SOL</span>
                      {user.wallet.balance_eur && <span className="text-[10px] text-muted-foreground">≈ {user.wallet.balance_eur} €</span>}
                    </div>
                    <div className="flex flex-col gap-0.5">
                      <span className="text-xs font-medium text-muted-foreground">{user.wallet.frozen_balance_sol} frozen</span>
                      {user.wallet.frozen_balance_eur && <span className="text-[10px] text-muted-foreground">≈ {user.wallet.frozen_balance_eur} €</span>}
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <Badge
                      className={`${statusBadge[user.status] ?? ""} border-0 capitalize`}
                    >
                      {user.status}
                    </Badge>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setViewing(user)}
                    >
                      Quick View
                    </Button>
                    <Link href={`/admin/users/${user.id}`}>
                      <Button
                        size="sm"
                        variant="default"
                      >
                        Full Details
                      </Button>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {!isLoading && total > 0 && (
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <span>
            {total} user{total !== 1 ? "s" : ""}
          </span>
          {lastPage > 1 && (
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    aria-disabled={page === 1}
                    className={
                      page === 1
                        ? "pointer-events-none opacity-50"
                        : "cursor-pointer"
                    }
                  />
                </PaginationItem>
                <PaginationItem>
                  <span className="px-3 py-2">
                    {page} / {lastPage}
                  </span>
                </PaginationItem>
                <PaginationItem>
                  <PaginationNext
                    onClick={() => setPage((p) => Math.min(lastPage, p + 1))}
                    aria-disabled={page === lastPage}
                    className={
                      page === lastPage
                        ? "pointer-events-none opacity-50"
                        : "cursor-pointer"
                    }
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          )}
        </div>
      )}

      {viewing && (
        <UserDetailDialog
          user={viewing}
          onClose={() => setViewing(null)}
          onViewReferrals={(user) => {
            setReferrerFilter(user);
            setPage(1);
          }}
        />
      )}
    </div>
  );
}

export default function UsersPage() {
  return (
    <Suspense fallback={<div className="p-6">Loading...</div>}>
      <UsersContent />
    </Suspense>
  );
}
