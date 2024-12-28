"use client";

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
import { MultipleInput } from "@/Components/Common/MultipleInput";
import { MultipleSelector } from "@/Components/Common/MultipleSelector";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/Components/Common/SelectionField";
import { toast } from "@/Components/Common/Toast/use-toast";
import { ACCESS_CONTROL } from "@/constants/accessControlConfig";
import UseGetAllRoles from "@/hooks/use-get-all-roles";
import useGetProject from "@/hooks/use-get-project";
import useGetUserByRole from "@/hooks/use-get-user-by-role";
import useGetUsers from "@/hooks/use-get-users";
import { projectDetailsSchema } from "@/lib/schemas";
import { ApiError } from "@/lib/types";
import { calculateBusinessDays, checkAccess, formatDate } from "@/lib/utils";
import { RootState } from "@/redux/store";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import React, { useEffect } from "react";
import { useForm, useWatch } from "react-hook-form";
import { useSelector } from "react-redux";
import { any, string, z } from "zod";

interface ProjectDetailsFormProps {
  projectId: string;
}

interface RequestBodyType {
  name: string | undefined;
  startDate: string | undefined;
  billingType: string | undefined;
  requiredDays: string | undefined;
  status: string | undefined;
  resources: string[] | [];
  technologies: string[] | [];
  projectPlatform: string[] | [];
  description: string | undefined;
  clientName: string | undefined;
  projectManager: string | undefined;
}
const ProjectDetailsForm = ({ projectId }: ProjectDetailsFormProps) => {
  const user = useSelector((state: RootState) => state.user);
  const canUpdateProject = checkAccess(user, "UpdateProject", "component");
  const userScope =
    ACCESS_CONTROL.components["UpdateProject"]?.scope[user.role.name];

  const isManager = userScope === "underManager";
  const { project, refetch: refetchProject } = useGetProject(projectId);

  const { getAllRoles } = UseGetAllRoles();
  const engineerRole = getAllRoles?.find(
    (role: { name: string }) => role?.name === "ENGINEER"
  );

  const { getUserByRole } = useGetUserByRole(
    getAllRoles?.find((role: { name: string }) => role?.name === "MANAGER"),
    canUpdateProject && !isManager
  );

  const { users } = useGetUsers(isManager, engineerRole?._id, canUpdateProject);

  let usersList = [];

  if (canUpdateProject) {
    const combinedUsers = [
      ...(project?.resources || []),
      ...(users?.users || []),
    ];

    const userIdentifier = new Set();
    usersList = combinedUsers.filter((user) => {
      if (userIdentifier.has(user._id)) return false;
      userIdentifier.add(user._id);
      return true;
    });
  } else {
    usersList = project?.resources || [];
  }

  const resourceIds = project?.resources.map(
    (item: { _id: string; name: string }) => item._id
  );

  const form = useForm<z.infer<typeof projectDetailsSchema>>({
    resolver: zodResolver(projectDetailsSchema),
    mode: "onBlur",
    defaultValues: {
      name: project?.name,
      description: project?.description,
      startDate: project?.startDate,
      endDate: project?.endDate,
      billingType: project?.billingType,
      requiredDays:
        calculateBusinessDays(
          project?.startDate,
          project?.endDate
        ).toString() || "",
      status: project?.status,
      technologies: project?.technologies,
      projectPlatform: project?.projectPlatform,
      resources: resourceIds,
      clientName: project?.clientName,
      projectManager: project?.projectManager._id,
    },
  });

  const billingType = useWatch({
    control: form.control,
    name: "billingType",
  });

  useEffect(() => {
    if (billingType !== "fixed") {
      form.setValue("requiredDays", "");
      form.setValue("endDate", null);
      form.clearErrors("requiredDays");
    } else {
      form.setValue(
        "requiredDays",
        calculateBusinessDays(
          project?.startDate,
          project?.endDate
        ).toString() || ""
      );
    }
  }, [billingType, form]);

  useEffect(() => {
    if (isManager) {
      form.setValue("projectManager", "");
    }
  }, [isManager]);

  const mutation = useMutation({
    mutationFn: (data: RequestBodyType) => {
      return axiosInstance.patch(
        `/project/update-project?projectId=${projectId}`,
        data
      );
    },
    onSuccess: (res) => {
      toast({
        title: res?.data?.message,
      });
      refetchProject();
    },
    onError: (error: ApiError) => {
      toast({
        title: error?.response?.data?.error || "Something went wrong",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (values: z.infer<typeof projectDetailsSchema>) => {
    const formattedPayload: RequestBodyType = {
      name: values?.name,
      description: values?.description,
      status: values?.status,
      startDate: formatDate(values?.startDate || null),
      requiredDays: values?.requiredDays,
      clientName: values?.clientName,
      resources: values?.resources,
      technologies: values?.technologies,
      projectPlatform: values?.projectPlatform,
      projectManager: values?.projectManager,
      billingType: values?.billingType,
    };
    mutation.mutate(formattedPayload);
  };

  return (
    <div className="w-full">
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
                    disabled={!canUpdateProject}
                    errorMessage={form.formState.errors.name?.message}
                    label="Project Name:"
                  />
                </FormControl>
              </FormItem>
            )}
          />
          {canUpdateProject && (
            <FormField
              name="billingType"
              control={form.control}
              render={({ field }) => (
                <FormItem className="flex justify-center items-center">
                  <FormControl className="grow">
                    <Select
                      value={field.value}
                      onValueChange={field.onChange}
                      disabled={!canUpdateProject}
                    >
                      <SelectTrigger
                        label="Billing Type:"
                        errorMessage={
                          form.formState.errors.billingType?.message
                        }
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
          )}

          <FormField
            name="status"
            control={form.control}
            render={({ field }) => (
              <FormItem className="flex justify-center items-center">
                <FormControl className="grow">
                  <Select
                    value={field.value}
                    onValueChange={field.onChange}
                    disabled={!canUpdateProject}
                  >
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
          {canUpdateProject && (
            <FormField
              name="requiredDays"
              control={form.control}
              render={({ field }) => (
                <FormItem className="flex justify-center items-center">
                  <FormControl className="grow">
                    <InputField
                      value={field.value}
                      onChange={field.onChange}
                      disabled={
                        form.getValues().billingType !== "fixed" ||
                        !canUpdateProject
                      }
                      type="number"
                      errorMessage={form.formState.errors.requiredDays?.message}
                      label="Required Days:"
                    />
                  </FormControl>
                </FormItem>
              )}
            />
          )}

          <FormField
            name="resources"
            control={form.control}
            render={({ field }) => (
              <FormItem className="flex flex-col justify-start items-start">
                <FormControl className="w-full">
                  <MultipleSelector
                    users={usersList}
                    disabled={!canUpdateProject}
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
                    disabled={!canUpdateProject}
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
                    disabled={!canUpdateProject}
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
                    disabled={!canUpdateProject}
                    placeholder="Select a date"
                    errorMessage={form.formState.errors.startDate?.message}
                  />
                </FormControl>
              </FormItem>
            )}
          />
          {billingType === "fixed" && canUpdateProject && (
            <FormField
              name="endDate"
              control={form.control}
              render={({ field }) => (
                <FormItem className="flex justify-center items-center">
                  <FormControl className="grow">
                    <DatePickerField
                      label="End Date:"
                      value={field.value}
                      disabled={true}
                      onChange={field.onChange}
                      errorMessage={form.formState.errors.endDate?.message}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
          )}

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
                      disabled={!canUpdateProject}
                      ref={(textarea) => {
                        if (textarea) {
                          textarea.style.height = "auto";
                          textarea.style.height = `${textarea.scrollHeight}px`;
                        }
                      }}
                      value={field.value}
                      onChange={(e) => {
                        field.onChange(e);
                        const target = e.target as HTMLTextAreaElement;
                        target.style.height = "auto";
                        target.style.height = `${target.scrollHeight}px`;
                      }}
                      rows={1}
                      placeholder="Enter task description"
                      className={`autofill:input-autofill overflow-hidden text-black disabled:cursor-not-allowed disabled:bg-gray-200
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
                    <Select
                      value={field.value}
                      onValueChange={field.onChange}
                      disabled={!canUpdateProject}
                    >
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
                          <SelectItem
                            key={project.projectManager._id}
                            value={project.projectManager._id}
                          >
                            {project.projectManager.name}
                          </SelectItem>
                        )}
                      </SelectContent>
                    </Select>
                  </FormControl>
                </FormItem>
              )}
            />
          )}

          {!isManager && canUpdateProject && (
            <FormField
              name="clientName"
              control={form.control}
              render={({ field }) => (
                <FormItem className="flex justify-center items-center">
                  <FormControl className="grow">
                    <InputField
                      value={field.value}
                      disabled={!canUpdateProject}
                      onChange={field.onChange}
                      errorMessage={form.formState.errors.clientName?.message}
                      label="Client Name:"
                    />
                  </FormControl>
                </FormItem>
              )}
            />
          )}
          {canUpdateProject && (
            <div className="flex col-span-full mt-md items-center justify-center w-full">
              <Button
                type="submit"
                title={mutation.isPending ? "Loading..." : "Save"}
                disabled={mutation.isPending || !form.formState.isDirty}
                className="w-full lg:min-w-[400px]"
              />
            </div>
          )}
        </form>
      </Form>
    </div>
  );
};

export default ProjectDetailsForm;
