"use client";
import { Suspense, useState } from "react";

import { useMutation } from "@tanstack/react-query";
import { Check } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { howl } from "@/lib/utils";
import type { ResetPasswordBody } from "@/types/auth";
import type { ApiResponse } from "@/types/base";

function ResetPasswordContent() {
  const router = useRouter();
  const params = useSearchParams();
  const email = params.get("email") ?? "";
  const token = params.get("token") ?? "";

  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [done, setDone] = useState(false);

  const mutation = useMutation({
    mutationFn: (body: ResetPasswordBody) =>
      howl<ApiResponse<null>>("/auth/forgot-password/reset", {
        method: "POST",
        body,
      }),
    onSuccess: (data) => {
      toast.success(data.message);
      setDone(true);
    },
    onError: (err: Error) => {
      toast.error(err.message);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirm) {
      toast.error("Passwords do not match.");
      return;
    }
    if (password.length < 8) {
      toast.error("Password must be at least 8 characters.");
      return;
    }
    mutation.mutate({
      email,
      password,
      password_confirmation: confirm,
      password_reset_token: token,
    });
  };

  if (done) {
    return (
      <Card className="shadow-none">
        <CardContent className="p-6">
          <div className="flex flex-col items-center gap-4 py-4 text-center">
            <div className="size-14 rounded-full bg-[oklch(0.52_0.165_145)]/10 flex items-center justify-center">
              <Check className="size-7 text-[oklch(0.52_0.165_145)]" />
            </div>
            <div className="space-y-1.5">
              <p className="text-base font-semibold">Password reset</p>
              <p className="text-sm text-muted-foreground">
                Your password has been updated. You can now sign in with your new credentials.
              </p>
            </div>
            <Button className="w-full" onClick={() => router.push("/auth/login")}>
              Back to sign in
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="shadow-none">
      <CardContent className="p-6 space-y-5">
        <div className="space-y-1">
          <h1 className="text-xl font-semibold">Reset password</h1>
          <p className="text-sm text-muted-foreground">
            Choose a new password for{" "}
            <span className="font-medium text-foreground">{email || "your account"}</span>.
          </p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="password">New password</Label>
            <Input
              id="password"
              type="password"
              placeholder="Min. 8 characters"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="new-password"
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="confirm">Confirm password</Label>
            <Input
              id="confirm"
              type="password"
              placeholder="Repeat new password"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              required
              autoComplete="new-password"
            />
          </div>
          <Button type="submit" className="w-full" disabled={mutation.isPending}>
            {mutation.isPending ? "Resetting…" : "Reset password"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense>
      <ResetPasswordContent />
    </Suspense>
  );
}
