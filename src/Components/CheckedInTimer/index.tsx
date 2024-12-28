import { formatDuration } from "@/lib/utils";
import React, { useEffect, useState } from "react";

interface CheckedInTimerProps {
  initialTimeInMinutes: number;
}

const CheckedInTimer: React.FC<CheckedInTimerProps> = ({
  initialTimeInMinutes,
}) => {
  const [elapsedTimeInMinutes, setElapsedTimeInMinutes] =
    useState(initialTimeInMinutes);

  useEffect(() => {
    setElapsedTimeInMinutes(initialTimeInMinutes);
  }, [initialTimeInMinutes]);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setElapsedTimeInMinutes((prevTime) => prevTime + 1);
    }, 60000);

    return () => clearInterval(intervalId);
  }, []);

  return (
    <span className="text-xl text-gray-800">
      {formatDuration(elapsedTimeInMinutes)}
    </span>
  );
};

export default CheckedInTimer;
