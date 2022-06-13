import React, { useContext, useEffect, useState } from "react";
import { Field, Formik } from "formik";
import * as Yup from "yup";
import { useNavigate } from "react-router-dom";
import { useSpeechContext } from "@speechly/react-client";

import { supabase } from "../../config/supabaseClient";
import * as paths from "../../routes";
import ErrorBanner from "./ErrorBanner";
import { PrimaryButton } from "../Buttons";
import TextInput from "./TextInput";
import SelectInput from "./SelectInput";
import { MdEuroSymbol } from "react-icons/md";
import SpeechlyExampleText from "./SpeechlyExampleText";
import { SnackBarContext } from "../../context/SnackBarContext";

const validationSchema = Yup.object().shape({
  date: Yup.date().required().label("Date"),
  typeOfFuel: Yup.string().required().label("Type of fuel"),
  total: Yup.number().required().label("Total"),
  gasStation: Yup.string().label("Gas station"),
  location: Yup.string().label("Location"),
});

const FuelExpenseForm = () => {
  const [error, setError] = useState("");
  const { setSnackBar } = useContext(SnackBarContext);
  const navigate = useNavigate();
  const [categoryId, setCategoryId] = useState(null);
  const [currentCar, setCurrentCar] = useState<{
    brand: string;
    id: number;
    mileage: number;
    model: string;
    photo_url: string;
    year: number;
  }>({
    brand: "",
    id: 0,
    mileage: 0,
    model: "",
    photo_url: "",
    year: 0,
  });
  const { segment } = useSpeechContext();
  const [speechlyFormdata, setSpeechlyFormdata] = useState<{
    date: string;
    typeOfFuel: string;
    total: string;
  }>({
    date: "",
    typeOfFuel: "",
    total: "",
  });

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
        .eq("type", "Fuel");

      if (error) {
        setError(error.message);
      }

      if (data) {
        setCategoryId(data[0].id);
      }
    })();
  }, []);

  useEffect(() => {
    if (segment) {
      if (segment.intent.intent === "add_expense") {
        segment.entities.map((entity: any) => {
          if (entity.type === "date") {
            setSpeechlyFormdata({
              ...speechlyFormdata,
              date: entity.value,
            });
          } else if (entity.type === "fuel") {
            setSpeechlyFormdata({
              ...speechlyFormdata,
              typeOfFuel: entity.value,
            });
          } else if (entity.type === "amount") {
            setSpeechlyFormdata({
              ...speechlyFormdata,
              total: entity.value,
            });
          }
        });
      }
    }
  }, [segment]);

  return (
    <Formik
      enableReinitialize={true}
      initialValues={{
        date: speechlyFormdata.date || "",
        typeOfFuel:
          speechlyFormdata.typeOfFuel.charAt(0).toUpperCase() +
            speechlyFormdata.typeOfFuel.slice(1).toLowerCase() || "",
        total: speechlyFormdata.total || "",
        gasStation: "",
        location: "",
      }}
      validationSchema={validationSchema}
      onSubmit={async (values, { setSubmitting }) => {
        try {
          setSubmitting(true);

          const { error } = await supabase.from("expenses").insert({
            category_id: categoryId,
            date: values.date,
            total: values.total,
            car_id: currentCar.id,
            location: values.location,
            name: values.gasStation,
            fuel_type: values.typeOfFuel,
          });

          if (error) {
            setError(error.message);
          }

          setSnackBar("Expense added");

          setTimeout(() => {
            setSnackBar("");
          }, 6000);

          navigate(paths.DASHBOARD);
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

          <SpeechlyExampleText>
            Example: Add expense for 50 euro's, type of fuel benzine for
            tomorrow.
          </SpeechlyExampleText>

          <div>
            <Field name="date" as={TextInput} type="date" label="Date" />

            <Field
              name="typeOfFuel"
              as={SelectInput}
              label="Type of Fuel"
              options={["Diesel", "Benzine", "LPG", "Electric"]}
            />

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

            <div className="mt-8">
              <h3 className="mb-4 bg-skin-gray p-2 rounded-sm text-skin-white text-center">
                Gas Station
              </h3>

              <Field
                name="gasStation"
                as={TextInput}
                type="text"
                label="Name (optional)"
                placeholder="Name Gas Station"
              />

              <Field
                name="location"
                as={TextInput}
                type="text"
                label="Location (optional)"
                placeholder="Location Gas Station"
              />
            </div>
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

export default FuelExpenseForm;
