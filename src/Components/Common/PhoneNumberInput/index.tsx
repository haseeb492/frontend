import React from "react";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";

interface PhoneInputFieldProps {
  value: string | undefined;
  onChange: (value: string) => void;
  label: string;
  errorMessage?: string;
}

export const PhoneNumberInput: React.FC<PhoneInputFieldProps> = ({
  value,
  onChange,
  label,
  errorMessage,
}) => {
  const handleOnChange = (phone: string) => {
    if (!phone.startsWith("+")) {
      phone = `+${phone}`;
    }
    onChange(phone);
  };

  const inputStyle: React.CSSProperties = {
    width: "100%",
    height: "48px",
    border: "1px solid #d1d5db",
    borderRadius: "6px",
    padding: "0 12px",
    paddingLeft: "50px",
    fontSize: "16px",
    color: "#374151",
  };

  const buttonStyle: React.CSSProperties = {
    backgroundColor: "#f3f4f6",
    borderRight: "1px solid #d1d5db",
    borderRadius: "6px 0 0 6px",
  };

  const dropdownStyle: React.CSSProperties = {
    backgroundColor: "#ffffff",
    border: "1px solid #d1d5db",
    borderRadius: "6px",
    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
  };

  return (
    <div className="flex flex-col w-full">
      <label className="text-sm mb-1">{label}</label>
      <PhoneInput
        country={"pk"}
        value={value}
        onChange={handleOnChange}
        inputStyle={inputStyle}
        buttonStyle={buttonStyle}
        dropdownStyle={dropdownStyle}
        countryCodeEditable={false}
      />
      {errorMessage && (
        <span className="text-sm text-red-500 mt-1">{errorMessage}</span>
      )}
    </div>
  );
};

export default PhoneNumberInput;
