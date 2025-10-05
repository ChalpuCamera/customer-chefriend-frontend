import { useQuery } from "@tanstack/react-query";
import { foodApi } from "@/lib/api/customer/food";
import type { Pageable } from "@/lib/types/customer";

export const foodKeys = {
  all: ["foods"] as const,
  byStore: (storeId: number, pageable?: Pageable) => [...foodKeys.all, "byStore", storeId, pageable] as const,
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

export function useFoodsByStore(storeId: number, pageable?: Pageable, options?: { enabled?: boolean }) {
  return useQuery({
    queryKey: foodKeys.byStore(storeId, pageable),
    queryFn: async () => {
      const response = await foodApi.getFoodsByStore(storeId, pageable);
      return response.result;
    },
    enabled: options?.enabled ?? !!storeId,
  });
}
