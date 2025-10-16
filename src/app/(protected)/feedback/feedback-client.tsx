"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useSurveyStore } from "@/stores/survey.store";
import { SurveyLayout } from "@/components/survey/SurveyLayout";
import { SurveySlider } from "@/components/survey/SurveySlider";
import { SurveyRadio } from "@/components/survey/SurveyRadio";
import { surveySteps, satisfactionOptions } from "./questions";
import { feedbackApi } from "@/lib/api/customer/feedback";
import { photoApi } from "@/lib/api/customer/photo";
import { getTasteProfile } from "@/lib/api/customer/profile";
import type { CustomerTasteDto } from "@/lib/types/customer";
import { toast } from "sonner";
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
import Image from "next/image";

export function FeedbackClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [showResumeDialog, setShowResumeDialog] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [tasteProfile, setTasteProfile] = useState<CustomerTasteDto | null>(null);
  const [checkboxStates, setCheckboxStates] = useState<Record<number, boolean>>({});

  const storeIdParam = searchParams.get("storeId");
  const foodItemIdParam = searchParams.get("foodItemId");

  const {
    storeId: savedStoreId,
    foodItemId: savedFoodItemId,
    currentStep,
    answers,
    photoFiles,
    textFeedback,
    satisfaction,
    initialize,
    saveAnswer,
    nextStep,
    prevStep,
    setTextFeedback,
    setSatisfaction,
    setPhotos,
    reset,
  } = useSurveyStore();

  // Taste 프로필 로드
  useEffect(() => {
    const loadTasteProfile = async () => {
      try {
        const profile = await getTasteProfile();
        console.log("🔍 [Feedback] Taste 프로필 로드:", profile);
        setTasteProfile(profile);
      } catch {
        console.log("⚠️ [Feedback] Taste 프로필 없음, 기본값 사용");
        // 프로필이 없으면 기본값
        setTasteProfile({
          spicyLevel: 2,
          mealAmount: 2,
          mealSpending: 2,
        });
      }
    };

    loadTasteProfile();
  }, []);

  useEffect(() => {
    // URL 파라미터가 있으면 사용, 없으면 더미 데이터로 초기화 (개발/테스트용)
    const storeId = storeIdParam ? parseInt(storeIdParam) : 1;
    const foodItemId = foodItemIdParam ? parseInt(foodItemIdParam) : 1;

    // 진행 중인 설문 확인
    if (
      savedStoreId === storeId &&
      savedFoodItemId === foodItemId &&
      currentStep > 0
    ) {
      // 같은 메뉴의 진행 중인 설문 발견
      setShowResumeDialog(true);
    } else if (
      savedStoreId &&
      (savedStoreId !== storeId || savedFoodItemId !== foodItemId)
    ) {
      // 다른 메뉴의 설문이면 초기화
      reset();
      initialize(storeId, foodItemId);
    } else if (!savedStoreId) {
      // 새로운 설문 시작
      initialize(storeId, foodItemId);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [storeIdParam, foodItemIdParam]);

  const handleResume = () => {
    setShowResumeDialog(false);
  };

  const handleRestart = () => {
    setShowResumeDialog(false);
    if (storeIdParam && foodItemIdParam) {
      reset();
      initialize(parseInt(storeIdParam), parseInt(foodItemIdParam));
    }
  };

  // Taste 프로필 기반 동적 surveySteps 생성
  const getDynamicSurveySteps = () => {
    if (!tasteProfile) return surveySteps;

    // mealAmount 텍스트 변환
    const mealAmountText =
      tasteProfile.mealAmount === 1 ? "0.5인분" :
      tasteProfile.mealAmount === 3 ? "1.5인분" :
      "1인분";

    // mealSpending 텍스트 변환
    const mealSpendingText =
      tasteProfile.mealSpending === 1 ? "만원 이하" :
      tasteProfile.mealSpending === 3 ? "2만원 이상" :
      "만원~2만원";

    return surveySteps.map((step) => {
      if (step.stepId === 0) {
        return { ...step, subtitle: "확인이 어렵다면 왼쪽 체크박스를 눌러주세요." };
      }
      if (step.stepId === 1) {
        return { ...step, subtitle: `나의 평소 식사량 : ${mealAmountText}` };
      }
      if (step.stepId === 2) {
        return { ...step, subtitle: `나의 평소 예산 : ${mealSpendingText}` };
      }
      return step;
    });
  };

  const handleNext = async () => {
    if (currentStep === 4) {
      // 마지막 단계 - 제출
      await handleSubmit();
    } else {
      // 현재 단계의 모든 질문에 대해 기본값(50) 저장 (답변하지 않은 경우)
      // null 값은 "확인이 어렵다면" 체크박스가 선택된 경우이므로 보존
      const dynamicSteps = getDynamicSurveySteps();
      const currentStepQuestions = dynamicSteps[currentStep].questions;

      currentStepQuestions.forEach((question) => {
        if (answers[question.id] === undefined) {
          console.log(`🔍 [Feedback] Question ${question.id} 기본값 50 저장`);
          saveAnswer(question.id, 50);
        }
      });

      nextStep();
    }
  };

  const handleSubmit = async () => {
    if (!savedStoreId || !savedFoodItemId) {
      toast.error("설문 정보가 올바르지 않습니다.");
      return;
    }

    try {
      setSubmitting(true);

      // 1. 사진 파일들을 S3에 업로드
      const uploadedPhotoUrls: string[] = [];
      if (photoFiles && photoFiles.length > 0) {
        toast.info("사진 업로드 중...");
        for (const file of photoFiles) {
          try {
            const uploadedUrl = await photoApi.uploadImage(file);
            uploadedPhotoUrls.push(uploadedUrl);
          } catch (uploadError) {
            console.error("Photo upload failed:", uploadError);
            toast.error("사진 업로드에 실패했습니다.");
            return;
          }
        }
        // 업로드된 URL들을 Store에 저장
        setPhotos(uploadedPhotoUrls);
      }

      // 2. 답변 데이터 변환
      console.log("🔍 [Feedback] 저장된 answers:", answers);

      // null 값은 제외 (체크박스 선택 시 "확인 어려움"은 전송하지 않음)
      const surveyAnswers: Array<{
        questionId: number;
        answerText?: string;
        numericValue?: number;
      }> = Object.entries(answers)
        .filter(([, value]) => value !== null)
        .map(([questionId, value]) => ({
          questionId: parseInt(questionId),
          numericValue: value as number,
        }));

      console.log("🔍 [Feedback] 변환된 surveyAnswers (1-8번):", surveyAnswers);

      // 텍스트 피드백 추가 (question ID 9)
      if (textFeedback) {
        surveyAnswers.push({
          questionId: 9,
          answerText: textFeedback,
        });
      }

      // 만족도 추가 (question ID 10)
      if (satisfaction) {
        surveyAnswers.push({
          questionId: 10,
          answerText: satisfaction,
        });
      }

      // 3. 피드백 제출
      await feedbackApi.createFeedback({
        storeId: savedStoreId,
        foodItemId: savedFoodItemId,
        surveyAnswers,
        photoUrls: uploadedPhotoUrls,
      });

      toast.success("피드백이 제출되었습니다!");

      // 완료 페이지로 이동
      router.push("/feedback/complete");
    } catch (error) {
      console.error("Failed to submit feedback:", error);
      toast.error("피드백 제출에 실패했습니다.");
    } finally {
      setSubmitting(false);
    }
  };

  const renderStepContent = () => {
    const dynamicSteps = getDynamicSurveySteps();
    const step = dynamicSteps[currentStep];

    if (currentStep === 4) {
      // Step 4: 마지막 한마디
      return (
        <div>
          {/* 메뉴 정보 카드 */}
          <div className="bg-gray-100 rounded-xl p-4 mb-6">
            <Image
              src="/store.png"
              alt="Menu"
              width={335}
              height={186}
              className="w-full h-auto rounded-lg mb-3"
            />
            <h3 className="text-gray-800 text-headline-b mb-1">메뉴 설명</h3>
            <p className="text-gray-700 text-body-r">메뉴 설명</p>
          </div>

          {/* 사장님께 한마디 */}
          <div className="mb-6">
            <h3 className="text-gray-800 text-headline-b mb-4">
              사장님께 딱 한 가지 이야기할 수 있다면,
              <br />
              어떤 말을 해주고 싶나요?
            </h3>
            <div className="relative">
              <textarea
                value={textFeedback}
                onChange={(e) => setTextFeedback(e.target.value)}
                placeholder="따뜻한 조언의 말 남기기"
                className="w-full min-h-[120px] p-4 bg-gray-100 rounded-xl text-body-r resize-none border-none focus:outline-none focus:ring-2 focus:ring-purple-700"
              />
              <div className="absolute bottom-3 right-3 text-sub-body-r text-gray-600">
                {textFeedback.length}/20
              </div>
            </div>
          </div>

          {/* 만족도 */}
          <div>
            <h3 className="text-gray-800 text-headline-b mb-4">
              🙋 오늘 식사 경험에 얼마나 만족하시나요?
            </h3>
            <SurveyRadio
              question=""
              options={satisfactionOptions}
              value={satisfaction}
              onChange={setSatisfaction}
            />
          </div>
        </div>
      );
    }

    // Step 0-3: 슬라이더 질문들
    return (
      <div className="px-4">
        {step.questions.map((question) => (
          <SurveySlider
            key={question.id}
            question={question.questionText}
            labels={question.labels!}
            value={answers[question.id] ?? null}
            onChange={(value) => {
              console.log(`🔍 [Feedback] Question ${question.id} 답변 저장:`, value);
              saveAnswer(question.id, value);
            }}
            min={0}
            max={100}
            showCheckbox={currentStep === 0}
            isChecked={checkboxStates[question.id] || false}
            onCheckboxChange={(checked) => {
              setCheckboxStates((prev) => ({
                ...prev,
                [question.id]: checked,
              }));
            }}
          />
        ))}
      </div>
    );
  };

  const dynamicSteps = getDynamicSurveySteps();
  const currentStepData = dynamicSteps[currentStep];
  const isLastStep = currentStep === 4;
  const canProceed = isLastStep
    ? satisfaction !== "" && textFeedback.length >= 20
    : true;

  return (
    <>
      <SurveyLayout
        title={currentStepData.title}
        subtitle={currentStepData.subtitle}
        currentStep={currentStep}
        totalSteps={5}
        onNext={handleNext}
        onBack={currentStep > 0 ? prevStep : undefined}
        buttonText={isLastStep ? "제출하기" : "다음"}
        buttonDisabled={submitting || !canProceed}
      >
        {renderStepContent()}
      </SurveyLayout>

      {/* Resume Dialog */}
      <AlertDialog open={showResumeDialog} onOpenChange={setShowResumeDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>진행 중인 설문이 있습니다</AlertDialogTitle>
            <AlertDialogDescription>
              이전에 작성하던 설문을 이어서 진행하시겠습니까?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={handleRestart}>
              처음부터
            </AlertDialogCancel>
            <AlertDialogAction onClick={handleResume}>
              이어서 하기
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
