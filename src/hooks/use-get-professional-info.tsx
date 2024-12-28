import axiosInstance from "@/AxiosInterceptor";
import { toast } from "@/Components/Common/Toast/use-toast";
import { useQuery } from "@tanstack/react-query";
import { AxiosError } from "axios";

const useGetProfessionalInfo = (
  userId: string | null,
  isLoggedIn: boolean | null
) => {
  const {
    data: professionalInfo,
    error,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["getProfessionalInfo", userId, isLoggedIn],
    queryFn: async () => {
      const endpoint = isLoggedIn
        ? `/user/get-professional-info`
        : `/user/get-user-professional-info?userId=${userId}`;

      const res = await axiosInstance.get(endpoint);
      return res?.data;
    },
    enabled: isLoggedIn || !!userId,
    refetchOnWindowFocus: false,
  });

  if (error instanceof AxiosError && error.response) {
    toast({
      title: error?.response?.data?.error || "Something went wrong",
      variant: "destructive",
    });
  }
  return { isLoading, professionalInfo, refetch };
};

export default useGetProfessionalInfo;
