import axiosInstance from "@/AxiosInterceptor";
import { toast } from "@/Components/Common/Toast/use-toast";
import { useQuery } from "@tanstack/react-query";
import { AxiosError } from "axios";

const useGetUsers = (
  isManager: boolean,
  roleId: string,
  isAuthorized: boolean = true
) => {
  const {
    data: users,
    error,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["getUsers", isManager],
    queryFn: async () => {
      const endpoint = isManager
        ? `/user/get-users-under-pm`
        : `/user/get-users-by-role?roleId=${roleId}`;
      const res = await axiosInstance.get(endpoint);
      return res?.data;
    },
    enabled: !!roleId && isAuthorized,
    refetchOnWindowFocus: false,
  });

  if (error instanceof AxiosError && error.response) {
    toast({
      title: error?.response?.data?.error || "Something went wrong",
      variant: "destructive",
    });
  }

  return { isLoading, refetch, users, error };
};

export default useGetUsers;
