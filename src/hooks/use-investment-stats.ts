import { useQuery } from "@tanstack/react-query";
import { useCookies } from "react-cookie";

import { howl } from "@/lib/utils";
import type { InvestmentStats } from "@/types/auth";
import type { ApiResponse } from "@/types/base";

export function useInvestmentStats() {
  const [cookies] = useCookies(["auth_token"]);
  const token = cookies.auth_token as string | undefined;

  return useQuery({
    queryKey: ["investment-stats"],
    queryFn: () => howl<ApiResponse<InvestmentStats>>("/investments-stats", { token }),
    enabled: !!token,
    staleTime: 1000 * 30,
  });
}
