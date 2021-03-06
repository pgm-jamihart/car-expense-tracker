import React from "react";
import * as Yup from "yup";
import { Formik, Field } from "formik";
import { useNavigate, Link } from "react-router-dom";
import * as paths from "../routes";
import { PrimaryButton } from "../components/Buttons";
import { MdOutlineKeyboardBackspace } from "react-icons/md";
import { ErrorBanner, TextInput } from "../components/Form";
import { useAuth } from "../context/AuthProvider";
import { LandingImage } from "../components";

const validationSchema = Yup.object().shape({
  email: Yup.string().required().email().label("Email"),
  password: Yup.string().required().min(6).label("Password"),
  passwordConfirmation: Yup.string().oneOf(
    [Yup.ref("password"), null],
    "Passwords must match"
  ),
});

const SignUp = () => {
  const auth = useAuth();
  const navigate = useNavigate();

  return (
    <div className="md:flex h-screen bg-skin-light_gray">
      <LandingImage />

      <div className="bg-skin-white h-full p-4 md:rounded-none md:flex md:items-center justify-center w-full md:w-full lg:w-1/2 ">
        <div className="h-full flex flex-col items-center justify-center">
          <div className="flex flex-col items-center">
            <div className="flex items-center justify-start w-full">
              <button onClick={() => navigate(paths.LANDING)}>
                <MdOutlineKeyboardBackspace className="text-skin-yellow w-10 h-10 mr-4" />
              </button>

              <h2 className="my-10 text-3xl">Create an account</h2>
            </div>

            <Formik
              initialValues={{
                email: "",
                password: "",
                passwordConfirmation: "",
              }}
              validationSchema={validationSchema}
              onSubmit={async (values, { setSubmitting }) => {
                try {
                  setSubmitting(true);

                  auth.signUp(values.email, values.password);

                  alert("Check your email for the login link!");
                } catch (error: any) {
                  setSubmitting(false);
                } finally {
                  setSubmitting(false);
                }
              }}
            >
              {({ handleSubmit, isSubmitting }) => (
                <form
                  onSubmit={handleSubmit}
                  className="flex flex-col my-0 mx-auto "
                >
                  {auth.errorMessage && (
                    <ErrorBanner error={auth.errorMessage} />
                  )}
                  {isSubmitting ? (
                    "Sending magic link"
                  ) : (
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
                      <Field
                        type="password"
                        as={TextInput}
                        name="passwordConfirmation"
                        placeholder="Repeat Password"
                        label="Repeat passwoord"
                      />
                    </div>
                  )}

                  <PrimaryButton
                    type="submit"
                    className="bg-skin-dark_blue"
                    disabled={isSubmitting}
                  >
                    Sign up
                  </PrimaryButton>
                </form>
              )}
            </Formik>
          </div>

          <div className="my-16">
            <p className="text-center text-skin-gray">
              Already have an account?{" "}
              <Link to={paths.SIGN_IN} className="text-skin-blue underline">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
