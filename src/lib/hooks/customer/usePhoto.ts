import { useQuery } from "@tanstack/react-query";
import { photoApi } from "@/lib/api/customer/photo";

export const photoKeys = {
  all: ["photos"] as const,
  listByFood: (foodId: number) => [...photoKeys.all, "food", foodId] as const,
};

export function usePhotosByFoodItem(
  foodId: number,
  options?: { enabled?: boolean }
) {
  return useQuery({
    queryKey: photoKeys.listByFood(foodId),
    queryFn: async () => {
      const response = await photoApi.getPhotosByFoodItem(foodId);
      return response.result?.content?.slice(0, 3) || [];
    },
    enabled: options?.enabled ?? !!foodId,
  });
}
