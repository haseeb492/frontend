"use client";

import axiosInstance from "@/AxiosInterceptor";
import Button from "@/Components/Common/Button";
import CircularLoader from "@/Components/Common/CircularLoader";
import { Editor } from "@/Components/Common/Editor";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
} from "@/Components/Common/Form";
import InputField from "@/Components/Common/InputField";
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
import { SET_MODAL } from "@/redux/slices/modalSlice";
import { RootState } from "@/redux/store";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { z } from "zod";

interface AddTaskFormProps {
  reportId: string;
}

interface RequestBodyType {
  reportId: string;
  description: string;
  projectId: string;
  time: number;
}

const AddTaskForm = ({ reportId }: AddTaskFormProps) => {
  const queryClient = useQueryClient();
  const dispatch = useDispatch();
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
      description: "",
      projectId: "",
      hours: "0",
      minutes: "0",
    },
  });

  useEffect(() => {
    if (user) {
      setUserRole(user.role.name);
    }
  }, [user]);

  const mutation = useMutation({
    mutationFn: (data: RequestBodyType) => {
      return axiosInstance.post(`/daily-report/create-task`, data);
    },
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: ["getDailyReport"] });
      queryClient.invalidateQueries({
        queryKey: ["getAvailableProductiveDuration"],
      });
      dispatch(SET_MODAL(false));
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
    const formattedPayload: RequestBodyType = {
      reportId: reportId,
      description: values.description,
      projectId: values.projectId,
      time: Number(values.hours) * 60 + Number(values.minutes),
    };
    mutation.mutate(formattedPayload);
  };

  if (isProjectsLoading || isEngineerProjectsLoading) {
    return (
      <div className="flex items-center justify-center mb-10">
        <CircularLoader />
      </div>
    );
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
              name="projectId"
              control={form.control}
              render={({ field }) => (
                <FormItem className="flex justify-center items-center">
                  <FormControl className="grow ">
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger
                        label="Project:"
                        errorMessage={form.formState.errors.projectId?.message}
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
                    <Editor value={field.value} onChange={field.onChange} />
                  </FormControl>
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-2">
              <FormField
                name="hours"
                control={form.control}
                render={({ field }) => (
                  <FormItem className="flex justify-center items-center">
                    <FormControl className="grow">
                      <InputField
                        className="text-black"
                        value={field.value}
                        onChange={field.onChange}
                        type="number"
                        errorMessage={form.formState.errors.hours?.message}
                        label="Hours:"
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                name="minutes"
                control={form.control}
                render={({ field }) => (
                  <FormItem className="flex justify-center items-center">
                    <FormControl className="grow">
                      <InputField
                        className="text-black"
                        value={field.value}
                        onChange={field.onChange}
                        type="number"
                        errorMessage={form.formState.errors.minutes?.message}
                        label="Minutes:"
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>
            <div className="flex w-full justify-end">
              <Button
                title={mutation.isPending ? "Loading..." : "Save"}
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

export default AddTaskForm;
