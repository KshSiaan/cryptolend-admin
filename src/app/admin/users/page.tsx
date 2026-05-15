"use client";
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";
import { Eye } from "lucide-react";
import { cn } from "@/lib/utils";

type UserStatus = "active" | "Suspended";

interface User {
  id: number;
  name: string;
  email: string;
  balance: string;
  invested: string;
  status: UserStatus;
}

const initialUsers: User[] = [
  {
    id: 1,
    name: "Alex Kim",
    email: "alex@email.com",
    balance: "1.842 USDT",
    invested: "0.95 USDT",
    status: "active",
  },
  {
    id: 2,
    name: "Maria Santos",
    email: "maria@email.com",
    balance: "3.210 USDT",
    invested: "2.10 USDT",
    status: "active",
  },
  {
    id: 3,
    name: "James Wu",
    email: "james@email.com",
    balance: "0.580 USDT",
    invested: "0.50 USDT",
    status: "active",
  },
  {
    id: 4,
    name: "Priya Pate",
    email: "priya@email.com",
    balance: "0.000 USDT",
    invested: "0.00 USDT",
    status: "active",
  },
  {
    id: 5,
    name: "Alex Kim",
    email: "alex@email.com",
    balance: "1.842 USDT",
    invested: "0.95 USDT",
    status: "active",
  },
  {
    id: 6,
    name: "Maria Santos",
    email: "maria@email.com",
    balance: "3.210 USDT",
    invested: "2.10 USDT",
    status: "Suspended",
  },
];

const PAGE_SIZE = 10;

function UserInitials({ name }: { name: string }) {
  const initials = name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
  return (
    <div className="size-10 rounded-full bg-muted flex items-center justify-center shrink-0 border border-border">
      <span className="text-xs font-semibold text-muted-foreground">
        {initials}
      </span>
    </div>
  );
}

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>(initialUsers);
  const [page, setPage] = useState(1);
  const [viewTarget, setViewTarget] = useState<User | null>(null);
  const [suspendTarget, setSuspendTarget] = useState<User | null>(null);

  const totalPages = Math.ceil(users.length / PAGE_SIZE);
  const paged = users.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const handleSuspend = () => {
    if (!suspendTarget) return;
    setUsers((prev) =>
      prev.map((u) =>
        u.id === suspendTarget.id ? { ...u, status: "Suspended" } : u,
      ),
    );
    setSuspendTarget(null);
    setViewTarget(null);
  };

  const viewUser = viewTarget
    ? (users.find((u) => u.id === viewTarget.id) ?? viewTarget)
    : null;

  return (
    <div className="p-6">
      <Card className="shadow-none">
        <CardContent className="p-6">
          <h2 className="text-base font-semibold mb-4">All users</h2>
          <Table>
            <TableHeader>
              <TableRow className="border-b-0">
                <TableHead className="text-muted-foreground font-normal pl-0">
                  User
                </TableHead>
                <TableHead className="text-muted-foreground font-normal">
                  Email
                </TableHead>
                <TableHead className="text-muted-foreground font-normal">
                  Available Balance
                </TableHead>
                <TableHead className="text-muted-foreground font-normal">
                  Invested
                </TableHead>
                <TableHead className="text-muted-foreground font-normal">
                  Status
                </TableHead>
                <TableHead className="text-muted-foreground font-normal">
                  Actions
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paged.map((u) => (
                <TableRow key={u.id} className="border-b border-border">
                  <TableCell className="pl-0 font-medium">{u.name}</TableCell>
                  <TableCell className="text-muted-foreground">
                    {u.email}
                  </TableCell>
                  <TableCell>{u.balance}</TableCell>
                  <TableCell>{u.invested}</TableCell>
                  <TableCell>
                    <span
                      className={cn(
                        "text-xs font-medium px-2.5 py-0.5 rounded-full border",
                        u.status === "active"
                          ? "bg-green-100 text-green-700 border-green-200"
                          : "bg-red-100 text-red-600 border-red-200",
                      )}
                    >
                      {u.status}
                    </span>
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="outline"
                      size="icon-sm"
                      onClick={() => setViewTarget(u)}
                    >
                      <Eye className="size-3.5" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          <div className="flex items-center justify-between mt-4 pt-4 border-t border-border">
            <p className="text-sm text-muted-foreground">
              Page {page} of {totalPages}
            </p>
            <div className="flex items-center gap-1">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
              >
                Previous
              </Button>
              <Button variant="outline" size="icon-sm" className="font-medium">
                {page}
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
              >
                Next
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* User Details Dialog */}
      <Dialog
        open={!!viewTarget}
        onOpenChange={(o) => !o && setViewTarget(null)}
      >
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>User Details</DialogTitle>
          </DialogHeader>
          {viewUser && (
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <UserInitials name={viewUser.name} />
                <div>
                  <p className="text-sm font-semibold">{viewUser.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {viewUser.email}
                  </p>
                </div>
              </div>
              <div className="space-y-3 pt-1">
                <div className="flex items-center justify-between border-b border-border pb-3">
                  <span className="text-sm text-muted-foreground">
                    Available
                  </span>
                  <span className="text-sm font-medium">
                    {viewUser.balance}
                  </span>
                </div>
                <div className="flex items-center justify-between border-b border-border pb-3">
                  <span className="text-sm text-muted-foreground">
                    Invested
                  </span>
                  <span className="text-sm font-medium">
                    {viewUser.invested}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Status</span>
                  <span
                    className={cn(
                      "text-sm font-semibold",
                      viewUser.status === "active"
                        ? "text-[oklch(0.52_0.165_145)]"
                        : "text-destructive",
                    )}
                  >
                    {viewUser.status === "active" ? "Active" : "Suspended"}
                  </span>
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            {viewUser?.status === "active" && (
              <Button
                variant="outline"
                onClick={() => viewTarget && setSuspendTarget(viewTarget)}
              >
                Suspend
              </Button>
            )}
            <Button variant="outline" onClick={() => setViewTarget(null)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Suspend AlertDialog */}
      <AlertDialog
        open={!!suspendTarget}
        onOpenChange={(o) => !o && setSuspendTarget(null)}
      >
        <AlertDialogContent size="sm">
          <AlertDialogHeader>
            <AlertDialogTitle>Suspend User</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to suspend{" "}
              <span className="font-semibold text-foreground">
                {suspendTarget?.name}
              </span>
              ? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setSuspendTarget(null)}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction onClick={handleSuspend}>
              Suspend
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
