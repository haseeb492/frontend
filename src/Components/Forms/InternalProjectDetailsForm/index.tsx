import axiosInstance from "@/AxiosInterceptor";
import Button from "@/Components/Common/Button";
import CircularLoader from "@/Components/Common/CircularLoader";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
} from "@/Components/Common/Form";
import InputField from "@/Components/Common/InputField";
import { MultipleSelector } from "@/Components/Common/MultipleSelector";
import { toast } from "@/Components/Common/Toast/use-toast";
import UseGetAllRoles from "@/hooks/use-get-all-roles";
import { internalProjectSchema } from "@/lib/schemas";
import { ApiError } from "@/lib/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import React from "react";
import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import { z } from "zod";

interface RequestBodyType {
  name: string;
  description: string;
  roles?: string[];
}

interface InternalProjectDetailFormProps {
  projectId: string;
  name: string;
  description: string;
  roles?: string[];
  onUpdateSuccess?: () => void;
}

const InternalProjectDetailsForm = ({
  projectId,
  name,
  description,
  roles,
  onUpdateSuccess,
}: InternalProjectDetailFormProps) => {
  const queryClient = useQueryClient();
  const dispatch = useDispatch();
  const { getAllRoles: allRoles, isLoading } = UseGetAllRoles();

  const form = useForm<z.infer<typeof internalProjectSchema>>({
    resolver: zodResolver(internalProjectSchema),
    mode: "onBlur",
    defaultValues: {
      name,
      description,
      roles: roles || [],
    },
  });

  const mutation = useMutation({
    mutationFn: (data: RequestBodyType) => {
      return axiosInstance.patch(
        `/internal-project/update?projectId=${projectId}`,
        data
      );
    },
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: ["getAllInternalProjects"] });
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

  const onSubmit = (values: z.infer<typeof internalProjectSchema>) => {
    const { dirtyFields } = form.formState;

    const formattedPayload: Partial<RequestBodyType> = {};

    if (dirtyFields.name) {
      formattedPayload.name = values.name;
    }

    if (dirtyFields.description) {
      formattedPayload.description = values.description;
    }

    if (dirtyFields.roles) {
      formattedPayload.roles = values.roles;
    }
    mutation.mutate(formattedPayload as RequestBodyType);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center my-10">
        <CircularLoader />
      </div>
    );
  }
  return (
    <>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col gap-2 justify-center mb-10"
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
          <FormField
            name="roles"
            control={form.control}
            render={({ field }) => (
              <FormItem className="flex flex-col justify-start items-start">
                <FormControl className="w-full">
                  <MultipleSelector
                    users={allRoles}
                    selectedIds={field.value}
                    onChange={field.onChange}
                    errorMessage={form.formState.errors.roles?.message}
                    label="Roles:"
                    placeholder="Add Roles.."
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

export default InternalProjectDetailsForm;
