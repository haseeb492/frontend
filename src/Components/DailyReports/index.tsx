"use client";

import React, { useEffect, useState } from "react";
import { DateRangePicker } from "../Common/DateRangePicker";
import { formatDate, getLastMonthDateRange } from "@/lib/utils";
import useGetDailyReports from "@/hooks/use-get-daily-reports";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import CircularLoader from "../Common/CircularLoader";
import { PenBox } from "lucide-react";
import { useRouter } from "next/navigation";

const DailyReports = () => {
  const [lastMonthStartDate, lastMonthEndDate] = getLastMonthDateRange();

  const [dateRange, setDateRange] = useState<[Date | null, Date | null]>([
    null,
    null,
  ]);

  const [dailyReports, setDailyReports] = useState<any[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [hasNextPage, setHasNextPage] = useState<boolean>(true);
  const [isFetchingNextPage, setIsFetchingNextPage] = useState<boolean>(false);
  const router = useRouter();

  const user = useSelector((state: RootState) => state.user);

  const [fetchDateRange, setFetchDateRange] = useState<[Date, Date]>([
    lastMonthStartDate,
    lastMonthEndDate,
  ]);

  const fromDate = formatDate(fetchDateRange[0]);
  const toDate = formatDate(fetchDateRange[1]);

  const { data, isLoading: isDailyReportLoading } = useGetDailyReports(
    user?._id,
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

  const handleDateRangeChange = (newDateRange: [Date | null, Date | null]) => {
    setCurrentPage(1);
    setDateRange(newDateRange);
    if (newDateRange[0] && newDateRange[1]) {
      setFetchDateRange([newDateRange[0], newDateRange[1]]);
    } else if (!newDateRange[0] && !newDateRange[1]) {
      setFetchDateRange([lastMonthStartDate, lastMonthEndDate]);
    }
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
    <>
      <div className="flex items-center justify-between my-5 w-full">
        <div className="flex flex-col">
          <h2 className="text-2xl text-primary">Daily Reports</h2>
          <span className="text-md text-slate-500">
            Review or edit your previous reports
          </span>
        </div>
        <div className="">
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
      <div className="w-full">
        {isDailyReportLoading ? (
          <div className="flex items-center justify-center w-full">
            <CircularLoader />
          </div>
        ) : dailyReports && dailyReports.length > 0 ? (
          dailyReports.map((report: any) => (
            <div
              className="flex justify-between items-center p-4 w-full border border-gray-300
              shadow-md shadow-gray-400 rounded-[5px] mb-4 cursor-pointer"
              key={report?._id}
              onClick={() => router.push(`/report/${report?._id}`)}
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
    </>
  );
};

export default DailyReports;
