"use client";
import Image from "next/image";
import React, { useState } from "react";
import logo from "../../assets/zealtouch-logo.png";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
} from "@/Components/Common/Form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import InputField from "@/Components/Common/InputField";
import { useForm } from "react-hook-form";
import Button from "@/Components/Common/Button";
import { ROOT_ROUTE, SESSION_COOKIE_NAME } from "@/constants/environment";
import { useMutation } from "@tanstack/react-query";
import { toast } from "@/Components/Common/Toast/use-toast";
import axiosInstance from "@/AxiosInterceptor";
import ForgetPassword from "@/Components/ForgetPassword";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import PasswordInputField from "@/Components/Common/PasswordInputField";

const loginSchema = z.object({
  email: z.string().min(1, "Enter email or username"),
  password: z
    .string()
    .min(1, "Enter password")
    .min(8, "Password must be at least 8 characters"),
});

const Page = () => {
  const navigate = useRouter();
  const [isForgetPassword, setIsForgetPassword] = useState(false);

  const loginForm = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    mode: "onBlur",
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const mutation = useMutation({
    mutationFn: (data: z.infer<typeof loginSchema>) => {
      return axiosInstance.post("/auth/login", data);
    },
    onSuccess: (res) => {
      const cookies = Cookies.set(
        SESSION_COOKIE_NAME,
        res?.data?.user?.accessToken
      );
      if (cookies) {
        navigate.push(ROOT_ROUTE);
      }
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onError: (error: any) => {
      toast({
        title: error?.response?.data?.error || "Something went wrong",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (values: z.infer<typeof loginSchema>) => {
    mutation.mutate(values);
  };

  return (
    <div className="w-full flex flex-col md:px-md px-sm h-screen items-center justify-center">
      {isForgetPassword && (
        <ForgetPassword
          isForgetPassword={isForgetPassword}
          setIsForgetPassword={() => setIsForgetPassword(false)}
        />
      )}
      <div className="w-full max-w-[600px] items-center border justify-center p-md mx-md border-gray-300 shadow-md shadow-gray-400">
        <div className="items-center flex justify-center">
          <Image
            src={logo}
            alt="zealtouch-logo"
            height={48}
            width={400}
            priority
            className="w-auto h-auto"
          />
        </div>
        <div className="flex flex-col mt-md items-center justify-center">
          <h1 className="lg:text-2xl text-lg font-bold text-primary">
            Welcome To ZT Productivity Suite
          </h1>
          <h2 className="lg:text-md text-sm text-primary italic">
            Acheive Your Time Management & Productivity Goals
          </h2>
          <Form {...loginForm}>
            <form
              onSubmit={loginForm.handleSubmit(onSubmit)}
              className="flex flex-col items-center mt-lg justify-center w-full gap-sm"
            >
              <FormField
                name="email"
                control={loginForm.control}
                render={({ field }) => (
                  <FormItem className="w-full flex justify-center items-center max-w-[400px]">
                    <FormControl className="grow">
                      <InputField
                        value={field.value}
                        onChange={field.onChange}
                        errorMessage={loginForm.formState.errors.email?.message}
                        label="Username or Email:"
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                name="password"
                control={loginForm.control}
                render={({ field }) => (
                  <FormItem className="w-full flex justify-center items-center max-w-[400px]">
                    <FormControl className="grow">
                      <PasswordInputField
                        value={field.value}
                        onChange={field.onChange}
                        errorMessage={
                          loginForm.formState.errors.password?.message
                        }
                        valid={false}
                        label="Password:"
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              <Button
                title={mutation.isPending ? "Loading..." : "Log In"}
                className="w-full max-w-[400px]"
                disabled={mutation.isPending}
              />
            </form>
          </Form>
          <div className="flex flex-col gap-sm mt-2sm items-center justify-center">
            <button
              className="text-primary"
              onClick={() => setIsForgetPassword(true)}
            >
              Forget your password?
            </button>
            <p className="text-sm text-gray-500">
              Powered by Zealtouch &copy;2024
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;
