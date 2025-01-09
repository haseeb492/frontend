import React from "react";
import WorkStatusTimer from "../WorkStatusTmer";

interface AvailableProductiveHoursProps {
  availableProductiveDuration: number;
  status?: string;
}

const AvailableProductiveHours = ({
  availableProductiveDuration,
  status = "",
}: AvailableProductiveHoursProps) => {
  return (
    <div
      className="flex flex-col p-4 border border-gray-300 shadow-md
  shadow-gray-400 rounded-[5px] gap-y-4 w-full"
    >
      <h1 className="text-xl">Productive Hours</h1>
      <h2 className="text-primary text-lg">
        <WorkStatusTimer
          initialTimeInMinutes={availableProductiveDuration}
          status={status}
        />
      </h2>
    </div>
  );
};

export default AvailableProductiveHours;
