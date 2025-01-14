"use client";

import * as React from "react";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";

import { cn, parseDate } from "@/lib/utils";
import { ShadcnButton } from "../ShadcnButton";
import { Popover, PopoverContent, PopoverTrigger } from "../Popover";
import { Calendar } from "../Calendar";

import { YearDropdown } from "../YearDropDown";

interface ShadcnDatePickerProps {
  label?: string;
  errorMessage?: string;
  value?: Date | string | number | null;
  onChange: (date: Date | null) => void;
  placeholder?: string;
  disabled?: boolean;
  id?: string;
  className?: string;
}

export const DatePickerField = ({
  label,
  errorMessage,
  value,
  onChange,
  placeholder,
  disabled,
  id,
  className,
}: ShadcnDatePickerProps) => {
  const [date, setDate] = React.useState<Date | null>(parseDate(value));

  React.useEffect(() => {
    setDate(parseDate(value));
  }, [value]);

  function handleSelect(selectedDate: Date | undefined) {
    setDate(selectedDate ?? null);
    onChange(selectedDate ?? null);
  }

  function handleYearChange(year: number) {
    const newDate = date ? new Date(date) : new Date();
    newDate.setFullYear(year);
    handleSelect(newDate);
  }

  return (
    <div className="flex w-full flex-col gap-1">
      {label && (
        <label htmlFor={id} className="mb-1 text-sm font-bold text-zinc-900">
          {label}
        </label>
      )}

      <Popover>
        <PopoverTrigger asChild>
          <ShadcnButton
            variant="outline"
            id={id}
            disabled={disabled}
            className={cn(
              "flex items-center justify-start mt-1 min-h-12 border px-sm border-gray-300 hover:border-primary focus-visible:border-primary focus-visible:outline-none focus-visible:ring-2 text-sm rounded-3xs w-full",
              "autofill:input-autofill disabled:cursor-not-allowed disabled:bg-gray-200 disabled:focus-visible:border-gray-300 disabled:hover:border-gray-300",
              errorMessage && "border-red-500 focus-visible:border-red-500",
              className
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {date ? format(date, "PPP") : placeholder || "Pick a date"}
          </ShadcnButton>
        </PopoverTrigger>

        <PopoverContent align="start" className="w-auto p-2 z-50">
          <YearDropdown
            selectedYear={date?.getFullYear() ?? new Date().getFullYear()}
            onSelectYear={handleYearChange}
          />

          <Calendar
            mode="single"
            selected={date ?? undefined}
            onSelect={handleSelect}
            initialFocus
            disabled={disabled}
          />
        </PopoverContent>
      </Popover>

      {errorMessage && <p className="text-sm text-red-500">{errorMessage}</p>}
    </div>
  );
};
