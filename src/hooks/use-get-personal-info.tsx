import axiosInstance from "@/AxiosInterceptor";
import { toast } from "@/Components/Common/Toast/use-toast";
import { useQuery } from "@tanstack/react-query";
import { AxiosError } from "axios";

const useGetPersonalInfo = (
  userId: string | null,
  isLoggedIn: boolean | null
) => {
  const {
    data: personalInfo,
    error,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["getPersonalInfo", userId, isLoggedIn],
    queryFn: async () => {
      const endpoint = isLoggedIn
        ? `/user/get-personal-info`
        : `/user/get-user-personal-info?userId=${userId}`;

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
  return { isLoading, personalInfo, refetch };
};

export default useGetPersonalInfo;
