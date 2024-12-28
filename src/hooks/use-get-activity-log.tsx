import axiosInstance from "@/AxiosInterceptor";
import { toast } from "@/Components/Common/Toast/use-toast";
import { useQuery } from "@tanstack/react-query";
import { AxiosError } from "axios";

const useGetActivityLog = (userId: string, shouldFetch: boolean = true) => {
  const {
    data: activityLog,
    error,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["getActivityLog", userId],
    queryFn: async () => {
      const endpoint = `/activity/get-activity-log`;

      const res = await axiosInstance.get(endpoint);
      return res?.data;
    },
    enabled: !!userId || shouldFetch,
    refetchOnWindowFocus: false,
  });

  if (error instanceof AxiosError && error.response) {
    toast({
      title: error?.response?.data?.error || "Something went wrong",
      variant: "destructive",
    });
  }
  return { isLoading, activityLog, refetch };
};

export default useGetActivityLog;
