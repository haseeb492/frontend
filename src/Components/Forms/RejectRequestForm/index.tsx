"use client";
import axiosInstance from "@/AxiosInterceptor";
import Button from "@/Components/Common/Button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
} from "@/Components/Common/Form";
import InputField from "@/Components/Common/InputField";
import { toast } from "@/Components/Common/Toast/use-toast";
import { rejectRequestSchema } from "@/lib/schemas";
import { ApiError } from "@/lib/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

interface RejectRequestFormProps {
  onRejectSuccess: () => void;
  requestId: string;
}

const RejectRequestForm = ({
  onRejectSuccess,
  requestId,
}: RejectRequestFormProps) => {
  const queryClient = useQueryClient();
  const form = useForm<z.infer<typeof rejectRequestSchema>>({
    resolver: zodResolver(rejectRequestSchema),
    mode: "onBlur",
    defaultValues: {
      remarks: "",
    },
  });

  const mutation = useMutation({
    mutationFn: (data: { remarks: string }) => {
      return axiosInstance.patch(
        `/request/reject?requestId=${requestId}`,
        data
      );
    },
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: ["getMyRequests"] });

      toast({
        title: res?.data?.message,
      });
      onRejectSuccess?.();
    },
    onError: (error: ApiError) => {
      toast({
        title: error?.response?.data?.error || "Something went wrong",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (values: z.infer<typeof rejectRequestSchema>) => {
    mutation.mutate({ remarks: values.remarks });
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
              name="remarks"
              control={form.control}
              render={({ field }) => (
                <FormItem className="flex flex-col justify-start items-start w-full">
                  <FormControl className="grow">
                    <InputField
                      label="Remarks: "
                      value={field.value}
                      errorMessage={form?.formState?.errors?.remarks?.message}
                      onChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <div className="flex w-full justify-end gap-x-2">
              <Button
                title={"Go Back"}
                className="min-w-40"
                onClick={onRejectSuccess}
                variant="outline"
              />
              <Button
                title={mutation.isPending ? "Loading.." : "Reject"}
                disabled={mutation.isPending}
                className="min-w-40"
                variant="destructive"
              />
            </div>
          </div>
        </form>
      </Form>
    </>
  );
};

export default RejectRequestForm;
