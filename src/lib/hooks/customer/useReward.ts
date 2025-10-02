import { useQuery } from "@tanstack/react-query";
import { rewardApi } from "@/lib/api/customer/reward";

export const rewardKeys = {
  all: ["rewards"] as const,
  active: () => [...rewardKeys.all, "active"] as const,
};

export function useMyActiveRewards(options?: { enabled?: boolean }) {
  return useQuery({
    queryKey: rewardKeys.active(),
    queryFn: async () => {
      const response = await rewardApi.getMyActiveRedemptions();
      return response.result;
    },
    enabled: options?.enabled ?? true,
  });
}
