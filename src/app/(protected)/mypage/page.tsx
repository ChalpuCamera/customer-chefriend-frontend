"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { useUser } from "@/lib/hooks/customer/useUser";
import { feedbackApi } from "@/lib/api/customer/feedback";
import { rewardApi } from "@/lib/api/customer/reward";
import { FeedbackCard } from "@/components/feedback/FeedbackCard";
import type { CustomerFeedbackResponse, RewardRedemptionResponse } from "@/lib/types/customer";
import { getTasteProfile } from "@/lib/api/customer/profile";
import type { CustomerTasteDto } from "@/lib/types/customer";
import Image from "next/image";

export default function Page() {
  const router = useRouter();
  const { data: user } = useUser();
  const [tasteProfile, setTasteProfile] = useState<CustomerTasteDto | null>(null);
  const [feedbacks, setFeedbacks] = useState<CustomerFeedbackResponse[]>([]);
  const [totalFeedbackCount, setTotalFeedbackCount] = useState(0);
  const [currentPoints, setCurrentPoints] = useState(0);
  const [totalEarnedPoints, setTotalEarnedPoints] = useState(0);
  const [usedPoints, setUsedPoints] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {

        // 입맛 프로필 로드
        try {
          const taste = await getTasteProfile();
          setTasteProfile(taste);
        } catch {
          // 프로필 없으면 기본값
          setTasteProfile({
            spicyLevel: 2,
            mealAmount: 2,
            mealSpending: 2,
          });
        }

        // 피드백 데이터 로드 (최근 3개)
        const feedbackResponse = await feedbackApi.getMyFeedbacks({ page: 0, size: 3 });
        setFeedbacks(feedbackResponse.result.content);
        setTotalFeedbackCount(feedbackResponse.result.totalElements);

        // 포인트 계산 (피드백 1개당 500포인트)
        const earnedPoints = feedbackResponse.result.totalElements * 500;
        setTotalEarnedPoints(earnedPoints);

        // 사용한 포인트 계산 (리워드 교환 내역에서)
        const redemptions = await rewardApi.getMyRedemptions();
        const usedPointsTotal = redemptions.result.reduce(
          (sum: number, redemption: RewardRedemptionResponse) => sum + redemption.reward.requiredFeedbackCount,
          0
        );
        setUsedPoints(usedPointsTotal);

        // 현재 사용 가능 포인트
        setCurrentPoints(earnedPoints - usedPointsTotal);
      } catch (error) {
        console.error("Failed to load mypage data:", error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <p className="text-gray-600">로딩 중...</p>
      </div>
    );
  }

  // 입맛 프로필 텍스트 변환
  const getSpicyText = (level: number) => {
    switch (level) {
      case 1: return "덜맵게";
      case 3: return "더맵게";
      default: return "보통";
    }
  };

  const getAmountText = (level: number) => {
    switch (level) {
      case 1: return "0.5인분";
      case 3: return "1.5인분";
      default: return "1인분";
    }
  };

  const getSpendingText = (level: number) => {
    switch (level) {
      case 1: return "만원 이하";
      case 3: return "2만원 이상";
      default: return "만원~2만원";
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="flex items-center justify-between px-4 h-11">
        <button onClick={() => router.back()} className="p-2 -ml-2">
          <ArrowLeft size={24} className="text-gray-800" />
        </button>
      </div>

      {/* User Profile Section */}
      <div className="px-4 py-6 text-center">
        <h1 className="text-gray-800 text-title-2 mb-2">
          안녕하세요, {user?.name || "맛평단님"}
        </h1>
        <p className="text-gray-700 text-body-r">
          {new Date().getFullYear()}년 {new Date().getMonth() + 1}월 {new Date().getDate()}일 기준
        </p>
        <p className="text-purple-700 text-headline-b mt-2">
          총 맛 평가 {totalFeedbackCount}개 작성
        </p>
      </div>

      {/* Points Section */}
      <div className="px-4 mb-6">
        <div className="flex justify-between items-center mb-2">
          <p className="text-gray-800 text-sub-body-r">현재 포인트</p>
          <p className="text-purple-700 text-headline-b">{currentPoints.toLocaleString()} P</p>
        </div>
        <div className="flex justify-between items-center mb-2">
          <p className="text-gray-800 text-sub-body-r">총 지급된 포인트</p>
          <p className="text-purple-700 text-headline-b">{totalEarnedPoints.toLocaleString()} P</p>
        </div>
        <div className="flex justify-between items-center mb-4">
          <p className="text-gray-800 text-sub-body-r">사용한 포인트</p>
          <p className="text-purple-700 text-headline-b">{usedPoints.toLocaleString()} P</p>
        </div>

        {/* Go to Reward Button */}
        <button
          onClick={() => router.push("/reward")}
          className="w-full bg-purple-50 text-purple-700 text-body-sb py-3 rounded-lg"
        >
          포인트 상품으로 교환하러 가기
        </button>
      </div>

      {/* Taste Profile Section */}
      <div className="px-4 mb-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-gray-800 text-headline-b">나의 입맛 프로필</h2>
          <button
            onClick={() => router.push("/profile/edit")}
            className="text-purple-700 text-sub-body-sb"
          >
            변경하기
          </button>
        </div>

        {/* Taste Icons */}
        {tasteProfile && (
          <div className="flex justify-around">
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 relative mb-2">
                <Image src="/spicy.png" alt="매운맛" fill className="object-contain" />
              </div>
              <p className="text-gray-800 text-sub-body-r">
                {getSpicyText(tasteProfile.spicyLevel)}
              </p>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 relative mb-2">
                <Image src="/portion.png" alt="식사량" fill className="object-contain" />
              </div>
              <p className="text-gray-800 text-sub-body-r">
                {getAmountText(tasteProfile.mealAmount)}
              </p>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 relative mb-2">
                <Image src="/price.png" alt="예산" fill className="object-contain" />
              </div>
              <p className="text-gray-800 text-sub-body-r">
                {getSpendingText(tasteProfile.mealSpending)}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Recent Feedback Section */}
      <div className="px-4 mb-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-gray-800 text-headline-b">나의 최근 맛 평가</h2>
          <button
            onClick={() => router.push("/history")}
            className="text-purple-700 text-sub-body-sb"
          >
            전체보기
          </button>
        </div>

        {/* Feedback Cards */}
        <div className="divide-y divide-gray-200">
          {feedbacks.map((feedback) => (
            <FeedbackCard
              key={feedback.feedbackId}
              feedback={feedback}
              status="approved"
            />
          ))}
        </div>

        {feedbacks.length === 0 && (
          <p className="text-gray-600 text-body-r text-center py-8">
            아직 작성한 평가가 없습니다
          </p>
        )}
      </div>
    </div>
  );
}
