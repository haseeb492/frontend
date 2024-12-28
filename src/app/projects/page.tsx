"use client";

import React, { useState, useEffect } from "react";
import withAuthorization from "@/HOC/withAuthorization";
import { ACCESS_CONTROL } from "@/constants/accessControlConfig";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import useGetProjects from "@/hooks/use-get-projects";
import Loader from "@/Components/Common/Loader";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/Components/Common/SelectionField";
import {
  CheckCircle,
  Circle,
  Hourglass,
  StopCircle,
  XCircle,
} from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import axiosInstance from "@/AxiosInterceptor";
import { toast } from "@/Components/Common/Toast/use-toast";
import { ApiError } from "@/lib/types";
import Button from "@/Components/Common/Button";
import { useRouter } from "next/navigation";
import HeaderCard from "@/Components/HeaderCard";

const statuses = [
  {
    value: "in_progress",
    label: "In Progress",
    icon: <Hourglass className="w-4 h-4 text-blue-500 mr-2" />,
    color: "text-blue-500",
  },
  {
    value: "requirement_gathering",
    label: "Requirement Gathering",
    icon: <Circle className="w-4 h-4 text-yellow-500 mr-2" />,
    color: "text-yellow-500",
  },
  {
    value: "completed",
    label: "Completed",
    icon: <CheckCircle className="w-4 h-4 text-green-500 mr-2" />,
    color: "text-green-500",
  },
  {
    value: "canceled",
    label: "Canceled",
    icon: <XCircle className="w-4 h-4 text-red-500 mr-2" />,
    color: "text-red-500",
  },
  {
    value: "on_hold",
    label: "On Hold",
    icon: <StopCircle className="w-4 h-4 text-purple-500 mr-2" />,
    color: "text-purple-500",
  },
];

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
  const [status, setStatus] = useState<string>("all");
  const [projectList, setProjectList] = useState<ProjectProps[]>([]);
  const router = useRouter();
  const user = useSelector((state: RootState) => state.user);

  const userScope = ACCESS_CONTROL.routes["/projects"]?.scope[user.role.name];
  const isManager = userScope === "underManager";
  const { isLoading, projects } = useGetProjects(isManager, status);

  const mutation = useMutation({
    mutationFn: ({
      data,
      projectId,
    }: {
      data: { status: string };
      projectId: string;
    }) => {
      return axiosInstance.patch(
        `/project/update-project?projectId=${projectId}`,
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

  useEffect(() => {
    if (projects && projects.projects) {
      setProjectList(projects.projects);
    }
  }, [projects]);

  return (
    <div className="flex flex-col  w-full gap-sm justify-between p-md">
      <HeaderCard title="Projects" subTitle="Review or edit projects" />
      <div className="flex gap-md items-center w-full justify-between">
        <div className="">
          <Select defaultValue={status} onValueChange={setStatus}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="in_progress">In Progress</SelectItem>
              <SelectItem value="requirement_gathering">
                Requirement Gathering
              </SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
              <SelectItem value="canceled">Canceled</SelectItem>
              <SelectItem value="on_hold">On Hold</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="">
          <Button
            title="Add Project"
            className="grow px-md"
            onClick={() => router.push("/projects/add-project")}
          />
        </div>
      </div>

      {isLoading ? (
        <Loader />
      ) : (
        <div className="overflow-x-auto mt-lg">
          <Table className="min-w-full">
            <TableHeader>
              <TableRow className="truncate">
                {tableColumns.map((column) => (
                  <TableHead key={column.value}>{column.label}</TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {projectList && projectList.length > 0 ? (
                projectList.map((project: ProjectProps, index: number) => (
                  <TableRow
                    key={project._id}
                    className="truncate cursor-pointer"
                    onClick={() => router.replace(`/project/${project._id}`)}
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
                      <Select
                        value={project.status}
                        onValueChange={(newStatus) => {
                          mutation.mutate({
                            data: { status: newStatus },
                            projectId: project._id,
                          });

                          const updatedProjects = [...projectList];
                          updatedProjects[index] = {
                            ...project,
                            status: newStatus,
                          };
                          setProjectList(updatedProjects);
                        }}
                      >
                        <SelectTrigger className="flex items-center bg-transparent border-none p-0 focus:ring-0 focus:outline-none">
                          <StatusBadge status={project.status} />
                        </SelectTrigger>
                        <SelectContent className="custom-select-content">
                          {statuses.map((statusOption) => (
                            <SelectItem
                              key={statusOption.value}
                              value={statusOption.value}
                            >
                              <div className="flex items-center">
                                {statusOption.icon}
                                <span
                                  className={`capitalize ${statusOption.color}`}
                                >
                                  {statusOption.label}
                                </span>
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
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
    </div>
  );
};

export default withAuthorization(Page, "/projects", "route");
