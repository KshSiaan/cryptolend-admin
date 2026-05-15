"use client";
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Eye, X, Check } from "lucide-react";
import { cn } from "@/lib/utils";

type WithdrawalStatus = "pending" | "approved" | "rejected";

interface Withdrawal {
  id: number;
  name: string;
  email: string;
  amount: string;
  address: string;
  date: string;
  status: WithdrawalStatus;
  note?: string;
}

const initialWithdrawals: Withdrawal[] = [
  { id: 1, name: "Alex Kim", email: "alex@email.com", amount: "1.1700 USDT", address: "877klkjkl", date: "2026-05-09", status: "pending" },
  { id: 2, name: "Alex Kim", email: "alex@email.com", amount: "1.1700 USDT", address: "877klkjkl", date: "2026-05-09", status: "pending" },
  { id: 3, name: "Alex Kim", email: "alex@email.com", amount: "1.1700 USDT", address: "877klkjkl", date: "2026-05-09", status: "pending" },
  { id: 4, name: "Alex Kim", email: "alex@email.com", amount: "1.1700 USDT", address: "877klkjkl", date: "2026-05-09", status: "approved", note: "Processed" },
  { id: 5, name: "Alex Kim", email: "alex@email.com", amount: "1.1700 USDT", address: "877klkjkl", date: "2026-05-09", status: "rejected", note: '"Suspicious activity"' },
];

const statusStyles: Record<WithdrawalStatus, string> = {
  pending: "bg-orange-100 text-orange-600 border-orange-200",
  approved: "bg-green-100 text-green-700 border-green-200",
  rejected: "bg-red-100 text-red-600 border-red-200",
};

type ResultType = "approved" | "rejected" | null;

function WithdrawalRow({
  w,
  onReview,
}: {
  w: Withdrawal;
  onReview?: () => void;
}) {
  return (
    <div className="flex items-start justify-between py-4 first:pt-0 last:pb-0 border-b last:border-0 border-border">
      <div className="space-y-0.5">
        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold">{w.name}</span>
          <span className="text-xs text-muted-foreground">
            {w.email} · just now
          </span>
        </div>
        <p className="text-sm font-medium">{w.amount}</p>
        <p className="text-xs text-muted-foreground">{w.address}</p>
        <p className="text-xs text-muted-foreground">{w.date}</p>
        {w.note && (
          <p className="text-xs text-muted-foreground">{w.note}</p>
        )}
      </div>
      <div className="flex items-center gap-2 shrink-0 ml-4 mt-0.5">
        <span
          className={cn(
            "text-xs font-medium px-2.5 py-0.5 rounded-full border capitalize",
            statusStyles[w.status],
          )}
        >
          {w.status}
        </span>
        {w.status === "pending" && onReview && (
          <Button
            variant="outline"
            size="sm"
            className="h-7 text-xs gap-1.5"
            onClick={onReview}
          >
            <Eye className="size-3.5" />
            Review
          </Button>
        )}
      </div>
    </div>
  );
}

export default function WithdrawalPage() {
  const [withdrawals, setWithdrawals] = useState<Withdrawal[]>(initialWithdrawals);
  const [reviewTarget, setReviewTarget] = useState<Withdrawal | null>(null);
  const [adminNote, setAdminNote] = useState("");
  const [result, setResult] = useState<ResultType>(null);

  const pending = withdrawals.filter((w) => w.status === "pending");
  const processed = withdrawals.filter((w) => w.status !== "pending");

  const handleApprove = () => {
    if (!reviewTarget) return;
    setWithdrawals((prev) =>
      prev.map((w) =>
        w.id === reviewTarget.id
          ? { ...w, status: "approved", note: adminNote || "Processed" }
          : w,
      ),
    );
    setResult("approved");
  };

  const handleReject = () => {
    if (!reviewTarget) return;
    setWithdrawals((prev) =>
      prev.map((w) =>
        w.id === reviewTarget.id
          ? { ...w, status: "rejected", note: adminNote || undefined }
          : w,
      ),
    );
    setResult("rejected");
  };

  const closeReview = () => {
    setReviewTarget(null);
    setAdminNote("");
    setResult(null);
  };

  const openReview = (w: Withdrawal) => {
    setReviewTarget(w);
    setAdminNote("");
    setResult(null);
  };

  return (
    <div className="p-6 space-y-5">
      {pending.length > 0 && (
        <Card className="shadow-none">
          <CardContent className="p-6">
            <h2 className="text-base font-semibold mb-2">Pending Approval</h2>
            <div>
              {pending.map((w) => (
                <WithdrawalRow key={w.id} w={w} onReview={() => openReview(w)} />
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {processed.length > 0 && (
        <Card className="shadow-none">
          <CardContent className="p-6">
            <h2 className="text-base font-semibold mb-2">Processed</h2>
            <div>
              {processed.map((w) => (
                <WithdrawalRow key={w.id} w={w} />
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Review Dialog */}
      <Dialog open={!!reviewTarget && result === null} onOpenChange={(o) => !o && closeReview()}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>Review Withdrawal</DialogTitle>
          </DialogHeader>
          {reviewTarget && (
            <div className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between border-b border-border pb-3">
                  <span className="text-sm text-muted-foreground">Email</span>
                  <span className="text-sm font-medium">{reviewTarget.email}</span>
                </div>
                <div className="flex items-center justify-between border-b border-border pb-3">
                  <span className="text-sm text-muted-foreground">Amount</span>
                  <span className="text-sm font-medium">{reviewTarget.amount}</span>
                </div>
                <div className="flex items-center justify-between border-b border-border pb-3">
                  <span className="text-sm text-muted-foreground">To address</span>
                  <span className="text-sm font-medium font-mono">{reviewTarget.address}</span>
                </div>
                <div className="flex items-center justify-between pb-1">
                  <span className="text-sm text-muted-foreground">Submitted</span>
                  <span className="text-sm font-medium">{reviewTarget.date}</span>
                </div>
              </div>
              <div className="space-y-1.5">
                <span className="text-sm text-muted-foreground">Admin note (optional)</span>
                <Textarea
                  placeholder="e.g. Verified, processed via hot wallet..."
                  value={adminNote}
                  onChange={(e) => setAdminNote(e.target.value)}
                  className="resize-none h-20 text-sm"
                />
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  className="flex-1 gap-1.5 text-destructive hover:text-destructive border-destructive/30 hover:bg-destructive/5"
                  onClick={handleReject}
                >
                  <X className="size-3.5" />
                  Reject
                </Button>
                <Button
                  className="flex-1 gap-1.5 bg-[oklch(0.52_0.165_145)] hover:bg-[oklch(0.47_0.165_145)] text-white"
                  onClick={handleApprove}
                >
                  <Check className="size-3.5" />
                  Approve
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Result Dialog */}
      <Dialog open={!!reviewTarget && result !== null} onOpenChange={(o) => !o && closeReview()}>
        <DialogContent className="sm:max-w-sm">
          <div className="flex flex-col items-center gap-4 py-4">
            <div
              className={cn(
                "size-14 rounded-full flex items-center justify-center",
                result === "approved"
                  ? "bg-[oklch(0.52_0.165_145)]/10"
                  : "bg-destructive/10",
              )}
            >
              {result === "approved" ? (
                <Check className="size-7 text-[oklch(0.52_0.165_145)]" />
              ) : (
                <X className="size-7 text-destructive" />
              )}
            </div>
            <div className="text-center space-y-1.5">
              <p className="text-base font-semibold">
                {result === "approved" ? "Withdrawal approved" : "Withdrawal rejected"}
              </p>
              <p className="text-sm text-muted-foreground">
                {result === "approved"
                  ? `${reviewTarget?.amount} has been approved for release to ${reviewTarget?.address.slice(0, 6)}...`
                  : `The withdrawal of ${reviewTarget?.amount} was rejected. The balance has been restored to the user.`}
              </p>
            </div>
            <Button variant="outline" className="w-full" onClick={closeReview}>
              Done
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
