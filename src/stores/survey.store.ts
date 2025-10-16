import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

interface SurveyState {
  // 상태
  storeId: number | null;
  foodItemId: number | null;
  currentStep: number; // 0-5 (0: 맛평가, 1: 양평가, 2: 가격평가, 3: 추천도평가, 4: 한마디)
  answers: Record<number, number | null>; // questionId -> value (null = 확인이 어려움)
  photos: string[]; // 업로드된 URL들 (최종 제출용)
  photoFiles: File[]; // 로컬 파일 객체들 (업로드 전)
  textFeedback: string;
  satisfaction: string; // 만족도 (매우만족, 만족, 보통, 불만족, 매우불만족)

  // 액션
  initialize: (storeId: number, foodItemId: number) => void;
  saveAnswer: (questionId: number, value: number | null) => void;
  nextStep: () => void;
  prevStep: () => void;
  setPhotos: (urls: string[]) => void;
  setPhotoFiles: (files: File[]) => void;
  setTextFeedback: (text: string) => void;
  setSatisfaction: (satisfaction: string) => void;
  reset: () => void;
}

export const useSurveyStore = create<SurveyState>()(
  persist(
    (set) => ({
      // 초기 상태
      storeId: null,
      foodItemId: null,
      currentStep: 0,
      answers: {},
      photos: [],
      photoFiles: [],
      textFeedback: "",
      satisfaction: "",

      // 설문 시작 시 초기화
      initialize: (storeId, foodItemId) => {
        set((state) => {
          // 같은 설문이면 기존 데이터 유지
          if (state.storeId === storeId && state.foodItemId === foodItemId) {
            return { storeId, foodItemId };
          }
          // 다른 설문이면 초기화
          return {
            storeId,
            foodItemId,
            currentStep: 0,
            answers: {},
            photos: [],
            photoFiles: [],
            textFeedback: "",
            satisfaction: "",
          };
        });
      },

      // 답변 저장
      saveAnswer: (questionId, value) => {
        set((state) => ({
          answers: { ...state.answers, [questionId]: value },
        }));
      },

      // 다음 단계
      nextStep: () => {
        set((state) => ({
          currentStep: Math.min(4, state.currentStep + 1),
        }));
      },

      // 이전 단계
      prevStep: () => {
        set((state) => ({
          currentStep: Math.max(0, state.currentStep - 1),
        }));
      },

      // 사진 저장 (업로드된 URL)
      setPhotos: (urls) => {
        set({ photos: urls });
      },

      // 사진 파일 저장 (로컬 File 객체)
      setPhotoFiles: (files) => {
        set({ photoFiles: files });
      },

      // 텍스트 피드백 저장
      setTextFeedback: (text) => {
        set({ textFeedback: text });
      },

      // 만족도 저장
      setSatisfaction: (satisfaction) => {
        set({ satisfaction });
      },

      // 제출 완료 시 초기화
      reset: () => {
        set({
          storeId: null,
          foodItemId: null,
          currentStep: 0,
          answers: {},
          photos: [],
          photoFiles: [],
          textFeedback: "",
          satisfaction: "",
        });
      },
    }),
    {
      name: "chefriend-survey-storage", // LocalStorage 키
      storage: createJSONStorage(() => localStorage),
    }
  )
);
