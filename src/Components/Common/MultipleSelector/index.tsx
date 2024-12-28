import * as React from "react";
import { Check, ChevronsUpDown, X } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/Components/Common/Popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/Components/Common/Command";
import { ShadcnButton } from "../ShadcnButton";

interface User {
  _id: string;
  name: string;
}

interface MultipleSelectorProps {
  users: User[];
  selectedIds: string[];
  onChange: (selected: string[]) => void;
  errorMessage?: string;
  label?: string;
  placeholder?: string;
  disabled?: boolean;
}

export const MultipleSelector: React.FC<MultipleSelectorProps> = ({
  users = [],
  selectedIds,
  onChange,
  errorMessage,
  disabled = false,
  label,
  placeholder = "Select resources...",
}) => {
  const [open, setOpen] = React.useState(false);

  const handleSetValue = (id: string) => {
    if (selectedIds.includes(id)) {
      onChange(selectedIds.filter((item) => item !== id));
    } else {
      onChange([...selectedIds, id]);
    }
  };

  const handleRemove = (
    id: string,
    event: React.MouseEvent | React.KeyboardEvent
  ) => {
    event.stopPropagation();
    onChange(selectedIds.filter((item) => item !== id));
  };

  const selectedUsers = users.filter((user) => selectedIds.includes(user._id));

  return (
    <div className="w-full">
      {label && (
        <label className="text-[15px] font-bold text-zinc-900">{label}</label>
      )}

      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <ShadcnButton
            asChild
            variant="outline"
            role="combobox"
            disabled={disabled}
            aria-expanded={open}
            className={cn(
              "flex flex-grow mt-1 min-h-12 autofill:input-autofill disabled:cursor-not-allowed disabled:bg-gray-200 disabled:focus-visible:border-gray-300 disabled:hover:border-gray-300 border px-sm border-gray-300 hover:border-primary focus-visible:border-primary focus-visible:outline-none focus:border-2 text-sm rounded-3xs w-full",
              errorMessage && "border-red-500 focus-visible:border-red-500"
            )}
          >
            <div className="flex items-center justify-between w-full">
              <div className="flex flex-wrap gap-2 justify-start">
                {selectedUsers.length > 0 ? (
                  selectedUsers.map((user) => (
                    <span
                      key={user._id}
                      className="flex items-center px-2 py-1 rounded border bg-slate-300 text-xs font-medium"
                    >
                      {user.name}
                      {!disabled && (
                        <span
                          onClick={(event) => handleRemove(user._id, event)}
                          onKeyDown={(event) => {
                            if (event.key === "Enter" || event.key === " ") {
                              handleRemove(user._id, event);
                            }
                          }}
                          role="button"
                          tabIndex={0}
                          className="ml-1 text-gray-500 hover:text-gray-700 cursor-pointer focus:outline-none"
                          aria-label={`Remove ${user.name}`}
                        >
                          <X className="h-3 w-3 text-slate-900 " />
                        </span>
                      )}
                    </span>
                  ))
                ) : (
                  <span className="text-gray-500">{placeholder}</span>
                )}
              </div>
              <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
            </div>
          </ShadcnButton>
        </PopoverTrigger>
        {!disabled && (
          <PopoverContent className="w-full p-0">
            <Command>
              <CommandInput placeholder="Search users..." />
              <CommandEmpty>No users found.</CommandEmpty>
              <CommandList>
                <CommandGroup>
                  {users.map((user) => (
                    <CommandItem
                      key={user._id}
                      value={user.name}
                      onSelect={() => handleSetValue(user._id)}
                    >
                      <Check
                        className={cn(
                          "mr-2 h-4 w-4",
                          selectedIds.includes(user._id)
                            ? "opacity-100"
                            : "opacity-0"
                        )}
                      />
                      {user.name}
                    </CommandItem>
                  ))}
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        )}
      </Popover>

      {errorMessage && (
        <p className="mt-1 text-xs text-red-600">{errorMessage}</p>
      )}
    </div>
  );
};
