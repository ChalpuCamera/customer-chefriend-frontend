"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle } from "lucide-react";
import { useSurveyStore } from "@/stores/survey.store";
import Image from "next/image";

export default function Page() {
  const router = useRouter();
  const reset = useSurveyStore((state) => state.reset);

  useEffect(() => {
    // Store 초기화
    reset();

    // 3초 후 홈으로 이동
    const timer = setTimeout(() => {
      router.push("/home");
    }, 3000);

    return () => clearTimeout(timer);
  }, [reset, router]);

  return (
    <div className="bg-white w-full mx-auto min-h-screen flex flex-col items-center justify-center px-4">
      {/* 완료 아이콘 */}
      <div className="mb-8">
        <div className="w-24 h-24 bg-purple-100 rounded-full flex items-center justify-center">
          <CheckCircle size={64} className="text-purple-700" />
        </div>
      </div>

      {/* 타이틀 */}
      <h1 className="text-gray-800 text-title-2 mb-4 text-center">
        맛 평가 제출 완료
      </h1>

      {/* 설명 */}
      <p className="text-gray-700 text-body-r text-center mb-12 whitespace-pre-line">
        평가해 주셔서 감사합니다.
        <br />
        진솔한 평가가 가게 운영에 큰 도움이 됩니다.
      </p>

      {/* Chefriend 로고 */}
      <div className="text-center">
        <div className="w-20 h-20 mx-auto mb-3">
          <Image
            src="/logo_small.png"
            alt="Chefriend"
            width={80}
            height={80}
            className="object-contain"
          />
        </div>
        <p className="text-gray-600 text-sub-body-r">
          사장님의 비밀 친구 셰프렌드
        </p>
      </div>
    </div>
  );
}
