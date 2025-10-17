"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { feedbackApi } from "@/lib/api/customer/feedback";
import { FeedbackCard } from "@/components/feedback/FeedbackCard";
import type { CustomerFeedbackResponse } from "@/lib/types/customer";

export default function Page() {
  const router = useRouter();
  const [pendingFeedbacks, setPendingFeedbacks] = useState<CustomerFeedbackResponse[]>([]);
  const [approvedFeedbacks, setApprovedFeedbacks] = useState<CustomerFeedbackResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);

  // 초기 데이터 로드
  useEffect(() => {
    const loadInitialData = async () => {
      try {
        // 전체 피드백 로드 (첫 페이지)
        const response = await feedbackApi.getMyFeedbacks({ page: 0, size: 20 });
        const allFeedbacks = response.result.content;

        // 승인 대기 vs 승인 완료 분리
        // TODO: 실제 API에서 status 필드가 있으면 사용, 없으면 모두 approved로 처리
        const pending = allFeedbacks.filter((f: CustomerFeedbackResponse & { status?: string }) =>
          f.status === "PENDING"
        );
        const approved = allFeedbacks.filter((f: CustomerFeedbackResponse & { status?: string }) =>
          f.status !== "PENDING"
        );

        setPendingFeedbacks(pending);
        setApprovedFeedbacks(approved);
        setHasMore(response.result.hasNext);
        setCurrentPage(0);
      } catch (error) {
        console.error("Failed to load feedback history:", error);
      } finally {
        setLoading(false);
      }
    };

    loadInitialData();
  }, []);

  // 더보기 로드
  const loadMore = async () => {
    if (loadingMore || !hasMore) return;

    try {
      setLoadingMore(true);
      const nextPage = currentPage + 1;
      const response = await feedbackApi.getMyFeedbacks({ page: nextPage, size: 20 });
      const moreFeedbacks = response.result.content;

      // 승인 완료된 피드백만 추가 (대기 중인 건은 이미 위에 표시됨)
      const moreApproved = moreFeedbacks.filter((f: CustomerFeedbackResponse & { status?: string }) =>
        f.status !== "PENDING"
      );

      setApprovedFeedbacks((prev) => [...prev, ...moreApproved]);
      setHasMore(response.result.hasNext);
      setCurrentPage(nextPage);
    } catch (error) {
      console.error("Failed to load more feedbacks:", error);
    } finally {
      setLoadingMore(false);
    }
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

      {/* Pending Section */}
      {pendingFeedbacks.length > 0 && (
        <div className="mb-8">
          <h2 className="px-4 text-gray-800 text-headline-b mb-4">승인 대기 중</h2>
          <div className="divide-y divide-gray-200">
            {pendingFeedbacks.map((feedback) => (
              <FeedbackCard
                key={feedback.feedbackId}
                feedback={feedback}
                status="pending"
              />
            ))}
          </div>
        </div>
      )}

      {/* Approved Section */}
      <div>
        <h2 className="px-4 text-gray-800 text-headline-b mb-4">승인 완료</h2>
        <div className="divide-y divide-gray-200">
          {approvedFeedbacks.map((feedback) => (
            <FeedbackCard
              key={feedback.feedbackId}
              feedback={feedback}
              status="approved"
            />
          ))}
        </div>

        {approvedFeedbacks.length === 0 && pendingFeedbacks.length === 0 && (
          <p className="text-gray-600 text-body-r text-center py-8">
            아직 작성한 평가가 없습니다
          </p>
        )}

        {/* Load More Button */}
        {hasMore && (
          <div className="px-4 py-6">
            <button
              onClick={loadMore}
              disabled={loadingMore}
              className="w-full bg-gray-100 text-gray-800 text-body-sb py-3 rounded-lg disabled:opacity-50"
            >
              {loadingMore ? "로딩 중..." : "더보기"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
