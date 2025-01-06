"use client";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { checkAccess } from "@/lib/utils";
import Button from "@/Components/Common/Button";
import InputField from "@/Components/Common/InputField";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/Components/Common/SelectionField";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/Components/Common/Table";
import { Tabs, TabsList, TabsTrigger } from "@/Components/Common/Tabs";
import { useRouter } from "next/navigation";
import axiosInstance from "@/AxiosInterceptor";
import { useQuery } from "@tanstack/react-query";
import { useDebouncedCallback } from "use-debounce";
import Pagination from "@/Components/Common/Pagination";
import { toast } from "@/Components/Common/Toast/use-toast";
import { AxiosError } from "axios";
import withAuthorization from "@/HOC/withAuthorization";
import { ACCESS_CONTROL } from "@/constants/accessControlConfig";
import HeaderCard from "@/Components/HeaderCard";
import CircularLoader from "@/Components/Common/CircularLoader";

type userProps = {
  _id: string;
  name: string;
  email: string;
  role: { name: string };
  designation: { name: string };
};

const tableColumns = [
  { label: "Name", value: "name" },
  { label: "Email", value: "email" },
  { label: "Role", value: "role.name" },
  { label: "Designation", value: "designation.name" },
];

const Page = () => {
  const router = useRouter();
  const [selectedTab, setSelectedTab] = useState("active");
  const [offset, setOffset] = useState("10");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const user = useSelector((state: RootState) => state.user);

  const canAddUser = checkAccess(user, "AddUserButton", "component");

  const userScope = ACCESS_CONTROL.routes["/users"]?.scope[user.role.name];
  const isManagerScope = userScope === "underManager";

  const {
    data: getAllUsers,
    error,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["getAllUserApi"],
    queryFn: async () => {
      if (isManagerScope) {
        const res = await axiosInstance.get(`/user/get-all-users-by-pm`);
        return res?.data;
      } else {
        const res = await axiosInstance.get(
          `/user/get-all-users?status=${selectedTab}&search=${searchQuery}&page=${currentPage}&offset=${
            offset === `all` ? "" : offset
          }`
        );
        return res?.data;
      }
    },
    refetchOnWindowFocus: false,
  });

  if (error instanceof AxiosError && error.response) {
    toast({
      title: error?.response?.data?.error || "Something went wrong",
      variant: "destructive",
    });
  }

  useEffect(() => {
    if (offset && offset === "all") {
      setCurrentPage(1);
    }
    if (searchQuery && !isManagerScope) {
      callUserQuery();
    } else {
      refetch();
    }
  }, [selectedTab, offset, searchQuery, currentPage, isManagerScope]);
  const callUserQuery = useDebouncedCallback(() => {
    refetch();
  }, 700);

  const handleRowClick = (userId: string) => {
    router.replace(`/user/${userId}`);
  };

  return (
    <>
      <HeaderCard title="Users" subTitle="View users and their details" />
      <div className="flex items-center w-full gap-lg justify-between p-md">
        <div className="flex gap-md justify-between items-center ">
          {!isManagerScope && (
            <InputField
              placeholder="Search User"
              value={searchQuery}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setSearchQuery(e?.target?.value)
              }
            />
          )}
          {!isManagerScope && (
            <Tabs
              defaultValue="active"
              className="w-[400px]"
              onValueChange={(value: React.SetStateAction<string>) =>
                setSelectedTab(value)
              }
            >
              <TabsList>
                <TabsTrigger value="active">Active</TabsTrigger>
                <TabsTrigger value="inactive">Inactive</TabsTrigger>
              </TabsList>
            </Tabs>
          )}
        </div>
        <div className="flex gap-md items-center lg:w-1/4 justify-end">
          {!isManagerScope && (
            <Select defaultValue={offset} onValueChange={setOffset}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="10">10</SelectItem>
                <SelectItem value="20">20</SelectItem>
                <SelectItem value="50">50</SelectItem>
                <SelectItem value="100">100</SelectItem>
              </SelectContent>
            </Select>
          )}

          {canAddUser && (
            <div className="w-full">
              <Button
                title="Add User"
                className="grow px-md"
                onClick={() => router.push("/users/add-user")}
              />
            </div>
          )}
        </div>
      </div>

      {/* Responsive container for the table */}
      <div className="overflow-x-auto mt-lg">
        {isLoading ? (
          <div className="flex items-center justify-center my-20">
            <CircularLoader size={40} />
          </div>
        ) : (
          <Table className="min-w-full">
            <TableHeader>
              <TableRow className="truncate">
                {tableColumns?.map((column) => (
                  <TableHead key={column.value}>{column.label}</TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {getAllUsers?.users && getAllUsers.users.length > 0 ? (
                getAllUsers.users.map((user: userProps) => (
                  <TableRow
                    key={user?._id}
                    className="truncate cursor-pointer "
                    onClick={() => handleRowClick(user._id)}
                  >
                    <TableCell>{user?.name}</TableCell>
                    <TableCell>{user?.email}</TableCell>
                    <TableCell>{user?.role?.name}</TableCell>
                    <TableCell>{user?.designation?.name}</TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-4">
                    No user found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        )}
        {!isManagerScope && getAllUsers && (
          <Pagination
            currentPage={currentPage}
            totalPages={getAllUsers?.totalPages}
            setCurrentPage={setCurrentPage}
          />
        )}
      </div>
    </>
  );
};

export default withAuthorization(Page, "/users", "route");
