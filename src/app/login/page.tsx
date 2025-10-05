"use client";

import Image from "next/image";

const initiateKakaoLogin = () => {
  window.location.href = `${process.env.NEXT_PUBLIC_API_URL}/api/oauth2/authorization/kakao/customer`;
};

export default function LoginPage() {
  return (
    <div className="min-h-screen mx-auto flex flex-col items-center justify-center p-5">
      <div className="w-full max-w-md space-y-10">
        {/* 헤더 */}
        <div className="flex flex-col items-center space-y-4">
          <Image src="/chefriend_logo.png" alt="Logo" width={206} height={61} />
          <p className="text-body-r text-[#595959]">
          여러분의 솔직한 평가가 가게를 살립니다.
          </p>
        </div>

        {/* 홍보 소개 이미지 */}
        <div className="flex justify-center">
          <Image
            className="w-full h-auto"
            src="/mock.png"
            alt="Promotion"
            width={343}
            height={256}
          />
        </div>

        {/* 로그인 버튼 */}
        <div className="flex flex-col gap-4">
          <button
            className="flex items-center justify-center gap-2 rounded-[12px] text-headline-b w-full h-14 bg-[#FFE812] text-[#3C1E1C]"
            onClick={initiateKakaoLogin}
          >
            <Image src="/kakao_icon.png" alt="Kakao" width={24} height={24} />
            카카오로 계속하기
          </button>
          {/* 고객지원 */}
          <div
            className="text-center text-body-r text-[#595959] cursor-pointer"
            onClick={() =>
              window.open("https://app.chefriend.kr")
            }
          >
            👨‍🌾 사장님으로 입장하기
          </div>
        </div>
      </div>
    </div>
  );
}
