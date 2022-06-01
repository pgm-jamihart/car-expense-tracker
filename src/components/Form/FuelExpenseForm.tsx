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
  mileage: Yup.number().required().label("Mileage"),
  typeOfFuel: Yup.string().required().label("Type of fuel"),
  total: Yup.number().required().label("Total"),
  gasStation: Yup.string().label("Gas station"),
  location: Yup.string().label("Location"),
});

const FuelExpenseForm = () => {
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
    if (!currentCar.id) return;

    (async () => {
      const { data, error } = await supabase
        .from("categories")
        .select("id")
        .eq("car_id", currentCar.id)
        .eq("type", "Fuel");

      if (error) {
        setError(error.message);
      }

      if (data) {
        setCategoryId(data[0].id);
      }
    })();
  }, [currentCar.id]);

  return (
    <Formik
      initialValues={{
        date: "",
        mileage: "",
        typeOfFuel: "",
        total: "",
        gasStation: "",
        location: "",
      }}
      validationSchema={validationSchema}
      onSubmit={async (values, { setSubmitting }) => {
        try {
          setSubmitting(true);

          const { data, error } = await supabase.from("expenses").insert({
            category_id: categoryId,
            date: values.date,
            total: values.total,
            type: "Fuel",
            car_id: currentCar.id,
          });

          if (error) {
            setError(error.message);
          } else {
            const { data: categoryData, error: categoryError } = await supabase
              .from("categories")
              .select("id, total")
              .eq("id", categoryId);

            if (categoryError) {
              throw categoryError;
            }

            if (data) {
              const newTotal = categoryData[0].total + values.total;

              const { error } = await supabase
                .from("categories")
                .update({ total: newTotal })
                .eq("id", categoryId);

              if (error) {
                console.log(error);
              }

              console.log("data", data);

              // insert the new expense id into the car_expenses table
              const { data: carExpenseData, error: carExpenseError } =
                await supabase.from("fuel_expense").insert({
                  expense_id: data[0].id,
                  gas_station_location: values.location,
                  gas_station_name: values.gasStation,
                  fuel_type: values.typeOfFuel,
                });

              if (carExpenseError) {
                console.log("carExpenseError", carExpenseError);
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
        <form onSubmit={handleSubmit} className="flex flex-col  mx-auto my-8">
          {error && <ErrorBanner error={error} />}

          <div>
            <Field name="date" as={TextInput} type="date" label="Date" />

            <Field
              name="mileage"
              as={TextInput}
              type="number"
              label="Mileage"
            />

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
            className="bg-skin-dark_blue"
            disabled={isSubmitting}
          >
            Add Expense
          </PrimaryButton>
        </form>
      )}
    </Formik>
  );
};

export default FuelExpenseForm;
