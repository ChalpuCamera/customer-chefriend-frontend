import { useQuery } from "@tanstack/react-query";
import { foodApi } from "@/lib/api/customer/food";

export const foodKeys = {
  all: ["foods"] as const,
  detail: (id: number) => [...foodKeys.all, id] as const,
};

export function useFood(foodId: number, options?: { enabled?: boolean }) {
  return useQuery({
    queryKey: foodKeys.detail(foodId),
    queryFn: async () => {
      const response = await foodApi.getFood(foodId);
      return response.result;
    },
    enabled: options?.enabled ?? !!foodId,
  });
}
