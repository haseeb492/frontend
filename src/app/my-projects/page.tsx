"use client";

import React from "react";
import useGetProjectsByResource from "@/hooks/use-get-projects-by-resource";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/Components/Common/Table";
import { capitalizeWords } from "@/lib/utils";
import StatusBadge from "@/Components/Common/StatusBadge";
import HeaderCard from "@/Components/HeaderCard";
import CircularLoader from "@/Components/Common/CircularLoader";

type ProjectProps = {
  _id: string;
  name: string;
  startDate: string;
  status: string;
};

const tableColumns = [
  { label: "Name", value: "name" },
  { label: "Start Date", value: "startDate" },
  { label: "Status", value: "status" },
];

const Page = () => {
  const { projectsByresource, isLoading } = useGetProjectsByResource();

  return (
    <>
      {isLoading ? (
        <div className="flex items-center justify-center mt-10">
          <CircularLoader size={40} />
        </div>
      ) : (
        <div className="overflow-x-auto">
          <HeaderCard
            title="My Projects"
            subTitle="Review the projects you're working on"
          />
          <Table className="min-w-full mt-5">
            <TableHeader>
              <TableRow className="truncate">
                {tableColumns.map((column) => (
                  <TableHead key={column.value}>{column.label}</TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {projectsByresource?.projects &&
              projectsByresource.projects.length > 0 ? (
                projectsByresource.projects.map((project: ProjectProps) => (
                  <TableRow
                    key={project._id}
                    className="truncate cursor-pointer"
                  >
                    <TableCell>{capitalizeWords(project.name)}</TableCell>
                    <TableCell>
                      {new Date(project.startDate).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </TableCell>
                    <TableCell className="w-36">
                      <StatusBadge status={project.status} />
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={3} className="text-center py-4">
                    No projects found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      )}
    </>
  );
};

export default Page;
