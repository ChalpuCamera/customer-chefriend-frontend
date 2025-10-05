import { apiClient } from "../client";
import type { ApiResponse, FoodItemResponse, PageResponse, Pageable } from "@/lib/types/customer";

export const foodApi = {
  // 음식 상세 조회
  getFood: (foodId: number) =>
    apiClient.get<ApiResponse<FoodItemResponse>>(`/api/foods/${foodId}`),

  // 매장별 음식 목록 조회
  getFoodsByStore: (storeId: number, pageable?: Pageable) =>
    apiClient.get<ApiResponse<PageResponse<FoodItemResponse>>>(`/api/foods/store/${storeId}`, {
      params: pageable,
    }),
};
