"use client";

import axiosInstance from "@/AxiosInterceptor";
import AvailableProductiveHours from "@/Components/AvailableProductiveHours";
import Button from "@/Components/Common/Button";
import CircularLoader from "@/Components/Common/CircularLoader";
import { FixedLengthPreview } from "@/Components/Common/FixedHieghtPreview";
import { Modal } from "@/Components/Common/Modal";
import { ShadcnButton } from "@/Components/Common/ShadcnButton";
import { toast } from "@/Components/Common/Toast/use-toast";
import DailyQuote from "@/Components/DailyQuote";
import DailyReports from "@/Components/DailyReports";
import AddTaskForm from "@/Components/Forms/AddTaskForm";
import TaskDetailsForm from "@/Components/Forms/TaskDetailsForm";
import HeaderCard from "@/Components/HeaderCard";
import useGetActivityLog from "@/hooks/use-get-activity-log";
import useGetAvailableProductiveDuration from "@/hooks/use-get-available-productive-duration";
import useGetDailyReport from "@/hooks/use-get-daily-report";
import useGetReportSubmissionStatus from "@/hooks/use-get-report-submission-status";
import { ApiError } from "@/lib/types";
import { formatDuration, getLatestStatus } from "@/lib/utils";
import { SET_MODAL } from "@/redux/slices/modalSlice";
import { RootState } from "@/redux/store";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { PlusIcon } from "lucide-react";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";

interface TaskDetailsFormProps {
  taskId: string;
  description: string;
  time: string;
  project: {
    _id: string;
    name: string;
  };
}

const Page = () => {
  const queryClient = useQueryClient();
  const [selectedTask, setSelectedTask] = useState<TaskDetailsFormProps | null>(
    null
  );
  const dispatch = useDispatch();
  const isModalOpen = useSelector((state: RootState) => state.modal);
  const user = useSelector((state: RootState) => state.user);

  const { dailyReport, isLoading } = useGetDailyReport(user?._id);
  const { isTodaysReportSubmitted } = useGetReportSubmissionStatus(user?._id);
  const { productiveDuration, isLoading: isProductiveDurationLoading } =
    useGetAvailableProductiveDuration(
      dailyReport?.report?._id,
      user?._id,
      user?._id ? true : false
    );
  const { activityLog, isLoading: isActivityLogLoading } = useGetActivityLog(
    user?._id,
    user?._id ? true : false
  );

  const submitReportMutation = useMutation({
    mutationFn: (reportId: string) => {
      return axiosInstance.patch(
        `/daily-report/submit-daily-report?reportId=${reportId}`
      );
    },
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: ["getDailyReport"] });
      queryClient.invalidateQueries({
        queryKey: ["getReportSubmissionStatus"],
      });

      toast({
        title: res?.data?.message,
      });
    },
    onError: (error: ApiError) => {
      toast({
        title: error?.response?.data?.error || "Something went wrong",
        variant: "destructive",
      });
    },
  });

  const closeTaskModal = () => {
    dispatch(SET_MODAL(false));
    if (selectedTask) {
      setSelectedTask(null);
    }
  };

  const handleReportSubmit = () => {
    submitReportMutation.mutate(dailyReport?.report?._id);
  };

  const handleTaskUpdateSuccess = () => {
    closeTaskModal();
  };

  return (
    <div className="w-full">
      {isModalOpen && !selectedTask && (
        <Modal
          title="Add task"
          open={!selectedTask && isModalOpen}
          onOpenChange={closeTaskModal}
          className="bg-white min-w-[600px]"
        >
          <AddTaskForm reportId={dailyReport?.report?._id} />
        </Modal>
      )}

      {selectedTask && isModalOpen && (
        <Modal
          title={`Task Details`}
          open={!!selectedTask && isModalOpen}
          onOpenChange={closeTaskModal}
          className="bg-white min-w-[600px]"
        >
          <TaskDetailsForm
            {...selectedTask}
            onUpdateSuccess={handleTaskUpdateSuccess}
          />
        </Modal>
      )}

      <HeaderCard
        title="Today's Report"
        subTitle="Manage your daily report & tasks"
      />
      {isLoading || isActivityLogLoading || isProductiveDurationLoading ? (
        <div className="flex items-center justify-center mt-10">
          <CircularLoader size={40} />
        </div>
      ) : (
        <>
          {!isTodaysReportSubmitted && dailyReport?.report ? (
            <div className="flex w-full gap-x-4 my-5">
              <div
                className="flex flex-col p-4 border border-gray-300 shadow-md shadow-gray-400
            rounded-[5px] w-[80%]
            "
              >
                <div className="flex justify-between items-center">
                  <div>
                    <h2 className="text-xl">
                      {new Date(dailyReport?.report?.date).toLocaleDateString(
                        "en-US",
                        {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        }
                      )}
                    </h2>
                    <span className="text-md text-slate-500">
                      Modify and add new tasks to your daily report
                    </span>
                  </div>
                  <div className="flex gap-2 items-center">
                    <ShadcnButton
                      className="w-20"
                      onClick={() => dispatch(SET_MODAL(true))}
                    >
                      <PlusIcon className="text-white min-h-6" />
                    </ShadcnButton>
                  </div>
                </div>

                <div className="flex-1 mt-10">
                  <div className="grid grid-cols-2 gap-4 w-[80%] justify-center items-center">
                    {dailyReport?.tasks?.length > 0 ? (
                      dailyReport.tasks.map((task: any) => (
                        <div
                          key={task._id}
                          className="flex flex-col justify-start p-4 items-start 
                          w-auto h-40 min-w-40 border border-gray-300 
                          shadow-md shadow-gray-400 rounded-[5px] cursor-pointer"
                          onClick={() => {
                            setSelectedTask({
                              taskId: task._id,
                              description: task.description,
                              time: task.time.toString(),
                              project: task.project,
                            });
                            dispatch(SET_MODAL(true));
                          }}
                        >
                          <span className="text-primary text-lg">
                            {task.project.name}{" "}
                            <span className="text-slate-600 text-lg">
                              - {formatDuration(task.time)}
                            </span>
                          </span>
                          <FixedLengthPreview value={task.description} />
                        </div>
                      ))
                    ) : (
                      <span className="text-slate-500 text-md text-center mt-5">
                        No tasks found
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex justify-end mt-4">
                  <Button
                    title={
                      submitReportMutation.isPending
                        ? "Loading..."
                        : "Submit Report"
                    }
                    disabled={submitReportMutation.isPending}
                    onClick={handleReportSubmit}
                  />
                </div>
              </div>

              <div className="flex flex-col items-center w-[20%] gap-y-2">
                <DailyQuote />
                <AvailableProductiveHours
                  availableProductiveDuration={productiveDuration}
                  status={getLatestStatus(activityLog?.workStatusHistory)}
                />
              </div>
            </div>
          ) : (
            <div
              className="
            flex items-center justify-center h-20 p-4
            border border-gray-300 
            shadow-md shadow-gray-400 
            mt-5 rounded-[5px]
          "
            >
              <span className="text-gray-600 text-lg">
                You've submitted the report
              </span>
            </div>
          )}
        </>
      )}

      <DailyReports />
    </div>
  );
};

export default Page;
