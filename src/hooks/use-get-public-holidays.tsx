import axiosInstance from "@/AxiosInterceptor";
import { toast } from "@/Components/Common/Toast/use-toast";
import { useQuery } from "@tanstack/react-query";
import { AxiosError } from "axios";

const useGetPublicHolidays = (userId: string, shouldFetch: boolean = true) => {
  const {
    data: holidays,
    error,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["getPublicHolidays"],
    queryFn: async () => {
      const endpoint = `/holiday/get-holidays?type=holiday`;
      const res = await axiosInstance.get(endpoint);
      return res?.data;
    },
    refetchOnWindowFocus: false,
    enabled: !!userId && shouldFetch,
  });

  if (error instanceof AxiosError && error.response) {
    toast({
      title: error?.response?.data?.error || "Something went wrong",
      variant: "destructive",
    });
  }

  return { isLoading, refetch, holidays };
};

export default useGetPublicHolidays;
