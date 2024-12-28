import React from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

interface DatePickerProps {
  label: string;
  errorMessage?: string;
  value: Date | null | undefined;
  onChange: (date: Date | null | undefined) => void;
  placeholder?: string;
  disabled?: boolean;
  id?: string;
  className?: string;
}

export const DatePickerField = ({
  label,
  placeholder,
  errorMessage,
  value,
  id,
  onChange,
  disabled,
  className,
}: DatePickerProps) => {
  return (
    <div className="w-full flex flex-col gap-3xs">
      <label htmlFor={id} className="text-sm font-bold text-zinc-900">
        {label}
      </label>
      <DatePicker
        className={`${className} autofill:input-autofill disabled:bg-gray-200 disabled:cursor-not-allowed disabled:focus-visible:border-gray-300 disabled:hover:border-gray-300 border px-sm h-3lg border-gray-300 hover:border-primary focus-visible:border-primary focus-visible:outline-none focus:border-2 text-sm rounded-3xs w-full ${
          errorMessage && "border-red-500 focus-visible:border-red-500"
        }`}
        placeholderText={placeholder}
        selected={value}
        onChange={onChange}
        disabled={disabled}
        dateFormat="MMM dd, yyyy"
      />
      {errorMessage && <p className="text-md text-red-500">{errorMessage}</p>}
    </div>
  );
};
