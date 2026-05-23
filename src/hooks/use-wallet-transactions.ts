import { useQuery } from "@tanstack/react-query";
import { useCookies } from "react-cookie";

import { howl } from "@/lib/utils";
import type { WalletTransaction } from "@/types/auth";
import type { ApiResponse, Paginator } from "@/types/base";

export function useWalletTransactions(page = 1) {
  const [cookies] = useCookies(["auth_token"]);
  const token = cookies.auth_token as string | undefined;

  return useQuery({
    queryKey: ["wallet-transactions", page],
    queryFn: () =>
      howl<ApiResponse<Paginator<WalletTransaction[]>>>(
        `/wallet-transactions?page=${page}`,
        { token },
      ),
    enabled: !!token,
    staleTime: 1000 * 30,
  });
}
