"use client";

import { useState, useRef } from "react";
import { Download } from "lucide-react";
import Image from "next/image";
import { toast } from "sonner";

interface ImageUploadProps {
  onFileSelect: (file: File) => void;
  previewUrl?: string;
}

export function ImageUpload({ onFileSelect, previewUrl }: ImageUploadProps) {
  const [localPreview, setLocalPreview] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // 파일 타입 검증
    if (!file.type.startsWith("image/")) {
      toast.error("이미지 파일만 업로드할 수 있습니다.");
      return;
    }

    // 파일 크기 검증 (10MB)
    if (file.size > 10 * 1024 * 1024) {
      toast.error("파일 크기는 10MB 이하여야 합니다.");
      return;
    }

    // 로컬 미리보기 생성
    const reader = new FileReader();
    reader.onloadend = () => {
      setLocalPreview(reader.result as string);
    };
    reader.readAsDataURL(file);

    // File 객체 전달 (업로드하지 않음)
    onFileSelect(file);
    toast.success("사진이 선택되었습니다.");
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        className="hidden"
      />

      <div
        onClick={handleClick}
        className="bg-gray-100 rounded-2xl p-8 flex flex-col items-center justify-center cursor-pointer hover:bg-gray-200 transition-colors min-h-[237px]"
      >
        {(localPreview || previewUrl) ? (
          // 미리보기
          <div className="relative w-full h-[237px]">
            <Image
              src={localPreview || previewUrl || ""}
              alt="Receipt preview"
              fill
              className="object-contain rounded-xl"
            />
          </div>
        ) : (
          // 업로드 전
          <div className="text-center">
            <div className="w-14 h-14 mx-auto mb-6 flex items-center justify-center">
              <Download size={54} className="text-gray-600" />
            </div>
            <p className="text-gray-800 text-headline-b mb-2">
              영수증 또는 캡쳐 화면 제출해 주세요.
            </p>
            <p className="text-gray-700 text-sub-body-r">
              캡처 화면은 배달 중 또는 배달 완료가
              <br />
              표시되어 있는 화면이어야 해요
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
