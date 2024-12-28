import { useState } from "react";
import { Icon } from "@iconify/react";

interface PasswordInputFieldProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  errorMessage?: string;
  className?: string;
  valid: boolean;
}

const PasswordInputField: React.FC<PasswordInputFieldProps> = ({
  label,
  id,
  placeholder,
  value,
  onChange,
  disabled,
  maxLength,
  errorMessage,
  className,
  valid,
  ...rest
}) => {
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  return (
    <div className="w-full flex flex-col gap-3xs">
      {label && (
        <label htmlFor={id} className="text-sm font-bold text-zinc-900">
          {label}
        </label>
      )}
      <div className="relative w-full">
        <input
          type={showPassword ? "text" : "password"}
          id={id}
          value={value}
          onChange={onChange}
          disabled={disabled}
          placeholder={placeholder || label}
          maxLength={maxLength}
          className={`${className}autofill:input-autofill disabled:bg-gray-200 disabled:focus-visible:border-gray-300 disabled:hover:border-gray-300 border px-sm h-3lg border-gray-300 hover:border-primary focus-visible:border-primary focus-visible:outline-none focus:border-2 text-sm rounded-3xs w-full ${
            errorMessage && "border-red-500 focus-visible:border-red-500"
          }`}
          {...rest}
        />
        <button
          type="button"
          onClick={togglePasswordVisibility}
          className="absolute inset-y-0 right-3 flex items-center text-gray-500 focus:outline-none"
          aria-label={showPassword ? "Hide password" : "Show password"}
        >
          <Icon
            icon={showPassword ? "mdi:eye-off" : "mdi:eye"}
            className="h-5 w-5"
          />
        </button>
      </div>
      {errorMessage && <p className="text-md text-red-500">{errorMessage}</p>}
    </div>
  );
};

export default PasswordInputField;
