import {
  Button,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";
import { Field, Formik } from "formik";
import React, { useState } from "react";
import { supabase } from "../../config/supabaseClient";
import * as paths from "../../routes";
import * as Yup from "yup";
import { useNavigate } from "react-router-dom";
import ErrorBanner from "./ErrorBanner";
import { PrimaryButton } from "../Buttons";

const validationSchema = Yup.object().shape({
  date: Yup.string().required().label("Date"),
  total: Yup.number().required().label("Total"),
});

const FuelExpenseForm = () => {
  const [error, setError] = useState("");
  const navigate = useNavigate();

  return (
    <Formik
      initialValues={{
        date: "",
        total: "",
      }}
      validationSchema={validationSchema}
      onSubmit={async (values, { setSubmitting }) => {
        try {
          setSubmitting(true);

          const { data, error } = await supabase.from("expenses").insert({
            category_id: 1,
            date: values.date,
            total: values.total,
            type: "Fuel",
          });

          if (error) {
            setError(error.message);
          } else {
            const { data: categoryData, error } = await supabase
              .from("categories")
              .select("id, total")
              .eq("id", 1);

            if (error) {
              throw error;
            }

            if (data) {
              const newTotal = categoryData[0].total + values.total;

              const { data, error } = await supabase
                .from("categories")
                .update({ total: newTotal })
                .eq("id", 1);

              if (error) {
                throw error;
              }
            }

            navigate(paths.DASHBOARD);
          }
        } catch (error: any) {
          setError(error.message);
          setSubmitting(false);
        } finally {
          setSubmitting(false);
        }
      }}
    >
      {({ handleSubmit, isSubmitting, values }) => (
        <form onSubmit={handleSubmit} className="flex flex-col my-0 mx-auto ">
          {error && <ErrorBanner error={error} />}

          <div>
            <Field name="date" as={TextField} type="date" />

            <Field name="total" as={TextField} type="number" />
          </div>

          <PrimaryButton
            type="submit"
            className="bg-skin-dark_blue"
            disabled={isSubmitting}
          >
            Add Expense
          </PrimaryButton>

          <pre>{JSON.stringify(values, null, 2)}</pre>
        </form>
      )}
    </Formik>
  );
};

export default FuelExpenseForm;
