import React from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

interface DatePickerProps {
  title: string;
  errorMessage?: string;
  startDate: Date | undefined;
  endDate: Date | undefined;
  setDateRange: (date: [Date | null, Date | null]) => void;
  placeholder?: string;
  disabled?: boolean;
  id?: string;
  className?: string;
}

export const DateRangePicker = ({
  title,
  placeholder,
  errorMessage,
  id,
  disabled,
  className,
  startDate,
  endDate,
  setDateRange,
}: DatePickerProps) => {
  return (
    <>
      <label htmlFor={id} className="text-sm font-bold text-zinc-900">
        {title}
      </label>
      <DatePicker
        className={`${className} autofill:input-autofill disabled:cursor-not-allowed
         disabled:bg-gray-200 disabled:focus-visible:border-gray-300
         disabled:hover:border-gray-300 border px-sm h-3lg border-gray-300
         hover:border-primary focus-visible:border-primary focus-visible:outline-none 
         focus:border-2 text-sm rounded-3xs w-full ${
           errorMessage && "border-red-500 focus-visible:border-red-500"
         }`}
        placeholderText={placeholder}
        disabled={disabled}
        dateFormat="MMM dd, yyyy"
        selectsRange={true}
        startDate={startDate}
        endDate={endDate}
        onChange={(date: [Date | null, Date | null]) => {
          setDateRange(date);
        }}
      />
      {errorMessage && <p className="text-md text-red-500">{errorMessage}</p>}
    </>
  );
};
