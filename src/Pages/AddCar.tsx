import React, { useState } from "react";
import * as Yup from "yup";
import { Formik, Field } from "formik";

import BaseLayout from "../Layouts/BaseLayout";
import { useAuth } from "../context/AuthProvider";
import { ErrorBanner, TextInput } from "../components/Form";
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

  return (
    <BaseLayout>
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
              const categories = [
                "Fuel",
                "Parking",
                "Maintenance",
                "Insurance",
                "Other",
              ];

              categories.map(async (category) => {
                const { data: categoryData, error: categoryError } =
                  await supabase.from("categories").insert({
                    type: category,
                    total: 0,
                    car_id: data[0].id,
                  });

                if (categoryError) {
                  console.log(categoryError);
                }
              });

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
        {({ handleSubmit, isSubmitting }) => (
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
                  type="input"
                  as={TextInput}
                  name="brand"
                  placeholder="Brand"
                  label="Brand"
                />

                <Field
                  type="input"
                  as={TextInput}
                  name="model"
                  placeholder="Model"
                  label="Model"
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
    </BaseLayout>
  );
};

export default AddCar;
