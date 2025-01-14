"use client";

import CircularLoader from "@/Components/Common/CircularLoader";
import { DateRangePicker } from "@/Components/Common/DateRangePicker";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/Components/Common/SelectionField";
import HeaderCard from "@/Components/HeaderCard";
import { ACCESS_CONTROL } from "@/constants/accessControlConfig";
import withAuthorization from "@/HOC/withAuthorization";
import UseGetAllRoles from "@/hooks/use-get-all-roles";
import useGetAllUsers from "@/hooks/use-get-all-users";
import useGetUserDailyReports from "@/hooks/use-get-user-daily-reports";
import useGetUsers from "@/hooks/use-get-users";
import { formatDate, getLastMonthDateRange } from "@/lib/utils";
import { RootState } from "@/redux/store";
import { PenBox } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";

const Page = () => {
  const [lastMonthStartDate, lastMonthEndDate] = getLastMonthDateRange();
  const router = useRouter();

  const [dateRange, setDateRange] = useState<[Date | null, Date | null]>([
    null,
    null,
  ]);

  const [fetchDateRange, setFetchDateRange] = useState<[Date, Date]>([
    lastMonthStartDate,
    lastMonthEndDate,
  ]);

  const [dailyReports, setDailyReports] = useState<any[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [hasNextPage, setHasNextPage] = useState<boolean>(true);
  const [isFetchingNextPage, setIsFetchingNextPage] = useState<boolean>(false);
  const user = useSelector((state: RootState) => state.user);
  const [selectedUserId, setSelectedUserId] = useState<string | undefined>(
    undefined
  );

  const userScope =
    ACCESS_CONTROL.routes["/daily-reports"]?.scope[user.role.name];
  const isManager = userScope === "underManager";

  const { getAllRoles } = UseGetAllRoles();
  const engineerRole = getAllRoles?.find(
    (role: { name: string }) => role?.name === "ENGINEER"
  );

  const { users } = useGetUsers(isManager, engineerRole?._id);

  const managerUsers = isManager ? users?.users : [];

  const { allUsers } = useGetAllUsers(!isManager);

  const usersList = isManager ? managerUsers : allUsers;

  const fromDate = formatDate(fetchDateRange[0]);
  const toDate = formatDate(fetchDateRange[1]);

  const { data, isLoading: isDailyReportLoading } = useGetUserDailyReports(
    selectedUserId,
    toDate,
    fromDate,
    currentPage
  );
  useEffect(() => {
    const newLogs = data?.reports;
    if (currentPage === 1) {
      setDailyReports(newLogs);
    } else {
      setDailyReports((prevLogs) => [...prevLogs, ...newLogs]);
    }
    setHasNextPage(currentPage < data?.totalPages);
    setIsFetchingNextPage(false);
  }, [data]);

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
    setDailyReports([]);
  };

  const handleScroll = () => {
    if (
      window.innerHeight + window.scrollY >=
        document.documentElement.scrollHeight - 10 &&
      hasNextPage &&
      !isFetchingNextPage &&
      !isDailyReportLoading
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
  }, [hasNextPage, isFetchingNextPage, isDailyReportLoading]);

  return (
    <div className="w-full">
      <HeaderCard title="Reports" subTitle="Review users daily reports" />

      <div className="flex justify-between my-5">
        <h2 className="text-xl text-primary mb-4">Daily Reports:</h2>

        <div className="flex items-center gap-2">
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

          <DateRangePicker
            className="min-w-60"
            startDate={dateRange[0] || null}
            endDate={dateRange[1] || null}
            setDateRange={handleDateRangeChange}
            placeholder="Last month"
          />
        </div>
      </div>

      {isDailyReportLoading && currentPage === 1 ? (
        <div className="flex items-center justify-center w-full mt-10">
          <CircularLoader />
        </div>
      ) : dailyReports && dailyReports.length > 0 ? (
        dailyReports.map((report: any) => (
          <div
            className="flex justify-between items-center p-4 w-full border border-gray-300
              shadow-md shadow-gray-400 rounded-[5px] mb-4 cursor-pointer"
            key={report?._id}
            onClick={() => router.push(`/report/${report._id}`)}
          >
            <div className="flex  items-center gap-2">
              <h2 className="text-xl text-primary">
                {new Date(report?.date).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })}
              </h2>
              {report?.isEdited && <PenBox className="h-5 w-5" />}
            </div>
            <div className="flex items-center">
              {!report?.isSubmitted && (
                <span className="text-md text-red-600">
                  You did not submit this report
                </span>
              )}
              {report?.isSubmitted && report?.isSystemSubmitted && (
                <span className="text-md text-yellow-600">
                  This report is system submitted
                </span>
              )}
              {report?.isSubmitted && report?.isLateSubmitted && (
                <span className="text-md text-yellow-600">
                  You submitted this report late
                </span>
              )}
            </div>
          </div>
        ))
      ) : (
        <div className="flex items-center justify-center mt-10">
          <span className="text-slate-500 text-md">No records found</span>
        </div>
      )}
      {isFetchingNextPage && (
        <div className="flex justify-center my-4">
          <CircularLoader />
        </div>
      )}
    </div>
  );
};

export default withAuthorization(Page, "/daily-reports", "route");
