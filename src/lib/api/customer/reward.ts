import { apiClient } from "../client";
import type { ApiResponse, RewardRedemptionResponse } from "@/lib/types/customer";

export const rewardApi = {
  // 사용 가능한 리워드 조회
  getMyActiveRedemptions: () =>
    apiClient.get<ApiResponse<RewardRedemptionResponse[]>>(
      "/api/rewards/redemptions/me/active"
    ),
};
