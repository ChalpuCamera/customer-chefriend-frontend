import { Suspense } from "react";
import { VerificationClient } from "./verification-client";

export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <VerificationClient />
    </Suspense>
  );
}
