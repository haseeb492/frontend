import axiosInstance from "@/AxiosInterceptor";
import { toast } from "@/Components/Common/Toast/use-toast";
import { useQuery } from "@tanstack/react-query";
import { AxiosError } from "axios";

const useGetAvailableProductiveDuration = (
  reportId: string,
  userId: string,
  shouldFetch: boolean = true
) => {
  const {
    data: productiveDuration,
    error,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["getAvailableProductiveDuration", userId, reportId],
    queryFn: async () => {
      const endpoint = `/daily-report/get-available-productive-duration?reportId=${reportId}`;

      const res = await axiosInstance.get(endpoint);
      return res?.data;
    },
    enabled: !!userId && shouldFetch && !!reportId,
    refetchOnWindowFocus: false,
  });

  if (error instanceof AxiosError && error.response) {
    toast({
      title: error?.response?.data?.error || "Something went wrong",
      variant: "destructive",
    });
  }
  return { isLoading, productiveDuration, refetch };
};

export default useGetAvailableProductiveDuration;
