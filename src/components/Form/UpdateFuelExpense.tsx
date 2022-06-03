import { Field, Formik } from "formik";
import React, { useEffect, useState } from "react";
import { supabase } from "../../config/supabaseClient";
import * as paths from "../../routes";
import * as Yup from "yup";
import { useNavigate } from "react-router-dom";
import ErrorBanner from "./ErrorBanner";
import { PrimaryButton } from "../Buttons";

import TextInput from "./TextInput";
import SelectInput from "./SelectInput";

const validationSchema = Yup.object().shape({
  date: Yup.date().required().label("Date"),
  typeOfFuel: Yup.string().required().label("Type of fuel"),
  total: Yup.number().required().label("Total"),
  gasStation: Yup.string().label("Gas station"),
  location: Yup.string().label("Location"),
});

interface Props {
  expense: {
    id: string;
    total: number;
    date: string;
    mileage: number;
    fuel_type: string;
    name: string;
    location: string;
    category_id: number;
  };
}

const UpdateFuelExpense = ({ expense }: Props) => {
  const [currentCar, setCurrentCar] = useState<any>({});
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const carId = localStorage.getItem("car");
    if (carId) {
      setCurrentCar(JSON.parse(carId));
    }
  }, []);

  return (
    <Formik
      initialValues={{
        date: expense.date,
        typeOfFuel: expense.fuel_type || "",
        total: expense.total,
        gasStation: expense.name || "",
        location: expense.location || "",
      }}
      validationSchema={validationSchema}
      onSubmit={async (values, { setSubmitting }) => {
        try {
          setSubmitting(true);

          console.log("values", values);

          const { data, error } = await supabase
            .from("expenses")
            .update({
              category_id: expense.category_id,
              date: values.date,
              total: values.total,
              car_id: currentCar.id,
              location: values.location,
              name: values.gasStation,
              fuel_type: values.typeOfFuel,
            })
            .match({ id: expense.id });

          if (error) {
            setError(error.message);
          }

          navigate(paths.TIMELINE);
        } catch (error: any) {
          setError(error.message);
          setSubmitting(false);
        } finally {
          setSubmitting(false);
        }
      }}
    >
      {({ handleSubmit, isSubmitting, values }) => (
        <form onSubmit={handleSubmit} className="flex flex-col  mx-auto my-8">
          {error && <ErrorBanner error={error} />}

          <div>
            <Field name="date" as={TextInput} type="date" label="Date" />

            <Field
              name="typeOfFuel"
              as={SelectInput}
              label="Type of Fuel"
              options={["Diesel", "Benzine", "LPG", "Electric"]}
            />

            <Field name="total" as={TextInput} type="number" label="Total" />

            <div className="mt-8">
              <h3 className="mb-4 bg-skin-gray p-2 rounded-sm text-skin-white text-center">
                Gas Station
              </h3>

              <Field
                name="gasStation"
                as={TextInput}
                type="text"
                label="Name (optional)"
              />

              <Field
                name="location"
                as={TextInput}
                type="text"
                label="Location (optional)"
              />
            </div>
          </div>

          <PrimaryButton
            type="submit"
            className="bg-skin-dark_blue max-w-md"
            disabled={isSubmitting}
          >
            Update Expense
          </PrimaryButton>
        </form>
      )}
    </Formik>
  );
};

export default UpdateFuelExpense;
