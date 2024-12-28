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
import { personalInfoSchema } from "@/lib/schemas";
import { checkAccess, formatDate } from "@/lib/utils";
import { ApiError, UserState } from "@/lib/types";
import useGetPersonalInfo from "@/hooks/use-get-personal-info";
import { useMutation } from "@tanstack/react-query";
import axiosInstance from "@/AxiosInterceptor";
import { toast } from "@/Components/Common/Toast/use-toast";

interface RequestBodyType {
  personalInfo: {
    nameOnCNIC: string | undefined;
    personalEmail: string | undefined;
    CNICNumber: string | undefined;
    maritalStatus: string | undefined;
    dateOfBirth: string;
    gender: string | undefined;
    bloodGroup: string | undefined;
    mobileNumber: string | undefined;
    secondaryMobileNumber: string | undefined;
    vehicleType: string | undefined;
    vehicleNumber: string | undefined;
    NTNNumber: string | undefined;
    officialBankAccountNumber: string | undefined;
    city: string | undefined;
    permanentAddress: string | undefined;
    currentAddress: string | undefined;
    slackId: string | undefined;
    familyMemberName: string | undefined;
    familyContactNumber: string | undefined;
    familyRelationShip: string | undefined;
    marriageDate: string | undefined;
  };
}

interface PersonalInfoFormProps {
  isLoggedInUser: boolean;
  userId: string;
}

const PersonalInfoForm = ({
  isLoggedInUser,
  userId,
}: PersonalInfoFormProps) => {
  const user: UserState = useSelector((state: RootState) => state.user);
  const { personalInfo } = useGetPersonalInfo(userId, isLoggedInUser);

  const canUpdatePersonalInfo = checkAccess(
    user,
    "UpdateUserInfo",
    "component"
  );

  const form = useForm<z.infer<typeof personalInfoSchema>>({
    resolver: zodResolver(personalInfoSchema),
    mode: "onBlur",
    defaultValues: {
      nameOnCNIC: personalInfo?.personalInfo?.nameOnCNIC,
      personalEmail: personalInfo?.personalInfo?.personalEmail,
      CNICNumber: personalInfo?.personalInfo?.CNICNumber,
      maritalStatus: personalInfo?.personalInfo?.maritalStatus,
      dateOfBirth: personalInfo?.personalInfo?.dateOfBirth || null,
      gender: personalInfo?.personalInfo?.gender,
      bloodGroup: personalInfo?.personalInfo?.bloodGroup,
      mobileNumber: personalInfo?.personalInfo?.mobileNumber,
      secondaryMobileNumber: personalInfo?.personalInfo?.secondaryMobileNumber,
      vehicleType: personalInfo?.personalInfo?.vehicleType,
      vehicleNumber: personalInfo?.personalInfo?.vehicleNumber,
      NTNNumber: personalInfo?.personalInfo?.NTNNumber,
      officialBankAccountNumber:
        personalInfo?.personalInfo?.officialBankAccountNumber,
      city: personalInfo?.personalInfo?.city,
      permanentAddress: personalInfo?.personalInfo?.permanentAddress,
      currentAddress: personalInfo?.personalInfo?.currentAddress,
      slackId: personalInfo?.personalInfo?.slackId,
      familyMemberName: personalInfo?.personalInfo?.familyMemberName,
      familyContactNumber: personalInfo?.personalInfo?.familyContactNumber,
      familyRelationship: personalInfo?.personalInfo?.familyRelationship,
      marriageDate: personalInfo?.personalInfo?.marriageDate || null,
    },
  });

  const maritalStatus = useWatch({
    control: form.control,
    name: "maritalStatus",
  });

  const mutation = useMutation({
    mutationFn: (data: RequestBodyType) => {
      const endpoint = isLoggedInUser
        ? `/user/update-personal-info`
        : `/user/update-user-personal-info?userId=${userId}`;
      return axiosInstance.patch(endpoint, data);
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

  const onSubmit = (values: z.infer<typeof personalInfoSchema>) => {
    const formattedPayload: RequestBodyType = {
      personalInfo: {
        nameOnCNIC: values.nameOnCNIC,
        personalEmail: values.personalEmail,
        CNICNumber: values.CNICNumber,
        maritalStatus: values.maritalStatus,
        dateOfBirth: formatDate(values.dateOfBirth),
        gender: values.gender,
        bloodGroup: values.bloodGroup,
        mobileNumber: values.mobileNumber,
        secondaryMobileNumber: values.secondaryMobileNumber,
        vehicleType: values.vehicleType,
        vehicleNumber: values.vehicleNumber,
        NTNNumber: values.NTNNumber,
        officialBankAccountNumber: values.officialBankAccountNumber,
        city: values.city,
        permanentAddress: values.permanentAddress,
        currentAddress: values.currentAddress,
        slackId: values.slackId,
        familyMemberName: values.familyMemberName,
        familyContactNumber: values.familyContactNumber,
        familyRelationShip: values.familyRelationship,
        marriageDate:
          maritalStatus !== "married" ? "" : formatDate(values.marriageDate),
      },
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
            name="nameOnCNIC"
            control={form.control}
            render={({ field }) => (
              <FormItem className="flex justify-center items-center">
                <FormControl className="grow">
                  <InputField
                    value={field.value}
                    onChange={field.onChange}
                    disabled={!canUpdatePersonalInfo}
                    errorMessage={form.formState.errors.nameOnCNIC?.message}
                    label="Name on CNIC:"
                  />
                </FormControl>
              </FormItem>
            )}
          />
          {/* email */}
          <FormField
            name="personalEmail"
            control={form.control}
            render={({ field }) => (
              <FormItem className="flex justify-center items-center">
                <FormControl className="grow">
                  <InputField
                    value={field.value}
                    onChange={field.onChange}
                    disabled={!canUpdatePersonalInfo}
                    errorMessage={form.formState.errors.personalEmail?.message}
                    label="Personal Email:"
                  />
                </FormControl>
              </FormItem>
            )}
          />
          {/* 13 digit CNIC Number */}
          <FormField
            name="CNICNumber"
            control={form.control}
            render={({ field }) => (
              <FormItem className="flex justify-center items-center">
                <FormControl className="grow">
                  <InputField
                    value={field.value}
                    onChange={field.onChange}
                    disabled={!canUpdatePersonalInfo}
                    errorMessage={form.formState.errors.CNICNumber?.message}
                    label="CNIC Number:"
                    maxLength={13}
                  />
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            name="maritalStatus"
            control={form.control}
            render={({ field }) => (
              <FormItem className="flex justify-center items-center">
                <FormControl className="grow">
                  <Select
                    defaultValue={field.value}
                    onValueChange={field.onChange}
                    disabled={!canUpdatePersonalInfo}
                  >
                    <SelectTrigger
                      label="Marriage Status:"
                      errorMessage={
                        form.formState.errors.maritalStatus?.message
                      }
                    >
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="married">Married</SelectItem>
                      <SelectItem value="single">Single</SelectItem>
                    </SelectContent>
                  </Select>
                </FormControl>
              </FormItem>
            )}
          />
          {/* date picker */}
          <FormField
            name="marriageDate"
            control={form.control}
            render={({ field }) => (
              <FormItem className="flex justify-center items-center">
                <FormControl className="grow">
                  <DatePickerField
                    label="Marriage Date:"
                    value={maritalStatus !== "married" ? null : field.value}
                    onChange={field.onChange}
                    disabled={
                      !canUpdatePersonalInfo || maritalStatus !== "married"
                    }
                    placeholder="Select a date"
                    errorMessage={form.formState.errors.marriageDate?.message}
                  />
                </FormControl>
              </FormItem>
            )}
          />
          {/*  date picker */}
          <FormField
            name="dateOfBirth"
            control={form.control}
            render={({ field }) => (
              <FormItem className="flex justify-center items-center">
                <FormControl className="grow">
                  <DatePickerField
                    label="Date of Birth"
                    value={field.value}
                    onChange={field.onChange}
                    placeholder="Select a date"
                    disabled={!canUpdatePersonalInfo}
                    errorMessage={form.formState.errors.dateOfBirth?.message}
                  />
                </FormControl>
              </FormItem>
            )}
          />
          {/* dropdown */}
          <FormField
            name="gender"
            control={form.control}
            render={({ field }) => (
              <FormItem className="flex justify-center items-center">
                <FormControl className="grow">
                  <Select
                    defaultValue={field.value}
                    onValueChange={field.onChange}
                    disabled={!canUpdatePersonalInfo}
                  >
                    <SelectTrigger
                      label="Gender:"
                      errorMessage={form.formState.errors.gender?.message}
                    >
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="male">Male</SelectItem>
                      <SelectItem value="female">Female</SelectItem>
                    </SelectContent>
                  </Select>
                </FormControl>
              </FormItem>
            )}
          />
          {/* dropdown */}
          <FormField
            name="bloodGroup"
            control={form.control}
            render={({ field }) => (
              <FormItem className="flex justify-center items-center">
                <FormControl className="grow">
                  <Select
                    defaultValue={field.value}
                    onValueChange={field.onChange}
                    disabled={!canUpdatePersonalInfo}
                  >
                    <SelectTrigger
                      label="Blood Group:"
                      errorMessage={form.formState.errors.bloodGroup?.message}
                    >
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="AB+">AB+</SelectItem>
                      <SelectItem value="AB-">AB-</SelectItem>
                      <SelectItem value="A+">A+</SelectItem>
                      <SelectItem value="A-">A-</SelectItem>
                      <SelectItem value="B+">B+</SelectItem>
                      <SelectItem value="B-">B-</SelectItem>
                      <SelectItem value="O+">O+</SelectItem>
                      <SelectItem value="O-">O-</SelectItem>
                    </SelectContent>
                  </Select>
                </FormControl>
              </FormItem>
            )}
          />
          {/* phone no */}
          <FormField
            name="mobileNumber"
            control={form.control}
            render={({ field }) => (
              <FormItem className="flex justify-center items-center">
                <FormControl className="grow">
                  <InputField
                    value={field.value}
                    onChange={field.onChange}
                    disabled={!canUpdatePersonalInfo}
                    errorMessage={form.formState.errors.mobileNumber?.message}
                    label="Mobile Number:"
                    maxLength={10}
                  />
                </FormControl>
              </FormItem>
            )}
          />
          {/*  phone no */}
          <FormField
            name="secondaryMobileNumber"
            control={form.control}
            render={({ field }) => (
              <FormItem className="flex justify-center items-center">
                <FormControl className="grow">
                  <InputField
                    value={field.value}
                    onChange={field.onChange}
                    disabled={!canUpdatePersonalInfo}
                    errorMessage={
                      form.formState.errors.secondaryMobileNumber?.message
                    }
                    label="Secondary Mobile Number:"
                    maxLength={10}
                  />
                </FormControl>
              </FormItem>
            )}
          />

          {/* vehicle */}
          <FormField
            name="vehicleType"
            control={form.control}
            render={({ field }) => (
              <FormItem className="flex justify-center items-center">
                <FormControl className="grow">
                  <InputField
                    value={field.value}
                    onChange={field.onChange}
                    disabled={!canUpdatePersonalInfo}
                    errorMessage={form.formState.errors.vehicleType?.message}
                    label="Vehicle Type"
                  />
                </FormControl>
              </FormItem>
            )}
          />
          {/* vehicle no */}
          <FormField
            name="vehicleNumber"
            control={form.control}
            render={({ field }) => (
              <FormItem className="flex justify-center items-center">
                <FormControl className="grow">
                  <InputField
                    value={field.value}
                    onChange={field.onChange}
                    disabled={!canUpdatePersonalInfo}
                    errorMessage={form.formState.errors.vehicleNumber?.message}
                    label="Vehicle Number:"
                  />
                </FormControl>
              </FormItem>
            )}
          />
          {/* NTN number */}
          <FormField
            name="NTNNumber"
            control={form.control}
            render={({ field }) => (
              <FormItem className="flex justify-center items-center">
                <FormControl className="grow">
                  <InputField
                    value={field.value}
                    onChange={field.onChange}
                    disabled={!canUpdatePersonalInfo}
                    errorMessage={form.formState.errors.NTNNumber?.message}
                    label="NTN number:"
                    maxLength={7}
                  />
                </FormControl>
              </FormItem>
            )}
          />
          {/* bank Account no */}
          <FormField
            name="officialBankAccountNumber"
            control={form.control}
            render={({ field }) => (
              <FormItem className="flex justify-center items-center">
                <FormControl className="grow">
                  <InputField
                    value={field.value}
                    onChange={field.onChange}
                    disabled={!canUpdatePersonalInfo}
                    errorMessage={
                      form.formState.errors.officialBankAccountNumber?.message
                    }
                    label="Official Bank Account No:"
                    maxLength={16}
                  />
                </FormControl>
              </FormItem>
            )}
          />
          {/* city */}
          <FormField
            name="city"
            control={form.control}
            render={({ field }) => (
              <FormItem className="flex justify-center items-center">
                <FormControl className="grow">
                  <InputField
                    value={field.value}
                    onChange={field.onChange}
                    disabled={!canUpdatePersonalInfo}
                    errorMessage={form.formState.errors.city?.message}
                    label="City:"
                  />
                </FormControl>
              </FormItem>
            )}
          />
          {/* address */}
          <FormField
            name="permanentAddress"
            control={form.control}
            render={({ field }) => (
              <FormItem className="flex justify-center items-center">
                <FormControl className="grow">
                  <InputField
                    value={field.value}
                    onChange={field.onChange}
                    disabled={!canUpdatePersonalInfo}
                    errorMessage={
                      form.formState.errors.permanentAddress?.message
                    }
                    label="Permanent Address:"
                  />
                </FormControl>
              </FormItem>
            )}
          />
          {/* address */}
          <FormField
            name="currentAddress"
            control={form.control}
            render={({ field }) => (
              <FormItem className="flex justify-center items-center">
                <FormControl className="grow">
                  <InputField
                    value={field.value}
                    onChange={field.onChange}
                    disabled={!canUpdatePersonalInfo}
                    errorMessage={form.formState.errors.currentAddress?.message}
                    label="Current Address:"
                  />
                </FormControl>
              </FormItem>
            )}
          />
          {/* slack id */}
          <FormField
            name="slackId"
            control={form.control}
            render={({ field }) => (
              <FormItem className="flex justify-center items-center">
                <FormControl className="grow">
                  <InputField
                    value={field.value}
                    onChange={field.onChange}
                    disabled={!canUpdatePersonalInfo}
                    errorMessage={form.formState.errors.slackId?.message}
                    label="Slack Id:"
                  />
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            name="familyMemberName"
            control={form.control}
            render={({ field }) => (
              <FormItem className="flex justify-center items-center">
                <FormControl className="grow">
                  <InputField
                    value={field.value}
                    onChange={field.onChange}
                    disabled={!canUpdatePersonalInfo}
                    errorMessage={
                      form.formState.errors.familyMemberName?.message
                    }
                    label="Family Member Name:"
                  />
                </FormControl>
              </FormItem>
            )}
          />
          {/* phone no */}
          <FormField
            name="familyContactNumber"
            control={form.control}
            render={({ field }) => (
              <FormItem className="flex justify-center items-center">
                <FormControl className="grow">
                  <InputField
                    value={field.value}
                    onChange={field.onChange}
                    disabled={!canUpdatePersonalInfo}
                    errorMessage={
                      form.formState.errors.familyContactNumber?.message
                    }
                    label="Family Member Contact Number:"
                    maxLength={10}
                  />
                </FormControl>
              </FormItem>
            )}
          />
          {/* relationship */}
          <FormField
            name="familyRelationship"
            control={form.control}
            render={({ field }) => (
              <FormItem className="flex justify-center items-center">
                <FormControl className="grow">
                  <InputField
                    value={field.value}
                    onChange={field.onChange}
                    disabled={!canUpdatePersonalInfo}
                    errorMessage={
                      form.formState.errors.familyRelationship?.message
                    }
                    label="Family Member RelationShip:"
                  />
                </FormControl>
              </FormItem>
            )}
          />
          {canUpdatePersonalInfo && (
            <div className="flex col-span-full mt-md items-center justify-center w-full ">
              <Button
                type="submit"
                disabled={mutation.isPending || !form.formState.isDirty}
                title={mutation.isPending ? "Loading" : "Save"}
                className="w-full lg:min-w-[400px]"
              />
            </div>
          )}
        </form>
      </Form>
    </div>
  );
};

export default PersonalInfoForm;
