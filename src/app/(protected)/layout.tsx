"use client";

import { useRequireAuth } from "@/hooks/use-auth";

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // 인증 필수 - 미인증 시 자동으로 "/" 로 리다이렉트
  useRequireAuth();

  return <>{children}</>;
}
