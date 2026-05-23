import { useQuery } from "@tanstack/react-query";
import { useCookies } from "react-cookie";

import { howl } from "@/lib/utils";
import type { WalletStats } from "@/types/auth";
import type { ApiResponse } from "@/types/base";

export function useWalletStats() {
  const [cookies] = useCookies(["auth_token"]);
  const token = cookies.auth_token as string | undefined;

  return useQuery({
    queryKey: ["wallet-stats"],
    queryFn: () => howl<ApiResponse<WalletStats>>("/wallet-stats", { token }),
    enabled: !!token,
    staleTime: 1000 * 30,
  });
}
