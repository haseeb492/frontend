import axiosInstance from "@/AxiosInterceptor";
import { toast } from "@/Components/Common/Toast/use-toast";
import { useQuery } from "@tanstack/react-query";
import { AxiosError } from "axios";

const useGetAverageProductiveHours = (
  userId: string,
  shouldFetch: boolean = true,
  to: string,
  from: string
) => {
  const {
    data: averageProductiveHours,
    error,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["getActivityLog", userId, to, from],
    queryFn: async () => {
      const endpoint = `/activity/get-average-productive-hours?to=${to}&from=${from}`;

      const res = await axiosInstance.get(endpoint);
      return res?.data;
    },
    enabled: !!userId && shouldFetch && !!to && !!from,
    refetchOnWindowFocus: false,
  });

  if (error instanceof AxiosError && error.response) {
    toast({
      title: error?.response?.data?.error || "Something went wrong",
      variant: "destructive",
    });
  }
  return { isLoading, averageProductiveHours, refetch };
};

export default useGetAverageProductiveHours;
