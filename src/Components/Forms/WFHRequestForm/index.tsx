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
import { toast } from "@/Components/Common/Toast/use-toast";
import { wfhRequest } from "@/lib/schemas";
import { ApiError } from "@/lib/types";
import { formatDate } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

interface RequestBodyType {
  startDate: string;
  endDate: string;
  reason: string;
}

interface WFHRequestFormProps {
  onGenerateSuccess: () => void;
}

const WFHRequestForm = ({ onGenerateSuccess }: WFHRequestFormProps) => {
  const queryClient = useQueryClient();
  const form = useForm<z.infer<typeof wfhRequest>>({
    resolver: zodResolver(wfhRequest),
    mode: "onBlur",
    defaultValues: {
      dateRange: [],
      reason: "",
    },
  });

  const mutation = useMutation({
    mutationFn: (data: RequestBodyType) => {
      return axiosInstance.post(`/request/wfh-request`, data);
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

  const onSubmit = (values: z.infer<typeof wfhRequest>) => {
    const formattedPayload: RequestBodyType = {
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

export default WFHRequestForm;
