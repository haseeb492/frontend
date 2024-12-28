import axiosInstance from "@/AxiosInterceptor";
import { toast } from "@/Components/Common/Toast/use-toast";
import { useQuery } from "@tanstack/react-query";
import { AxiosError } from "axios";

const useGetDesignation = (role: string) => {
  const {
    data: getDesignation,
    error,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["getDesignationApi"],
    queryFn: async () => {
      const res = await axiosInstance.get(
        `/general/get-designations-by-role?roleId=${role}`
      );
      return res?.data?.designations;
    },
    enabled: !!role,
    refetchOnWindowFocus: false,
  });

  if (error instanceof AxiosError && error.response) {
    toast({
      title: error?.response?.data?.error || "Something went wrong",
      variant: "destructive",
    });
  }

  return { isLoading, refetch, getDesignation };
};

export default useGetDesignation;
