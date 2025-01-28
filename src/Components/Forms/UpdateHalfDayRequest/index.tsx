"use client";
import axiosInstance from "@/AxiosInterceptor";
import Button from "@/Components/Common/Button";
import { DatePickerField } from "@/Components/Common/DatePicker";
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
import { updateHalfDayRequestSchema } from "@/lib/schemas";
import { ApiError, RequestType } from "@/lib/types";
import { formatDate } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

interface RequestBodyType {
  halfDayType: string;
  date: string;
  reason: string;
}

interface HalfDayRequestFormProps {
  onUpdateSuccess: () => void;
  request: RequestType;
}

const UpdateHalfDayRequest = ({
  onUpdateSuccess,
  request,
}: HalfDayRequestFormProps) => {
  const queryClient = useQueryClient();
  const form = useForm<z.infer<typeof updateHalfDayRequestSchema>>({
    resolver: zodResolver(updateHalfDayRequestSchema),
    mode: "onBlur",
    defaultValues: {
      halfDayType: request?.halfDayType,
      date: new Date(request?.startDate),
      reason: request?.reason,
    },
  });

  const mutation = useMutation({
    mutationFn: (data: RequestBodyType) => {
      return axiosInstance.patch(
        `/request/update-half-day-request?requestId=${request._id}`,
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

  const onSubmit = (values: z.infer<typeof updateHalfDayRequestSchema>) => {
    const { dirtyFields } = form.formState;
    const formattedPayload: Partial<RequestBodyType> = {};

    if (dirtyFields.date) {
      formattedPayload.date = formatDate(values?.date);
    }

    if (dirtyFields.halfDayType) {
      formattedPayload.halfDayType = values.halfDayType;
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
              name="halfDayType"
              control={form.control}
              render={({ field }) => (
                <FormItem className="flex justify-center items-center">
                  <FormControl className="grow ">
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger
                        label="Project:"
                        errorMessage={
                          form.formState.errors.halfDayType?.message
                        }
                        className="text-black"
                      >
                        <SelectValue placeholder="Select a project" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="first_half">First Half</SelectItem>
                        <SelectItem value="second_half">Second Half</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              name="date"
              control={form.control}
              render={({ field }) => (
                <FormItem className="flex flex-col justify-start items-start w-full">
                  <FormControl className="grow">
                    <DatePickerField
                      label="Date:"
                      value={field.value}
                      errorMessage={form?.formState?.errors?.date?.message}
                      onChange={field.onChange}
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

export default UpdateHalfDayRequest;
