import { cn } from "@/lib/utils";
import React from "react";

const Loader = ({ className }: { className?: string }) => {
  return (
    <div
      className={cn(
        "bg-black/80 fixed inset-0 z-50 flex items-center justify-center",
        className
      )}
    >
      <div className="w-xl loader grid aspect-square"></div>
    </div>
  );
};

export default Loader;
