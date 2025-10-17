"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { feedbackApi } from "@/lib/api/customer/feedback";
import { rewardApi } from "@/lib/api/customer/reward";
import { RewardCard } from "@/components/reward/RewardCard";
import type { RewardResponse, RewardRedemptionResponse } from "@/lib/types/customer";
import { toast } from "sonner";

export default function Page() {
  const router = useRouter();
  const [currentPoints, setCurrentPoints] = useState(0);
  const [rewards, setRewards] = useState<RewardResponse[]>([]);
  const [redemptions, setRedemptions] = useState<RewardRedemptionResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [redeeming, setRedeeming] = useState<number | null>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        // 현재 포인트 계산
        const feedbackResponse = await feedbackApi.getMyFeedbacks({ page: 0, size: 1 });
        const totalFeedbackCount = feedbackResponse.result.totalElements;
        const earnedPoints = totalFeedbackCount * 500;

        const allRedemptions = await rewardApi.getMyRedemptions();
        const usedPoints = allRedemptions.result.reduce(
          (sum: number, redemption: RewardRedemptionResponse) => sum + redemption.reward.requiredFeedbackCount,
          0
        );

        setCurrentPoints(earnedPoints - usedPoints);

        // 가용 리워드 조회
        const rewardsResponse = await rewardApi.getMyRewards();
        setRewards(rewardsResponse.result);

        // 교환 내역 조회
        setRedemptions(allRedemptions.result);
      } catch (error) {
        console.error("Failed to load reward data:", error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const handleRedeem = async (rewardId: number, requiredPoints: number) => {
    if (currentPoints < requiredPoints) {
      toast.error("포인트가 부족합니다");
      return;
    }

    try {
      setRedeeming(rewardId);
      await rewardApi.redeemReward(rewardId);

      // 포인트 차감
      setCurrentPoints((prev) => prev - requiredPoints);

      // 교환 내역 새로고침
      const allRedemptions = await rewardApi.getMyRedemptions();
      setRedemptions(allRedemptions.result);

      toast.success("리워드가 교환되었습니다!");
    } catch (error) {
      console.error("Failed to redeem reward:", error);
      toast.error("리워드 교환에 실패했습니다");
    } finally {
      setRedeeming(null);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    return `${year}년 ${month}월 ${day}일`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <p className="text-gray-600">로딩 중...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="flex items-center justify-between px-4 h-11">
        <button onClick={() => router.back()} className="p-2 -ml-2">
          <ArrowLeft size={24} className="text-gray-800" />
        </button>
      </div>

      {/* Points Display */}
      <div className="text-center py-8">
        <h1 className="text-purple-700 text-large-title-1 mb-2">
          {currentPoints.toLocaleString()} P
        </h1>
        <p className="text-gray-600 text-body-r">현재 사용 가능 포인트</p>
      </div>

      {/* Available Rewards Section */}
      <div className="px-4 mb-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-gray-800 text-headline-b">교환 가능 상품</h2>
          <button
            onClick={() => router.push("/mypage")}
            className="text-purple-700 text-sub-body-sb"
          >
            신청하기
          </button>
        </div>

        {/* Reward Grid */}
        <div className="grid grid-cols-2 gap-4">
          {rewards.map((reward) => (
            <RewardCard
              key={reward.rewardId}
              reward={reward}
              onRedeem={() =>
                handleRedeem(reward.rewardId, reward.requiredFeedbackCount)
              }
              disabled={
                currentPoints < reward.requiredFeedbackCount ||
                redeeming === reward.rewardId
              }
            />
          ))}
        </div>

        {rewards.length === 0 && (
          <p className="text-gray-600 text-body-r text-center py-8">
            교환 가능한 상품이 없습니다
          </p>
        )}
      </div>

      {/* Redemption History Section */}
      <div className="px-4 mb-8">
        <h2 className="text-gray-800 text-headline-b mb-4">상품 교환 내역</h2>

        {/* History List */}
        <div className="space-y-3">
          {redemptions.map((redemption) => (
            <div
              key={redemption.redemptionId}
              className="flex justify-between items-center"
            >
              <div>
                <p className="text-gray-800 text-body-r">
                  {redemption.reward.rewardName} 교환권
                </p>
                <p className="text-gray-600 text-sub-body-r">
                  {formatDate(redemption.redeemedAt)}
                </p>
              </div>
              <p className="text-purple-700 text-body-sb">
                -{redemption.reward.requiredFeedbackCount.toLocaleString()} P
              </p>
            </div>
          ))}
        </div>

        {redemptions.length === 0 && (
          <p className="text-gray-600 text-body-r text-center py-8">
            아직 교환 내역이 없습니다
          </p>
        )}
      </div>
    </div>
  );
}
