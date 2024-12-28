"use client";

import { cn } from "@/lib/utils";
import * as RadioGroupPrimitive from "@radix-ui/react-radio-group";
import { forwardRef } from "react";

const RadioGroup = forwardRef<
  React.ElementRef<typeof RadioGroupPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Root>
>(({ className, ...props }, ref) => {
  return (
    <RadioGroupPrimitive.Root
      className={cn("grid gap-2", className)}
      {...props}
      ref={ref}
    />
  );
});
RadioGroup.displayName = RadioGroupPrimitive.Root.displayName;

export interface RadioGroupItemProps
  extends React.ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Item> {
  label: string;
  valid?: boolean;
  description?: string | React.ReactNode;
}

const RadioGroupItem = forwardRef<
  React.ElementRef<typeof RadioGroupPrimitive.Item>,
  RadioGroupItemProps
>(({ id, label, description, disabled, className, ...props }, ref) => {
  return (
    <label htmlFor={id} className="gap-sm flex flex-row items-start">
      <RadioGroupPrimitive.Item
        id={id}
        ref={ref}
        className={cn(
          "disabled:bg-trans-white-100 border-gray-300 disabled:fill-gray-300 disabled:data-[state=checked]:border-gray-400 my-xs peer aspect-square h-[20px] w-[20px] rounded-[10px] border fill-primary hover:border-gray-400 active:border-[2px] active:border-gray-300 disabled:cursor-not-allowed data-[state=checked]:border-[2px] data-[state=checked]:border-gray-400",
          className
        )}
        disabled={disabled}
        {...props}
      >
        <RadioGroupPrimitive.Indicator className="flex items-center justify-center">
          <Dot className="size-[8px] fill-primary" />
        </RadioGroupPrimitive.Indicator>
      </RadioGroupPrimitive.Item>
      <div className="gap-2xs flex flex-col">
        <label
          htmlFor={id}
          className={`text-sm font-bold text-zinc-900 ${
            disabled && "text-gray-400"
          }`}
        >
          {label}
        </label>
        {Boolean(description) && (
          <div
            className={`text-sm text-zinc-900 ${
              disabled && "cursor-not-allowed text-gray-400"
            }`}
          >
            {description}
          </div>
        )}
      </div>
    </label>
  );
});
RadioGroupItem.displayName = RadioGroupPrimitive.Item.displayName;

const Dot: React.FC<{ className?: string }> = (props) => (
  <svg viewBox="0 0 8 8" xmlns="http://www.w3.org/2000/svg" {...props}>
    <circle cx="4" cy="4" r="4" />
  </svg>
);

export { RadioGroup, RadioGroupItem };
