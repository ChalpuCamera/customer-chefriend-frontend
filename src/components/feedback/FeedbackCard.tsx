"use client";

import { CustomerFeedbackResponse } from "@/lib/types/customer";
import Image from "next/image";

interface FeedbackCardProps {
  feedback: CustomerFeedbackResponse;
  status?: "pending" | "approved";
}

export function FeedbackCard({ feedback, status = "approved" }: FeedbackCardProps) {
  // 날짜 포맷팅 (YYYY년 MM월 DD일)
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    return `${year}년 ${month}월 ${day}일`;
  };

  // 텍스트 피드백 찾기 (questionId 9)
  const textFeedback = feedback.surveyAnswers.find(
    (answer) => answer.questionId === 9
  )?.answerText || "";

  // 이미지 URL (첫 번째 사진 사용, 없으면 기본 이미지)
  const imageUrl = feedback.photoUrls?.[0] || "/placeholder.png";

  return (
    <div className="px-4 py-5">
      <div className="flex flex-col gap-5">
        {/* Top Section: Image, Food Name, Date, Status Badge */}
        <div className="relative">
          <div className="flex gap-2">
            {/* Food Image */}
            <div className="relative w-10 h-10 shrink-0 mt-1">
              <Image
                src={imageUrl}
                alt={feedback.foodName}
                fill
                className="object-cover rounded"
              />
            </div>

            {/* Food Name and Date */}
            <div className="flex-1">
              <p className="text-gray-700 text-body-sb">{feedback.foodName}</p>
              <p className="text-gray-700 text-sub-body-r mt-0.5">
                {formatDate(feedback.createdAt)}
              </p>
            </div>

            {/* Status Badge */}
            <div
              className={`self-start mt-[7px] px-3 py-0.5 rounded-[20px] ${
                status === "pending"
                  ? "bg-gray-300"
                  : "bg-gray-300"
              }`}
            >
              <p
                className={`text-sub-body-sb ${
                  status === "pending" ? "text-gray-600" : "text-white"
                }`}
              >
                {status === "pending" ? "승인 대기" : "지급 완료"}
              </p>
            </div>
          </div>
        </div>

        {/* Text Feedback - 3줄 말줄임 */}
        <div className="w-full">
          <p className="text-gray-700 text-body-r line-clamp-3">
            {textFeedback}
          </p>
        </div>
      </div>
    </div>
  );
}
