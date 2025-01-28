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
import { leaveRequest } from "@/lib/schemas";
import { ApiError } from "@/lib/types";
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
  onGenerateSuccess: () => void;
}

const LeaveRequestForm = ({ onGenerateSuccess }: LeaveRequestFormProps) => {
  const queryClient = useQueryClient();
  const form = useForm<z.infer<typeof leaveRequest>>({
    resolver: zodResolver(leaveRequest),
    mode: "onBlur",
    defaultValues: {
      leaveType: "casual",
      dateRange: [],
      reason: "",
    },
  });

  const mutation = useMutation({
    mutationFn: (data: RequestBodyType) => {
      return axiosInstance.post(`/request/leave-request`, data);
    },
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: ["getMyRequests"] });

      toast({
        title: res?.data?.message,
      });
      onGenerateSuccess?.();
    },
    onError: (error: ApiError) => {
      toast({
        title: error?.response?.data?.error || "Something went wrong",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (values: z.infer<typeof leaveRequest>) => {
    const formattedPayload: RequestBodyType = {
      leaveType: values.leaveType,
      startDate: formatDate(values.dateRange[0]),
      endDate: formatDate(values.dateRange[0]),
      reason: values.reason,
    };

    mutation.mutate(formattedPayload);
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
                disabled={mutation.isPending}
                className="min-w-40"
              />
            </div>
          </div>
        </form>
      </Form>
    </>
  );
};

export default LeaveRequestForm;
