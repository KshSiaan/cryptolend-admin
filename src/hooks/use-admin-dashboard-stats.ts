import { useQuery } from "@tanstack/react-query";
import { useCookies } from "react-cookie";

import { howl } from "@/lib/utils";
import type { AdminDashboardStats } from "@/types/auth";
import type { ApiResponse } from "@/types/base";

export function useAdminDashboardStats() {
  const [cookies] = useCookies(["auth_token"]);
  const token = cookies.auth_token as string | undefined;

  return useQuery({
    queryKey: ["admin-dashboard-stats"],
    queryFn: () =>
      howl<ApiResponse<AdminDashboardStats>>("/admin/dashboard-stats", { token }),
    enabled: !!token,
    staleTime: 1000 * 30,
  });
}
