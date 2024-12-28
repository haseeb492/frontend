"use client";

import * as SelectPrimitive from "@radix-ui/react-select";
import { Icon } from "@iconify/react";

import { cn } from "@/lib/utils";
import { forwardRef } from "react";

const Select = SelectPrimitive.Root;

const SelectGroup = SelectPrimitive.Group;

const SelectValue = SelectPrimitive.Value;
export interface SelectTriggerProps
  extends React.ComponentPropsWithoutRef<typeof SelectPrimitive.Trigger> {
  label?: string;
  errorMessage?: string;
}
const SelectTrigger = forwardRef<
  React.ElementRef<typeof SelectPrimitive.Trigger>,
  SelectTriggerProps
>(({ className, label, id, errorMessage, children, ...props }, ref) => (
  <div className="w-full flex flex-col gap-2xs">
    <label htmlFor={id} className="text-sm font-bold text-zinc-900">
      {label}
    </label>
    <SelectPrimitive.Trigger
      ref={ref}
      className={cn(
        "disabled:bg-gray-200 flex items-center justify-between disabled:focus-visible:border-gray-300 disabled:hover:border-gray-300 border px-sm h-3lg border-gray-300 hover:border-primary focus-visible:border-primary focus-visible:outline-none focus:border-2 text-sm rounded-3xs w-full disabled:cursor-not-allowed disabled:opacity-50",
        className,
        errorMessage && "border-red-500 focus-visible:border-red-500"
      )}
      {...props}
    >
      {children}
      <SelectPrimitive.Icon asChild>
        <Icon icon="mdi:chevron-down" width={24} height={24} />
      </SelectPrimitive.Icon>
    </SelectPrimitive.Trigger>
    {errorMessage && <p className="text-md text-red-500">{errorMessage}</p>}
  </div>
));
SelectTrigger.displayName = SelectPrimitive.Trigger.displayName;

const SelectScrollUpButton = forwardRef<
  React.ElementRef<typeof SelectPrimitive.ScrollUpButton>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.ScrollUpButton>
>(({ className, ...props }, ref) => (
  <SelectPrimitive.ScrollUpButton
    ref={ref}
    className={cn(
      "flex cursor-default items-center justify-center py-1",
      className
    )}
    {...props}
  >
    <Icon icon="mdi:chevron-up" width={24} height={24} />
  </SelectPrimitive.ScrollUpButton>
));
SelectScrollUpButton.displayName = SelectPrimitive.ScrollUpButton.displayName;

const SelectScrollDownButton = forwardRef<
  React.ElementRef<typeof SelectPrimitive.ScrollDownButton>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.ScrollDownButton>
>(({ className, ...props }, ref) => (
  <SelectPrimitive.ScrollDownButton
    ref={ref}
    className={cn(
      "flex cursor-default items-center justify-center py-1",
      className
    )}
    {...props}
  >
    <Icon icon="mdi:chevron-down" width={24} height={24} />
  </SelectPrimitive.ScrollDownButton>
));
SelectScrollDownButton.displayName =
  SelectPrimitive.ScrollDownButton.displayName;

const SelectContent = forwardRef<
  React.ElementRef<typeof SelectPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Content>
>(({ className, children, position = "popper", ...props }, ref) => (
  <SelectPrimitive.Portal>
    <SelectPrimitive.Content
      ref={ref}
      className={cn(
        "data-[state=open]:animate-in data-[state=closed]:animate-out w-full rounded-3xs shadow-50 relative z-50 max-h-[24rem] min-w-[8rem] overflow-hidden border bg-white border-gray-300 text-zinc-900",
        position === "popper" &&
          "data-[side=bottom]:translate-y-3xs data-[side=left]:-translate-x-3xs data-[side=right]:translate-x-3xs data-[side=top]:-translate-y-3xs",
        className
      )}
      position={position}
      {...props}
    >
      <SelectScrollUpButton />
      <SelectPrimitive.Viewport
        className={cn(
          "p-2xs",
          position === "popper" &&
            "h-[var(--radix-select-trigger-height)] w-full min-w-[var(--radix-select-trigger-width)]"
        )}
      >
        {children}
      </SelectPrimitive.Viewport>
      <SelectScrollDownButton />
    </SelectPrimitive.Content>
  </SelectPrimitive.Portal>
));
SelectContent.displayName = SelectPrimitive.Content.displayName;

const SelectItem = forwardRef<
  React.ElementRef<typeof SelectPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Item>
>(({ className, children, ...props }, ref) => (
  <SelectPrimitive.Item
    ref={ref}
    className={cn(
      "relative flex w-full cursor-default select-none items-center rounded-3xs py-sm px-md text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
      className
    )}
    {...props}
  >
    <SelectPrimitive.ItemText>{children}</SelectPrimitive.ItemText>
  </SelectPrimitive.Item>
));
SelectItem.displayName = SelectPrimitive.Item.displayName;

export {
  Select,
  SelectGroup,
  SelectValue,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectScrollUpButton,
  SelectScrollDownButton,
};
