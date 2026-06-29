import { useQuery } from "@tanstack/react-query";
import { useCookies } from "react-cookie";

import { howl } from "@/lib/utils";
import type { AdminUser } from "@/types/auth";
import type { ApiResponse, Paginator } from "@/types/base";

export function useAdminUsers(page = 1, search = "", referrerId?: number) {
  const [cookies] = useCookies(["auth_token"]);
  const token = cookies.auth_token as string | undefined;

  return useQuery({
    queryKey: ["admin-users", page, search, referrerId],
    queryFn: () => {
      let url = `/admin/users?page=${page}&search=${encodeURIComponent(search)}`;
      if (referrerId) url += `&referrer_id=${referrerId}`;
      return howl<ApiResponse<Paginator<AdminUser[]>>>(url, { token });
    },
    enabled: !!token,
    staleTime: 1000 * 30,
  });
}
