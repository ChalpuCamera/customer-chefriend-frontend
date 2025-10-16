export interface SurveyQuestion {
  id: number;
  questionText: string;
  labels?: {
    start: string;
    middle: string;
    end: string;
  };
}

export interface SurveyStep {
  stepId: number;
  title: string;
  subtitle?: string;
  questions: SurveyQuestion[];
}

// 설문 단계 정의
export const surveySteps: SurveyStep[] = [
  // Step 0: 맛 평가
  {
    stepId: 0,
    title: "맛 평가",
    subtitle: "확인이 어렵다면 왼쪽 체크박스를 눌러주세요.",
    questions: [
      {
        id: 1, // SPICINESS
        questionText: "음식의 맵기는 어떠셨나요?",
        labels: {
          start: "매운맛 부족",
          middle: "적당",
          end: "너무 매움",
        },
      },
      {
        id: 3, // SALTINESS
        questionText: "음식의 간은 어떠셨나요?",
        labels: {
          start: "싱거움",
          middle: "적당",
          end: "너무 짬",
        },
      },
      {
        id: 2, // SWEETNESS
        questionText: "음식의 달기는 어떠셨나요?",
        labels: {
          start: "단맛 부족",
          middle: "적당",
          end: "너무 달음",
        },
      },
      {
        id: 4, // SOURNESS
        questionText: "음식의 신맛은 어떠셨나요?",
        labels: {
          start: "신맛 부족",
          middle: "적당",
          end: "너무 시큼",
        },
      },
    ],
  },
  // Step 1: 음식 양 평가
  {
    stepId: 1,
    title: "음식 양 평가",
    subtitle: "나의 평소 식사량 : 2인분",
    questions: [
      {
        id: 5,
        questionText: "오늘 음식의 양은 어떠셨나요?",
        labels: {
          start: "훨씬 적음",
          middle: "적당",
          end: "훨씬 많았음",
        },
      },
    ],
  },
  // Step 2: 가격 평가
  {
    stepId: 2,
    title: "가격 평가",
    subtitle: "나의 평소 예산 : 1만원",
    questions: [
      {
        id: 6,
        questionText: "오늘 음식의 가격은 어떻게 느끼셨나요?",
        labels: {
          start: "훨씬 저렴",
          middle: "적당",
          end: "훨씬 비쌈",
        },
      },
    ],
  },
  // Step 3: 추천도 평가
  {
    stepId: 3,
    title: "추천도 평가",
    subtitle: "항상 긍정적인 답변보다 솔직한 답변이 더 좋아요.",
    questions: [
      {
        id: 7,
        questionText:
          "이 음식을 다른 사람에게 추천할 의향이 얼마나 있으신가요?",
        labels: {
          start: "추천안함",
          middle: "보통(5점)",
          end: "적극추천",
        },
      },
      {
        id: 8,
        questionText:
          "이 가게에서 메뉴를 다시 주문할 의향이 얼마나 있으신가요?",
        labels: {
          start: "주문안함",
          middle: "보통(5점)",
          end: "무조건 재주문",
        },
      },
    ],
  },
  // Step 4: 마지막 한마디 (텍스트 + 만족도)
  {
    stepId: 4,
    title: "마지막 한마디",
    subtitle: "사장님에게 소중한 조언을 전달해보세요.",
    questions: [],
  },
];

// 만족도 옵션 (Step 4에서 사용)
export const satisfactionOptions = [
  { value: "very_satisfied", label: "매우 만족" },
  { value: "satisfied", label: "만족" },
  { value: "neutral", label: "보통" },
  { value: "dissatisfied", label: "불만족" },
  { value: "very_dissatisfied", label: "매우 불만족" },
];
