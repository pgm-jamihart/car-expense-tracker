import React, { useEffect, useState } from "react";
import * as Yup from "yup";
import { Formik, Field } from "formik";

import BaseLayout from "../Layouts/BaseLayout";
import { useAuth } from "../context/AuthProvider";
import {
  ErrorBanner,
  SelectInput,
  SelectInputAddCar,
  TextInput,
} from "../components/Form";
import { PrimaryButton } from "../components/Buttons";
import { supabase } from "../config/supabaseClient";
import { useNavigate } from "react-router-dom";
import * as paths from "../routes";
import { PageTitle } from "../components";

const validationSchema = Yup.object().shape({
  brand: Yup.string().required().label("Brand"),
  model: Yup.string().required().label("Model"),
  year: Yup.number().required().label("Year"),
  mileage: Yup.number().required().label("Mileage"),
});

const AddCar = () => {
  const navigate = useNavigate();
  const auth = useAuth();
  const [error, setError] = useState("");
  const [carBrands, setCarBrands] = useState([]);
  const [currentCarValue, setCurrentCarValue] = useState("");
  const [carModels, setCarModels] = useState([]);

  const apikey: string | undefined = process.env.REACT_APP_RAPID_API_KEY;

  useEffect(() => {
    (async () => {
      // fetch data with fetch api

      try {
        const response = await fetch(
          "https://car-data.p.rapidapi.com/cars/makes",
          {
            method: "GET",
            // @ts-expect-error
            headers: {
              "X-RapidAPI-Host": "car-data.p.rapidapi.com",
              "X-RapidAPI-Key": apikey,
            },
          }
        );

        const data = await response.json();
        setCarBrands(data.message ? null : data);
      } catch (error) {
        console.log(error);
      }
    })();
  }, [apikey]);

  useEffect(() => {
    if (currentCarValue) {
      (async () => {
        // fetch data with fetch api

        try {
          const response = await fetch(
            "https://car-data.p.rapidapi.com/cars?limit=50&page=0&make=" +
              currentCarValue,
            {
              method: "GET",
              // @ts-expect-error
              headers: {
                "X-RapidAPI-Host": "car-data.p.rapidapi.com",
                "X-RapidAPI-Key": apikey,
              },
            }
          );

          const data = await response.json();
          console.log(data);
          const models = data.map((car: any) => car.model);

          // filter out duplicates
          const uniqueModels: any = [...new Set(models)];

          setCarModels(uniqueModels);
        } catch (error) {
          console.log(error);
        }
      })();
    }
  }, [apikey, currentCarValue]);

  return (
    <>
      <PageTitle>Add car</PageTitle>

      <Formik
        initialValues={{
          brand: "",
          model: "",
          year: "",
          mileage: "",
        }}
        validationSchema={validationSchema}
        onSubmit={async (values, { setSubmitting }) => {
          try {
            setSubmitting(true);

            const { data, error } = await supabase.from("cars").insert({
              user_id: auth.user?.id,
              brand: values.brand,
              model: values.model,
              year: values.year,
              mileage: values.mileage,
            });

            if (error) {
              setError(error.message);
            } else {
              localStorage.setItem(
                "car",
                JSON.stringify({
                  id: data[0].id,
                  brand: values.brand,
                  model: values.model,
                  year: values.year,
                  mileage: values.mileage,
                })
              );

              navigate(paths.GARAGE);
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
            {isSubmitting ? (
              <div className="text-center my-6">
                <div className="spinner-border text-skin-yellow" role="status">
                  <span className="sr-only">Loading...</span>
                </div>
              </div>
            ) : (
              <div className="mb-4">
                <Field
                  as={SelectInputAddCar}
                  name="brand"
                  placeholder="Brand"
                  label="Brand"
                  options={carBrands ? carBrands : []}
                  currentCarValue={currentCarValue}
                  setCurrentCarValue={setCurrentCarValue}
                />

                <Field
                  as={SelectInput}
                  name="model"
                  placeholder="Model"
                  label="Model"
                  options={carModels ? carModels : []}
                  disabled={!currentCarValue}
                />

                <Field
                  type="input"
                  as={TextInput}
                  name="year"
                  placeholder="Year"
                  label="Year"
                />

                <Field
                  type="input"
                  as={TextInput}
                  name="mileage"
                  placeholder="Mileage"
                  label="Mileage"
                />
              </div>
            )}

            <PrimaryButton
              type="submit"
              className="bg-skin-dark_blue"
              disabled={isSubmitting}
            >
              Add car
            </PrimaryButton>
          </form>
        )}
      </Formik>
    </>
  );
};

export default AddCar;
