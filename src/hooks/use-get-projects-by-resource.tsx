import axiosInstance from "@/AxiosInterceptor";
import { toast } from "@/Components/Common/Toast/use-toast";
import { useQuery } from "@tanstack/react-query";
import { AxiosError } from "axios";

const useGetProjectsByResource = (
  shouldFetch: boolean = true,
  status: string = ""
) => {
  const {
    data: projectsByresource,
    error,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["getProjectsByresource"],
    queryFn: async () => {
      const res = await axiosInstance.get(
        `/project/get-projects-by-resource?status=${status}`
      );
      return res?.data;
    },
    enabled: shouldFetch,
    refetchOnWindowFocus: false,
  });

  if (error instanceof AxiosError && error.response) {
    toast({
      title: error?.response?.data?.error || "Something went wrong",
      variant: "destructive",
    });
  }

  return { isLoading, refetch, projectsByresource };
};

export default useGetProjectsByResource;
