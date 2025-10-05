"use client";

import React, { useState, useEffect } from "react";
import { Search, ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Input } from "@/components/ui/input";
import { useAuthStore } from "@/stores/auth.store";
import type { StoreResponse } from "@/lib/types/customer";

interface HomeClientProps {
  initialStores: StoreResponse[];
}

export function HomeClient({ initialStores }: HomeClientProps) {
  const router = useRouter();
  const [userName, setUserName] = useState("맛평단1");
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Hydration-safe user name loading
  useEffect(() => {
    const user = useAuthStore.getState().user;
    if (user?.name) {
      setUserName(user.name);
      setIsLoggedIn(true);
    } else {
      setIsLoggedIn(false);
    }
  }, []);

  const mockUserData = {
    name: userName,
    points: 6000, // TODO: API에서 포인트 정보 제공 필요
  };

  const mockOngoingSurvey = false;

  const handleSettings = () => {
    router.push("/mypage");
  };

  const handleStoreClick = (storeId: number) => {
    router.push(`/store/${storeId}`);
  };

  const handleSurveyClick = () => {
    router.push("/feedback");
  };

  return (
    <div className="bg-white w-full mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between px-4 h-11">
        <Image src="/logo_small.png" alt="Logo" width={88} height={27} />
        <button className="" onClick={handleSettings}>
          <Image src="/setting_icon.png" alt="setting" width={20} height={20} />
        </button>
      </div>

      {/* User Greeting */}
      <div className="px-4 py-4">
        {isLoggedIn ? (
          <div className="flex items-center justify-between">
            <h1 className="text-gray-800 text-body-sb">
              반가워요, {mockUserData.name}님
            </h1>
            <div className="flex items-center text-body-sb gap-1">
              <span className="text-gray-900">P</span>
              <span className="text-purple-600">
                {mockUserData.points.toLocaleString()}
              </span>
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-between">
            <h1 className="text-gray-800 text-body-sb">
              로그인 후 이용하세요
            </h1>
            <button
              onClick={() => router.push("/login")}
              className="px-4 py-2 bg-purple-700 text-white text-body-sb rounded-lg hover:bg-purple-800 transition-colors"
            >
              로그인
            </button>
          </div>
        )}
      </div>

      {/* Search Bar */}
      <div className="px-4 p-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
          <Input
            type="text"
            placeholder="메뉴, 가게 이름 검색"
            className="w-full pl-10 pr-4 py-3 border border-gray-500 rounded-xl h-11"
          />
        </div>
      </div>

      {/* Ongoing Survey Alert */}
      {mockOngoingSurvey && (
        <div className="p-4">
          <div
            className="bg-white flex items-center justify-between"
            onClick={handleSurveyClick}
          >
            <div className="flex items-center gap-3">
              <div className="w-14 h-14 flex items-center justify-center">
                <Image
                  src="/review_icon.png"
                  alt="Survey"
                  width={40}
                  height={40}
                />
              </div>
              <div className="flex flex-col gap-0.5">
                <p className="text-gray-800 text-headline-b">
                  작성 중이던 맛 평가가 있어요
                </p>
                <p className="text-gray-700 text-sub-body-r">
                  이어서 진행하고 리워드 받기
                </p>
              </div>
            </div>
            <div className="w-7.5 h-7.5 bg-purple-700 rounded-full flex items-center justify-center">
              <ArrowRight className=" text-white"/>
            </div>
          </div>
        </div>
      )}

      {/* Store List */}
      <div>
        <div className="px-4 pb-3">
          <div className="flex items-center gap-2">
            <h2 className="text-gray-800 text-headline-b">{initialStores[0]?.address || ""} 맛평 리스트</h2>
            <span className="text-purple-700 text-body-sb">{500}P 지급</span>
          </div>
        </div>

        {/* Store Items */}
        <div className="space-y-0">
          {initialStores.map((store) => (
            <div
              key={store.storeId}
              className="p-4 flex items-center justify-between h-26"
              onClick={() => handleStoreClick(store.storeId)}
            >
              <div className="flex items-center gap-4">
                <Image
                  src="/kimchi.png"
                  alt={store.storeName}
                  width={72}
                  height={72}
                  className="rounded-full object-cover w-18 h-18"
                />
                <div>
                  <h3 className="text-gray-800 text-headline-b">
                    {store.storeName}
                  </h3>
                  <p className="text-gray-700 text-sub-body-r mt-1">
                    맛평 가능 메뉴 {0}개
                  </p>
                </div>
              </div>
              <div className="text-center flex flex-col gap-0.5">
                <p className="text-purple-700 text-body-sb">
                  {0}
                </p>
                <p className="text-gray-800 text-sub-body-r">맛평수</p>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
