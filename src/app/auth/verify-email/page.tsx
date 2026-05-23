"use client";
import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { howl } from "@/lib/utils";
import { ApiResponse } from "@/types/base";
import { VerifyEmailBody, ForgotPasswordBody } from "@/types/auth";

function VerifyEmailContent() {
  const router = useRouter();
  const params = useSearchParams();
  const email = params.get("email") ?? "";
  const [otp, setOtp] = useState("");

  const masked = email
    ? email.replace(/(.{2})(.*)(@.*)/, (_, a, b, c) => a + "*".repeat(b.length) + c)
    : "";

  const verifyMutation = useMutation({
    mutationFn: (body: VerifyEmailBody) =>
      howl<ApiResponse<null>>("/auth/email/verify", {
        method: "POST",
        body,
      }),
    onSuccess: () => {
      toast.success("Email verified. You can now sign in.");
      router.push("/auth/login");
    },
    onError: (err: Error) => {
      toast.error(err.message);
    },
  });

  const resendMutation = useMutation({
    mutationFn: (body: ForgotPasswordBody) =>
      howl<ApiResponse<null>>("/auth/forgot-password", {
        method: "POST",
        body,
      }),
    onSuccess: () => {
      toast.success("Verification code resent.");
    },
    onError: (err: Error) => {
      toast.error(err.message);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (otp.length < 6) return;
    verifyMutation.mutate({ email, otp });
  };

  return (
    <Card className="shadow-none">
      <CardContent className="p-6 space-y-5">
        <div className="space-y-1">
          <h1 className="text-xl font-semibold">Verify your email</h1>
          <p className="text-sm text-muted-foreground">
            Enter the 6-digit code sent to{" "}
            <span className="font-medium text-foreground">{masked || "your email"}</span>.
          </p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex justify-center">
            <InputOTP maxLength={6} value={otp} onChange={setOtp}>
              <InputOTPGroup>
                <InputOTPSlot index={0} className="size-11 text-base" />
                <InputOTPSlot index={1} className="size-11 text-base" />
                <InputOTPSlot index={2} className="size-11 text-base" />
                <InputOTPSlot index={3} className="size-11 text-base" />
                <InputOTPSlot index={4} className="size-11 text-base" />
                <InputOTPSlot index={5} className="size-11 text-base" />
              </InputOTPGroup>
            </InputOTP>
          </div>
          <Button
            type="submit"
            className="w-full"
            disabled={otp.length < 6 || verifyMutation.isPending}
          >
            {verifyMutation.isPending ? "Verifying…" : "Verify email"}
          </Button>
        </form>
        <p className="text-center text-sm text-muted-foreground">
          Didn&apos;t receive a code?{" "}
          <button
            type="button"
            className="font-medium text-foreground hover:underline disabled:opacity-50"
            disabled={resendMutation.isPending}
            onClick={() => resendMutation.mutate({ email })}
          >
            {resendMutation.isPending ? "Sending…" : "Resend"}
          </button>
        </p>
      </CardContent>
    </Card>
  );
}

export default function VerifyEmailPage() {
  return (
    <Suspense>
      <VerifyEmailContent />
    </Suspense>
  );
}
