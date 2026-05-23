"use client";

import { useState } from "react";

import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { useCookies } from "react-cookie";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { howl } from "@/lib/utils";
import type { ChangePasswordBody } from "@/types/auth";
import type { ApiResponse } from "@/types/base";

export default function SecurityPage() {
  const router = useRouter();
  const [cookies] = useCookies(["auth_token"]);
  const token = cookies.auth_token as string | undefined;

  const [form, setForm] = useState<ChangePasswordBody>({
    current_password: "",
    new_password: "",
    new_password_confirmation: "",
  });
  const [isPending, setIsPending] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (form.new_password !== form.new_password_confirmation) {
      toast.error("New passwords do not match.");
      return;
    }
    if (form.new_password.length < 8) {
      toast.error("New password must be at least 8 characters.");
      return;
    }

    setIsPending(true);
    try {
      const data = await howl<ApiResponse<null>>("/profile/password", {
        method: "PUT",
        body: form,
        token,
      });
      toast.success(data.message ?? "Password updated.");
      setForm({ current_password: "", new_password: "", new_password_confirmation: "" });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setIsPending(false);
    }
  };

  return (
    <div className="py-6 space-y-6">
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={() => router.back()}
          className="text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft size={20} />
        </button>
        <div>
          <h1 className="text-xl font-bold tracking-tight">Security</h1>
          <p className="text-sm text-muted-foreground">Manage your password</p>
        </div>
      </div>

      <div className="rounded-2xl bg-card border border-border p-4 space-y-1">
        <p className="text-sm font-semibold">Change password</p>
        <p className="text-xs text-muted-foreground">
          Use a strong password you don&apos;t use anywhere else.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="rounded-2xl bg-card border border-border p-4 space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="current_password">Current password</Label>
            <Input
              id="current_password"
              name="current_password"
              type="password"
              placeholder="••••••••"
              value={form.current_password}
              onChange={handleChange}
              required
              autoComplete="current-password"
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="new_password">New password</Label>
            <Input
              id="new_password"
              name="new_password"
              type="password"
              placeholder="Min. 8 characters"
              value={form.new_password}
              onChange={handleChange}
              required
              autoComplete="new-password"
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="new_password_confirmation">Confirm new password</Label>
            <Input
              id="new_password_confirmation"
              name="new_password_confirmation"
              type="password"
              placeholder="Repeat new password"
              value={form.new_password_confirmation}
              onChange={handleChange}
              required
              autoComplete="new-password"
            />
          </div>
        </div>

        <Button type="submit" className="w-full" disabled={isPending}>
          {isPending ? "Updating…" : "Update password"}
        </Button>
      </form>
    </div>
  );
}
