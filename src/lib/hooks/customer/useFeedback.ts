import { useQuery } from "@tanstack/react-query";
import { feedbackApi } from "@/lib/api/customer/feedback";

export const feedbackKeys = {
  all: ["feedbacks"] as const,
  my: () => [...feedbackKeys.all, "my"] as const,
};

export function useMyFeedbacks(options?: { enabled?: boolean }) {
  return useQuery({
    queryKey: feedbackKeys.my(),
    queryFn: async () => {
      const response = await feedbackApi.getMyFeedbacks({ page: 0, size: 1 });
      return response.result;
    },
    enabled: options?.enabled ?? true,
  });
}
