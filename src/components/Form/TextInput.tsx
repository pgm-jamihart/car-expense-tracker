import { useField } from "formik";
import React, { useState } from "react";
import ErrorMessage from "./ErrorMessage";

interface TextInputProps {
  label: string;
  name: string;
  value?: string;
  placeholder?: string;
  type?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
}

const TextInput = ({
  label,
  name,
  value = "",
  placeholder,
  type,
  onChange,
  onBlur,
}: TextInputProps) => {
  const [currentValue, setCurrentValue] = useState(value);
  const [field, meta] = useField({
    type,
    name,
    value,
    placeholder,
    onChange,
    onBlur,
  });
  const errorText = meta.error && meta.touched ? meta.error : "";
  return (
    <>
      <div className="mb-4">
        <label htmlFor={name} className="font-bold text-base">
          {label}
        </label>

        <input
          {...field}
          className={`${
            errorText ? "border-2 border-skin-error" : "border"
          } w-full h-10 py-2.5 text-base px-4 mt-2 bg-skin-light rounded-md placeholder:text-sm placeholder:font-semibold placeholder:text-skin-dark hover:border-skin-light hover:border hover:bg-skin-white hover:shadow-[0px_0px_0px_4px_#4c7bea4c] hover:transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-skin-accent`}
          type={type}
          name={name}
          placeholder={placeholder}
          value={currentValue}
          onChange={(e) => {
            if (onChange) onChange(e);
            setCurrentValue(e.currentTarget.value);
          }}
          onBlur={onBlur}
          autoComplete="off"
        />

        {errorText && <ErrorMessage errorText={errorText} />}
      </div>
    </>
  );
};

export default TextInput;
