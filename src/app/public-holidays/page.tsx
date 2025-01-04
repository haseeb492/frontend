"use client";
import Button from "@/Components/Common/Button";
import CircularLoader from "@/Components/Common/CircularLoader";
import { Modal } from "@/Components/Common/Modal";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/Components/Common/Table";
import AddHolidayForm from "@/Components/Forms/AddHolidayForm";
import HolidayDetailsForm from "@/Components/Forms/HolidayDetailsForm";
import HeaderCard from "@/Components/HeaderCard";
import useGetPublicHolidays from "@/hooks/use-get-public-holidays";
import { capitalizeWords, checkAccess } from "@/lib/utils";
import { SET_MODAL } from "@/redux/slices/modalSlice";
import { RootState } from "@/redux/store";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Icon } from "@iconify/react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axiosInstance from "@/AxiosInterceptor";
import { toast } from "@/Components/Common/Toast/use-toast";
import { ApiError } from "@/lib/types";

interface HolidayType {
  _id: string;
  name: string;
  date: string;
}

interface HolidayFormProps {
  holidayId: string;
  title: string;
  date: string;
}

const tableColumns = [
  { label: "Title", value: "title" },
  { label: "Date", value: "date" },
];

const Page = () => {
  const queryClient = useQueryClient();
  const [selectedHoliday, setSelectedHoliday] =
    useState<HolidayFormProps | null>(null);
  const dispatch = useDispatch();

  const user = useSelector((state: RootState) => state.user);
  const isModalOpen = useSelector((state: RootState) => state.modal);

  const canAccessHolidays = checkAccess(user, "Holiday", "component");

  const { holidays, isLoading } = useGetPublicHolidays(
    user?._id,
    user?._id ? true : false
  );

  const mutation = useMutation({
    mutationFn: (holidayId: string) => {
      return axiosInstance.delete(
        `/holiday/remove-holiday?holidayId=${holidayId}`
      );
    },
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: ["getPublicHolidays"] });
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
    if (selectedHoliday) {
      setSelectedHoliday(null);
    }
  };

  const handleTaskUpdateSuccess = () => {
    closeTaskModal();
  };

  return (
    <div className="flex flex-col gap-5 w-full">
      <HeaderCard title="Public Holidays" subTitle="View Public Holidays" />
      {isModalOpen && !selectedHoliday && (
        <Modal
          title={`Add Holiday`}
          open={!selectedHoliday && isModalOpen}
          onOpenChange={closeTaskModal}
          className="bg-white min-w-[600px]"
        >
          <AddHolidayForm />
        </Modal>
      )}

      {selectedHoliday && isModalOpen && (
        <Modal
          title={`Holiday Details: ${selectedHoliday?.title}`}
          open={!!selectedHoliday && isModalOpen}
          onOpenChange={closeTaskModal}
          className="bg-white min-w-[600px]"
        >
          <HolidayDetailsForm
            {...selectedHoliday}
            onUpdateSuccess={handleTaskUpdateSuccess}
          />
        </Modal>
      )}
      {isLoading ? (
        <div className="flex items-center justify-center mt-10">
          <CircularLoader size={40} />
        </div>
      ) : (
        <>
          <div className="overflow-x-auto">
            <Table className="min-w-full mt-5">
              <TableHeader>
                <TableRow className="truncate">
                  {tableColumns.map((column) => (
                    <TableHead key={column.value}>{column.label}</TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {holidays && holidays.length > 0 ? (
                  holidays.map((holiday: HolidayType) => (
                    <TableRow
                      key={holiday._id}
                      className="truncate cursor-pointer group hover:bg-gray-100"
                      onClick={() => {
                        if (canAccessHolidays) {
                          setSelectedHoliday({
                            holidayId: holiday._id,
                            title: holiday.name,
                            date: holiday.date,
                          });
                          dispatch(SET_MODAL(true));
                        }
                      }}
                    >
                      <TableCell>{capitalizeWords(holiday.name)}</TableCell>
                      <TableCell className="flex justify-between items-center relative">
                        <span>
                          {new Date(holiday.date).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          })}
                        </span>
                        {canAccessHolidays && (
                          <div
                            className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 cursor-pointer"
                            onClick={(e) => {
                              e.stopPropagation();
                              mutation.mutate(holiday._id);
                            }}
                          >
                            <Icon
                              icon="ic:baseline-delete-forever"
                              width={30}
                              height={30}
                              color="#FF0000"
                            />
                          </div>
                        )}
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={2} className="text-center py-4">
                      No Holidays found
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
          {canAccessHolidays && (
            <div className="flex items-center justify-start w-full">
              <Button
                title="Add Holiday"
                onClick={() => {
                  dispatch(SET_MODAL(true));
                }}
                className="min-w-20"
              />
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Page;
