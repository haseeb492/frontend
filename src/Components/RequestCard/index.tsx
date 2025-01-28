"use client";
import React, { useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../Common/SelectionField";
import { ApiError, RequestType } from "@/lib/types";
import {
  calculateDateDiff,
  capitalizeWords,
  formatDateRange,
  formatString,
} from "@/lib/utils";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { SET_MODAL } from "@/redux/slices/modalSlice";
import { Modal } from "../Common/Modal";
import UpdateLeaveRequest from "../Forms/UpDateLeaveRequest";
import UpdateHalfDayRequest from "../Forms/UpdateHalfDayRequest";
import UpdateWFHRequest from "../Forms/UpdateWFHRequest";
import Button from "../Common/Button";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axiosInstance from "@/AxiosInterceptor";
import { toast } from "../Common/Toast/use-toast";
import RejectRequestForm from "../Forms/RejectRequestForm";

interface RequestCardProps {
  request: RequestType;
  isMyRequest: boolean;
  canResolveRequest?: boolean;
}

const RequestCard = ({
  request,
  isMyRequest,
  canResolveRequest = true,
}: RequestCardProps) => {
  const queryClient = useQueryClient();
  const isModalOpen = useSelector((state: RootState) => state.modal);
  const dispatch = useDispatch();
  const [selectedRequest, setSelectedRequest] = useState<RequestType | null>(
    null
  );
  const [newStatus, setNewStatus] = useState(request.status);

  const closeModal = () => {
    dispatch(SET_MODAL(false));
    if (selectedRequest) {
      setSelectedRequest(null);
    }
    setNewStatus(request.status);
  };

  const mutation = useMutation({
    mutationFn: (requestId: string) => {
      return axiosInstance.patch(`/request/cancel?requestId=${requestId}`);
    },
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: ["getMyRequests"] });
      toast({
        title: res?.data?.message,
      });
      closeModal();
    },
    onError: (error: ApiError) => {
      toast({
        title: error?.response?.data?.error || "Something went wrong",
        variant: "destructive",
      });
    },
  });

  const approveRequestMutation = useMutation({
    mutationFn: ({
      requestId,
      requestType,
    }: {
      requestId: string;
      requestType: string;
    }) => {
      const endpoint =
        requestType === "leave"
          ? `/request/approve-leave-request?requestId=${requestId}`
          : requestType === "wfh"
          ? `/request/approve-wfh-request?requestId=${requestId}`
          : `/request/approve-half-day-request?requestId=${requestId}`;
      return axiosInstance.patch(endpoint);
    },
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: ["getMyRequests"] });
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

  const handleStatusChange = (value: string) => {
    setNewStatus(value);
    if (value === "canceled") {
      dispatch(SET_MODAL(true));
      setSelectedRequest(null);
    } else if (value === "rejected") {
      dispatch(SET_MODAL(true));
      setSelectedRequest(null);
    } else if (value === "approved") {
      approveRequestMutation.mutate({
        requestId: request._id,
        requestType: request.type,
      });
    }
  };
  return (
    <>
      {isModalOpen &&
        selectedRequest &&
        selectedRequest?.type === "leave" &&
        selectedRequest.status === "pending" && (
          <Modal
            title={`Update Leave Request`}
            open={
              !!selectedRequest &&
              selectedRequest.type === "leave" &&
              selectedRequest.status === "pending" &&
              isModalOpen
            }
            onOpenChange={closeModal}
            className="bg-white min-w-[600px]"
          >
            <UpdateLeaveRequest
              onUpdateSuccess={() => {
                closeModal();
              }}
              request={selectedRequest}
            />
          </Modal>
        )}

      {isModalOpen &&
        selectedRequest &&
        selectedRequest?.type === "half_day" &&
        selectedRequest.status === "pending" && (
          <Modal
            title={`Generate Half Day Request`}
            open={
              !!selectedRequest &&
              selectedRequest.type === "half_day" &&
              selectedRequest.status === "pending" &&
              isModalOpen
            }
            onOpenChange={closeModal}
            className="bg-white min-w-[600px]"
          >
            <UpdateHalfDayRequest
              onUpdateSuccess={() => {
                closeModal();
              }}
              request={selectedRequest}
            />
          </Modal>
        )}

      {isModalOpen &&
        selectedRequest &&
        selectedRequest?.type === "wfh" &&
        selectedRequest.status === "pending" && (
          <Modal
            title={`Generate WFH Request`}
            open={
              !!selectedRequest &&
              selectedRequest.type === "wfh" &&
              selectedRequest.status === "pending" &&
              isModalOpen
            }
            onOpenChange={closeModal}
            className="bg-white min-w-[600px]"
          >
            <UpdateWFHRequest
              onUpdateSuccess={() => {
                closeModal();
              }}
              request={selectedRequest}
            />
          </Modal>
        )}

      {isModalOpen &&
        !selectedRequest &&
        newStatus === "canceled" &&
        request.status === "pending" && (
          <Modal
            title={`Cancel request`}
            open={
              !selectedRequest &&
              newStatus === "canceled" &&
              request.status === "pending" &&
              isModalOpen
            }
            onOpenChange={closeModal}
            className="bg-white min-w-[600px]"
          >
            <div className="flex flex-col">
              <div className="text-slate-500 text-lg">
                Are you sure you want to cancel this request? This can't be
                undone.
              </div>
              <div className="flex justify-end w-full mb-5 gap-2">
                <Button
                  title={"Go Back"}
                  variant="outline"
                  onClick={() => closeModal()}
                />
                <Button
                  title={mutation.isPending ? "Loading..." : "Confirm"}
                  disabled={mutation.isPending}
                  variant="destructive"
                  onClick={() => mutation.mutate(request._id)}
                />
              </div>
            </div>
          </Modal>
        )}
      {isModalOpen &&
        !selectedRequest &&
        newStatus === "rejected" &&
        request.status === "pending" && (
          <Modal
            title={`Cancel request`}
            open={
              !selectedRequest &&
              newStatus === "rejected" &&
              request.status === "pending" &&
              isModalOpen
            }
            onOpenChange={closeModal}
            className="bg-white min-w-[600px]"
          >
            <RejectRequestForm
              onRejectSuccess={() => closeModal()}
              requestId={request._id}
            />
          </Modal>
        )}
      <div
        className="flex flex-col p-4 gap-4 border border-gray-300 shadow-md
         shadow-gray-400 rounded-[5px]"
        onClick={() => {
          setSelectedRequest(request);
          dispatch(SET_MODAL(true));
        }}
      >
        <div className="flex items-center justify-between">
          <div className="">
            <span className="text-primary text-lg">
              {formatString(request.type)}
              <span className="text-lg text-slate-500">
                {" "}
                {request.type !== "wfh" && (
                  <span className="text-lg text-slate-500">|</span>
                )}{" "}
                {formatString(request?.halfDayType || request.leaveType || "")}
              </span>
            </span>
          </div>
          <div className="">
            <span className="text-primary text-md">
              {" "}
              {calculateDateDiff(
                new Date(request.startDate),
                new Date(request.endDate)
              )}{" "}
              {calculateDateDiff(
                new Date(request.startDate),
                new Date(request.endDate)
              ) > 1
                ? "Days"
                : "Day"}
              <span className="text-slate-500 text-md">
                {" "}
                |{" "}
                {formatDateRange(
                  new Date(request.startDate),
                  new Date(request.endDate)
                )}
              </span>
            </span>
          </div>
          <div className="">
            <Select
              value={newStatus}
              disabled={request.status !== "pending" || !canResolveRequest}
              onValueChange={handleStatusChange}
            >
              <SelectTrigger
                className="min-w-40"
                onClick={(e) => e.stopPropagation()}
              >
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {request.status === "pending" ? (
                  <>
                    {isMyRequest ? (
                      <>
                        <SelectItem value="canceled">Canceled</SelectItem>
                        <SelectItem value={request.status}>
                          {capitalizeWords(request.status)}
                        </SelectItem>
                      </>
                    ) : (
                      <>
                        <SelectItem value="rejected">Rejected</SelectItem>
                        <SelectItem value="approved">Approved</SelectItem>
                        <SelectItem value={request.status}>
                          {capitalizeWords(request.status)}
                        </SelectItem>
                      </>
                    )}
                  </>
                ) : (
                  <SelectItem value={request.status}>
                    {capitalizeWords(request.status)}
                  </SelectItem>
                )}
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="flex items-center justify-between ">
          <div className="">
            <span className="text-lg text-slate-500">
              Generated By :
              <span className="text-primary text-lg">
                {" "}
                {request.generatedBy?.name}
              </span>
            </span>
          </div>
          {request.approvedBy && (
            <div className="">
              <span className="text-lg text-slate-500">
                Approved By :
                <span className="text-primary text-lg">
                  {" "}
                  {request.approvedBy.name}
                </span>
              </span>
            </div>
          )}
        </div>
        <div className="flex items-center justify-start">
          <span className="text-lg text-primary">
            Reason :{" "}
            <span className="text-md text-slate-500">{request.reason}</span>
          </span>
        </div>
        {request.remarks && (
          <div className="flex items-center justify-start">
            <span className="text-lg text-primary">
              Remarks :{" "}
              <span className="text-md text-slate-500">{request.remarks}</span>
            </span>
          </div>
        )}
      </div>
    </>
  );
};

export default RequestCard;
