"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function SplashPage() {
  const router = useRouter();

  useEffect(() => {
    // 2초 후 홈 페이지로 자동 이동
    const timer = setTimeout(() => {
      router.push("/home");
    }, 2000);

    return () => clearTimeout(timer);
  }, [router]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white">
      <div className="flex flex-col items-center space-y-6">
        {/* Chefriend 로고 (보라색 요리사 모자) */}
        <Image
          src="/chefriend_logo.png"
          alt="Chefriend"
          width={206}
          height={61}
          priority
        />
        {/* 서브 텍스트 */}
        <p className="text-body-r text-[#8B8B8B]">
          사장님의 비밀 친구 셰프렌드
        </p>
      </div>
    </div>
  );
}
