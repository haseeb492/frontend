"use client";

import dynamic from "next/dynamic";
import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
const ActivityLogCard = dynamic(() => import("@/Components/ActivityLogCard"), {
  ssr: false,
});
import { DateRangePicker } from "@/Components/Common/DateRangePicker";
import useGetActivityLogs from "@/hooks/use-get-activity-logs";
import { checkAccess, formatDate, getLastMonthDateRange } from "@/lib/utils";
const CircularLoader = dynamic(
  () => import("@/Components/Common/CircularLoader"),
  {
    ssr: false,
  }
);
import { ACCESS_CONTROL } from "@/constants/accessControlConfig";
import UseGetAllRoles from "@/hooks/use-get-all-roles";
import useGetUsers from "@/hooks/use-get-users";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/Components/Common/SelectionField";
import useGetAllUsers from "@/hooks/use-get-all-users";
const HeaderCard = dynamic(() => import("@/Components/HeaderCard"), {
  ssr: false,
});

interface checkInOutHistoryType {
  checkInTime?: Date | undefined;
  checkOutTime?: Date | undefined;
}

interface WorkStatusHistoryType {
  status?: string | undefined;
  timestamp?: Date | undefined;
}

interface ActivityLogsType {
  _id: string;
  date?: Date | undefined;
  user?: string | undefined;
  checkInOutHistory?: checkInOutHistoryType;
  workStatusHistory?: WorkStatusHistoryType[];
  totalWorkDuration?: number | undefined;
  totalBreakDuration?: number | undefined;
  totalRndDuration?: number | undefined;
  totalIdleDuration?: number | undefined;
  isLateCheckIn?: boolean | undefined;
  isCheckedIn?: boolean | undefined;
  isMinimumProductiveHours: boolean | undefined;
}

const Page = () => {
  const [lastMonthStartDate, lastMonthEndDate] = getLastMonthDateRange();

  const [dateRange, setDateRange] = useState<[Date | null, Date | null]>([
    null,
    null,
  ]);

  const [fetchDateRange, setFetchDateRange] = useState<[Date, Date]>([
    lastMonthStartDate,
    lastMonthEndDate,
  ]);

  const [activityLogs, setActivityLogs] = useState<ActivityLogsType[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [hasNextPage, setHasNextPage] = useState<boolean>(true);
  const [isFetchingNextPage, setIsFetchingNextPage] = useState<boolean>(false);
  const [expandedCardId, setExpandedCardId] = useState<string | null>(null);
  const user = useSelector((state: RootState) => state.user);
  const [selectedUserId, setSelectedUserId] = useState(user?._id);

  const canGetActivityFeeds = checkAccess(user, "GetActivityLogs", "component");
  const userScope =
    ACCESS_CONTROL.components["GetActivityLogs"]?.scope[user.role.name];

  const isManager = userScope === "underManager";

  const { getAllRoles } = UseGetAllRoles();
  const engineerRole = getAllRoles?.find(
    (role: { name: string }) => role?.name === "ENGINEER"
  );

  const { users } = useGetUsers(
    isManager,
    engineerRole?._id,
    canGetActivityFeeds
  );

  const managerUsers = isManager ? [...(users?.users || []), user] : [];

  const { allUsers } = useGetAllUsers(canGetActivityFeeds && !isManager);

  const usersList = isManager ? managerUsers : allUsers;

  const fromDate = formatDate(fetchDateRange[0]);
  const toDate = formatDate(fetchDateRange[1]);

  const { data, isLoading: isActivityLogsLoading } = useGetActivityLogs(
    selectedUserId,
    toDate,
    fromDate,
    currentPage,
    !canGetActivityFeeds && selectedUserId === user?._id
  );

  useEffect(() => {
    if (data) {
      const newLogs = data.data;

      if (currentPage === 1) {
        setActivityLogs(newLogs);
      } else {
        setActivityLogs((prevLogs) => [...prevLogs, ...newLogs]);
      }

      setHasNextPage(currentPage < data.totalPages);

      setIsFetchingNextPage(false);
    }
  }, [data]);

  useEffect(() => {
    if (user?._id) {
      setSelectedUserId(user?._id);
    }
  }, [user?._id]);

  useEffect(() => {
    setCurrentPage(1);
  }, [selectedUserId]);

  const handleDateRangeChange = (newDateRange: [Date | null, Date | null]) => {
    setDateRange(newDateRange);
    if (newDateRange[0] && newDateRange[1]) {
      setFetchDateRange([newDateRange[0], newDateRange[1]]);
    } else if (!newDateRange[0] && !newDateRange[1]) {
      setFetchDateRange([lastMonthStartDate, lastMonthEndDate]);
    }
    // Reset pagination
    setCurrentPage(1);
    setHasNextPage(true);
    setActivityLogs([]);
  };

  const handleToggle = (id: string) => {
    setExpandedCardId((prev) => (prev === id ? null : id));
  };

  const handleScroll = () => {
    if (
      window.innerHeight + window.scrollY >=
        document.documentElement.scrollHeight - 10 &&
      hasNextPage &&
      !isFetchingNextPage &&
      !isActivityLogsLoading
    ) {
      setIsFetchingNextPage(true);
      setCurrentPage((prevPage) => prevPage + 1);
    }
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [hasNextPage, isFetchingNextPage, isActivityLogsLoading]);

  return (
    <div className="flex flex-col w-full">
      <HeaderCard
        title="Activity Feeds"
        subTitle="Review Previous activity-logs"
      />
      <div className="flex justify-between mt-5">
        <h2 className="text-xl text-primary mb-4">Activity Logs:</h2>

        <div className="flex items-center gap-2">
          {canGetActivityFeeds && (
            <Select
              value={selectedUserId}
              onValueChange={(value) => setSelectedUserId(value)}
            >
              <SelectTrigger className="min-w-60">
                <SelectValue placeholder="Enter user" />
              </SelectTrigger>
              <SelectContent>
                {usersList ? (
                  usersList.map((user: { name: string; _id: string }) => (
                    <SelectItem key={user._id} value={user._id}>
                      {user.name}
                    </SelectItem>
                  ))
                ) : (
                  <SelectItem value="-" aria-readonly>
                    No user found
                  </SelectItem>
                )}
              </SelectContent>
            </Select>
          )}

          <DateRangePicker
            title=""
            className="min-w-60"
            startDate={dateRange[0] || undefined}
            endDate={dateRange[1] || undefined}
            setDateRange={handleDateRangeChange}
            placeholder="Last month"
          />
        </div>
      </div>
      {isActivityLogsLoading && currentPage === 1 ? (
        <div className="flex items-center justify-center mt-20">
          <CircularLoader size={50} />
        </div>
      ) : (
        <div className="flex flex-col gap-x-3">
          {activityLogs && activityLogs.length > 0 ? (
            activityLogs.map((log: ActivityLogsType) => (
              <ActivityLogCard
                key={log._id}
                log={log}
                isExpanded={expandedCardId === log?._id}
                onToggle={() => handleToggle(log?._id)}
              />
            ))
          ) : (
            <div className="text-center text-gray-500 mt-10">
              No activity logs found
            </div>
          )}
          {isFetchingNextPage && (
            <div className="flex justify-center my-4">
              <CircularLoader />
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Page;
