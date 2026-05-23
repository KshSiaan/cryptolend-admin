import { useQuery } from "@tanstack/react-query";
import { useCookies } from "react-cookie";

import { howl } from "@/lib/utils";
import type { ProfileData } from "@/types/auth";
import type { ApiResponse } from "@/types/base";

export function useProfile() {
  const [cookies] = useCookies(["auth_token"]);
  const token = cookies.auth_token as string | undefined;

  return useQuery({
    queryKey: ["profile"],
    queryFn: () =>
      howl<ApiResponse<ProfileData>>("/profile", { token }),
    enabled: !!token,
    staleTime: 1000 * 60 * 5,
  });
}
