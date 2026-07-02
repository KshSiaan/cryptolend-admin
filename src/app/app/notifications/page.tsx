"use client";

import { useQueryClient } from "@tanstack/react-query";
import {
  ArrowLeft,
  Bell,
  CheckCircle2,
  Clock,
  Info,
  XCircle,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useCookies } from "react-cookie";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useNotifications } from "@/hooks/use-notifications";
import { howl } from "@/lib/utils";
import type { ApiResponse } from "@/types/base";
import type { Notification } from "@/types/notification";

function formatDate(iso: string) {
  return new Date(iso).toLocaleString(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

function notificationMeta(n: Notification): {
  title: string;
  description: string;
  icon: React.ReactNode;
  variant: "default" | "destructive";
} {
  const d = n.data;
  const amount = d.amount_eur == null ? "Your" : `${d.amount_eur} EUR`;
  const loanLabel =
    d.loan_title || d.loan_number
      ? `${d.loan_title ?? "Loan"}${d.loan_number ? ` (${d.loan_number})` : ""}`
      : "this loan";

  if (d.type === "deposit_status") {
    const status = d.status ?? "";
    if (status === "confirmed") {
      return {
        title: "Deposit Confirmed",
        description: `${d.amount_eur} EUR deposited successfully.`,
        icon: <CheckCircle2 className="h-4 w-4 text-green-500" />,
        variant: "default",
      };
    }
    if (status === "failed") {
      return {
        title: "Deposit Failed",
        description: d.failure_reason
          ? `Reason: ${d.failure_reason}`
          : "Your deposit could not be processed.",
        icon: <XCircle className="h-4 w-4 text-destructive" />,
        variant: "destructive",
      };
    }
    if (status === "pending") {
      return {
        title: "Deposit Pending",
        description: `${d.amount_eur} EUR deposit is being processed.`,
        icon: <Clock className="h-4 w-4 text-orange-400" />,
        variant: "default",
      };
    }
    return {
      title: "Deposit Update",
      description: `Status: ${status}. Amount: ${d.amount_eur} EUR.`,
      icon: <Info className="h-4 w-4" />,
      variant: "default",
    };
  }

  if (d.type === "deposit_pending") {
    return {
      title: "Deposit Detected",
      description: `${amount} deposit was detected and is awaiting confirmation.`,
      icon: <Clock className="h-4 w-4 text-orange-400" />,
      variant: "default",
    };
  }

  if (d.type === "investment_created") {
    return {
      title: "Investment Created",
      description: `${amount} investment in ${loanLabel} is now active.`,
      icon: <CheckCircle2 className="h-4 w-4 text-green-500" />,
      variant: "default",
    };
  }

  if (d.type === "investment_refunded") {
    return {
      title: "Investment Refunded",
      description: `${amount} investment in ${loanLabel} has been refunded.`,
      icon: <Info className="h-4 w-4 text-blue-500" />,
      variant: "default",
    };
  }

  if (d.type === "loan_funding_status") {
    const isFunded = d.status === "funded";
    return {
      title: isFunded ? "Loan Funding Successful" : "Loan Funding Unsuccessful",
      description: isFunded
        ? `The loan ${loanLabel} reached its target amount and has been funded.`
        : `The loan ${loanLabel} did not reach its target before the deadline.`,
      icon: isFunded ? <CheckCircle2 className="h-4 w-4 text-green-500" /> : <XCircle className="h-4 w-4 text-destructive" />,
      variant: isFunded ? "default" : "destructive",
    };
  }

  if (d.type === "loan_repaying_started") {
    return {
      title: "Loan Repayment Started",
      description: `The loan ${loanLabel} has started its repayment phase.`,
      icon: <CheckCircle2 className="h-4 w-4 text-green-500" />,
      variant: "default",
    };
  }

  if (d.type === "withdrawal_lifecycle") {
    const isApproved = d.status === "approved";
    return {
      title: isApproved ? "Withdrawal Approved" : "Withdrawal Submitted",
      description: isApproved
        ? `${d.amount_eur} EUR withdrawal request has been approved and is being processed.`
        : `${d.amount_eur} EUR withdrawal request has been submitted and is pending admin review.`,
      icon: isApproved ? <CheckCircle2 className="h-4 w-4 text-green-500" /> : <Clock className="h-4 w-4 text-orange-400" />,
      variant: "default",
    };
  }

  if (d.type === "withdrawal_status") {
    const isConfirmed = d.status === "confirmed";
    return {
      title: isConfirmed ? "Withdrawal Confirmed" : "Withdrawal Failed",
      description: isConfirmed
        ? `${d.amount_eur} EUR withdrawal has been confirmed on-chain.`
        : d.failure_reason ? `Withdrawal failed: ${d.failure_reason}` : "Your withdrawal could not be completed.",
      icon: isConfirmed ? <CheckCircle2 className="h-4 w-4 text-green-500" /> : <XCircle className="h-4 w-4 text-destructive" />,
      variant: isConfirmed ? "default" : "destructive",
    };
  }

  if (d.type === "admin_wallet_update") {
    const adj = Number(d.adjustment_amount_eur) > 0 ? `+${d.adjustment_amount_eur}` : d.adjustment_amount_eur;
    return {
      title: "Account Balance Adjustment",
      description: `Adjustment: ${adj} EUR. New balance: ${d.new_balance_eur} EUR. Reason: ${d.reason}`,
      icon: <Info className="h-4 w-4 text-blue-500" />,
      variant: "default",
    };
  }

  const raw = n.type.split("\\").pop() ?? n.type;
  
  const details = [];
  if (d.amount_eur) details.push(`${d.amount_eur} EUR`);
  if (d.status) details.push(`Status: ${d.status}`);
  if (loanLabel !== "this loan") details.push(`Loan: ${loanLabel}`);
  
  return {
    title: raw.replace(/([A-Z])/g, " $1").trim(),
    description: details.length > 0 ? details.join(" | ") : "New notification received.",
    icon: <Bell className="h-4 w-4" />,
    variant: "default",
  };
}

export default function NotificationsPage() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [cookies] = useCookies(["auth_token"]);
  const token = cookies.auth_token as string | undefined;
  const qc = useQueryClient();
  const { data, isLoading } = useNotifications();
  const [markingAll, setMarkingAll] = useState(false);
  const [markingId, setMarkingId] = useState<string | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  const notifications = data?.data?.data ?? [];
  const hasUnread = notifications.some((n) => !n.read_at);

  const markOne = async (id: string, alreadyRead: boolean) => {
    if (alreadyRead || markingId === id) return;
    setMarkingId(id);
    try {
      await howl<ApiResponse<{ id: string; read_at: string }>>(
        `/notifications/${id}/read`,
        { method: "PATCH", token },
      );
      qc.invalidateQueries({ queryKey: ["notifications"] });
    } finally {
      setMarkingId(null);
    }
  };

  const markAll = async () => {
    if (!hasUnread || markingAll) return;
    setMarkingAll(true);
    try {
      await howl<ApiResponse<{ marked_count: number }>>(
        "/notifications/read-all",
        { method: "PATCH", token },
      );
      qc.invalidateQueries({ queryKey: ["notifications"] });
    } finally {
      setMarkingAll(false);
    }
  };

  return (
    <div className="py-6 space-y-6 p-0 ">
      {/* Header */}
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          <button
            type="button"
            onClick={() => router.back()}
            className="flex items-center justify-center w-9 h-9 rounded-xl border border-border bg-card hover:bg-muted/50 transition-colors shrink-0"
            aria-label="Go back"
          >
            <ArrowLeft size={18} />
          </button>
          <div className="min-w-0">
            <h1 className="text-xl font-bold tracking-tight">Notifications</h1>
            <p className="text-sm text-muted-foreground">
              Your recent activity
            </p>
          </div>
        </div>

        {hasUnread && (
          <button
            type="button"
            onClick={markAll}
            disabled={markingAll}
            className="shrink-0 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors disabled:opacity-50"
          >
            {markingAll ? "Marking…" : "Mark all read"}
          </button>
        )}
      </div>

      {/* Content */}
      {!mounted || isLoading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="h-20 rounded-xl bg-card border border-border animate-pulse"
            />
          ))}
        </div>
      ) : notifications.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 gap-3 text-muted-foreground">
          <Bell size={40} className="opacity-30" />
          <p className="text-sm">No notifications yet</p>
        </div>
      ) : (
        <div className="space-y-3">
          {notifications.map((n) => {
            const { title, description, icon, variant } = notificationMeta(n);
            const isRead = !!n.read_at;
            const isMarking = markingId === n.id;
            const inner = (
              <>
                {!isRead && !isMarking && (
                  <span className="absolute top-3 right-3 z-10 w-2 h-2 rounded-full bg-primary" />
                )}
                {isMarking && (
                  <span className="absolute top-3 right-3 z-10 w-2 h-2 rounded-full bg-primary animate-ping" />
                )}
                <Alert
                  variant={variant}
                  className={`pr-6 transition-opacity ${isRead ? "opacity-60" : "hover:bg-muted/30"}`}
                >
                  {icon}
                  <AlertTitle className="text-sm font-semibold leading-tight">
                    {title}
                  </AlertTitle>
                  <AlertDescription className="text-xs text-muted-foreground space-y-0.5">
                    <span className="block">{description}</span>
                    <span className="block opacity-70">
                      {formatDate(n.created_at)}
                    </span>
                  </AlertDescription>
                </Alert>
              </>
            );
            return isRead ? (
              <div key={n.id} className="relative">
                {inner}
              </div>
            ) : (
              <button
                key={n.id}
                type="button"
                className="relative w-full text-left"
                onClick={() => markOne(n.id, false)}
                aria-label="Mark as read"
              >
                {inner}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

