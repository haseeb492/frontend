"use client";
import { z } from "zod";

import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { useForm, useWatch } from "react-hook-form";
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
import { DatePickerField } from "@/Components/Common/DatePicker";
import TimePickerField from "@/Components/Common/TimePicker";
import useGetUserByRole from "@/hooks/use-get-user-by-role";
import UseGetAllRoles from "@/hooks/use-get-all-roles";
import useGetDesignation from "@/hooks/use-get-designation";
import { professionalInfoSchema } from "@/lib/schemas";
import { checkAccess, formatDate } from "@/lib/utils";
import useGetProfessionalInfo from "@/hooks/use-get-professional-info";
import { toast } from "@/Components/Common/Toast/use-toast";
import axiosInstance from "@/AxiosInterceptor";
import { useMutation } from "@tanstack/react-query";
import { ApiError } from "@/lib/types";

interface ProfessionalInfoFormProps {
  isLoggedInUser: boolean;
  userId: string;
}

interface RequestBodyType {
  professionalInfo: {
    joiningDate: string | undefined;
    employmentStatus: string | undefined;
    permanentDate: string | undefined;
    experienceBeforeJoining: string | undefined;
    totalExperience: string | undefined;
    reportingOffice: string | undefined;
    reportingOfficeLocation: string | undefined;
    officeStartTime: string | undefined;
    officeHours: number | undefined;
    workingHours: number | undefined;
    jobType: string | undefined;
    managerId: string | undefined;
  };
  roleId: string;
  designationId: string | undefined;
}

const ProfessionalInfoForm = ({
  isLoggedInUser,
  userId,
}: ProfessionalInfoFormProps) => {
  const user = useSelector((state: RootState) => state.user);
  const canUpdateUserInfo = checkAccess(user, "UpdateUserInfo", "component");

  const { professionalInfo } = useGetProfessionalInfo(userId, isLoggedInUser);

  const { getAllRoles } = UseGetAllRoles();
  const getUserByRole = useGetUserByRole(
    getAllRoles?.find((role: { name: string }) => role?.name === "MANAGER"),
    canUpdateUserInfo
  );

  const form = useForm<z.infer<typeof professionalInfoSchema>>({
    resolver: zodResolver(professionalInfoSchema),
    mode: "onBlur",
    defaultValues: {
      jobType: professionalInfo?.professionalInfo?.jobType,
      employmentStatus: professionalInfo?.professionalInfo?.employmentStatus,
      experienceBeforeJoining:
        professionalInfo?.professionalInfo?.experienceBeforeJoining,
      totalExperience: professionalInfo?.professionalInfo?.totalExperience,
      joiningDate: professionalInfo?.professionalInfo?.joiningDate || null,
      permanentDate: professionalInfo?.professionalInfo?.permanentDate || null,
      reportingOffice: professionalInfo?.professionalInfo?.reportingOffice,
      reportingOfficeLocation:
        professionalInfo?.professionalInfo?.reportingOfficeLocation,
      officeStartTime: professionalInfo?.professionalInfo?.officeStartTime,
      officeHours: professionalInfo?.professionalInfo?.officeHours,
      workingHours: professionalInfo?.professionalInfo?.workingHours,
      managerId: professionalInfo?.professionalInfo?.lineProjectManager?._id,

      designationId: professionalInfo?.designation?._id,
      role: {
        id: professionalInfo?.role?._id,
        name: professionalInfo?.role?.name,
      },
    },
  });

  const employmentStatus = useWatch({
    control: form.control,
    name: "employmentStatus",
  });

  const selectedRoleId = useWatch({
    control: form.control,
    name: "role.id",
  });

  const roleName = useWatch({
    control: form.control,
    name: "role.name",
  });

  const { refetch: refetchDesignation, getDesignation } =
    useGetDesignation(selectedRoleId);

  useEffect(() => {
    if (selectedRoleId) {
      refetchDesignation();
    }
  }, [selectedRoleId, refetchDesignation]);

  useEffect(() => {
    if (roleName !== "ENGINEER") {
      form.setValue("managerId", "");
    }
  }, [roleName]);

  const mutation = useMutation({
    mutationFn: (data: RequestBodyType) => {
      return axiosInstance.patch(
        `/user/update-professional-info?userId=${userId}`,
        data
      );
    },
    onSuccess: (res) => {
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

  const onSubmit = (values: z.infer<typeof professionalInfoSchema>) => {
    const formattedPayload: RequestBodyType = {
      professionalInfo: {
        joiningDate: formatDate(values.joiningDate),
        employmentStatus: values.employmentStatus,
        permanentDate:
          employmentStatus !== "permanent"
            ? ""
            : formatDate(values.permanentDate),
        experienceBeforeJoining: values.experienceBeforeJoining,
        totalExperience: values.totalExperience,
        reportingOffice: values.reportingOffice,
        reportingOfficeLocation: values.reportingOfficeLocation,
        officeStartTime: values.officeStartTime,
        officeHours: values.officeHours,
        workingHours: values.workingHours,
        jobType: values.jobType,
        managerId: values.managerId,
      },
      roleId: values.role.id,
      designationId: values.designationId,
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
            name="jobType"
            control={form.control}
            render={({ field }) => (
              <FormItem className="flex justify-center items-center">
                <FormControl className="grow">
                  <Select
                    defaultValue={field.value}
                    onValueChange={field.onChange}
                    disabled={!canUpdateUserInfo}
                  >
                    <SelectTrigger
                      label="Job Type:"
                      errorMessage={form.formState.errors.jobType?.message}
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
            name="role"
            control={form.control}
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
                    disabled={!canUpdateUserInfo}
                  >
                    <SelectTrigger
                      label="Role:"
                      errorMessage={form.formState.errors.role?.message}
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
            control={form.control}
            render={({ field }) => (
              <FormItem className="flex justify-center items-center">
                <FormControl className="grow">
                  <Select
                    defaultValue={field.value}
                    onValueChange={field.onChange}
                    disabled={!form.getValues().role.id || !canUpdateUserInfo}
                  >
                    <SelectTrigger
                      label="Designation:"
                      errorMessage={
                        form.formState.errors.designationId?.message
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
            name="officeStartTime"
            control={form.control}
            render={({ field }) => (
              <FormItem className="flex justify-center items-center">
                <FormControl className="grow">
                  <TimePickerField
                    label="Office Start Time:"
                    disabled={!canUpdateUserInfo}
                    value={field.value}
                    onChange={field.onChange}
                    placeholder="Select office start time"
                    errorMessage={
                      form.formState.errors.officeStartTime?.message
                    }
                  />
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            name="officeHours"
            control={form.control}
            render={({ field }) => (
              <FormItem className="flex justify-center items-center">
                <FormControl className="grow">
                  <InputField
                    value={field.value}
                    onChange={(e) =>
                      field.onChange(
                        isNaN(Number(e.target.value))
                          ? 0
                          : Number(e.target.value)
                      )
                    }
                    disabled={!canUpdateUserInfo}
                    maxLength={2}
                    errorMessage={form.formState.errors.officeHours?.message}
                    label="Office Hours:"
                  />
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            name="workingHours"
            control={form.control}
            render={({ field }) => (
              <FormItem className="flex justify-center items-center">
                <FormControl className="grow">
                  <InputField
                    value={field.value}
                    onChange={(e) =>
                      field.onChange(
                        isNaN(Number(e.target.value))
                          ? 0
                          : Number(e.target.value)
                      )
                    }
                    disabled={!canUpdateUserInfo}
                    maxLength={2}
                    errorMessage={form.formState.errors.workingHours?.message}
                    label="Working Hours:"
                  />
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            name="joiningDate"
            control={form.control}
            render={({ field }) => (
              <FormItem className="flex justify-center items-center">
                <FormControl className="grow">
                  <DatePickerField
                    label="Joining Date:"
                    value={field.value}
                    disabled={!canUpdateUserInfo}
                    onChange={field.onChange}
                    placeholder="Select a date"
                    errorMessage={form.formState.errors.joiningDate?.message}
                  />
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            name="employmentStatus"
            control={form.control}
            render={({ field }) => (
              <FormItem className="flex justify-center items-center">
                <FormControl className="grow">
                  <Select
                    defaultValue={field.value}
                    onValueChange={field.onChange}
                    disabled={!canUpdateUserInfo}
                  >
                    <SelectTrigger
                      label="Employement Status:"
                      errorMessage={
                        form.formState.errors.employmentStatus?.message
                      }
                    >
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="permanent">Permanent</SelectItem>
                      <SelectItem value="probation">Probation</SelectItem>
                      <SelectItem value="notice period">
                        Notice Period
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            name="permanentDate"
            control={form.control}
            render={({ field }) => (
              <FormItem className="flex justify-center items-center">
                <FormControl className="grow">
                  <DatePickerField
                    label="Permanent Date:"
                    disabled={
                      employmentStatus !== "permanent" || !canUpdateUserInfo
                    }
                    value={
                      employmentStatus !== "permanent" ? null : field.value
                    }
                    onChange={field.onChange}
                    placeholder="Select a date"
                    errorMessage={form.formState.errors.permanentDate?.message}
                  />
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            name="reportingOffice"
            control={form.control}
            render={({ field }) => (
              <FormItem className="flex justify-center items-center">
                <FormControl className="grow">
                  <InputField
                    value={field.value}
                    onChange={field.onChange}
                    disabled={!canUpdateUserInfo}
                    errorMessage={
                      form.formState.errors.reportingOffice?.message
                    }
                    label="Reporting Office:"
                  />
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            name="reportingOfficeLocation"
            control={form.control}
            render={({ field }) => (
              <FormItem className="flex justify-center items-center">
                <FormControl className="grow">
                  <InputField
                    value={field.value}
                    onChange={field.onChange}
                    disabled={!canUpdateUserInfo}
                    errorMessage={
                      form.formState.errors.reportingOfficeLocation?.message
                    }
                    label="Reporting Office Location:"
                  />
                </FormControl>
              </FormItem>
            )}
          />
          {form.getValues().role.name === "ENGINEER" && (
            <FormField
              name="managerId"
              control={form.control}
              render={({ field }) => (
                <FormItem className="flex justify-center items-center">
                  <FormControl className="grow">
                    <Select
                      value={field.value}
                      onValueChange={field.onChange}
                      disabled={!canUpdateUserInfo}
                    >
                      <SelectTrigger
                        label="Line Project Manager:"
                        errorMessage={form.formState.errors.managerId?.message}
                      >
                        <SelectValue placeholder="Enter Project Manager" />
                      </SelectTrigger>
                      <SelectContent>
                        {getUserByRole &&
                        Array.isArray(getUserByRole.getUserByRole) &&
                        getUserByRole.getUserByRole.length > 0 ? (
                          getUserByRole.getUserByRole.map(
                            (pm: { name: string; _id: string }) => (
                              <SelectItem key={pm._id} value={pm._id}>
                                {pm.name}
                              </SelectItem>
                            )
                          )
                        ) : (
                          <SelectItem
                            key={
                              professionalInfo.professionalInfo
                                .lineProjectManager._id
                            }
                            value={
                              professionalInfo.professionalInfo
                                .lineProjectManager._id
                            }
                          >
                            {
                              professionalInfo.professionalInfo
                                .lineProjectManager.name
                            }
                          </SelectItem>
                        )}
                      </SelectContent>
                    </Select>
                  </FormControl>
                </FormItem>
              )}
            />
          )}

          {canUpdateUserInfo && (
            <div className="flex col-span-full mt-md items-center justify-center w-full ">
              <Button
                type="submit"
                title={mutation.isPending ? "Loading" : "Save"}
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

export default ProfessionalInfoForm;
