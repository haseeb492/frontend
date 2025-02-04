import axiosInstance from "@/AxiosInterceptor";
import { toast } from "@/Components/Common/Toast/use-toast";
import { useQuery } from "@tanstack/react-query";
import { AxiosError } from "axios";

const useGetAllInternalProjects = (
  userId: string,
  shouldFetch: boolean = true
) => {
  const {
    data: internalProjects,
    error,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["getAllInternalProjects", userId],
    queryFn: async () => {
      const endpoint = `/internal-project/get-all`;

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

export default useGetAllInternalProjects;
