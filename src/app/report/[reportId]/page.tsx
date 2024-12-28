"use client";

import axiosInstance from "@/AxiosInterceptor";
import Button from "@/Components/Common/Button";
import Loader from "@/Components/Common/Loader";
import { Modal } from "@/Components/Common/Modal";
import { ShadcnButton } from "@/Components/Common/ShadcnButton";
import { toast } from "@/Components/Common/Toast/use-toast";
import AddTaskForm from "@/Components/Forms/AddTaskForm";
import TaskDetailsForm from "@/Components/Forms/TaskDetailsForm";
import HeaderCard from "@/Components/HeaderCard";
import useGetDailyReport from "@/hooks/use-get-daily-report";
import { ApiError } from "@/lib/types";
import { SET_MODAL } from "@/redux/slices/modalSlice";
import { RootState } from "@/redux/store";
import { useMutation } from "@tanstack/react-query";
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

const Page = ({ params }: { params: { reportId: string } }) => {
  const [selectedTask, setSelectedTask] = useState<TaskDetailsFormProps | null>(
    null
  );
  const [isLoggedIn, setIsLoggedIn] = useState<boolean | undefined>(undefined);
  const user = useSelector((state: RootState) => state.user);
  const isModalOpen = useSelector((state: RootState) => state.modal);

  const dispatch = useDispatch();

  const { dailyReport, isLoading } = useGetDailyReport(
    user?._id,
    user?._id ? true : false,
    params.reportId
  );

  const submitReportMutation = useMutation({
    mutationFn: (reportId: string) => {
      return axiosInstance.patch(
        `/daily-report/submit-daily-report?reportId=${reportId}`
      );
    },
    onSuccess: (res) => {
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
    if (user?._id && dailyReport?.report) {
      if (dailyReport?.report?.user === user?._id) {
        setIsLoggedIn(true);
      } else {
        setIsLoggedIn(false);
      }
    }
  }, [user, dailyReport]);

  const closeTaskModal = () => {
    dispatch(SET_MODAL(false));
    if (selectedTask) {
      setSelectedTask(null);
    }
  };

  const handleTaskUpdateSuccess = () => {
    closeTaskModal();
  };

  const handleReportSubmit = () => {
    submitReportMutation.mutate(dailyReport?.report?._id);
  };

  return (
    <div className="w-full">
      {isLoading ? (
        <Loader />
      ) : (
        <>
          <HeaderCard title="Report" subTitle="Preview or edit your report" />
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
                isLoggedIn={isLoggedIn}
                onUpdateSuccess={handleTaskUpdateSuccess}
              />
            </Modal>
          )}
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
                {isLoggedIn && (
                  <span className="text-md text-slate-500">
                    Review or edit your report
                  </span>
                )}
              </div>
              <div className="flex gap-2 items-center">
                {isLoggedIn && (
                  <ShadcnButton
                    className="w-20"
                    onClick={() => dispatch(SET_MODAL(true))}
                  >
                    <PlusIcon className="text-white min-h-6" />
                  </ShadcnButton>
                )}
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
                    <span className="text-slate-600 text-lg ">
                      {task.title}
                    </span>
                  </div>
                ))
              ) : (
                <span className="text-slate-500 text-md text-center mt-5">
                  No tasks found
                </span>
              )}
            </div>

            <div className="flex items-center justify-end mt-4">
              {!dailyReport?.isSubmitted && (
                <Button
                  title={
                    submitReportMutation.isPending
                      ? "Loading..."
                      : "Submit Report"
                  }
                  disabled={submitReportMutation.isPending}
                  onClick={handleReportSubmit}
                />
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Page;
