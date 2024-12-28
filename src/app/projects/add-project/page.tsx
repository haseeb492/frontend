"use client";

import React, { useEffect } from "react";
import withAuthorization from "@/HOC/withAuthorization";
import { ACCESS_CONTROL } from "@/constants/accessControlConfig";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import UseGetAllRoles from "@/hooks/use-get-all-roles";
import useGetUsers from "@/hooks/use-get-users";
import { useForm, useWatch } from "react-hook-form";
import { z } from "zod";
import { addProjectSchema } from "@/lib/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
} from "@/Components/Common/Form";
import InputField from "@/Components/Common/InputField";
import Button from "@/Components/Common/Button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/Components/Common/SelectionField";
import { MultipleSelector } from "@/Components/Common/MultipleSelector";
import { DatePickerField } from "@/Components/Common/DatePicker";
import { MultipleInput } from "@/Components/Common/MultipleInput";
import { useMutation } from "@tanstack/react-query";
import axiosInstance from "@/AxiosInterceptor";
import { toast } from "@/Components/Common/Toast/use-toast";
import { ApiError } from "@/lib/types";
import { useRouter } from "next/navigation";
import { formatDate } from "@/lib/utils";
import useGetUserByRole from "@/hooks/use-get-user-by-role";
import HeaderCard from "@/Components/HeaderCard";

interface RequestBodyType {
  name: string;
  startDate: string;
  billingType: string;
  requiredDays: string | undefined;
  status: string;
  resources: string[];
  technologies: string[];
  projectPlatform: string[];
  description: string | undefined;
  clientName: string | undefined;
}
const Page = () => {
  const user = useSelector((state: RootState) => state.user);
  const router = useRouter();
  const userScope = ACCESS_CONTROL.routes["/projects"]?.scope[user.role.name];
  const isManager = userScope === "underManager";

  const { getAllRoles } = UseGetAllRoles();
  const engineerRole = getAllRoles?.find(
    (role: { name: string }) => role?.name === "ENGINEER"
  );

  const { getUserByRole } = useGetUserByRole(
    getAllRoles?.find((role: { name: string }) => role?.name === "MANAGER"),
    isManager ? false : true
  );

  const { users } = useGetUsers(isManager, engineerRole?._id);

  const form = useForm<z.infer<typeof addProjectSchema>>({
    resolver: zodResolver(addProjectSchema),
    mode: "onBlur",
    defaultValues: {
      name: "",
      description: "",
      startDate: undefined,
      billingType: "fixed",
      requiredDays: "",
      status: "in_progress",
      technologies: [],
      projectPlatform: [],
      resources: [],
      clientName: "",
      projectManager: "",
    },
  });

  const billingType = useWatch({
    control: form.control,
    name: "billingType",
  });

  const projectManager = useWatch({
    control: form.control,
    name: "projectManager",
  });

  useEffect(() => {
    if (billingType !== "fixed") {
      form.setValue("requiredDays", "");
      form.clearErrors("requiredDays");
    }
  }, [billingType, form]);

  const mutation = useMutation({
    mutationFn: (data: RequestBodyType) => {
      return axiosInstance.post(
        `/project/create-project?userId=${projectManager}`,
        data
      );
    },
    onSuccess: (res) => {
      toast({
        title: res?.data?.message,
      });
      router.push("/projects");
    },
    onError: (error: ApiError) => {
      toast({
        title: error?.response?.data?.error || "Something went wrong",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (values: z.infer<typeof addProjectSchema>) => {
    const formattedPayload: RequestBodyType = {
      name: values?.name,
      startDate: values?.startDate ? formatDate(values?.startDate) : "",
      description: values?.description,
      status: values?.status,
      billingType: values?.billingType,
      resources: values?.resources,
      technologies: values?.technologies,
      projectPlatform: values?.projectPlatform,
      requiredDays: values?.requiredDays,
      clientName: values?.clientName,
    };
    mutation.mutate(formattedPayload);
  };

  return (
    <div className="w-full">
      <HeaderCard title="Add Project" subTitle="Add project Info" />
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="grid grid-cols-1 md:grid-cols-2 gap-sm mt-lg w-full"
        >
          <FormField
            name="name"
            control={form.control}
            render={({ field }) => (
              <FormItem className="flex justify-center items-center">
                <FormControl className="grow">
                  <InputField
                    value={field.value}
                    onChange={field.onChange}
                    errorMessage={form.formState.errors.name?.message}
                    label="Project Name:"
                  />
                </FormControl>
              </FormItem>
            )}
          />

          <FormField
            name="billingType"
            control={form.control}
            render={({ field }) => (
              <FormItem className="flex justify-center items-center">
                <FormControl className="grow">
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger
                      label="Billing Type:"
                      errorMessage={form.formState.errors.billingType?.message}
                    >
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="fixed">Fixed</SelectItem>
                      <SelectItem value="time_and_material">
                        Time and Material
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </FormControl>
              </FormItem>
            )}
          />

          <FormField
            name="status"
            control={form.control}
            render={({ field }) => (
              <FormItem className="flex justify-center items-center">
                <FormControl className="grow">
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger
                      label="Status:"
                      errorMessage={form.formState.errors.status?.message}
                    >
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="in_progress">In Progress</SelectItem>
                      <SelectItem value="requirement_gathering">
                        Requirement Gathering
                      </SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
                      <SelectItem value="canceled">Canceled</SelectItem>
                      <SelectItem value="on_hold">On Hold</SelectItem>
                    </SelectContent>
                  </Select>
                </FormControl>
              </FormItem>
            )}
          />

          <FormField
            name="requiredDays"
            control={form.control}
            render={({ field }) => (
              <FormItem className="flex justify-center items-center">
                <FormControl className="grow">
                  <InputField
                    value={field.value}
                    onChange={field.onChange}
                    disabled={form.getValues().billingType !== "fixed"}
                    type="number"
                    errorMessage={form.formState.errors.requiredDays?.message}
                    label="Required Days:"
                  />
                </FormControl>
              </FormItem>
            )}
          />

          {/* Resources Multi-Select Field */}
          <FormField
            name="resources"
            control={form.control}
            render={({ field }) => (
              <FormItem className="flex flex-col justify-start items-start">
                <FormControl className="w-full">
                  <MultipleSelector
                    users={users ? users?.users : []}
                    selectedIds={field.value}
                    onChange={field.onChange}
                    errorMessage={form.formState.errors.resources?.message}
                    label="Resources:"
                  />
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            name="technologies"
            control={form.control}
            render={({ field }) => (
              <FormItem className="flex flex-col justify-start items-start">
                <FormControl className="w-full">
                  <MultipleInput
                    label="Technologies:"
                    placeholder="Add a technology and press Enter"
                    values={field.value}
                    onChange={field.onChange}
                    errorMessage={form.formState.errors.technologies?.message}
                  />
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            name="projectPlatform"
            control={form.control}
            render={({ field }) => (
              <FormItem className="flex flex-col justify-start items-start">
                <FormControl className="w-full">
                  <MultipleInput
                    label="Project Platform:"
                    placeholder="Add a technology and press Enter"
                    values={field.value}
                    onChange={field.onChange}
                    errorMessage={
                      form.formState.errors.projectPlatform?.message
                    }
                  />
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            name="startDate"
            control={form.control}
            render={({ field }) => (
              <FormItem className="flex justify-center items-center">
                <FormControl className="grow">
                  <DatePickerField
                    label="Start Date:"
                    value={field.value}
                    onChange={field.onChange}
                    placeholder="Select a date"
                    errorMessage={form.formState.errors.startDate?.message}
                  />
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            name="description"
            control={form.control}
            render={({ field }) => (
              <FormItem className="flex flex-col justify-start items-start w-full">
                <label
                  htmlFor="description"
                  className="text-sm font-bold text-zinc-900 mb-1"
                >
                  Description:
                </label>
                <FormControl className="grow">
                  <>
                    <textarea
                      id="description"
                      value={field.value}
                      onChange={(e) => {
                        field.onChange(e);
                        const target = e.target as HTMLTextAreaElement;
                        target.style.height = "auto";
                        target.style.height = `${target.scrollHeight}px`;
                      }}
                      rows={1}
                      placeholder="Enter project description"
                      className={`autofill:input-autofill overflow-hidden disabled:bg-gray-200
                        disabled:focus-visible:border-gray-300 disabled:hover:border-gray-300
                        border px-sm py-sm border-gray-300 hover:border-primary
                        focus-visible:border-primary focus-visible:outline-none focus:border-2
                        text-sm rounded-3xs w-full resize-none ${
                          form.formState.errors.description &&
                          "border-red-500 focus-visible:border-red-500"
                        }`}
                    />
                    {form.formState.errors.description && (
                      <p className="text-md text-red-500 mt-xs">
                        {form.formState.errors.description.message}
                      </p>
                    )}
                  </>
                </FormControl>
              </FormItem>
            )}
          />
          {!isManager && (
            <FormField
              name="projectManager"
              control={form.control}
              render={({ field }) => (
                <FormItem className="flex justify-center items-center">
                  <FormControl className="grow">
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger
                        label="Project Manager:"
                        errorMessage={
                          form.formState.errors.projectManager?.message
                        }
                      >
                        <SelectValue placeholder="Enter Project Manager" />
                      </SelectTrigger>
                      <SelectContent>
                        {getUserByRole ? (
                          getUserByRole.map(
                            (pm: { name: string; _id: string }) => (
                              <SelectItem key={pm._id} value={pm._id}>
                                {pm.name}
                              </SelectItem>
                            )
                          )
                        ) : (
                          <SelectItem value="-" aria-readonly>
                            No manager found
                          </SelectItem>
                        )}
                      </SelectContent>
                    </Select>
                  </FormControl>
                </FormItem>
              )}
            />
          )}

          {!isManager && (
            <FormField
              name="clientName"
              control={form.control}
              render={({ field }) => (
                <FormItem className="flex justify-center items-center">
                  <FormControl className="grow">
                    <InputField
                      value={field.value}
                      onChange={field.onChange}
                      errorMessage={form.formState.errors.clientName?.message}
                      label="Client Name:"
                    />
                  </FormControl>
                </FormItem>
              )}
            />
          )}

          <div className="flex col-span-full mt-md items-center justify-center w-full ">
            <Button
              type="submit"
              title={mutation.isPending ? "Loading" : "Add Project"}
              className="w-full lg:min-w-[400px]"
            />
          </div>
        </form>
      </Form>
    </div>
  );
};

export default withAuthorization(Page, "/projects/add-project", "route");
