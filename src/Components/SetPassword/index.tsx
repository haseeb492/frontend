import React, { useState } from "react";
import { Modal } from "../Common/Modal";
import { Form, FormControl, FormField, FormItem } from "../Common/Form";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import InputField from "../Common/InputField";
import Button from "../Common/Button";
import { useMutation } from "@tanstack/react-query";
import axiosInstance from "@/AxiosInterceptor";
import { toast } from "../Common/Toast/use-toast";
import Loader from "../Common/Loader";

type SetPasswordProp = {
  userId: string;
};

const setPasswordSchema = z
  .object({
    newPassword: z
      .string()
      .min(1, "Enter new password")
      .min(8, "Password must be at least 8 characters"),
    confirmPassword: z
      .string()
      .min(1, "Enter confirm password")
      .min(8, "Password must be at least 8 characters"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "New password and confirm password should be the same",
  });

const SetPassword = ({ userId }: SetPasswordProp) => {
  const [isSetPassword, setIsSetPassword] = useState(true);
  const setPasswordForm = useForm<z.infer<typeof setPasswordSchema>>({
    resolver: zodResolver(setPasswordSchema),
    mode: "onBlur",
    defaultValues: {
      newPassword: "",
      confirmPassword: "",
    },
  });

  const mutation = useMutation({
    mutationFn: (data: { newPassword: string }) => {
      return axiosInstance.post(`/auth/set-password?userId=${userId}`, data);
    },
    onSuccess: () => {
      toast({
        title: "Password set successfuly",
      });
      setIsSetPassword(false);
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onError: (error: any) => {
      toast({
        title: error?.response?.data?.error || "Something went wrong",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (values: z.infer<typeof setPasswordSchema>) => {
    const { newPassword } = values;
    mutation.mutate({ newPassword: newPassword });
  };

  return (
    <Modal open={isSetPassword} className="bg-gray-300" title="Set Password">
      <div>
        {mutation.isPending && <Loader />}
        <Form {...setPasswordForm}>
          <form
            onSubmit={setPasswordForm.handleSubmit(onSubmit)}
            className="flex flex-col items-center mt-sm justify-center w-full gap-sm"
          >
            <FormField
              name="newPassword"
              control={setPasswordForm.control}
              render={({ field }) => (
                <FormItem className="w-full flex text-zinc-900 justify-center items-center max-w-[400px]">
                  <FormControl className="grow">
                    <InputField
                      value={field.value}
                      onChange={field.onChange}
                      errorMessage={
                        setPasswordForm.formState.errors.newPassword?.message
                      }
                      type="password"
                      label="New Password:"
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              name="confirmPassword"
              control={setPasswordForm.control}
              render={({ field }) => (
                <FormItem className="w-full flex text-zinc-900 justify-center items-center max-w-[400px]">
                  <FormControl className="grow">
                    <InputField
                      value={field.value}
                      onChange={field.onChange}
                      errorMessage={
                        setPasswordForm.formState.errors.confirmPassword
                          ?.message
                      }
                      type="password"
                      label="Confirm Password:"
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <Button
              title="Reset"
              // title={mutation.isPending ? "Loading..." : "Log In"}
              className="w-full max-w-[400px] my-md"
              // disabled={mutation.isPending}
            />
          </form>
        </Form>
      </div>
    </Modal>
  );
};

export default SetPassword;
