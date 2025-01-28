"use client";
import axiosInstance from "@/AxiosInterceptor";
import Button from "@/Components/Common/Button";
import { DateRangePicker } from "@/Components/Common/DateRangePicker";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
} from "@/Components/Common/Form";
import InputField from "@/Components/Common/InputField";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/Components/Common/SelectionField";
import { toast } from "@/Components/Common/Toast/use-toast";
import { leaveRequest, updateLeaveRequestSchema } from "@/lib/schemas";
import { ApiError, RequestType } from "@/lib/types";
import { formatDate } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

interface RequestBodyType {
  leaveType: string;
  startDate: string;
  endDate: string;
  reason: string;
}

interface LeaveRequestFormProps {
  onUpdateSuccess: () => void;
  request: RequestType;
}

const UpdateLeaveRequest = ({
  onUpdateSuccess,
  request,
}: LeaveRequestFormProps) => {
  const queryClient = useQueryClient();
  const formattedDateRange = [
    new Date(request.startDate),
    new Date(request.endDate),
  ];
  const form = useForm<z.infer<typeof updateLeaveRequestSchema>>({
    resolver: zodResolver(updateLeaveRequestSchema),
    mode: "onBlur",
    defaultValues: {
      leaveType: request.leaveType,
      dateRange: formattedDateRange,
      reason: request.reason,
    },
  });

  const mutation = useMutation({
    mutationFn: (data: RequestBodyType) => {
      return axiosInstance.patch(
        `/request/update-leave-request?requestId=${request._id}`,
        data
      );
    },
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: ["getMyRequests"] });
      toast({
        title: res?.data?.message,
      });
      onUpdateSuccess?.();
    },
    onError: (error: ApiError) => {
      toast({
        title: error?.response?.data?.error || "Something went wrong",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (values: z.infer<typeof updateLeaveRequestSchema>) => {
    const { dirtyFields } = form.formState;

    const formattedPayload: Partial<RequestBodyType> = {};

    if (dirtyFields.dateRange) {
      formattedPayload.startDate = formatDate(values.dateRange[0]);
      formattedPayload.endDate = formatDate(values.dateRange[1]);
    }

    if (dirtyFields.leaveType) {
      formattedPayload.leaveType = values.leaveType;
    }

    if (dirtyFields.reason) {
      formattedPayload.reason = values.reason;
    }

    mutation.mutate(formattedPayload as RequestBodyType);
  };

  return (
    <>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex items-center justify-center w-full mb-5"
        >
          <div className="flex flex-col gap-2 w-full">
            <FormField
              name="leaveType"
              control={form.control}
              render={({ field }) => (
                <FormItem className="flex justify-center items-center">
                  <FormControl className="grow ">
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger
                        label="Project:"
                        errorMessage={form.formState.errors.leaveType?.message}
                        className="text-black"
                      >
                        <SelectValue placeholder="Select a project" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="casual">Casual</SelectItem>
                        <SelectItem value="sick">Sick</SelectItem>
                        <SelectItem value="annual">Annual</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              name="dateRange"
              control={form.control}
              render={({ field }) => (
                <FormItem className="flex flex-col justify-start items-start w-full">
                  <FormControl className="grow">
                    <DateRangePicker
                      label="Date Range"
                      startDate={field.value[0] || null}
                      endDate={field.value[1] || null}
                      setDateRange={field.onChange}
                      errorMessage={form.formState?.errors?.dateRange?.message}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              name="reason"
              control={form.control}
              render={({ field }) => (
                <FormItem className="flex flex-col justify-start items-start w-full">
                  <FormControl className="grow">
                    <InputField
                      label="Reason: "
                      value={field.value}
                      errorMessage={form?.formState?.errors?.reason?.message}
                      onChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <div className="flex w-full justify-end">
              <Button
                title={mutation.isPending ? "Loading.." : "Save"}
                disabled={mutation.isPending || !form.formState.isDirty}
                className="min-w-40"
              />
            </div>
          </div>
        </form>
      </Form>
    </>
  );
};

export default UpdateLeaveRequest;
