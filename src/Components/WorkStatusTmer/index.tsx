import { formatDuration } from "@/lib/utils";
import { useEffect, useState } from "react";

interface WorkStatusTimerProps {
  initialTimeInMinutes: number;
  status?: string;
  isBreak?: boolean;
}

const WorkStatusTimer: React.FC<WorkStatusTimerProps> = ({
  initialTimeInMinutes,
  status = "",
  isBreak = false,
}) => {
  const [timeInMinutes, setTimeInMinutes] = useState(initialTimeInMinutes);

  useEffect(() => {
    setTimeInMinutes(initialTimeInMinutes);
  }, [initialTimeInMinutes]);

  useEffect(() => {
    let intervalId: NodeJS.Timeout | null = null;

    if (
      (isBreak && status === "break") ||
      (!isBreak && (status === "working" || status === "rnd"))
    ) {
      intervalId = setInterval(() => {
        setTimeInMinutes((prevTime) => prevTime + 1);
      }, 60000);
    } else {
      if (intervalId) {
        clearInterval(intervalId);
        intervalId = null;
      }
    }

    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [status, isBreak]);

  return <span className="">{formatDuration(timeInMinutes)}</span>;
};

export default WorkStatusTimer;
