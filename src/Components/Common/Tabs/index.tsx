"use client";

import { cn } from "@/lib/utils";
import * as TabsPrimitive from "@radix-ui/react-tabs";
import { forwardRef } from "react";

const Tabs = TabsPrimitive.Root;

const TabsList = forwardRef<
  React.ElementRef<typeof TabsPrimitive.List>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.List>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.List
    ref={ref}
    className={cn(
      "p-3xs gap-3xs inline-flex items-center justify-center",
      className
    )}
    {...props}
  />
));
TabsList.displayName = TabsPrimitive.List.displayName;

const TabsTrigger = forwardRef<
  React.ElementRef<typeof TabsPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Trigger> & {
    tagMessage?: string;
  }
>(({ className, ...props }, ref) => (
  <div className="relative">
    <TabsPrimitive.Trigger
      ref={ref}
      className={cn(
        "py-3xs px-3sm border-b-2 text-md data-[state=active]:text-primary text-gray-500 hover:bg-outline-hover active:bg-outline-active inline-flex items-center justify-center whitespace-nowrap font-bold transition-all hover:border-gray-50 focus-visible:outline-none active:border-b-gray-400 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:border-b-gray-400",
        className
      )}
      {...props}
    />
  </div>
));
TabsTrigger.displayName = TabsPrimitive.Trigger.displayName;

const TabsContent = forwardRef<
  React.ElementRef<typeof TabsPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Content>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.Content
    ref={ref}
    className={cn("gap-3sm z-10 flex flex-col", className)}
    {...props}
  />
));
TabsContent.displayName = TabsPrimitive.Content.displayName;

export { Tabs, TabsList, TabsTrigger, TabsContent };
