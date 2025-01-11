import axiosInstance from "@/AxiosInterceptor";
import { toast } from "@/Components/Common/Toast/use-toast";
import { useQuery } from "@tanstack/react-query";
import { AxiosError } from "axios";

const useGetProjectAnalytics = (
  projectId: string,
  shouldFetch: boolean = true
) => {
  const {
    data: projectAnalytics,
    error,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["getProjectAnalytics", projectId],
    queryFn: async () => {
      const endpoint = `/project/get-analytics?projectId=${projectId}`;

      const res = await axiosInstance.get(endpoint);
      return res?.data;
    },
    enabled: !!projectId || shouldFetch,
    refetchOnWindowFocus: false,
  });

  if (error instanceof AxiosError && error.response) {
    toast({
      title: error?.response?.data?.error || "Something went wrong",
      variant: "destructive",
    });
  }
  return { isLoading, projectAnalytics, refetch };
};

export default useGetProjectAnalytics;
