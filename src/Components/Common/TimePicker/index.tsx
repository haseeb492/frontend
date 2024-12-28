interface TimePickerProps {
  label: string;
  errorMessage?: string;
  value: string | undefined;
  onChange: () => void;
  placeholder?: string;
  disabled?: boolean;
  id?: string;
  className?: string;
}

export default function TimePickerField({
  label,
  value,
  id,
  onChange,
  errorMessage,
  className,
  disabled,
}: TimePickerProps) {
  return (
    <div className="w-full flex flex-col gap-3xs">
      <label htmlFor={id} className="text-sm font-bold text-zinc-900">
        {label}
      </label>
      <input
        type="time"
        id={id}
        value={value}
        disabled={disabled}
        onChange={onChange}
        className={`${className} autofill:input-autofill disabled:cursor-not-allowed disabled:bg-gray-200 disabled:focus-visible:border-gray-300 disabled:hover:border-gray-300 border px-sm h-3lg border-gray-300 hover:border-primary focus-visible:border-primary focus-visible:outline-none focus:border-2 text-sm rounded-3xs w-full ${
          errorMessage && "border-red-500 focus-visible:border-red-500"
        }`}
      />
      {errorMessage && <p className="text-md text-red-500">{errorMessage}</p>}
    </div>
  );
}
