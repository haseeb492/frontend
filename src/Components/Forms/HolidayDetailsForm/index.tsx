import axiosInstance from "@/AxiosInterceptor";
import Button from "@/Components/Common/Button";
import { DatePickerField } from "@/Components/Common/DatePicker";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
} from "@/Components/Common/Form";
import InputField from "@/Components/Common/InputField";
import { toast } from "@/Components/Common/Toast/use-toast";
import { holidayDetailsSchema } from "@/lib/schemas";
import { ApiError } from "@/lib/types";
import { formatDate } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import React from "react";
import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import { z } from "zod";

interface RequestBodyType {
  name: string;
  date: string;
}

interface HolidayDetailFormProps {
  holidayId: string;
  title: string;
  date: string;
  onUpdateSuccess?: () => void;
}

const HolidayDetailsForm = ({
  holidayId,
  title,
  date,
  onUpdateSuccess,
}: HolidayDetailFormProps) => {
  const queryClient = useQueryClient();
  const dispatch = useDispatch();

  const form = useForm<z.infer<typeof holidayDetailsSchema>>({
    resolver: zodResolver(holidayDetailsSchema),
    mode: "onBlur",
    defaultValues: {
      title,
      date: date ? new Date(date) : null,
    },
  });

  const mutation = useMutation({
    mutationFn: (data: RequestBodyType) => {
      return axiosInstance.patch(
        `/holiday/update-holiday?holidayId=${holidayId}`,
        data
      );
    },
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: ["getPublicHolidays"] });
      onUpdateSuccess?.();

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

  const onSubmit = (values: z.infer<typeof holidayDetailsSchema>) => {
    const { dirtyFields } = form.formState;

    const formattedPayload: Partial<RequestBodyType> = {};

    if (dirtyFields.title) {
      formattedPayload.name = values.title;
    }

    if (dirtyFields.date) {
      formattedPayload.date = values?.date ? formatDate(values?.date) : "";
    }
    mutation.mutate(formattedPayload as RequestBodyType);
  };

  return (
    <>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col gap-2 justify-center mb-10"
        >
          <FormField
            name="title"
            control={form.control}
            render={({ field }) => (
              <FormItem className="flex justify-center items-center">
                <FormControl className="grow">
                  <InputField
                    value={field.value}
                    onChange={field.onChange}
                    errorMessage={form.formState.errors.title?.message}
                    label="Title:"
                  />
                </FormControl>
              </FormItem>
            )}
          />

          <FormField
            name="date"
            control={form.control}
            render={({ field }) => (
              <FormItem className="flex justify-center items-center">
                <FormControl className="grow">
                  <DatePickerField
                    label="Date:"
                    value={field.value}
                    onChange={field.onChange}
                    placeholder="Select a date"
                    errorMessage={form.formState.errors.date?.message}
                  />
                </FormControl>
              </FormItem>
            )}
          />

          <div className="flex w-full justify-end">
            <Button
              title={mutation.isPending ? "Loading..." : "Save"}
              disabled={mutation.isPending || !form.formState.isDirty}
              className="min-w-40"
            />
          </div>
        </form>
      </Form>
    </>
  );
};

export default HolidayDetailsForm;
