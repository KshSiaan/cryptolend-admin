import { useQuery } from "@tanstack/react-query";
import { useCookies } from "react-cookie";

import { howl } from "@/lib/utils";
import type { HomeStats } from "@/types/auth";
import type { ApiResponse } from "@/types/base";

export function useHomeStats() {
  const [cookies] = useCookies(["auth_token"]);
  const token = cookies.auth_token as string | undefined;

  return useQuery({
    queryKey: ["home-stats"],
    queryFn: () => howl<ApiResponse<HomeStats>>("/home-stats", { token }),
    enabled: !!token,
    staleTime: 1000 * 30,
  });
}
