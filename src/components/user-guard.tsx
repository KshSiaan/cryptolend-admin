"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { useProfile } from "@/hooks/use-profile";

export function UserGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { data, isLoading, isError } = useProfile();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const role = data?.data?.role;

  useEffect(() => {
    if (!mounted || isLoading) return;

    if (isError) {
      router.replace("/auth/login");
      return;
    }

    if (role === "admin") {
      router.replace("/admin/dashboard");
    }
  }, [mounted, isLoading, isError, role, router]);

  if (!mounted || isLoading) return null;

  if (isError || role === "admin") return null;

  return <>{children}</>;
}
