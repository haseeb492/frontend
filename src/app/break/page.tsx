"use client";

import React, { useEffect, useState } from "react";
import breakImage from "../../assets/break-image.jpg";
import BreakTimer from "@/Components/BreakTimer";
import { useRouter } from "next/navigation";
import useGetCheckInStatus from "@/hooks/use-get-check-in-status";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import useGetActivityLog from "@/hooks/use-get-activity-log";
import { getLatestStatus } from "@/lib/utils";
import Button from "@/Components/Common/Button";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axiosInstance from "@/AxiosInterceptor";
import { toast } from "@/Components/Common/Toast/use-toast";
import { ApiError } from "@/lib/types";

const BreakPage = () => {
  const queryClient = useQueryClient();
  const router = useRouter();
  const user = useSelector((state: RootState) => state.user);
  const { isCheckedIn } = useGetCheckInStatus(user?._id);
  const [workStatus, setWorkStatus] = useState<string | null>(null);
  const { activityLog } = useGetActivityLog(
    user?._id,
    user?._id ? true : false
  );

  console.log(workStatus);

  useEffect(() => {
    if (activityLog) {
      setWorkStatus(getLatestStatus(activityLog?.workStatusHistory));
    }
  }, [activityLog]);

  const mutation = useMutation({
    mutationFn: async (newStatus: string) => {
      const endpoint = `/activity/update-status?newStatus=${newStatus}`;
      return axiosInstance.patch(endpoint);
    },
    onSuccess: (res) => {
      toast({ title: res?.data?.message });
      queryClient.invalidateQueries({ queryKey: ["getActivityLog"] });
      queryClient.invalidateQueries({ queryKey: ["getWorkStatusDuration"] });
      router.push("/");
    },
    onError: (error: ApiError) => {
      toast({
        title: error?.response?.data?.error || "Something went wrong",
        variant: "destructive",
      });
    },
  });
  //Note : commented this part will fix the issue later
  //   useEffect(() => {
  //     if (activityLog) {
  //       if (isCheckedIn === false || workStatus !== "break") {
  //         router.push("/");
  //       }
  //     }
  //   }, [workStatus]);

  return (
    <div className="relative h-full w-full overflow-hidden">
      <div
        className="absolute inset-0 bg-center bg-no-repeat flex items-center justify-center"
        style={{
          backgroundImage: `url(${breakImage.src})`,
          backgroundSize: "70%",
          backgroundRepeat: "no-repeat",
          backgroundPosition: "center",
          opacity: 1,
        }}
      ></div>

      <div className="absolute inset-0"></div>

      <div className="relative z-10 flex flex-col items-center justify-center mt-48 h-full px-4">
        <div className="bg-white bg-opacity-70 border border-primary backdrop-filter backdrop-blur-lg p-20 rounded-lg shadow-lg text-center min-w-sm">
          <h1 className="text-primary text-3xl font-bold mb-4">
            Relax - Refresh - Recharge
          </h1>

          <div className="mb-3 flex items-center justify-center">
            <BreakTimer />
          </div>
          <div className="flex items-center justify-center gap-3 mb-3">
            <Button
              title="Go back"
              onClick={() => {
                router.push("/");
              }}
              variant="outline"
            />
            <Button
              title={mutation.isPending ? "Loading..." : "End break"}
              disabled={mutation.isPending}
              onClick={() => mutation.mutate("working")}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default BreakPage;
