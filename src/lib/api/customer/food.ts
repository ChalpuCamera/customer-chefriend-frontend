import { apiClient } from "../client";
import type { ApiResponse, FoodItemResponse } from "@/lib/types/customer";

export const foodApi = {
  // 음식 상세 조회
  getFood: (foodId: number) =>
    apiClient.get<ApiResponse<FoodItemResponse>>(`/api/foods/${foodId}`),
};
