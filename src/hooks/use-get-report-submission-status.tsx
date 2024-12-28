import axiosInstance from "@/AxiosInterceptor";
import { toast } from "@/Components/Common/Toast/use-toast";
import { useQuery } from "@tanstack/react-query";
import { AxiosError } from "axios";

const useGetReportSubmissionStatus = (userId: string) => {
  const {
    data: isTodaysReportSubmitted,
    error,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["getReportSubmissionStatus", userId],
    queryFn: async () => {
      const endpoint = `/daily-report/get-report-submission-status`;

      const res = await axiosInstance.get(endpoint);
      return res?.data;
    },
    enabled: !!userId,
    refetchOnWindowFocus: false,
  });

  if (error instanceof AxiosError && error.response) {
    toast({
      title: error?.response?.data?.error || "Something went wrong",
      variant: "destructive",
    });
  }
  return { isLoading, isTodaysReportSubmitted, refetch };
};

export default useGetReportSubmissionStatus;
