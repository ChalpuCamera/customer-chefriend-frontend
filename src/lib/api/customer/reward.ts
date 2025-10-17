import { apiClient } from "../client";
import type {
  ApiResponse,
  RewardResponse,
  RewardRedemptionResponse,
} from "@/lib/types/customer";

export const rewardApi = {
  // GET /api/rewards/me - 가용 리워드 조회 (피드백 횟수 기반)
  getMyRewards: () =>
    apiClient.get<ApiResponse<RewardResponse[]>>(
      "/api/rewards/me"
    ),

  // GET /api/rewards/redemptions/me/active - 활성 리워드 조회 (미사용)
  getMyActiveRedemptions: () =>
    apiClient.get<ApiResponse<RewardRedemptionResponse[]>>(
      "/api/rewards/redemptions/me/active"
    ),

  // GET /api/rewards/redemptions/me - 전체 리워드 교환 내역 조회
  getMyRedemptions: () =>
    apiClient.get<ApiResponse<RewardRedemptionResponse[]>>(
      "/api/rewards/redemptions/me"
    ),

  // POST /api/rewards/redeem - 리워드 교환
  redeemReward: (rewardId: number) =>
    apiClient.post<ApiResponse<RewardRedemptionResponse>>(
      "/api/rewards/redeem",
      { rewardId }
    ),
};
