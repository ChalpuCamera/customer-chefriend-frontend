"use client";

import { RewardResponse } from "@/lib/types/customer";
import Image from "next/image";

interface RewardCardProps {
  reward: RewardResponse;
  onRedeem?: () => void;
  disabled?: boolean;
}

export function RewardCard({ reward, onRedeem, disabled }: RewardCardProps) {
  return (
    <div className="flex flex-col items-center">
      {/* Image Container */}
      <div className="w-[164px] h-[164px] bg-gray-200 rounded-lg flex items-center justify-center mb-3">
        {reward.imageUrl ? (
          <Image
            src={reward.imageUrl}
            alt={reward.rewardName}
            width={164}
            height={164}
            className="object-contain"
          />
        ) : (
          <div className="w-[120px] h-[120px] bg-gray-300 rounded" />
        )}
      </div>

      {/* Reward Name */}
      <p className="text-gray-800 text-body-r text-center mb-1">
        {reward.rewardName}
      </p>

      {/* Required Points */}
      <button
        onClick={onRedeem}
        disabled={disabled}
        className="text-purple-700 text-body-sb disabled:text-gray-500"
      >
        {reward.requiredFeedbackCount.toLocaleString()} 포인트
      </button>
    </div>
  );
}
