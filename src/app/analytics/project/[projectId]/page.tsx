"use client";

import useGetProjectAnalytics from "@/hooks/use-get-project-analytics";
import { RootState } from "@/redux/store";
import React from "react";
import { useSelector } from "react-redux";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Pie } from "react-chartjs-2";
import HeaderCard from "@/Components/HeaderCard";
import CircularLoader from "@/Components/Common/CircularLoader";
import { generateRandomColors } from "@/lib/utils";

interface User {
  _id: string;
  name: string;
  time: number;
}

ChartJS.register(ArcElement, Tooltip, Legend);

const Page = ({ params }: { params: { projectId: string } }) => {
  const user = useSelector((state: RootState) => state.user);

  const { projectAnalytics, isLoading } = useGetProjectAnalytics(
    params.projectId,
    user?._id ? true : false
  );

  const usersWithTime =
    projectAnalytics?.filter((user: User) => user.time > 0) || [];

  const colors = generateRandomColors(usersWithTime.length);
  const chartData = {
    labels: usersWithTime.map((user: User) => user.name),
    datasets: [
      {
        data: usersWithTime.map((user: User) => user.time),
        backgroundColor: colors,
        borderWidth: 1,
      },
    ],
  };

  return (
    <>
      <HeaderCard
        title="Project Analytics"
        subTitle="Visualize project analytics"
      />
      {isLoading ? (
        <div className="flex items-center justify-center mt-10">
          <CircularLoader size={40} />
        </div>
      ) : (
        <div className="flex flex-col md:flex-row items-center gap-10 mt-10">
          {usersWithTime && usersWithTime.length > 0 && (
            <div className="w-1/2">
              <Pie data={chartData} />
            </div>
          )}
          <div className="w-1/2">
            <ul className="space-y-4">
              {usersWithTime && usersWithTime.length > 0 ? (
                usersWithTime.map((user: User, index: number) => (
                  <li
                    key={user._id}
                    className="flex items-center gap-4 text-lg"
                  >
                    <div
                      className="w-6 h-6 rounded-full"
                      style={{ backgroundColor: colors[index] }}
                    ></div>
                    <div>
                      {user.name} - {(user.time / 60).toFixed(0)} hours
                    </div>
                  </li>
                ))
              ) : (
                <span className="text-slate-400 text-md">
                  {" "}
                  No data available for this project
                </span>
              )}
            </ul>
          </div>
        </div>
      )}
    </>
  );
};

export default Page;
