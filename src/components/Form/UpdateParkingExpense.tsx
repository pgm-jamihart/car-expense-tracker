import { Field, Formik } from "formik";
import React, { useEffect, useState } from "react";
import { supabase } from "../../config/supabaseClient";
import * as paths from "../../routes";
import * as Yup from "yup";
import { useNavigate } from "react-router-dom";
import ErrorBanner from "./ErrorBanner";
import { PrimaryButton } from "../Buttons";

import TextInput from "./TextInput";

const validationSchema = Yup.object().shape({
  date: Yup.date().required().label("Date"),
  total: Yup.number().required().label("Total"),
  parking_name: Yup.string().notRequired().label("Parking name"),
  parking_location: Yup.string().notRequired().label("Parking location"),
});

interface Props {
  expense: {
    id: string;
    total: number;
    date: string;
    name: string;
    location: string;
    category_id: number;
  };
}

const UpdateParkingExpense = ({ expense }: Props) => {
  const [error, setError] = useState("");
  const navigate = useNavigate();

  return (
    <Formik
      initialValues={{
        date: expense.date,
        total: expense.total,
        parking_name: expense.name || "",
        parking_location: expense.location || "",
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
              location: values.parking_location,
              name: values.parking_name,
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

            <Field name="total" as={TextInput} type="number" label="Total" />

            <div className="mt-8">
              <h3 className="mb-4 bg-skin-gray p-2 rounded-sm text-skin-white text-center">
                Parking
              </h3>

              <Field
                name="parking_name"
                as={TextInput}
                type="text"
                label="Name (optional)"
              />

              <Field
                name="parking_location"
                as={TextInput}
                type="text"
                label="Location (optional)"
              />
            </div>
          </div>

          <PrimaryButton
            type="submit"
            className="bg-skin-dark_blue"
            disabled={isSubmitting}
          >
            Update Expense
          </PrimaryButton>
        </form>
      )}
    </Formik>
  );
};

export default UpdateParkingExpense;