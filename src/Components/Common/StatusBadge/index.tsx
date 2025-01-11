import { Circle } from "lucide-react";
import { Icon } from "@iconify/react";

const StatusBadge = ({ status }: { status: string }) => {
  let icon;
  let color;

  switch (status) {
    case "in_progress":
      icon = (
        <Icon
          icon="mdi:progress-clock"
          className="w-4 h-4 text-blue-500 mr-2"
        />
      );
      color = "text-blue-500";
      break;
    case "requirement_gathering":
      icon = (
        <Icon
          icon="mdi:clipboard-text-outline"
          className="w-4 h-4 text-yellow-500 mr-2"
        />
      );
      color = "text-yellow-500";
      break;
    case "completed":
      icon = (
        <Icon
          icon="mdi:check-circle-outline"
          className="w-4 h-4 text-green-500 mr-2"
        />
      );
      color = "text-green-500";
      break;
    case "canceled":
      icon = <Icon icon="mdi:cancel" className="w-4 h-4 text-red-500 mr-2" />;
      color = "text-red-500";
      break;
    case "on_hold":
      icon = (
        <Icon
          icon="mdi:pause-circle-outline"
          className="w-4 h-4 text-purple-500 mr-2"
        />
      );
      color = "text-purple-500";
      break;
    default:
      icon = (
        <Icon
          icon="mdi:pause-circle-outline"
          className="w-4 h-4 text-gray-500 mr-2"
        />
      );
      color = "text-gray-500";
  }

  return (
    <div className="flex items-center">
      {icon}
      <span className={`capitalize ${color}`}>{status.replace("_", " ")}</span>
    </div>
  );
};

export default StatusBadge;
