import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation } from "@tanstack/react-query";
import axiosInstance from "@/AxiosInterceptor";
import Button from "../Common/Button";
import { Form, FormControl, FormField, FormItem } from "../Common/Form";
import InputField from "../Common/InputField";
import Loader from "../Common/Loader";
import { Modal } from "../Common/Modal";
import { toast } from "../Common/Toast/use-toast";
import PasswordInputField from "../Common/PasswordInputField";
type ForgetPasswordProps = {
  isForgetPassword: boolean;
  setIsForgetPassword: (open: boolean) => void;
};
type ApiError = {
  response: {
    data: {
      error: string;
    };
  };
};
const emailSchema = z.object({
  email: z.string().min(1, "Enter email").email("Incorrect email address"),
});
const otpPasswordSchema = z
  .object({
    otp: z
      .string()
      .min(1, "Enter otp that was sent to your email")
      .min(8, "OTP must be at least 8 characters"),
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
const ForgetPassword = ({
  isForgetPassword,
  setIsForgetPassword,
}: ForgetPasswordProps) => {
  const [step, setStep] = useState(1);
  const emailForm = useForm({
    resolver: zodResolver(emailSchema),
    mode: "onBlur",
    defaultValues: { email: "" },
  });
  const otpPasswordForm = useForm({
    resolver: zodResolver(otpPasswordSchema),
    mode: "onBlur",
    defaultValues: { otp: "", newPassword: "", confirmPassword: "" },
  });
  const sendEmailMutation = useMutation({
    mutationFn: (data: { email: string }) => {
      return axiosInstance.post("/auth/forgot-password", { email: data.email });
    },
    onSuccess: () => {
      toast({
        title: "Please check your email for the OTP",
      });
      setStep(2);
    },
    onError: (error: ApiError) => {
      toast({
        title: error?.response?.data?.error || "Something went wrong",
        variant: "destructive",
      });
    },
  });
  const resetPasswordMutation = useMutation({
    mutationFn: (data: { otp: string; newPassword: string }) => {
      return axiosInstance.post("auth/set-password", data);
    },
    onSuccess: () => {
      toast({
        title: "Password reset successful",
      });
      setStep(0);
      setIsForgetPassword(false);
    },
    onError: (error: ApiError) => {
      toast({
        title: error?.response?.data?.error || "Something went wrong",
        variant: "destructive",
      });
    },
  });
  const handleSendEmail = (values: { email: string }) => {
    sendEmailMutation.mutate(values);
  };
  const handleResetPassword = (values: z.infer<typeof otpPasswordSchema>) => {
    const { newPassword, otp } = values;
    resetPasswordMutation.mutate({ otp: otp, newPassword: newPassword });
  };
  const closeModals = () => {
    setStep(0);
    setIsForgetPassword(false);
  };
  return (
    <>
      {isForgetPassword && step === 1 && (
        <Modal
          title="Forget Password"
          open={isForgetPassword}
          onOpenChange={closeModals}
          className="bg-gray-300"
        >
          {sendEmailMutation.isPending && <Loader />}
          <Form {...emailForm}>
            <form
              onSubmit={emailForm.handleSubmit(handleSendEmail)}
              className="flex flex-col items-center mt-sm justify-center w-full gap-sm"
            >
              <FormField
                name="email"
                control={emailForm.control}
                render={({ field }) => (
                  <FormItem className="w-full flex text-zinc-900 justify-center items-center max-w-[400px]">
                    <FormControl className="grow">
                      <InputField
                        value={field.value}
                        onChange={field.onChange}
                        errorMessage={emailForm.formState.errors.email?.message}
                        label="Email Address:"
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              <Button
                title="Send"
                type="submit"
                className="w-full max-w-[400px] my-md"
                disabled={sendEmailMutation.isPending}
              />
            </form>
          </Form>
        </Modal>
      )}
      {isForgetPassword && step === 2 && (
        <Modal
          title="Forget Password"
          open={isForgetPassword}
          onOpenChange={closeModals}
          className="bg-gray-300"
        >
          {resetPasswordMutation.isPending && <Loader />}
          <Form {...otpPasswordForm}>
            <form
              onSubmit={otpPasswordForm.handleSubmit(handleResetPassword)}
              className="flex flex-col items-center mt-sm justify-center w-full gap-sm"
            >
              <FormField
                name="otp"
                control={otpPasswordForm.control}
                render={({ field }) => (
                  <FormItem className="w-full flex text-zinc-900 justify-center items-center max-w-[400px]">
                    <FormControl className="grow">
                      <InputField
                        value={field.value}
                        onChange={field.onChange}
                        errorMessage={
                          otpPasswordForm.formState.errors.otp?.message
                        }
                        label="OTP:"
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                name="newPassword"
                control={otpPasswordForm.control}
                render={({ field }) => (
                  <FormItem className="w-full flex text-zinc-900 justify-center items-center max-w-[400px]">
                    <FormControl className="grow">
                      <PasswordInputField
                        value={field.value}
                        onChange={field.onChange}
                        errorMessage={
                          otpPasswordForm.formState.errors.newPassword?.message
                        }
                        valid={false}
                        label="New Password:"
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                name="confirmPassword"
                control={otpPasswordForm.control}
                render={({ field }) => (
                  <FormItem className="w-full flex text-zinc-900 justify-center items-center max-w-[400px]">
                    <FormControl className="grow">
                      <PasswordInputField
                        value={field.value}
                        onChange={field.onChange}
                        errorMessage={
                          otpPasswordForm.formState.errors.confirmPassword
                            ?.message
                        }
                        valid={false}
                        label="Confirm Password:"
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              <Button
                title="Reset"
                type="submit"
                className="w-full max-w-[400px] my-md"
                disabled={resetPasswordMutation.isPending}
              />
            </form>
          </Form>
        </Modal>
      )}
    </>
  );
};
export default ForgetPassword;
