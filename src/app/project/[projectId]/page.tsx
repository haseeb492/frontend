"use client";

import Loader from "@/Components/Common/Loader";
import ProjectDetailsForm from "@/Components/Forms/ProjectDetailsForm";
import HeaderCard from "@/Components/HeaderCard";
import useGetProject from "@/hooks/use-get-project";
import React from "react";

const Page = ({ params }: { params: { projectId: string } }) => {
  const { project, isLoading } = useGetProject(params.projectId);

  return (
    <div className="">
      <HeaderCard title="Project Info" subTitle="Review project details" />
      {isLoading ? (
        <Loader />
      ) : (
        <ProjectDetailsForm projectId={params.projectId} />
      )}
    </div>
  );
};

export default Page;
