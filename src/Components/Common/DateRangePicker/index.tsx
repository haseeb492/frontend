"use client";

import * as React from "react";
import {
  format,
  startOfWeek,
  endOfWeek,
  startOfMonth,
  endOfMonth,
  subWeeks,
  subMonths,
} from "date-fns";
import { CalendarIcon } from "lucide-react";
import { DateRange } from "react-day-picker";

import { cn } from "@/lib/utils";
import { Popover, PopoverContent, PopoverTrigger } from "../Popover";
import { ShadcnButton } from "../ShadcnButton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../SelectionField";
import { Calendar } from "../Calendar";

interface ShadcnDateRangePickerProps {
  label?: string;
  errorMessage?: string;
  startDate: Date | null;
  endDate: Date | null;

  setDateRange: (range: [Date | null, Date | null]) => void;
  placeholder?: string;
  disabled?: boolean;
  id?: string;
  className?: string;
}

export function DateRangePicker({
  label,
  errorMessage,
  startDate,
  endDate,
  setDateRange,
  placeholder,
  disabled,
  id,
  className,
}: ShadcnDateRangePickerProps) {
  const [range, setRange] = React.useState<(Date | null)[]>([
    startDate,
    endDate,
  ]);

  const [open, setOpen] = React.useState(false);

  React.useEffect(() => {
    setRange([startDate, endDate]);
  }, [startDate, endDate]);

  function handleCalendarSelect(selected: DateRange | undefined) {
    const newRange: [Date | null, Date | null] = [
      selected?.from || null,
      selected?.to || null,
    ];
    setRange(newRange);
    setDateRange(newRange);
  }

  function handleRangeFilter(value: string) {
    const today = new Date();
    let from: Date;
    let to: Date;

    switch (value) {
      case "last-week":
        from = startOfWeek(subWeeks(today, 1));
        to = endOfWeek(subWeeks(today, 1));
        break;
      case "this-week":
        from = startOfWeek(today);
        to = endOfWeek(today);
        break;
      case "last-month":
        from = startOfMonth(subMonths(today, 1));
        to = endOfMonth(subMonths(today, 1));
        break;
      case "this-month":
        from = startOfMonth(today);
        to = endOfMonth(today);
        break;
      default:
        return;
    }

    const newRange: [Date | null, Date | null] = [from, to];
    setRange(newRange);
    setDateRange(newRange);
  }

  return (
    <div className="flex w-full flex-col gap-1">
      {label && (
        <label htmlFor={id} className="mb-1 text-sm font-bold text-zinc-900">
          {label}
        </label>
      )}

      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <ShadcnButton
            id={id}
            variant="outline"
            disabled={disabled}
            className={cn(
              "flex items-center justify-start mt-1 min-h-12 w-full px-sm text-sm rounded-3xs border border-gray-300 autofill:input-autofill focus-visible:outline-none focus-visible:border-primary focus:border-2 hover:border-primary disabled:cursor-not-allowed disabled:bg-gray-200 disabled:focus-visible:border-gray-300 disabled:hover:border-gray-300",
              errorMessage && "border-red-500 focus-visible:border-red-500",
              className
            )}
            aria-expanded={open}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {range[0] ? (
              range[1] ? (
                <>
                  {format(range[0], "LLL dd, y")} -{" "}
                  {format(range[1], "LLL dd, y")}
                </>
              ) : (
                format(range[0], "LLL dd, y")
              )
            ) : (
              <span>{placeholder || "Select date range"}</span>
            )}
          </ShadcnButton>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0 z-50" align="start">
          {/* The top filter dropdown */}
          <div className="p-3 border-b">
            <Select onValueChange={handleRangeFilter}>
              <SelectTrigger className="w-[250px]">
                <SelectValue placeholder="Quick range filters" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="last-week">Last Week</SelectItem>
                <SelectItem value="this-week">This Week</SelectItem>
                <SelectItem value="last-month">Last Month</SelectItem>
                <SelectItem value="this-month">This Month</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Calendar
            mode="range"
            numberOfMonths={2}
            initialFocus
            disabled={disabled}
            selected={{
              from: range[0] || undefined,
              to: range[1] || undefined,
            }}
            defaultMonth={range[0] || undefined}
            onSelect={handleCalendarSelect}
          />
        </PopoverContent>
      </Popover>

      {errorMessage && (
        <p className="mt-1 text-sm text-red-500">{errorMessage}</p>
      )}
    </div>
  );
}
