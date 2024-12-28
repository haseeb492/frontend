"use client";

import axiosInstance from "@/AxiosInterceptor";
import Clock from "@/Components/Clock";
import Button from "@/Components/Common/Button";
import Loader from "@/Components/Common/Loader";
import { toast } from "@/Components/Common/Toast/use-toast";
import SetPassword from "@/Components/SetPassword";
import useGetActivityLog from "@/hooks/use-get-activity-log";
import useGetCheckInStatus from "@/hooks/use-get-check-in-status";
import useGetProfessionalInfo from "@/hooks/use-get-professional-info";
import { ApiError } from "@/lib/types";
import {
  convertHoursToString,
  convertTo12HourFormat,
  formatDate,
  formatTime,
  getCheckedInTimeInMinutes,
  getLastMonthDateRange,
  getLatestStatus,
} from "@/lib/utils";
import { SET_USER } from "@/redux/slices/userSlice";
import { RootState } from "@/redux/store";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import CheckedInTimer from "@/Components/CheckedInTimer";
import WorkStatusTimer from "@/Components/WorkStatusTmer";
import useGetWorkStatusDuration from "@/hooks/use-get-work-status-duration";
import { Icon } from "@iconify/react";
import { DateRangePicker } from "@/Components/Common/DateRangePicker";
import useGetAverageProductiveHours from "@/hooks/use-get-average-productive-hours";
import HeaderCard from "@/Components/HeaderCard";

export default function Home() {
  const queryClient = useQueryClient();
  const [lastMonthStartDate, lastMonthEndDate] = getLastMonthDateRange();

  const [dateRange, setDateRange] = useState<[Date | null, Date | null]>([
    null,
    null,
  ]);

  const [fetchDateRange, setFetchDateRange] = useState<[Date, Date]>([
    lastMonthStartDate,
    lastMonthEndDate,
  ]);
  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.user);

  const {
    data: userData,
    error,
    isLoading,
  } = useQuery({
    queryKey: ["getUserApi"],
    queryFn: async () => {
      const res = await axiosInstance.get("/user/get-user");
      return res.data;
    },

    refetchOnWindowFocus: false,
  });

  if (error) {
    console.error("Error fetching user data:", error);
  }

  useEffect(() => {
    if (userData) {
      dispatch(SET_USER(userData?.user));
      localStorage.setItem("user", JSON.stringify(userData?.user));
    }
  }, [userData, dispatch]);

  const { isLoading: isProfessionalInfoLoading, professionalInfo } =
    useGetProfessionalInfo(user._id, user?._id ? true : false);
  const { isCheckedIn, isLoading: isCheckInStatusLoading } =
    useGetCheckInStatus(user._id);

  const { activityLog, isLoading: isActivityLogLoading } = useGetActivityLog(
    user._id,
    user?._id ? isCheckedIn : false
  );

  const {
    workStatusDuration: breakDuration,
    isLoading: isBreakDurationLoading,
  } = useGetWorkStatusDuration(
    "break",
    user?._id,
    user?._id ? isCheckedIn : false
  );

  const {
    workStatusDuration: productiveDuration,
    isLoading: isProductiveDurationLoading,
  } = useGetWorkStatusDuration(
    "productive",
    user?._id,
    user?._id ? isCheckedIn : false
  );

  const checkInCheckoutMutation = useMutation({
    mutationFn: async (isCheckedIn: boolean) => {
      const endpoint = isCheckedIn
        ? `/activity/check-out`
        : `/activity/check-in`;
      return axiosInstance.post(endpoint);
    },
    onSuccess: (res) => {
      toast({ title: res?.data?.message });
      queryClient.invalidateQueries({ queryKey: ["getCheckInStatus"] });
      queryClient.invalidateQueries({ queryKey: ["getActivityLog"] });
      queryClient.invalidateQueries({ queryKey: ["getWorkStatusDuration"] });
    },
    onError: (error: ApiError) => {
      toast({
        title: error?.response?.data?.error || "Something went wrong",
        variant: "destructive",
      });
    },
  });

  const fromDate = formatDate(fetchDateRange[0]);
  const toDate = formatDate(fetchDateRange[1]);

  const { averageProductiveHours, isLoading: isAverageProductiveHoursLoading } =
    useGetAverageProductiveHours(
      user?._id,
      user?._id ? true : false,
      toDate,
      fromDate
    );

  const handleDateRangeChange = (newDateRange: [Date | null, Date | null]) => {
    setDateRange(newDateRange);
    if (newDateRange[0] && newDateRange[1]) {
      setFetchDateRange([newDateRange[0], newDateRange[1]]);
    } else if (!newDateRange[0] && !newDateRange[1]) {
      setFetchDateRange([lastMonthStartDate, lastMonthEndDate]);
    }
  };

  const handleChecinCheckout = () => {
    checkInCheckoutMutation.mutate(isCheckedIn);
  };

  const checkedInTimeInMinutes = getCheckedInTimeInMinutes(
    activityLog?.checkInOutHistory?.checkInTime
  );

  if (
    isLoading ||
    isProfessionalInfoLoading ||
    isCheckInStatusLoading ||
    isActivityLogLoading ||
    isProductiveDurationLoading ||
    isBreakDurationLoading
  ) {
    return <Loader />;
  }

  return (
    <div className="flex flex-col h-screen w-full">
      {userData?.user?.isFirstTimeLogin && (
        <SetPassword userId={userData?.user?._id} />
      )}
      <HeaderCard
        title={userData?.user?.name}
        subTitle="Activity monitoring dashboard"
      />
      {professionalInfo?.professionalInfo.jobType === "remote" && (
        <div className="flex justify-center items-center my-4 w-full">
          <Button
            title={
              checkInCheckoutMutation.isPending
                ? "Loading..."
                : isCheckedIn
                ? "Check-out remotely"
                : "Check-in remotely"
            }
            onClick={handleChecinCheckout}
            disabled={checkInCheckoutMutation.isPending}
          />
        </div>
      )}
      {isCheckedIn && (
        <div className="flex flex-col w-full p-4 border border-gray-300 shadow-md shadow-gray-400 rounded-[5px] mt-4">
          <div className="flex justify-between">
            <div className="mb-4">
              <h2 className="text-2xl text-slate-800">Today's Analysis</h2>
              <span className="text-md text-slate-400">
                General analysis based on your today's activity.
              </span>
            </div>
            {activityLog?.isLateCheckin && (
              <span className="text-sm text-red-600">
                You were late today !
              </span>
            )}
          </div>

          <div className="flex justify-around  mt-2 gap-x-6">
            <div className="flex flex-col items-center">
              <span className="text-sm text-gray-500">Office Start Time</span>
              <h2 className="text-xl text-gray-800">
                {convertTo12HourFormat(
                  professionalInfo?.professionalInfo.officeStartTime
                )}
              </h2>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-sm text-gray-500">Check-In Time</span>
              <h2 className="text-xl text-primary">
                {formatTime(activityLog?.checkInOutHistory?.checkInTime)}
              </h2>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-sm text-gray-500">Break Time</span>
              <div className="flex gap-1 justify-center items-center ">
                <h2 className="text-xl text-gray-800 ">
                  <WorkStatusTimer
                    status={getLatestStatus(activityLog?.workStatusHistory)}
                    initialTimeInMinutes={breakDuration?.duration}
                    isBreak={true}
                  />
                </h2>
                {getLatestStatus(activityLog?.workStatusHistory) ===
                  "break" && (
                  <Icon
                    icon="uis:clock"
                    width={20}
                    height={20}
                    color="#fbb117"
                  />
                )}
              </div>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-sm text-gray-500">Checked In Since</span>
              <h2 className="text-xl text-gray-800">
                <CheckedInTimer initialTimeInMinutes={checkedInTimeInMinutes} />
              </h2>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-sm text-gray-500">Productive time</span>
              <h2 className="text-xl text-primary">
                <WorkStatusTimer
                  initialTimeInMinutes={productiveDuration?.duration}
                  status={getLatestStatus(activityLog?.workStatusHistory)}
                  isBreak={false}
                />
              </h2>
            </div>
          </div>
        </div>
      )}
      <div
        className="flex flex-col w-full p-4 border
       border-gray-300 shadow-md shadow-gray-400 rounded-[5px] mt-4"
      >
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl text-primary">Facts</h2>
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
        {averageProductiveHours ? (
          <div className="flex justify-between">
            <div className="">
              <span className="text-md text-gray-600">
                Average productive hours:{" "}
                {convertHoursToString(
                  averageProductiveHours?.averageProductiveHours
                )}
              </span>
            </div>
            <div className="">
              {averageProductiveHours?.isMinimumAverageProductiveHours ? (
                <span className="text-md text-green-400 text-end">
                  Your average productive hours are more tham minimum.
                </span>
              ) : (
                <span className="text-md text-red-400 text-end ">
                  Your average productive hours are less than minimum
                </span>
              )}
            </div>
          </div>
        ) : (
          <span className="text-md text-gray-600 text-center">
            No records found
          </span>
        )}
      </div>
    </div>
  );
}
