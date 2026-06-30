import { useQuery } from "@tanstack/react-query";
import { useCookies } from "react-cookie";

import { howl } from "@/lib/utils";
import type { AdminUser, AdminUserInvestment } from "@/types/auth";
import type { ApiResponse, Paginator } from "@/types/base";

export function useAdminUser(id: number) {
  const [cookies] = useCookies(["auth_token"]);
  const token = cookies.auth_token as string | undefined;

  return useQuery({
    queryKey: ["admin-user", id],
    queryFn: () => howl<ApiResponse<AdminUser>>(`/admin/users/${id}`, { token }),
    enabled: !!token && !!id,
    staleTime: 1000 * 30,
  });
}

export function useAdminUserInvestments(id: number, page = 1) {
  const [cookies] = useCookies(["auth_token"]);
  const token = cookies.auth_token as string | undefined;

  return useQuery({
    queryKey: ["admin-user-investments", id, page],
    queryFn: () => howl<ApiResponse<Paginator<AdminUserInvestment[]>>>(`/admin/users/${id}/investments?per_page=15&page=${page}`, { token }),
    enabled: !!token && !!id,
    staleTime: 1000 * 30,
  });
}
