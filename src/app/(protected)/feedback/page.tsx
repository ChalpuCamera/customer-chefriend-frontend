import { Suspense } from "react";
import { FeedbackClient } from "./feedback-client";

export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <FeedbackClient />
    </Suspense>
  );
}
