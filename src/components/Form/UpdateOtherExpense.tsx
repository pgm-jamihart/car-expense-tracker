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
  type_of_expense: Yup.string().notRequired().label("Type of expense"),
});

interface Props {
  expense: {
    id: string;
    total: number;
    date: string;
    type_of_expense: string;
  };
}

const UpdateOtherExpense = ({ expense }: Props) => {
  const [error, setError] = useState("");
  const navigate = useNavigate();
  return (
    <Formik
      initialValues={{
        date: expense.date,
        total: expense.total,
        type_of_expense: expense.type_of_expense || "",
      }}
      validationSchema={validationSchema}
      onSubmit={async (values, { setSubmitting }) => {
        try {
          setSubmitting(true);

          console.log("values", values);

          const { data, error } = await supabase
            .from("expenses")
            .update({
              date: values.date,
              total: values.total,
              type_of_expense: values.type_of_expense,
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

            <Field
              name="type_of_expense"
              as={TextInput}
              type="text"
              label="Type of expense (optional)"
            />
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

export default UpdateOtherExpense;
