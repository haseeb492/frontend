import React from "react";

interface CheckboxItemProp extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
}

const Checkbox = ({
  id,
  label,
  checked,
  disabled,
  onChange,
}: CheckboxItemProp) => {
  return (
    <div className="flex items-center gap-sm">
      <input
        id={id}
        type="checkbox"
        checked={checked}
        disabled={disabled}
        onChange={onChange}
        className="w-4 h-4 text-primary disabled:bg-gray-300 bg-gray-100 border-gray-300 rounded-2xs"
      />
      <label htmlFor={id} className="text-sm font-bold text-zinc-900">
        {label}
      </label>
    </div>
  );
};

export default Checkbox;
