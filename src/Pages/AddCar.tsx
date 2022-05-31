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
  millage: Yup.number().required().label("Millage"),
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
          millage: "",
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
              millage: values.millage,
            });

            if (error) {
              setError(error.message);
            } else {
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
                  name="millage"
                  placeholder="Millage"
                  label="Millage"
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
