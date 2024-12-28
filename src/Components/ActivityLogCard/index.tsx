import React, { useState, useRef, useEffect } from "react";
import { formatDuration, formatTime, getTotalOfficeTime } from "@/lib/utils";

const ActivityLogCard = ({ log, isExpanded, onToggle }: any) => {
  const contentRef = useRef<HTMLDivElement>(null);
  const [height, setHeight] = useState<number | string>(0);

  useEffect(() => {
    if (isExpanded && contentRef.current) {
      setHeight(contentRef.current.scrollHeight);
    } else {
      setHeight(0);
    }
  }, [isExpanded]);

  const totalOfficeTime = getTotalOfficeTime(
    log.checkInOutHistory.checkInTime,
    log.checkInOutHistory.checkOutTime
  );

  return (
    <div
      className="flex flex-col w-full p-4 border border-gray-300 shadow-md shadow-gray-400 rounded-[5px] mt-4 cursor-pointer transition-all duration-300"
      onClick={onToggle}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onToggle();
        }
      }}
      role="button"
      tabIndex={0}
      aria-expanded={isExpanded}
    >
      <div className="flex justify-between items-center">
        <span className="text-lg text-primary">
          {new Date(log.date).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
          })}
        </span>
        {log.isMinimumProductiveHours ? (
          <span className="text-sm text-green-600">
            You were productive that day
          </span>
        ) : (
          <span className="text-sm text-yellow-600">
            You were unproductive that day
          </span>
        )}
      </div>

      <div
        ref={contentRef}
        className="overflow-hidden transition-height duration-500"
        style={{ height: height }}
        aria-hidden={!isExpanded}
      >
        <div className="flex justify-around gap-x-6 mt-3">
          <div className="flex flex-col items-center">
            <span className="text-sm text-gray-500">Check-in time</span>
            <h2 className="text-xl text-gray-800">
              {formatTime(log.checkInOutHistory.checkInTime)}
            </h2>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-sm text-gray-500">Check-out Time</span>
            <h2 className="text-xl text-primary">
              {log.checkInOutHistory.checkOutTime
                ? formatTime(log.checkInOutHistory.checkOutTime)
                : "N/A"}
            </h2>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-sm text-gray-500">Total office time</span>
            <h2 className="text-xl text-primary">
              {formatDuration(totalOfficeTime)}
            </h2>
          </div>
        </div>

        <div className="flex justify-around gap-x-6 mt-3">
          <div className="flex flex-col items-center">
            <span className="text-sm text-gray-500">Break Time</span>
            <h2 className="text-xl text-gray-800">
              {formatDuration(log.totalBreakDuration)}
            </h2>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-sm text-gray-500">Idle Time</span>
            <h2 className="text-xl text-gray-800">
              {formatDuration(log.totalIdleDuration)}
            </h2>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-sm text-gray-500">Productive time</span>
            <h2 className="text-xl text-primary">
              {formatDuration(log.totalRndDuration + log.totalWorkDuration)}
            </h2>
          </div>
        </div>

        {log.isLateCheckin && (
          <div className="flex justify-center w-full mt-3">
            <span className="text-sm text-red-600">
              You were late that day!
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default ActivityLogCard;
