import React from "react";
import { InputField } from "@/components/FormFields";

interface SuboptionFieldProps {
  label: string;
  name: string;
  value: string | number;
  onChange: (name: string, value: string | number) => void;
  placeholder: string;
  type?: string;
}

const SuboptionField = React.memo(
  ({
    label,
    name,
    value,
    onChange,
    placeholder,
    type = "text",
  }: SuboptionFieldProps) => {
    const handleChange = React.useCallback(
      (e: React.ChangeEvent<HTMLInputElement>) => {
        onChange(e.target.name, e.target.value);
      },
      [onChange]
    );

    return (
      <InputField
        label={label}
        name={name}
        value={value}
        onChange={handleChange}
        placeholder={placeholder}
        type={type}
      />
    );
  }
);

SuboptionField.displayName = "SuboptionField";

export default SuboptionField;
