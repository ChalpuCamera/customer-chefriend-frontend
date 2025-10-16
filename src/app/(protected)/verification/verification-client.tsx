"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowLeft, X } from "lucide-react";
import { CustomButton } from "@/components/ui/custom-button";
import { ImageUpload } from "@/components/survey/ImageUpload";
import { useSurveyStore } from "@/stores/survey.store";

export function VerificationClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const storeId = searchParams.get("storeId") || "1";
  const foodItemId = searchParams.get("foodItemId") || "1";

  const handleFileSelect = (file: File) => {
    setSelectedFile(file);
    // Store에 파일 저장 (업로드는 나중에)
    useSurveyStore.getState().setPhotoFiles([file]);
  };

  const handleNext = () => {
    // Survey Store 초기화
    useSurveyStore.getState().initialize(
      parseInt(storeId),
      parseInt(foodItemId)
    );

    // 설문 페이지로 이동
    router.push(`/feedback?storeId=${storeId}&foodItemId=${foodItemId}`);
  };

  const handleBack = () => {
    router.back();
  };

  const handleClose = () => {
    router.push("/home");
  };

  return (
    <div className="bg-white w-full mx-auto min-h-screen flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between px-4 h-11">
        <button onClick={handleBack} className="p-2 -ml-2">
          <ArrowLeft size={24} className="text-gray-800" />
        </button>
        <button onClick={handleClose} className="p-2 -mr-2">
          <X size={24} className="text-gray-800" />
        </button>
      </div>

      {/* Title */}
      <div className="px-4 py-6">
        <h1 className="text-gray-800 text-headline-m mb-2">
          주문을 인증해 주세요
        </h1>
        <p className="text-gray-700 text-body-r">
          정직한 평가를 위해 실제 주문을 확인해요.
        </p>
      </div>

      {/* Content */}
      <div className="flex-1 px-4">
        <ImageUpload onFileSelect={handleFileSelect} />
      </div>

      {/* Bottom Button */}
      <div className="px-4 pb-8 pt-6">
        <CustomButton onClick={handleNext} disabled={!selectedFile}>
          다음
        </CustomButton>
      </div>
    </div>
  );
}
