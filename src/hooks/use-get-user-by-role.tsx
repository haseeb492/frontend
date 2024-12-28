import axiosInstance from "@/AxiosInterceptor";
import { toast } from "@/Components/Common/Toast/use-toast";
import { useQuery } from "@tanstack/react-query";
import { AxiosError } from "axios";

const useGetUserByRole = (
  role: { _id: string } | null,
  isAuthorized: boolean = true
) => {
  const {
    data: getUserByRole,
    error,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["getUserByRoleApi", role?._id],
    queryFn: async () => {
      const res = await axiosInstance.get(
        `/user/get-users-by-role?roleId=${role?._id}`
      );
      return res?.data?.users;
    },
    enabled: !!role?._id && isAuthorized,
    refetchOnWindowFocus: false,
  });

  if (error instanceof AxiosError && error.response) {
    toast({
      title: error?.response?.data?.error || "Something went wrong",
      variant: "destructive",
    });
  }

  return { isLoading, refetch, getUserByRole };
};

export default useGetUserByRole;
