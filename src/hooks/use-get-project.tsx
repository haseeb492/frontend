import axiosInstance from "@/AxiosInterceptor";
import { toast } from "@/Components/Common/Toast/use-toast";
import { useQuery } from "@tanstack/react-query";
import { AxiosError } from "axios";

const useGetProject = (projectId: string) => {
  const {
    data: project,
    error,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["getPersonalInfo", projectId],
    queryFn: async () => {
      const endpoint = `/project/get-project?projectId=${projectId}`;

      const res = await axiosInstance.get(endpoint);
      return res?.data;
    },
    enabled: !!projectId,
    refetchOnWindowFocus: false,
  });

  if (error instanceof AxiosError && error.response) {
    toast({
      title: error?.response?.data?.error || "Something went wrong",
      variant: "destructive",
    });
  }
  return { isLoading, project, refetch };
};

export default useGetProject;
