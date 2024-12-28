import axiosInstance from "@/AxiosInterceptor";
import { toast } from "@/Components/Common/Toast/use-toast";
import { useQuery } from "@tanstack/react-query";
import { AxiosError } from "axios";

const useGetAllUsers = (isAuthorized: boolean = true) => {
  const {
    data: allUsers,
    error,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["allUsers"],
    queryFn: async () => {
      const res = await axiosInstance.get(`/user/get-all-users`);
      return res?.data?.users;
    },
    enabled: isAuthorized,
    refetchOnWindowFocus: false,
  });

  if (error instanceof AxiosError && error.response) {
    toast({
      title: error?.response?.data?.error || "Something went wrong",
      variant: "destructive",
    });
  }

  return { isLoading, refetch, allUsers };
};

export default useGetAllUsers;

// import { useQuery } from "@tanstack/react-query";

// const {
//     data: getAllUsers,
//     error,
//     isLoading,
//     refetch,
//   } = useQuery({
//     queryKey: ["getAllUserApi"],
//     queryFn: async () => {
//       if (isManagerScope) {
//         const res = await axiosInstance.get(`/user/get-all-users-by-pm`);
//         return res?.data;
//       } else {
//         const res = await axiosInstance.get(
//   `/user/get-all-users?status=${selectedTab}&search=${searchQuery}&page=${currentPage}&offset=${
//     offset === `all` ? "" : offset
//   }`
//         );
//         return res?.data;
//       }
//     },
//     refetchOnWindowFocus: false,
//   });

//   if (error instanceof AxiosError && error.response) {
//     toast({
//       title: error?.response?.data?.error || "Something went wrong",
//       variant: "destructive",
//     });
//   }
