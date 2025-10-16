"use client";

import { ArrowLeft, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { CustomButton } from "@/components/ui/custom-button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useState } from "react";

interface SurveyLayoutProps {
  title: string;
  subtitle?: string;
  currentStep: number;
  totalSteps: number;
  onNext: () => void;
  onBack?: () => void;
  buttonText?: string;
  buttonDisabled?: boolean;
  children: React.ReactNode;
}

export function SurveyLayout({
  title,
  subtitle,
  currentStep,
  totalSteps,
  onNext,
  onBack,
  buttonText = "다음",
  buttonDisabled = false,
  children,
}: SurveyLayoutProps) {
  const router = useRouter();
  const [showCancelDialog, setShowCancelDialog] = useState(false);

  const handleBack = () => {
    if (currentStep === 0) {
      // 첫 번째 단계에서는 취소 확인
      setShowCancelDialog(true);
    } else if (onBack) {
      onBack();
    }
  };

  const handleClose = () => {
    setShowCancelDialog(true);
  };

  const handleCancelConfirm = () => {
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

      {/* Title Section */}
      <div className="px-4 py-6">
        <h1 className="text-[#8c4ed9] text-title-2 mb-2 text-center">{title}</h1>
        {subtitle && (
          <p className="text-[#343a40] text-body-r text-center">{subtitle}</p>
        )}
      </div>


      {/* Content */}
      <div className="flex-1">{children}</div>

      {/* Bottom Button */}
      <div className="px-4 pb-8 pt-4">
        <CustomButton onClick={onNext} disabled={buttonDisabled}>
          {buttonText}
        </CustomButton>
      </div>

      {/* Cancel Dialog */}
      <AlertDialog open={showCancelDialog} onOpenChange={setShowCancelDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>설문을 취소하시겠습니까?</AlertDialogTitle>
            <AlertDialogDescription>
              저장된 내용은 유지됩니다. 나중에 이어서 진행할 수 있습니다.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>계속하기</AlertDialogCancel>
            <AlertDialogAction onClick={handleCancelConfirm}>
              취소하기
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
