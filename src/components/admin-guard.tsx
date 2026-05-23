"use client";

import { useEffect, useState } from "react";

import { useRouter } from "next/navigation";

import { useProfile } from "@/hooks/use-profile";

export function AdminGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { data, isLoading, isError } = useProfile();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const role = data?.data?.role;

  useEffect(() => {
    if (!mounted || isLoading) return;
    if (isError || role !== "admin") {
      router.replace("/app");
    }
  }, [mounted, isLoading, isError, role, router]);

  if (!mounted || isLoading) return null;

  if (role !== "admin") return null;

  return <>{children}</>;
}
