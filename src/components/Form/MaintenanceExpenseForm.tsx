import { Field, Formik } from "formik";
import React, { useEffect, useState } from "react";
import { supabase } from "../../config/supabaseClient";
import { PrimaryButton } from "../Buttons";
import ErrorBanner from "./ErrorBanner";

import TextInput from "./TextInput";
import * as Yup from "yup";
import { useNavigate } from "react-router-dom";
import * as paths from "../../routes";
import { MdEuroSymbol } from "react-icons/md";

const validationSchema = Yup.object().shape({
  date: Yup.date().required().label("Date"),
  total: Yup.number().required().label("Total"),
  type_maintenance: Yup.string().notRequired().label("Type of maintenance"),
});

const MaintenanceExpenseForm = () => {
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const [categoryId, setCategoryId] = useState(null);
  const [currentCar, setCurrentCar] = useState<any>({});

  useEffect(() => {
    const carId = localStorage.getItem("car");
    if (carId) {
      setCurrentCar(JSON.parse(carId));
    }
  }, []);

  useEffect(() => {
    (async () => {
      const { data, error } = await supabase
        .from("categories")
        .select("id")
        .eq("type", "Maintenance");

      if (error) {
        setError(error.message);
      }

      if (data) {
        setCategoryId(data[0].id);
      }
    })();
  }, []);
  return (
    <Formik
      initialValues={{
        date: "",
        total: "",
        type_maintenance: "",
      }}
      validationSchema={validationSchema}
      onSubmit={async (values, { setSubmitting }) => {
        try {
          setSubmitting(true);

          const { data, error } = await supabase.from("expenses").insert({
            category_id: categoryId,
            date: values.date,
            total: values.total,
            car_id: currentCar.id,
            type_maintenance: values.type_maintenance,
          });

          if (error) {
            setError(error.message);
            console.log(error);
          } else {
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
            Add Expense
          </PrimaryButton>
        </form>
      )}
    </Formik>
  );
};

export default MaintenanceExpenseForm;
