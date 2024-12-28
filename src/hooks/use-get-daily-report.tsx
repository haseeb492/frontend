import axiosInstance from "@/AxiosInterceptor";
import { toast } from "@/Components/Common/Toast/use-toast";
import { useQuery } from "@tanstack/react-query";
import { AxiosError } from "axios";

const useGetDailyReport = (
  userId: string,
  shouldFetch: boolean = true,
  reportId: string = ""
) => {
  const {
    data: dailyReport,
    error,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["getDailyReport", userId, reportId],
    queryFn: async () => {
      const endpoint = `/daily-report/get-daily-report-details?reportId=${reportId}`;

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
  return { isLoading, dailyReport, refetch };
};

export default useGetDailyReport;
