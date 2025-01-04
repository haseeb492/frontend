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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/Components/Common/SelectionField";
import { toast } from "@/Components/Common/Toast/use-toast";
import useGetInternalProjects from "@/hooks/use-get-internal-projects";
import useGetProjects from "@/hooks/use-get-projects";
import useGetProjectsByResource from "@/hooks/use-get-projects-by-resource";
import { taskFormSchema } from "@/lib/schemas";
import { ApiError } from "@/lib/types";
import { RootState } from "@/redux/store";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { z } from "zod";

interface TaskDetailsFormProps {
  taskId: string;
  title: string;
  description: string;
  time: string;
  projectId: string;
  isLoggedIn?: boolean;
  onUpdateSuccess?: () => void;
}

interface RequestBodyType {
  title: string;
  description: string;
  projectId: string;
  time: string;
}

const TaskDetailsForm = ({
  taskId,
  title,
  description,
  time,
  projectId,
  isLoggedIn = true,
  onUpdateSuccess,
}: TaskDetailsFormProps) => {
  const queryClient = useQueryClient();
  const user = useSelector((state: RootState) => state.user);
  const [userRole, setUserRole] = useState<string | null>(user?.role?.name);

  const isManager = userRole === "MANAGER";
  const isEngineer = userRole === "ENGINEER";

  const { projectsByresource, isLoading: isEngineerProjectsLoading } =
    useGetProjectsByResource(isEngineer, "in_progress");
  const { projects, isLoading: isProjectsLoading } = useGetProjects(
    isManager,
    "in_progress",
    !isEngineer
  );
  const { internalProjects } = useGetInternalProjects(
    user?._id,
    user?._id ? true : false
  );

  const projectsList = isEngineer
    ? projectsByresource?.projects
    : projects?.projects;

  const safeProjectsList = Array.isArray(projectsList) ? projectsList : [];
  const safeInternalProjects = Array.isArray(internalProjects)
    ? internalProjects
    : [];

  const allProjects =
    isEngineer || isManager
      ? [...safeProjectsList, ...safeInternalProjects]
      : safeInternalProjects;

  const form = useForm<z.infer<typeof taskFormSchema>>({
    resolver: zodResolver(taskFormSchema),
    mode: "onBlur",
    defaultValues: {
      title: title,
      description: description,
      projectId: projectId,
      time: time,
    },
  });

  useEffect(() => {
    if (user) {
      setUserRole(user.role.name);
    }
  }, [user]);

  const mutation = useMutation({
    mutationFn: (data: RequestBodyType) => {
      return axiosInstance.patch(
        `/daily-report/update-task?taskId=${taskId}`,
        data
      );
    },
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: ["getDailyReport"] });
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

  const onSubmit = (values: z.infer<typeof taskFormSchema>) => {
    const { dirtyFields } = form.formState;

    const formattedPayload: Partial<RequestBodyType> = {};

    if (dirtyFields.title) {
      formattedPayload.title = values.title;
    }
    if (dirtyFields.description) {
      formattedPayload.description = values.description;
    }
    if (dirtyFields.projectId) {
      formattedPayload.projectId = values.projectId;
    }
    if (dirtyFields.time) {
      formattedPayload.time = values.time;
    }

    mutation.mutate(formattedPayload as RequestBodyType);
  };

  if (isProjectsLoading || isEngineerProjectsLoading) {
    return <Loader />;
  }
  return (
    <>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex items-center justify-center w-full mb-5"
        >
          <div className="flex flex-col gap-2 w-full">
            <FormField
              name="title"
              control={form.control}
              render={({ field }) => (
                <FormItem className="flex justify-center items-center">
                  <FormControl className="grow">
                    <InputField
                      disabled={!isLoggedIn}
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
                        disabled={!isLoggedIn}
                        id="description"
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
                        className={`autofill:input-autofill  disabled:cursor-not-allowed overflow-hidden text-black disabled:bg-gray-200
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

            <div className="grid grid-cols-2 gap-2">
              <FormField
                name="projectId"
                control={form.control}
                render={({ field }) => (
                  <FormItem className="flex justify-center items-center">
                    <FormControl className="grow ">
                      <Select
                        disabled={!isLoggedIn}
                        value={field.value}
                        onValueChange={field.onChange}
                      >
                        <SelectTrigger
                          label="Project:"
                          errorMessage={
                            form.formState.errors.projectId?.message
                          }
                          className="text-black"
                        >
                          <SelectValue placeholder="Select a project" />
                        </SelectTrigger>
                        <SelectContent>
                          {allProjects ? (
                            allProjects.map(
                              (project: { name: string; _id: string }) => {
                                return (
                                  <SelectItem
                                    key={project._id}
                                    value={project._id}
                                  >
                                    {project.name}
                                  </SelectItem>
                                );
                              }
                            )
                          ) : (
                            <SelectItem value="-" aria-readonly>
                              No projects found
                            </SelectItem>
                          )}
                        </SelectContent>
                      </Select>
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                name="time"
                control={form.control}
                render={({ field }) => (
                  <FormItem className="flex justify-center items-center">
                    <FormControl className="grow">
                      <InputField
                        disabled={!isLoggedIn}
                        className="text-black"
                        value={field.value}
                        onChange={field.onChange}
                        type="number"
                        errorMessage={form.formState.errors.time?.message}
                        label="Time:"
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>
            <div className="flex w-full justify-end">
              {isLoggedIn && (
                <Button
                  title={mutation.isPending ? "Loading..." : "Save"}
                  disabled={mutation.isPending || !form.formState.isDirty}
                  className="min-w-40"
                />
              )}
            </div>
          </div>
        </form>
      </Form>
    </>
  );
};

export default TaskDetailsForm;
