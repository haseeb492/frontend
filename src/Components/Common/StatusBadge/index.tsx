import {
  CheckCircle,
  Circle,
  Hourglass,
  StopCircle,
  XCircle,
} from "lucide-react";

const StatusBadge = ({ status }: { status: string }) => {
  let icon;
  let color;

  switch (status) {
    case "in_progress":
      icon = <Hourglass className="w-4 h-4 text-blue-500 mr-2" />;
      color = "text-blue-500";
      break;
    case "requirement_gathering":
      icon = <Circle className="w-4 h-4 text-yellow-500 mr-2" />;
      color = "text-yellow-500";
      break;
    case "completed":
      icon = <CheckCircle className="w-4 h-4 text-green-500 mr-2" />;
      color = "text-green-500";
      break;
    case "canceled":
      icon = <XCircle className="w-4 h-4 text-red-500 mr-2" />;
      color = "text-red-500";
      break;
    case "on_hold":
      icon = <StopCircle className="w-4 h-4 text-purple-500 mr-2" />;
      color = "text-purple-500";
      break;
    default:
      icon = <Circle className="w-4 h-4 text-gray-500 mr-2" />;
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
