"use client";

import axiosInstance from "@/AxiosInterceptor";
import Button from "@/Components/Common/Button";
import Loader from "@/Components/Common/Loader";
import { Modal } from "@/Components/Common/Modal";
import { ShadcnButton } from "@/Components/Common/ShadcnButton";
import { toast } from "@/Components/Common/Toast/use-toast";
import DailyReports from "@/Components/DailyReports";
import AddTaskForm from "@/Components/Forms/AddTaskForm";
import TaskDetailsForm from "@/Components/Forms/TaskDetailsForm";
import HeaderCard from "@/Components/HeaderCard";
import useGetDailyReport from "@/hooks/use-get-daily-report";
import useGetReportSubmissionStatus from "@/hooks/use-get-report-submission-status";
import { ApiError } from "@/lib/types";
import { SET_MODAL } from "@/redux/slices/modalSlice";
import { RootState } from "@/redux/store";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { PlusIcon } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

interface TaskDetailsFormProps {
  taskId: string;
  title: string;
  description: string;
  time: string;
  projectId: string;
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
  const {
    isTodaysReportSubmitted,
    isLoading: isReportSubmissionStatusLoading,
  } = useGetReportSubmissionStatus(user?._id);

  const mutation = useMutation({
    mutationFn: () => {
      return axiosInstance.post(`/daily-report/create-daily-report`);
    },
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: ["getDailyReport"] });
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

  useEffect(() => {
    if (
      !isLoading &&
      !isReportSubmissionStatusLoading &&
      !dailyReport &&
      isTodaysReportSubmitted === false
    ) {
      mutation.mutate();
    }
  }, [dailyReport]);

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

  if (isLoading) {
    return <Loader />;
  }

  return (
    <div className="w-full">
      {isModalOpen && !selectedTask && (
        <Modal
          title={`Add task`}
          open={!selectedTask && isModalOpen}
          onOpenChange={closeTaskModal}
          className="bg-white min-w-[600px]"
        >
          <AddTaskForm reportId={dailyReport?.report?._id} />
        </Modal>
      )}

      {selectedTask && isModalOpen && (
        <Modal
          title={`Task Details: ${selectedTask.title}`}
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
      {!isTodaysReportSubmitted ? (
        <div
          className="flex flex-col p-4 border border-gray-300 shadow-md
       shadow-gray-400 mt-5 rounded-[5px]"
        >
          <div className="flex justify-between items-center">
            <div className="">
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
          <div className="grid grid-cols-4 gap-4 w-full justify-center items-center mt-10">
            {dailyReport?.tasks?.length > 0 ? (
              dailyReport.tasks.map((task: any) => (
                <div
                  key={task._id}
                  className="flex justify-center p-4 items-center w-auto h-auto min-h-20
                 min-w-40 border border-gray-300 shadow-md shadow-gray-400 rounded-md cursor-pointer"
                  onClick={() => {
                    setSelectedTask({
                      taskId: task._id,
                      title: task.title,
                      description: task.description,
                      time: task.time.toString(),
                      projectId: task.project,
                    });
                    dispatch(SET_MODAL(true));
                  }}
                >
                  <span className="text-slate-600 text-lg ">{task.title}</span>
                </div>
              ))
            ) : (
              <span className="text-slate-500 text-md text-center mt-5">
                No tasks found
              </span>
            )}
          </div>

          <div className="flex items-center justify-end mt-4">
            <Button
              title={
                submitReportMutation.isPending ? "Loading..." : "Submit Report"
              }
              disabled={submitReportMutation.isPending}
              onClick={handleReportSubmit}
            />
          </div>
        </div>
      ) : (
        <div
          className="flex items-center justify-center h-20 p-4 border border-gray-300 shadow-md
       shadow-gray-400 mt-5 rounded-[5px]"
        >
          <span className="text-gray-600 text-lg">
            You've submitted today's report
          </span>
        </div>
      )}
      <DailyReports />
    </div>
  );
};

export default Page;
