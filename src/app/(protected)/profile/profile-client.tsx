"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { CustomButton } from "@/components/ui/custom-button";
import { getTasteProfile, updateTasteProfile } from "@/lib/api/customer/profile";
import { toast } from "sonner";
import Image from "next/image";

interface ProfileClientProps {
  showBackButton?: boolean;
}

export function ProfileClient({ showBackButton = false }: ProfileClientProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [spicyLevel, setSpicyLevel] = useState<string>("2");
  const [portionSize, setPortionSize] = useState<string>("2");
  const [priceRange, setPriceRange] = useState<string>("2");

  useEffect(() => {
    // 기존 프로필 불러오기
    const loadProfile = async () => {
      try {
        const profile = await getTasteProfile();
        console.log("🔍 [Profile] 불러온 프로필:", profile);
        setSpicyLevel(profile.spicyLevel.toString());
        setPortionSize(profile.mealAmount.toString());
        setPriceRange(profile.mealSpending.toString());
      } catch {
        // 프로필이 없으면 기본값 사용
        console.log("No existing profile, using defaults");
      }
    };

    loadProfile();
  }, []);

  const handleSubmit = async () => {
    try {
      setLoading(true);

      const profileData = {
        spicyLevel: parseInt(spicyLevel),
        mealAmount: parseInt(portionSize),
        mealSpending: parseInt(priceRange),
      };

      console.log("🔍 [Profile] 저장 요청 데이터:", profileData);
      console.log("🔍 [Profile] 원본 값:", { spicyLevel, portionSize, priceRange });

      const result = await updateTasteProfile(profileData);

      console.log("✅ [Profile] 저장 성공 응답:", result);
      toast.success("입맛 프로필이 저장되었습니다.");
      router.push("/home");
    } catch (error) {
      console.error("❌ [Profile] 저장 실패:", error);
      toast.error("입맛 프로필 저장에 실패했습니다.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white w-full mx-auto min-h-screen flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between px-4 h-11">
        {showBackButton ? (
          <button onClick={() => router.back()} className="p-2 -ml-2">
            <ArrowLeft size={24} className="text-gray-800" />
          </button>
        ) : (
          <div />
        )}
      </div>

      {/* Title */}
      <div className="px-4 py-6">
        <h1 className="text-gray-800 text-headline-m mb-2">
          평소 식사 스타일을 알려주세요
        </h1>
        <p className="text-gray-700 text-body-r">
          평가할 때 참고용으로 사용돼요.
        </p>
      </div>

      {/* Content */}
      <div className="flex-1 px-4 space-y-9">
        {/* 매운맛 섹션 */}
        <div>
          <div className="flex items-center gap-3 mb-6">
            <div className="w-14 h-14 relative">
              <Image
                src="/spicy.png"
                alt="매운맛"
                width={56}
                height={56}
                className="object-contain"
              />
            </div>
            <h3 className="text-gray-800 text-headline-b">
              보통 어느 정도로 맵게 드시나요?
            </h3>
          </div>
          <RadioGroup value={spicyLevel} onValueChange={setSpicyLevel}>
            <div className="bg-white h-12 flex items-center justify-between px-4">
              <Label
                htmlFor="spicy-1"
                className={`flex-1 cursor-pointer ${
                  spicyLevel === "1"
                    ? "text-purple-700 text-body-sb"
                    : "text-gray-700 text-body-r"
                }`}
              >
                덜 맵게
              </Label>
              <RadioGroupItem value="1" id="spicy-1" />
            </div>
            <div className="bg-white h-12 flex items-center justify-between px-4">
              <Label
                htmlFor="spicy-2"
                className={`flex-1 cursor-pointer ${
                  spicyLevel === "2"
                    ? "text-purple-700 text-body-sb"
                    : "text-gray-700 text-body-r"
                }`}
              >
                보통 <span className="text-gray-600">(신라면)</span>
              </Label>
              <RadioGroupItem value="2" id="spicy-2" />
            </div>
            <div className="bg-white h-12 flex items-center justify-between px-4">
              <Label
                htmlFor="spicy-3"
                className={`flex-1 cursor-pointer ${
                  spicyLevel === "3"
                    ? "text-purple-700 text-body-sb"
                    : "text-gray-700 text-body-r"
                }`}
              >
                더 맵게
              </Label>
              <RadioGroupItem value="3" id="spicy-3" />
            </div>
          </RadioGroup>
        </div>

        {/* 식사량 섹션 */}
        <div>
          <div className="flex items-center gap-3 mb-6">
            <div className="w-14 h-14 relative">
              <Image
                src="/portion.png"
                alt="식사량"
                width={56}
                height={56}
                className="object-contain"
              />
            </div>
            <h3 className="text-gray-800 text-headline-b">
              평소 식사량이 어느정도 되시나요?
            </h3>
          </div>
          <RadioGroup value={portionSize} onValueChange={setPortionSize}>
            <div className="bg-white h-12 flex items-center justify-between px-4">
              <Label
                htmlFor="portion-1"
                className={`flex-1 cursor-pointer ${
                  portionSize === "1"
                    ? "text-purple-700 text-body-sb"
                    : "text-gray-700 text-body-r"
                }`}
              >
                0.5인분{" "}
                <span className="text-gray-600">(1인분이 보통 남아요)</span>
              </Label>
              <RadioGroupItem value="1" id="portion-1" />
            </div>
            <div className="bg-white h-12 flex items-center justify-between px-4">
              <Label
                htmlFor="portion-2"
                className={`flex-1 cursor-pointer ${
                  portionSize === "2"
                    ? "text-purple-700 text-body-sb"
                    : "text-gray-700 text-body-r"
                }`}
              >
                1인분{" "}
                <span className="text-gray-600">(정량이 딱 적당해요)</span>
              </Label>
              <RadioGroupItem value="2" id="portion-2" />
            </div>
            <div className="bg-white h-12 flex items-center justify-between px-4">
              <Label
                htmlFor="portion-3"
                className={`flex-1 cursor-pointer ${
                  portionSize === "3"
                    ? "text-purple-700 text-body-sb"
                    : "text-gray-700 text-body-r"
                }`}
              >
                1.5인분{" "}
                <span className="text-gray-600">(매번 양이 아쉬워요)</span>
              </Label>
              <RadioGroupItem value="3" id="portion-3" />
            </div>
          </RadioGroup>
        </div>

        {/* 가격대 섹션 */}
        <div>
          <div className="flex items-center gap-3 mb-6">
            <div className="w-14 h-14 relative">
              <Image
                src="/price.png"
                alt="가격대"
                width={56}
                height={56}
                className="object-contain"
              />
            </div>
            <h3 className="text-gray-800 text-headline-b">
              평균 식사 비용을 어느정도 쓰시나요?
            </h3>
          </div>
          <RadioGroup value={priceRange} onValueChange={setPriceRange}>
            <div className="bg-white h-12 flex items-center justify-between px-4">
              <Label
                htmlFor="price-1"
                className={`flex-1 cursor-pointer ${
                  priceRange === "1"
                    ? "text-purple-700 text-body-sb"
                    : "text-gray-700 text-body-r"
                }`}
              >
                만원 이하
              </Label>
              <RadioGroupItem value="1" id="price-1" />
            </div>
            <div className="bg-white h-12 flex items-center justify-between px-4">
              <Label
                htmlFor="price-2"
                className={`flex-1 cursor-pointer ${
                  priceRange === "2"
                    ? "text-purple-700 text-body-sb"
                    : "text-gray-700 text-body-r"
                }`}
              >
                만원 ~ 2만원
              </Label>
              <RadioGroupItem value="2" id="price-2" />
            </div>
            <div className="bg-white h-12 flex items-center justify-between px-4">
              <Label
                htmlFor="price-3"
                className={`flex-1 cursor-pointer ${
                  priceRange === "3"
                    ? "text-purple-700 text-body-sb"
                    : "text-gray-700 text-body-r"
                }`}
              >
                2만원 이상
              </Label>
              <RadioGroupItem value="3" id="price-3" />
            </div>
          </RadioGroup>
        </div>
      </div>

      {/* Bottom Button */}
      <div className="px-4 pb-8 pt-6">
        <CustomButton onClick={handleSubmit} disabled={loading}>
          {loading ? "저장 중..." : "확인"}
        </CustomButton>
      </div>
    </div>
  );
}
