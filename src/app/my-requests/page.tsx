"use client";
import CircularLoader from "@/Components/Common/CircularLoader";
import { Modal } from "@/Components/Common/Modal";
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
import HalfDayRequestForm from "@/Components/Forms/HalfDayRequestForm";
import LeaveRequestForm from "@/Components/Forms/LeaveRequestForm";
import WFHRequestForm from "@/Components/Forms/WFHRequestForm";
import HeaderCard from "@/Components/HeaderCard";
import RequestCard from "@/Components/RequestCard";
import useGetMyRequests from "@/hooks/use-get-my-requests";
import { RequestType } from "@/lib/types";
import { SET_MODAL } from "@/redux/slices/modalSlice";
import { RootState } from "@/redux/store";
import { Icon } from "@iconify/react";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { useInView } from "react-intersection-observer";
import dynamic from "next/dynamic";

const requests = [
  {
    type: "leave",
    icon: "mdi:progress-clock",
    heading: "Generate Leave",
  },
  {
    type: "half_day",
    icon: "material-symbols-light:hourglass-bottom-rounded",
    heading: "Generate Half Day",
  },
  {
    type: "wfh",
    icon: "material-symbols-light:home-and-garden-outline-rounded",
    heading: "Generate Work From Home",
  },
];

const Page = () => {
  const user = useSelector((state: RootState) => state.user);
  const isModalOpen = useSelector((state: RootState) => state.modal);
  const dispatch = useDispatch();
  const [requestType, setRequestType] = useState(null);
  const [requestStatus, setRequestStatus] = useState("pending");
  const [type, setType] = useState("leave");

  const closeModal = () => {
    dispatch(SET_MODAL(false));
    if (requestType) {
      setRequestType(null);
    }
  };

  const {
    myRequests,
    isLoading: isMyRequestsLoading,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useGetMyRequests(requestStatus, type, Boolean(user._id), user._id);

  const { ref, inView } = useInView({ threshold: 0 });

  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage]);

  const allRequests = myRequests?.pages.flatMap((page) => page.data) || [];

  return (
    <>
      <HeaderCard
        title="My Requests"
        subTitle="Generate and Review your requests"
      />

      {isModalOpen && requestType === "leave" && (
        <Modal
          title={`Generate Leave Request`}
          open={requestType === "leave" && isModalOpen}
          onOpenChange={closeModal}
          className="bg-white min-w-[600px]"
        >
          <LeaveRequestForm
            onGenerateSuccess={() => {
              closeModal();
            }}
          />
        </Modal>
      )}

      {isModalOpen && requestType === "half_day" && (
        <Modal
          title={`Generate Half Day Request`}
          open={requestType === "half_day" && isModalOpen}
          onOpenChange={closeModal}
          className="bg-white min-w-[600px]"
        >
          <HalfDayRequestForm
            onGenerateSuccess={() => {
              closeModal();
            }}
          />
        </Modal>
      )}

      {isModalOpen && requestType === "wfh" && (
        <Modal
          title={`Generate WFH Request`}
          open={requestType === "wfh" && isModalOpen}
          onOpenChange={closeModal}
          className="bg-white min-w-[600px]"
        >
          <WFHRequestForm
            onGenerateSuccess={() => {
              closeModal();
            }}
          />
        </Modal>
      )}

      <div className="flex items-center justify-center flex-wrap gap-4 mt-5">
        {requests.map((request: any) => (
          <div
            className="flex flex-col items-center justify-center p-4 gap-y-1
            border border-gray-300 shadow-md shadow-gray-400 rounded-[5px]
            min-w-80 min-h-40 cursor-pointer"
            key={request.type}
            onClick={() => {
              setRequestType(request.type);
              dispatch(SET_MODAL(true));
            }}
          >
            <Icon icon={request.icon} className="w-10 h-10 text-primary" />
            <h2 className="text-lg text-primary">{request.heading}</h2>
            <span className="text-md text-slate-500">Request</span>
          </div>
        ))}
      </div>

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
                  isMyRequest={true}
                  key={request._id}
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

export default Page;
