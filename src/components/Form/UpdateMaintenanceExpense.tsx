import { Field, Formik } from "formik";
import React, { useContext, useEffect, useState } from "react";
import { supabase } from "../../config/supabaseClient";
import * as paths from "../../routes";
import * as Yup from "yup";
import { useNavigate } from "react-router-dom";
import ErrorBanner from "./ErrorBanner";
import { PrimaryButton } from "../Buttons";

import TextInput from "./TextInput";
import { MdEuroSymbol } from "react-icons/md";
import { SnackBarContext } from "../../context/SnackBarContext";

const validationSchema = Yup.object().shape({
  date: Yup.date().required().label("Date"),
  total: Yup.number().required().label("Total"),
  type_maintenance: Yup.string().notRequired().label("Type of maintenance"),
});

interface Props {
  expense: {
    id: string;
    total: number;
    date: string;
    type_maintenance: string;
  };
}

const UpdateMaintenanceExpense = ({ expense }: Props) => {
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { setSnackBar } = useContext(SnackBarContext);

  return (
    <Formik
      initialValues={{
        date: expense.date,
        total: expense.total,
        type_maintenance: expense.type_maintenance || "",
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
              type_maintenance: values.type_maintenance,
            })
            .match({ id: expense.id });

          if (error) {
            setError(error.message);
          }

          setSnackBar("Expense updated successfully");

          setTimeout(() => {
            setSnackBar("");
          }, 6000);

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

            <div>
              <label className="font-bold text-base" htmlFor="total">
                Total
              </label>

              <div className="flex items-start">
                <span className="h-10 w-10 mt-2 mr-2 flex items-center justify-center bg-skin-light_blue rounded-sm">
                  <MdEuroSymbol className="text-2xl text-skin-blue" />
                </span>

                <Field
                  name="total"
                  as={TextInput}
                  type="number"
                  placeholder="Total"
                />
              </div>
            </div>

            <Field
              name="type_maintenance"
              as={TextInput}
              type="text"
              label="Type of maintenance"
              placeholder="Type of maintenance"
            />
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

export default UpdateMaintenanceExpense;
