import { useField } from "formik";
import React, { useState, useEffect } from "react";
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

  useEffect(() => {
    if (value !== currentValue) {
      setCurrentValue(value);
    }
  }, [value]);

  //   useEffect(() => {
  //     if (segment) {
  //       //   console.log("segment", segment);
  //       if (segment.intent.intent === "add_fuel_expense") {
  //         segment.entities.map((entity: any) => {
  //           console.log("entity", entity);
  //           if (entity.type === "date") {
  //             setCurrentValue(entity.value);
  //           } else if (entity.type === "type_of_fuel") {
  //             setCurrentValue(entity.value);
  //           } else if (entity.type === "total") {
  //             setCurrentValue(entity.value);
  //           }
  //         });
  //       }
  //     }
  //   }, [segment]);

  return (
    <>
      <div className="mb-4">
        <label htmlFor={name} className="font-bold text-base">
          {label}
        </label>

        <input
          {...field}
          className={`${
            errorText ? "border-2 border-skin-red" : "border"
          } w-full h-10 py-2.5 text-base px-4 mt-2  rounded-md placeholder:text-sm placeholder:font-semibold placeholder:text-skin-light_gray hover:border-skin-light_blue hover:border hover:shadow-[0px_0px_0px_4px_#4c7bea4c] hover:transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-skin-blue`}
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
