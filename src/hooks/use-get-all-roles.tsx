import axiosInstance from "@/AxiosInterceptor";
import { toast } from "@/Components/Common/Toast/use-toast";
import { useQuery } from "@tanstack/react-query";
import { AxiosError } from "axios";

const UseGetAllRoles = () => {
  const {
    data: getAllRoles,
    error,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["getAllRolesApi"],
    queryFn: async () => {
      const res = await axiosInstance.get(`/general/get-roles`);
      return res?.data?.roles;
    },
    refetchOnWindowFocus: false,
  });

  if (error instanceof AxiosError && error.response) {
    toast({
      title: error?.response?.data?.error || "Something went wrong",
      variant: "destructive",
    });
  }

  return { isLoading, refetch, getAllRoles };
};

export default UseGetAllRoles;
