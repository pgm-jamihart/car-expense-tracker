import { useField } from "formik";
import React, { useEffect, useState } from "react";

interface Props {
  label: string;
  name: string;
  value?: string;
  type: string;
  onChange: (event: any) => void;
  onBlur: (event: any) => void;
  options: any[];
  currentCarValue: string;
  setCurrentCarValue: (value: string) => void;
}

const SelectInputAddCar = ({
  label,
  name,
  value = "",
  type,
  onChange,
  onBlur,
  options,
  currentCarValue,
  setCurrentCarValue,
}: Props) => {
  const [field, meta] = useField({
    type,
    name,
    value,
    onChange,
    onBlur,
  });

  const errorText = meta.error && meta.touched ? meta.error : "";

  useEffect(() => {
    if (value !== currentCarValue) {
      setCurrentCarValue(value);
    }
  }, [value]);

  return (
    <div className="mb-4">
      <label htmlFor={name} className="block text-base font-bold">
        {label}
      </label>

      <select
        {...field}
        id={name}
        className={`${
          errorText ? "border-2 border-skin-red" : "border"
        } cursor-pointer w-full h-10 py-2.5 text-base px-4 mt-2  rounded-md placeholder:text-sm placeholder:font-semibold placeholder:text-skin-light_gray hover:border-skin-light_blue hover:border hover:shadow-[0px_0px_0px_4px_#4c7bea4c] hover:transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-skin-blue`}
        onChange={(event: any) => {
          if (onChange) onChange(event);
          setCurrentCarValue(event.target.value);
        }}
        onBlur={onBlur}
        value={currentCarValue}
      >
        <option value="">Select</option>
        {options.map((option) => {
          return (
            <option
              className="cursor-pointer my-1 text-sm font-semibold text-skin-black"
              key={option}
              value={option}
            >
              {option}
            </option>
          );
        })}
      </select>

      {errorText && <p className="text-red-500 text-xs italic">{errorText}</p>}
    </div>
  );
};

export default SelectInputAddCar;
