"use client";

import React, { useState, KeyboardEvent } from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

interface MultipleInputProps {
  label?: string;
  placeholder?: string;
  values: string[];
  onChange: (values: string[]) => void;
  errorMessage?: string;
  disabled?: boolean;
}

export const MultipleInput: React.FC<MultipleInputProps> = ({
  label,
  placeholder = "Add a technology and press Enter",
  values,
  onChange,
  disabled = false,
  errorMessage,
}) => {
  const [inputValue, setInputValue] = useState<string>("");

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      const trimmedValue = inputValue.trim();
      if (trimmedValue && !values.includes(trimmedValue)) {
        onChange([...values, trimmedValue]);
        setInputValue("");
      }
    }
  };

  const handleRemove = (value: string) => {
    onChange(values.filter((item) => item !== value));
  };

  return (
    <div className="w-full flex flex-col gap-3xs">
      {label && (
        <label className="text-sm font-bold text-zinc-900">{label}</label>
      )}

      <div
        className={cn(
          "flex flex-wrap items-center border px-sm rounded-3xs w-full",
          errorMessage ? "border-red-500" : "border-gray-300",
          "hover:border-primary focus-visible:border-primary focus-within:outline-none focus-within:border-2"
        )}
        style={{
          minHeight: "3rem",
          paddingTop: values.length > 0 ? "0.5rem" : "0",
        }}
      >
        {values.map((value) => (
          <div
            key={value}
            className="flex items-center bg-slate-300 text-gray-800 px-2 py-1 rounded mr-2 mb-2"
          >
            <span className="text-sm">{value}</span>
            <button
              type="button"
              onClick={() => {
                if (!disabled) {
                  handleRemove(value);
                }
              }}
              className="ml-1 text-gray-500 hover:text-gray-700 focus:outline-none"
              aria-label={`Remove ${value}`}
            >
              <X className="h-3 w-3" />
            </button>
          </div>
        ))}
        <input
          type="text"
          value={inputValue}
          disabled={disabled}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={values.length === 0 && !disabled ? placeholder : ""}
          className={cn(
            "flex-grow border-none focus:outline-none text-sm placeholder-gray-500",
            "min-w-[150px] disabled:cursor-not-allowed "
          )}
        />
      </div>

      {errorMessage && (
        <p className="mt-1 text-md text-red-500">{errorMessage}</p>
      )}
    </div>
  );
};
