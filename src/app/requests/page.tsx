"use client";

import HeaderCard from "@/Components/HeaderCard";
import useGetAllUsers from "@/hooks/use-get-all-users";
import useGetRequests from "@/hooks/use-get-requests";
import { RootState } from "@/redux/store";
import dynamic from "next/dynamic";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useInView } from "react-intersection-observer";
import CircularLoader from "@/Components/Common/CircularLoader";
import RequestCard from "@/Components/RequestCard";
import { RequestType } from "@/lib/types";
import withAuthorization from "@/HOC/withAuthorization";
import { checkAccess } from "@/lib/utils";

const Select = dynamic(
  () =>
    import("@/Components/Common/SelectionField").then(
      (module) => module.Select
    ),
  { ssr: false }
);

const SelectTrigger = dynamic(
  () =>
    import("@/Components/Common/SelectionField").then(
      (module) => module.SelectTrigger
    ),
  { ssr: false }
);
const SelectValue = dynamic(
  () =>
    import("@/Components/Common/SelectionField").then(
      (module) => module.SelectValue
    ),
  { ssr: false }
);
const SelectContent = dynamic(
  () =>
    import("@/Components/Common/SelectionField").then(
      (module) => module.SelectContent
    ),
  { ssr: false }
);
const SelectItem = dynamic(
  () =>
    import("@/Components/Common/SelectionField").then(
      (module) => module.SelectItem
    ),
  { ssr: false }
);

const Page = () => {
  const user = useSelector((state: RootState) => state.user);
  const [requestStatus, setRequestStatus] = useState("pending");
  const [type, setType] = useState("leave");
  const [selectedUser, setSelectedUser] = useState("all");
  const canGetAllRequests = checkAccess(user, "ReadRequest", "component");
  const canResolveRequests = checkAccess(user, "ResolveRequest", "component");

  const { allUsers } = useGetAllUsers(true);

  const {
    requests,
    isLoading: isMyRequestsLoading,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useGetRequests(
    requestStatus,
    type,
    selectedUser,
    Boolean(user._id),
    user._id,
    canGetAllRequests
  );

  const { ref, inView } = useInView({ threshold: 0 });

  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage]);

  const allRequests = requests?.pages.flatMap((page) => page.data) || [];

  return (
    <>
      <HeaderCard title="Requests" subTitle="Review and resolve requests" />
      <div
        className="flex justify-between p-4 border border-gray-300 shadow-md
       shadow-gray-400 rounded-[5px] mt-5"
      >
        <div className="flex flex-col">
          <h2 className="text-2xl text-primary"> Previous Requests</h2>
          <span className="text-md text-slate-500">
            Review or edit previous requests
          </span>
        </div>
        <div className="flex gap-x-2">
          {canGetAllRequests && (
            <Select
              value={selectedUser}
              onValueChange={(value) => setSelectedUser(value)}
            >
              <SelectTrigger className="min-w-60">
                <SelectValue placeholder="Enter user" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>

                {allUsers ? (
                  allUsers.map((user: { name: string; _id: string }) => (
                    <>
                      <SelectItem key={user._id} value={user._id}>
                        {user.name}
                      </SelectItem>
                    </>
                  ))
                ) : (
                  <SelectItem value="-" aria-readonly>
                    No user found
                  </SelectItem>
                )}
              </SelectContent>
            </Select>
          )}
          <Select
            value={requestStatus}
            onValueChange={(value: string) => setRequestStatus(value)}
          >
            <SelectTrigger className="min-w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="canceled">Canceled</SelectItem>
              <SelectItem value="approved">Approved</SelectItem>
              <SelectItem value="rejected">Rejected</SelectItem>
            </SelectContent>
          </Select>
          <Select
            value={type}
            onValueChange={(value: string) => setType(value)}
          >
            <SelectTrigger className="min-w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="leave">Leave</SelectItem>
              <SelectItem value="wfh">Work From Home</SelectItem>
              <SelectItem value="half_day">Half Day</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {isMyRequestsLoading ? (
        <div className="flex items-center justify-center mt-10">
          <CircularLoader size={40} />
        </div>
      ) : (
        <div className="flex flex-col gap-y-4 mt-5">
          {allRequests.length > 0 ? (
            <>
              {allRequests.map((request: RequestType) => (
                <RequestCard
                  request={request}
                  isMyRequest={false}
                  key={request._id}
                  canResolveRequest={canResolveRequests}
                />
              ))}
              {isFetchingNextPage && (
                <div className="flex items-center justify-center mt-4">
                  <CircularLoader size={40} />
                </div>
              )}
              {!isFetchingNextPage && hasNextPage && (
                <div ref={ref} className="h-10" />
              )}
            </>
          ) : (
            <div className="flex items-center justify-center">
              <span className="text-slate-500 text-md">No Records found</span>
            </div>
          )}
        </div>
      )}
    </>
  );
};

export default withAuthorization(Page, "/requests", "route");
