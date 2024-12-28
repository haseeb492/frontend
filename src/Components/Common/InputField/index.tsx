interface InputFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  errorMessage?: string;
  className?: string;
}
const InputField = ({
  label,
  id,
  type,
  placeholder,
  value,
  onChange,
  disabled,
  maxLength,
  errorMessage,
  className,
}: InputFieldProps) => {
  return (
    <div className="w-full flex flex-col gap-3xs">
      <label htmlFor={id} className="text-sm font-bold text-zinc-900">
        {label}
      </label>
      <input
        type={type}
        id={id}
        value={value}
        onChange={onChange}
        disabled={disabled}
        placeholder={placeholder || label}
        maxLength={maxLength}
        className={`${className}autofill:input-autofill disabled:bg-gray-200 disabled:cursor-not-allowed disabled:focus-visible:border-gray-300 disabled:hover:border-gray-300 border px-sm h-3lg border-gray-300 hover:border-primary focus-visible:border-primary focus-visible:outline-none focus:border-2 text-sm rounded-3xs w-full ${
          errorMessage && "border-red-500 focus-visible:border-red-500"
        }`}
      />
      <div>
        {errorMessage && <p className="text-md text-red-500">{errorMessage}</p>}
      </div>
    </div>
  );
};

export default InputField;
