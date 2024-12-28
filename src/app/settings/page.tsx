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
import Loader from "@/Components/Common/Loader";
import PasswordInputField from "@/Components/Common/PasswordInputField";
import { toast } from "@/Components/Common/Toast/use-toast";
import HeaderCard from "@/Components/HeaderCard";
import useGetPersonalInfo from "@/hooks/use-get-personal-info";
import { ApiError } from "@/lib/types";
import { RootState } from "@/redux/store";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import { z } from "zod";

const resetPasswordScehma = z.object({
  oldPassword: z
    .string()
    .min(1, "Please enter old password")
    .min(8, "Password must be 8 charachters"),
  newPassword: z
    .string()
    .min(1, "Please enter new password")
    .min(8, "Password must be 8 charachters"),
});

const Page = () => {
  const user = useSelector((state: RootState) => state.user);
  const { personalInfo, isLoading } = useGetPersonalInfo(user._id, true);

  const form = useForm<z.infer<typeof resetPasswordScehma>>({
    resolver: zodResolver(resetPasswordScehma),
    mode: "onBlur",
    defaultValues: {
      oldPassword: "",
      newPassword: "",
    },
  });

  const mutation = useMutation({
    mutationFn: (data: { oldPassword: string; newPassword: string }) => {
      return axiosInstance.post("user/reset-password", data);
    },
    onSuccess: () => {
      toast({
        title: "Password reset successful",
      });
    },
    onError: (error: ApiError) => {
      toast({
        title: error?.response?.data?.error || "Something went wrong",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (values: z.infer<typeof resetPasswordScehma>) => {
    mutation.mutate(values);
  };

  if (isLoading) {
    return <Loader />;
  }
  return (
    <div className="w-full">
      <HeaderCard title="Settings" subTitle="Edit your account settings" />
      <div className="flex  justify-start items-start w-full gap-md mt-lg">
        <div className="flex flex-col">
          <InputField value={user?.email} disabled={true} label="Email:" />
          <InputField
            value={personalInfo?.personalInfo?.slackId}
            disabled={true}
            label="SlackId:"
          />
        </div>
        <div className="flex flex-col">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <FormField
                name="oldPassword"
                control={form.control}
                render={({ field }) => (
                  <FormItem className="w-80">
                    <FormControl>
                      <PasswordInputField
                        className=""
                        value={field.value}
                        onChange={field.onChange}
                        errorMessage={
                          form.formState.errors.oldPassword?.message
                        }
                        valid={false}
                        label="Old Password:"
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                name="newPassword"
                control={form.control}
                render={({ field }) => (
                  <FormItem className="w-80 mt-2">
                    <FormControl>
                      <PasswordInputField
                        className=""
                        value={field.value}
                        onChange={field.onChange}
                        valid={false}
                        errorMessage={
                          form.formState.errors.newPassword?.message
                        }
                        label="New Password:"
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              <Button
                title={mutation.isPending ? "Loading..." : "Reset Password"}
                disabled={mutation.isPending}
                type="submit"
                className="w-full max-w-[400px] my-md"
              />
            </form>
          </Form>
        </div>
      </div>
    </div>
  );
};

export default Page;
