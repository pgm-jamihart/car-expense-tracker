import React, { useState } from "react";
import * as Yup from "yup";
import { Formik, Field } from "formik";
import { useNavigate } from "react-router-dom";
import * as paths from "../routes";
import { PrimaryButton } from "../components/Buttons";
import { MdOutlineKeyboardBackspace } from "react-icons/md";
import { ErrorBanner, TextInput } from "../components/Form";

import { Devider, LandingImage, SignUpWithSocials } from "../components";
import { useAuth } from "../context/AuthProvider";

const validationSchema = Yup.object().shape({
  email: Yup.string().required().email().label("Email"),
  password: Yup.string().required().min(6).label("Password"),
});

const SignIn = () => {
  const auth = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  return (
    <div className="md:flex h-screen bg-skin-light-gray">
      <LandingImage />

      <div className="bg-skin-white h-full p-4 md:rounded-none md:flex md:items-center justify-center w-full md:w-full lg:w-1/2 ">
        <div className="h-full flex flex-col items-center justify-center">
          <div className="flex flex-col items-center">
            <div className="flex items-center justify-start w-full">
              <button onClick={() => navigate(paths.LANDING)}>
                <MdOutlineKeyboardBackspace className="text-skin-yellow w-10 h-10 mr-4" />
              </button>

              <h2 className="my-10 text-3xl">Sign in to your account</h2>
            </div>

            <Formik
              initialValues={{
                email: "",
                password: "",
              }}
              validationSchema={validationSchema}
              onSubmit={async (values, { setSubmitting }) => {
                try {
                  setSubmitting(true);

                  auth.signIn(values.email, values.password);
                } catch (error: any) {
                  setSubmitting(false);
                } finally {
                  setSubmitting(false);
                }
              }}
            >
              {({ handleSubmit, isSubmitting }) => (
                <form onSubmit={handleSubmit} className="w-full">
                  {auth.errorMessage && (
                    <ErrorBanner error={auth.errorMessage} />
                  )}

                  <div className="mb-4">
                    <Field
                      type="input"
                      as={TextInput}
                      name="email"
                      placeholder="E-mail"
                      label="E-mail"
                    />
                    <Field
                      type="password"
                      as={TextInput}
                      name="password"
                      placeholder="Password"
                      label="Password"
                    />
                  </div>

                  <PrimaryButton
                    type="submit"
                    className="bg-skin-dark_blue mt-6"
                    disabled={isSubmitting}
                  >
                    Sign up
                  </PrimaryButton>
                </form>
              )}
            </Formik>
            <Devider />
          </div>

          <SignUpWithSocials loading={loading} setLoading={setLoading} />
        </div>
      </div>
    </div>
  );
};

export default SignIn;
