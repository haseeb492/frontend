"use client";
import Button from "@/Components/Common/Button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
} from "@/Components/Common/Form";
import InputField from "@/Components/Common/InputField";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { useEffect } from "react";
import { useForm, useWatch } from "react-hook-form";
import { z } from "zod";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/Components/Common/SelectionField";
import UseGetAllRoles from "@/hooks/use-get-all-roles";
import useGetDesignation from "@/hooks/use-get-designation";
import { useMutation } from "@tanstack/react-query";
import axiosInstance from "@/AxiosInterceptor";
import { toast } from "@/Components/Common/Toast/use-toast";
import TimePickerField from "@/Components/Common/TimePicker";
import { useRouter } from "next/navigation";
import useGetUserByRole from "@/hooks/use-get-user-by-role";
import withAuthorization from "@/HOC/withAuthorization";
import { userSchema } from "@/lib/schemas";
import { ApiError } from "@/lib/types";
import HeaderCard from "@/Components/HeaderCard";

interface RequestBodyType {
  name: string;
  email: string;
  status: string;
  jobType: string;
  officeStartTime: string;
  officeHours: number;
  workingHours: number;
  roleId: string;
  designationId: string;
  managerId: string;
}

const Page = () => {
  const router = useRouter();
  const userForm = useForm<z.infer<typeof userSchema>>({
    resolver: zodResolver(userSchema),
    mode: "onBlur",
    defaultValues: {
      name: "",
      email: "",
      status: "active",
      role: { id: "", name: "" },
      designationId: "",
      jobType: "onsite",
      officeStartTime: "",
      officeHours: 9,
      workingHours: 8,
      managerId: "",
    },
  });
  const { getAllRoles } = UseGetAllRoles();
  const { getUserByRole } = useGetUserByRole(
    getAllRoles?.find((role: { name: string }) => role?.name === "MANAGER")
  );
  const selectedRoleId = useWatch({
    control: userForm.control,
    name: "role.id",
  });
  const { refetch: refetchDesignation, getDesignation } =
    useGetDesignation(selectedRoleId);

  useEffect(() => {
    if (selectedRoleId) {
      refetchDesignation();
    }
  }, [selectedRoleId, refetchDesignation]);

  const mutation = useMutation({
    mutationFn: (data: RequestBodyType) => {
      return axiosInstance.post("/user/add-user", data);
    },
    onSuccess: (res) => {
      toast({
        title: res?.data?.message,
      });
      router.push("/users");
    },
    onError: (error: ApiError) => {
      toast({
        title: error?.response?.data?.error || "Something went wrong",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (values: z.infer<typeof userSchema>) => {
    const formattedValues: RequestBodyType = {
      name: values.name,
      email: values.email,
      status: values.status,
      jobType: values.jobType,
      officeStartTime: values.officeStartTime,
      officeHours: values.officeHours,
      workingHours: values.workingHours,
      roleId: values.role.id,
      designationId: values.designationId,
      managerId: values.managerId,
    };
    mutation.mutate(formattedValues);
  };

  return (
    <div className="w-full">
      <HeaderCard title="Add User" subTitle="Add new user" />
      <h1 className="text-primary text-xl mt-5 ">General Info</h1>
      <Form {...userForm}>
        <form
          onSubmit={userForm.handleSubmit(onSubmit)}
          className="grid grid-cols-1 md:grid-cols-2 gap-sm mt-lg w-full"
        >
          <FormField
            name="name"
            control={userForm.control}
            render={({ field }) => (
              <FormItem className="flex justify-center items-center">
                <FormControl className="grow">
                  <InputField
                    value={field.value}
                    onChange={field.onChange}
                    errorMessage={userForm.formState.errors.name?.message}
                    label="User Name:"
                  />
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            name="email"
            control={userForm.control}
            render={({ field }) => (
              <FormItem className="flex justify-center items-center">
                <FormControl className="grow">
                  <InputField
                    value={field.value}
                    onChange={field.onChange}
                    errorMessage={userForm.formState.errors.email?.message}
                    label="Email Address:"
                  />
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            name="status"
            control={userForm.control}
            render={({ field }) => (
              <FormItem className="flex justify-center items-center">
                <FormControl className="grow">
                  <Select
                    defaultValue={field.value}
                    onValueChange={field.onChange}
                  >
                    <SelectTrigger
                      label="Status:"
                      errorMessage={userForm.formState.errors.status?.message}
                    >
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="inactive">Inactive</SelectItem>
                    </SelectContent>
                  </Select>
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            name="role"
            control={userForm.control}
            render={({ field }) => (
              <FormItem className="flex justify-center items-center">
                <FormControl className="grow">
                  <Select
                    value={field.value.id || ""}
                    onValueChange={(id) => {
                      const selectedRole = getAllRoles.find(
                        (role: { name: string; _id: string }) => role._id === id
                      );
                      if (selectedRole) {
                        field.onChange({
                          id: selectedRole._id,
                          name: selectedRole.name,
                        });
                      } else {
                        field.onChange({ id: "", name: "" });
                      }
                    }}
                  >
                    <SelectTrigger
                      label="Role:"
                      errorMessage={userForm.formState.errors.role?.message}
                    >
                      <SelectValue placeholder="Enter Role" />
                    </SelectTrigger>
                    <SelectContent>
                      {getAllRoles ? (
                        getAllRoles?.map(
                          (role: { name: string; _id: string }) => (
                            <SelectItem key={role?._id} value={role._id}>
                              {role?.name}
                            </SelectItem>
                          )
                        )
                      ) : (
                        <SelectItem value="-" aria-readonly>
                          No role found
                        </SelectItem>
                      )}
                    </SelectContent>
                  </Select>
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            name="designationId"
            control={userForm.control}
            render={({ field }) => (
              <FormItem className="flex justify-center items-center">
                <FormControl className="grow">
                  <Select
                    defaultValue={field.value}
                    onValueChange={field.onChange}
                    disabled={!userForm.getValues().role.id}
                  >
                    <SelectTrigger
                      label="Designation:"
                      errorMessage={
                        userForm.formState.errors.designationId?.message
                      }
                    >
                      <SelectValue placeholder="Enter Designation" />
                    </SelectTrigger>
                    <SelectContent>
                      {getDesignation ? (
                        getDesignation?.map(
                          (designation: { name: string; _id: string }) => (
                            <SelectItem
                              key={designation?._id}
                              value={designation?._id}
                            >
                              {designation?.name}
                            </SelectItem>
                          )
                        )
                      ) : (
                        <SelectItem value="-" aria-readonly>
                          No designation found
                        </SelectItem>
                      )}
                    </SelectContent>
                  </Select>
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            name="jobType"
            control={userForm.control}
            render={({ field }) => (
              <FormItem className="flex justify-center items-center">
                <FormControl className="grow">
                  <Select
                    defaultValue={field.value}
                    onValueChange={field.onChange}
                  >
                    <SelectTrigger
                      label="Job type:"
                      errorMessage={userForm.formState.errors.jobType?.message}
                    >
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="onsite">On site</SelectItem>
                      <SelectItem value="remote">Remote</SelectItem>
                    </SelectContent>
                  </Select>
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            name="officeStartTime"
            control={userForm.control}
            render={({ field }) => (
              <FormItem className="flex justify-center items-center">
                <FormControl className="grow">
                  <TimePickerField
                    label="Office Start Time:"
                    value={field.value}
                    onChange={field.onChange}
                    placeholder="Select office start time"
                    errorMessage={
                      userForm.formState.errors.officeStartTime?.message
                    }
                  />
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            name="officeHours"
            control={userForm.control}
            render={({ field }) => (
              <FormItem className="flex justify-center items-center">
                <FormControl className="grow">
                  <InputField
                    value={field.value}
                    onChange={field.onChange}
                    maxLength={2}
                    errorMessage={
                      userForm.formState.errors.officeHours?.message
                    }
                    label="Office Hours:"
                  />
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            name="workingHours"
            control={userForm.control}
            render={({ field }) => (
              <FormItem className="flex justify-center items-center">
                <FormControl className="grow">
                  <InputField
                    value={field.value}
                    onChange={field.onChange}
                    maxLength={2}
                    errorMessage={
                      userForm.formState.errors.workingHours?.message
                    }
                    label="Working Hours:"
                  />
                </FormControl>
              </FormItem>
            )}
          />
          {userForm.getValues().role.name === "ENGINEER" && (
            <FormField
              name="managerId"
              control={userForm.control}
              render={({ field }) => (
                <FormItem className="flex justify-center items-center">
                  <FormControl className="grow">
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger
                        label="Line Project Manager:"
                        errorMessage={
                          userForm.formState.errors.managerId?.message
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

          <div className="flex col-span-full mt-md items-center justify-center w-full ">
            <Button
              title={mutation.isPending ? "Loading..." : "Add User"}
              disabled={mutation.isPending}
              className="w-full lg:min-w-[400px]"
            />
          </div>
        </form>
      </Form>
    </div>
  );
};

export default withAuthorization(Page, "users/add-user", "route");
