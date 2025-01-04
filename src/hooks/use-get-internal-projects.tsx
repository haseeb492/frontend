import axiosInstance from "@/AxiosInterceptor";
import { toast } from "@/Components/Common/Toast/use-toast";
import { useQuery } from "@tanstack/react-query";
import { AxiosError } from "axios";

const useGetInternalProjects = (
  userId: string,
  shouldFetch: boolean = true
) => {
  const {
    data: internalProjects,
    error,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["getActivityLog", userId],
    queryFn: async () => {
      const endpoint = `/internal-project/get`;

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
  return { isLoading, internalProjects, refetch };
};

export default useGetInternalProjects;
