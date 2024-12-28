import axiosInstance from "@/AxiosInterceptor";
import { toast } from "@/Components/Common/Toast/use-toast";
import { useQuery } from "@tanstack/react-query";
import { AxiosError } from "axios";

const useGetCheckInStatus = (userId: string) => {
  const {
    data: isCheckedIn,
    error,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["getCheckInStatus", userId],
    queryFn: async () => {
      const endpoint = `/activity/get-check-in-status`;

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
  return { isLoading, isCheckedIn, refetch };
};

export default useGetCheckInStatus;
