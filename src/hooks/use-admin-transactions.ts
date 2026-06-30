import { useQuery } from "@tanstack/react-query";
import { useCookies } from "react-cookie";

import { howl } from "@/lib/utils";
import type { AdminTransactionListItem } from "@/types/auth";
import type { ApiResponse, Paginator } from "@/types/base";

export function useAdminTransactions(page = 1, userId?: number) {
  const [cookies] = useCookies(["auth_token"]);
  const token = cookies.auth_token as string | undefined;

  return useQuery({
    queryKey: ["admin-transactions", page, userId],
    queryFn: () => {
      const url = userId 
        ? `/admin/transactions?page=${page}&user_id=${userId}`
        : `/admin/transactions?page=${page}`;
      return howl<ApiResponse<Paginator<AdminTransactionListItem[]>>>(url, { token });
    },
    enabled: !!token,
    staleTime: 1000 * 30,
  });
}
