import axiosInstance from "@/AxiosInterceptor";
import { toast } from "@/Components/Common/Toast/use-toast";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { AxiosError } from "axios";

const useGetDailyReports = (
  userId: string,
  toDate: string,
  fromDate: string,
  page: number = 1
) => {
  const { data, error, isLoading, refetch } = useQuery({
    queryKey: ["getUserDailyReports", userId, toDate, fromDate, page],
    queryFn: async () => {
      const endpoint = `/daily-report/get-my-daily-reports?to=${toDate}&from=${fromDate}&page=${page}&userId=${userId}`;
      const res = await axiosInstance.get(endpoint);
      return res?.data;
    },
    enabled: !!userId && !!toDate && !!fromDate,
    refetchOnWindowFocus: false,
    placeholderData: keepPreviousData,
  });

  if (error instanceof AxiosError && error.response) {
    toast({
      title: error?.response?.data?.error || "Something went wrong",
      variant: "destructive",
    });
  }
  return { isLoading, data, refetch };
};

export default useGetDailyReports;
