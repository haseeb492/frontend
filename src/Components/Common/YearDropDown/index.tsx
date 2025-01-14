"use client";

import React from "react";

import { Popover, PopoverContent, PopoverTrigger } from "../Popover";
import { ShadcnButton } from "../ShadcnButton";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "../Command";

interface YearDropdownProps {
  selectedYear: number;
  onSelectYear: (year: number) => void;
}

export const YearDropdown = ({
  selectedYear,
  onSelectYear,
}: YearDropdownProps) => {
  const [open, setOpen] = React.useState(false);

  const currentYear = new Date().getFullYear();
  // Example range: 100 years around the current date
  const years = React.useMemo(() => {
    const start = currentYear - 50;
    const end = currentYear + 50;
    const list: number[] = [];
    for (let y = start; y <= end; y++) {
      list.push(y);
    }
    return list;
  }, [currentYear]);

  return (
    <div className="mb-2">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <ShadcnButton variant="outline" onClick={() => setOpen(true)}>
            Search Year
          </ShadcnButton>
        </PopoverTrigger>

        <PopoverContent side="bottom" align="start" className="p-2 z-50">
          <Command>
            <CommandInput placeholder="Search year..." />
            <CommandList>
              <CommandEmpty>No results found.</CommandEmpty>
              <CommandGroup>
                {years.map((year) => (
                  <CommandItem
                    key={year}
                    onSelect={() => {
                      onSelectYear(year);
                      setOpen(false);
                    }}
                  >
                    {year === selectedYear ? (
                      <span className="font-bold">{year}</span>
                    ) : (
                      <span>{year}</span>
                    )}
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
};
