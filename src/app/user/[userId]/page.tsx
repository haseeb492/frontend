"use client";

import CircularLoader from "@/Components/Common/CircularLoader";
import { Tabs, TabsList, TabsTrigger } from "@/Components/Common/Tabs";
import PersonalInfoForm from "@/Components/Forms/PersonalInfoForm";
import ProfessionalInfoForm from "@/Components/Forms/ProfessionalInfoForm";
import useGetPersonalInfo from "@/hooks/use-get-personal-info";
import useGetProfessionalInfo from "@/hooks/use-get-professional-info";
import { RootState } from "@/redux/store";
import React, { useState } from "react";
import { useSelector } from "react-redux";

const Page = ({ params }: { params: { userId: string } }) => {
  const [selectedTab, setSelectedTab] = useState<string>("personal");
  const user = useSelector((state: RootState) => state.user);
  let isLoggedInUser: boolean;

  if (user._id === params.userId) {
    isLoggedInUser = true;
  } else {
    isLoggedInUser = false;
  }

  const { isLoading: isProfessionalInfoLoading } = useGetProfessionalInfo(
    params.userId,
    isLoggedInUser
  );
  const { isLoading: isPersonalInfoLoading } = useGetPersonalInfo(
    params.userId,
    isLoggedInUser
  );

  return (
    <div>
      <div className="flex justify-between items-center">
        <h1 className="text-4xl text-primary">User Info</h1>
        <Tabs
          defaultValue="personal"
          className="w-[400px]"
          onValueChange={(value: React.SetStateAction<string>) =>
            setSelectedTab(value)
          }
        >
          <TabsList>
            <TabsTrigger value="personal">Personal</TabsTrigger>
            <TabsTrigger value="professional">Professional</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>
      {selectedTab === "personal" ? (
        isPersonalInfoLoading ? (
          <div className="flex items-center justify-center mt-10">
            <CircularLoader size={40} />
          </div>
        ) : (
          <PersonalInfoForm
            isLoggedInUser={isLoggedInUser}
            userId={params.userId}
          />
        )
      ) : isProfessionalInfoLoading ? (
        <div className="flex items-center justify-center mt-10">
          <CircularLoader size={40} />
        </div>
      ) : (
        <ProfessionalInfoForm
          isLoggedInUser={isLoggedInUser}
          userId={params.userId}
        />
      )}
    </div>
  );
};

export default Page;
