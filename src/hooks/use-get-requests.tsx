import axiosInstance from "@/AxiosInterceptor";
import { toast } from "@/Components/Common/Toast/use-toast";
import { AxiosError } from "axios";

import { useInfiniteQuery } from "@tanstack/react-query";

const useGetRequests = (
  requestStatus: string,
  type: string,
  selectedUser: string,
  shouldFetch: boolean = true,
  userId: string,
  canGetAllRequests: boolean
) => {
  const {
    data,
    error,
    isLoading,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    refetch,
  } = useInfiniteQuery({
    queryKey: ["getMyRequests", requestStatus, type, userId, selectedUser],
    queryFn: async ({ pageParam = 1 }) => {
      const endpoint = !canGetAllRequests
        ? `/request/get-requests?status=${
            requestStatus === "all" ? "" : requestStatus
          }&type=${type === "all" ? "" : type}&page=${pageParam}&offset=5`
        : selectedUser === "all"
        ? `/request/get-all?status=${
            requestStatus === "all" ? "" : requestStatus
          }&type=${type === "all" ? "" : type}&page=${pageParam}&offset=5`
        : `/request/get-requests-by-user?status=${
            requestStatus === "all" ? "" : requestStatus
          }&type=${
            type === "all" ? "" : type
          }&page=${pageParam}&offset=5&userId=${selectedUser}`;
      const res = await axiosInstance.get(endpoint);
      return res?.data;
    },
    getNextPageParam: (lastPage) => {
      return lastPage.currentPage < lastPage.totalPages
        ? lastPage.currentPage + 1
        : undefined;
    },
    initialPageParam: 1,
    refetchOnWindowFocus: false,
    enabled: shouldFetch && !!userId && !!selectedUser,
  });

  if (error instanceof AxiosError && error.response) {
    toast({
      title: error?.response?.data?.error || "Something went wrong",
      variant: "destructive",
    });
  }

  return {
    isLoading,
    refetch,
    requests: data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  };
};

export default useGetRequests;
