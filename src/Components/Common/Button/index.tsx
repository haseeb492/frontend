import { cn } from "@/lib/utils";
import React from "react";

interface ButtonProps {
  title: string | React.ReactNode;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
  className?: string;
  variant?: "outline" | "destructive" | "default";
  disabled?: boolean;
  type?: "button" | "submit";
}

const Button = ({
  title,
  onClick,
  className,
  variant,
  disabled,
  type,
}: ButtonProps) => {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      type={type}
      className={cn(
        className,
        " font-medium w-auto h-auto rounded-3xs text-white bg-primary shadow-blue-400 text-sm p-sm focus:outline-none text-center shadow-sm",
        {
          "bg-gray-400 text-zinc-800 shadow-gray-400 cursor-not-allowed":
            disabled,
          "text-primary border-primary border bg-gray-50 shadow-gray-400":
            variant === "outline",
          "bg-red-600 border-red-600 border shadow-red-400":
            variant === "destructive",
        }
      )}
    >
      {title}
    </button>
  );
};

export default Button;
