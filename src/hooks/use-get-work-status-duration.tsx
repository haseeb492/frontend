import axiosInstance from "@/AxiosInterceptor";
import { toast } from "@/Components/Common/Toast/use-toast";
import { useQuery } from "@tanstack/react-query";
import { AxiosError } from "axios";

const useGetWorkStatusDuration = (
  status: string,
  userId: string,
  shouldFetch: boolean = true
) => {
  const {
    data: workStatusDuration,
    error,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["getWorkStatusDuration", userId, status],
    queryFn: async () => {
      const endpoint = `/activity/get-work-status-duration?statusType=${status}`;

      const res = await axiosInstance.get(endpoint);
      return res?.data;
    },
    enabled: !!userId || shouldFetch || !status,
    refetchOnWindowFocus: false,
  });

  if (error instanceof AxiosError && error.response) {
    toast({
      title: error?.response?.data?.error || "Something went wrong",
      variant: "destructive",
    });
  }
  return { isLoading, workStatusDuration, refetch };
};

export default useGetWorkStatusDuration;
