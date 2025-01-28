import axiosInstance from "@/AxiosInterceptor";
import { toast } from "@/Components/Common/Toast/use-toast";
import { AxiosError } from "axios";

import { useInfiniteQuery } from "@tanstack/react-query";

const useGetMyRequests = (
  requestStatus: string,
  type: string,
  shouldFetch: boolean = true,
  userId: string
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
    queryKey: ["getMyRequests", requestStatus, type, userId],
    queryFn: async ({ pageParam = 1 }) => {
      const endpoint = `/request/get-my-requests?status=${
        requestStatus === "all" ? "" : requestStatus
      }&type=${type === "all" ? "" : type}&page=${pageParam}&offset=5`;
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
    enabled: shouldFetch && !!userId,
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
    myRequests: data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  };
};

export default useGetMyRequests;
