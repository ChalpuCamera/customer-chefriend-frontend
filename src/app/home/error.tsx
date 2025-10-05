"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertCircle } from "lucide-react";

export default function HomeError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("[Home Page Error]", error);
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center p-5 bg-white">
      <Card className="w-full max-w-md">
        <CardHeader>
          <div className="flex flex-col items-center space-y-4">
            <AlertCircle className="h-12 w-12 text-destructive" />
            <CardTitle className="text-center">문제가 발생했습니다</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="flex flex-col items-center space-y-6">
          <div className="text-center space-y-2">
            <p className="text-sm text-muted-foreground">
              가게 목록을 불러오는 중 오류가 발생했습니다.
            </p>
            {error.digest && (
              <p className="text-xs text-muted-foreground">
                오류 코드: {error.digest}
              </p>
            )}
          </div>

          <div className="flex flex-col w-full gap-3">
            <Button onClick={reset} className="w-full">
              다시 시도
            </Button>
            <Button
              variant="outline"
              onClick={() => (window.location.href = "/")}
              className="w-full"
            >
              홈으로 돌아가기
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
