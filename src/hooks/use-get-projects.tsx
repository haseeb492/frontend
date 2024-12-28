import axiosInstance from "@/AxiosInterceptor";
import { toast } from "@/Components/Common/Toast/use-toast";
import { useQuery } from "@tanstack/react-query";
import { AxiosError } from "axios";

const useGetProjects = (
  isManager: boolean,
  status: string = "",
  shouldFetch: boolean = true
) => {
  const {
    data: projects,
    error,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["getProjects", status, isManager],
    queryFn: async () => {
      const endpoint = isManager
        ? `/project/get-projects-by-manager?status=${
            status === "all" ? "" : status
          }`
        : `/project/get-all-projects?status=${status === "all" ? "" : status}`;
      const res = await axiosInstance.get(endpoint);
      return res?.data;
    },
    refetchOnWindowFocus: false,
    enabled: shouldFetch,
  });

  if (error instanceof AxiosError && error.response) {
    toast({
      title: error?.response?.data?.error || "Something went wrong",
      variant: "destructive",
    });
  }

  return { isLoading, refetch, projects };
};

export default useGetProjects;
