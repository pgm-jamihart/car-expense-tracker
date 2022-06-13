import React, { useState, useEffect, useContext } from "react";
import { useAuth } from "../context/AuthProvider";
import { supabase } from "../config/supabaseClient";
import { PageTitle } from "../components";
import { AiOutlineEdit, AiOutlineUser } from "react-icons/ai";
import { IoMdClose } from "react-icons/io";
import { PrimaryButton } from "../components/Buttons";
import * as Yup from "yup";
import { Field, Formik } from "formik";
import { ErrorBanner, TextInput } from "../components/Form";
import { FiMail } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { SnackBarContext } from "../context/SnackBarContext";
import { CircularProgress } from "@mui/material";

const validationSchemaEmail = Yup.object().shape({
  email: Yup.string().email("Invalid email").required("Required"),
});
const validationSchemaUsername = Yup.object().shape({
  username: Yup.string().required("Required"),
});

const Account = () => {
  const auth = useAuth();
  const navigate = useNavigate();
  const [username, setUsername] = useState(null);
  const [avatar_url, setAvatarUrl] = useState("");
  const [imageURI, setImageURI] = useState(null);
  const [editImage, setEditImage] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { setSnackBar } = useContext(SnackBarContext);

  useEffect(() => {
    getProfile();
  }, [auth]);

  const getProfile = async () => {
    try {
      setLoading(true);
      const user = supabase.auth.user();

      let { data, error, status } = await supabase
        .from("profiles")
        .select(`username, avatar_url`)
        .eq("id", user!.id)
        .single();

      if (error && status !== 406) {
        throw error;
      }

      if (data) {
        setUsername(data.username);
        setAvatarUrl(data.avatar_url);
      }
    } catch (error: any) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = async (e: { preventDefault: () => void }) => {
    e.preventDefault();
    let avatar = "";

    if (imageURI) {
      console.log("avatar_url", avatar_url);
      const { data, error } = await supabase.storage
        .from("avatars")
        .upload(`${auth.user?.id}/${Date.now()}_avatar.png`, imageURI || "");

      if (error) {
        console.error(error);
      }

      if (data) {
        setAvatarUrl(data.Key);
        avatar = data.Key;
      }
    }

    const { data, error } = await supabase
      .from("profiles")
      .update({
        id: auth.user!.id,
        avatar_url: avatar,
      })
      .match({
        id: auth.user!.id,
      });

    if (error) {
      console.error(error);
    }

    if (data) {
      setSnackBar("Profile image updated");

      setTimeout(() => {
        setSnackBar("");
      }, 6000);
    }
  };

  return (
    <>
      <PageTitle>Account</PageTitle>

      {loading && (
        <div className="absolute left-0 top-0 right-0 bottom-0 bg-skin-white z-20 flex justify-center items-center">
          <CircularProgress />
        </div>
      )}

      <div className="lg:flex lg:items-center mt-8">
        <div className="lg:w-1/2 relative mt-8 lg:mt-0 lg:mr-8 mb-4">
          <div className="flex justify-center">
            <button
              className="absolute -top-4 right-1/2 translate-x-24 lg:translate-x-0 lg:-right-3 bg-skin-blue rounded-full p-2 hover:bg-slate-800 transition-all duration-200 ease-in-out"
              onClick={() => {
                setEditImage(!editImage);
              }}
            >
              {editImage ? (
                <IoMdClose className="text-skin-white text-2xl" />
              ) : (
                <AiOutlineEdit className="text-skin-white text-2xl" />
              )}
            </button>

            {avatar_url && (
              <img
                src={`https://togpdpbjnxnodlpvzjco.supabase.co/storage/v1/object/public/${avatar_url}`}
                alt="avatar"
                className="lg:w-full lg:max-h-[17rem] w-44 h-full max-h-[10rem] object-cover rounded-md bg-skin-black"
              />
            )}
          </div>
        </div>

        <div className="lg:w-full">
          {editImage && (
            <form
              onSubmit={handleImageUpload}
              className={`mb-10 flex justify-center lg:justify-start lg:flex-col-reverse flex-wrap lg:absolute ${
                imageURI ? "bottom-[22%]" : "bottom-[32%]"
              } left-6 lg:w-[30%]`}
            >
              {imageURI && (
                <PrimaryButton
                  type="submit"
                  className="bg-skin-dark_blue w-32 lg:w-full !py-2 lg:mt-4 mb-4"
                >
                  Upload Image
                </PrimaryButton>
              )}

              <div className="flex items-center justify-center w-full lg:block">
                <input
                  className=" bg-skin-light_gray rounded-md p-2 w-full border-none text-skin-white"
                  type="file"
                  id="avatar"
                  name="avatar"
                  onChange={(e: any) => setImageURI(e.target.files[0])}
                  accept="image/*"
                />
              </div>
            </form>
          )}

          <Formik
            enableReinitialize={true}
            initialValues={{
              email: auth.user?.email,
            }}
            validationSchema={validationSchemaEmail}
            onSubmit={async (values, { setSubmitting }) => {
              try {
                setSubmitting(true);
                const { error } = await supabase.auth.update({
                  email: values.email,
                });

                if (error) {
                  setError(error.message);
                }
                navigate(0);

                setSnackBar("Email updated");

                setTimeout(() => {
                  setSnackBar("");
                }, 6000);
              } catch (error: any) {
                setError(error.message);
                setSubmitting(false);
              } finally {
                setSubmitting(false);
              }
            }}
          >
            {({ handleSubmit, isSubmitting, values }) => (
              <form
                onSubmit={handleSubmit}
                className="flex flex-col  mx-auto my-8 w-full"
              >
                {error && <ErrorBanner error={error} />}

                <div>
                  <div>
                    <label className="font-bold text-base" htmlFor="email">
                      E-mail
                    </label>

                    <div className="flex items-start">
                      <span className="min-w-[2.5rem] h-10 w-10 mt-2 mr-2 flex items-center justify-center bg-skin-light_blue rounded-sm">
                        <FiMail className="text-2xl text-skin-blue" />
                      </span>

                      <Field
                        name="email"
                        as={TextInput}
                        type="email"
                        placeholder="E-mail"
                      />

                      {auth.user?.email !== values.email ? (
                        <PrimaryButton
                          type="submit"
                          className="bg-skin-dark_blue w-20 h-10 !p-1 mt-2 ml-4"
                          disabled={isSubmitting}
                        >
                          Save
                        </PrimaryButton>
                      ) : (
                        <div className="absolute right-10 mt-4">
                          <AiOutlineEdit className="text-skin-gray text-2xl" />
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </form>
            )}
          </Formik>

          <Formik
            enableReinitialize={true}
            initialValues={{
              username: username || "",
            }}
            validationSchema={validationSchemaUsername}
            onSubmit={async (values, { setSubmitting }) => {
              try {
                setSubmitting(true);

                const { error } = await supabase
                  .from("profiles")
                  .update({
                    username: values.username,
                  })
                  .match({ id: auth.user?.id });

                if (error) {
                  setError(error.message);
                }
                navigate(0);

                setSnackBar("Username updated");

                setTimeout(() => {
                  setSnackBar("");
                }, 6000);
              } catch (error: any) {
                setError(error.message);
                setSubmitting(false);
              } finally {
                setSubmitting(false);
              }
            }}
          >
            {({ handleSubmit, isSubmitting, values }) => (
              <form
                onSubmit={handleSubmit}
                className="flex flex-col  mx-auto my-8"
              >
                {error && <ErrorBanner error={error} />}

                <div>
                  <div>
                    <label className="font-bold text-base" htmlFor="email">
                      Username
                    </label>

                    <div className="flex items-start">
                      <span className="h-10 w-10 min-w-[2.5rem] mt-2 mr-2 flex items-center justify-center bg-skin-light_blue rounded-sm">
                        <AiOutlineUser className="text-2xl text-skin-blue" />
                      </span>

                      <Field
                        name="username"
                        as={TextInput}
                        type="text"
                        placeholder="Username"
                      />

                      {username !== values.username ? (
                        <PrimaryButton
                          type="submit"
                          className="bg-skin-dark_blue max-w-md w-20 h-10 !p-1 mt-2 ml-2"
                          disabled={isSubmitting}
                        >
                          Save
                        </PrimaryButton>
                      ) : (
                        <div className="absolute right-10 mt-4">
                          <AiOutlineEdit className="text-skin-gray text-2xl" />
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </form>
            )}
          </Formik>
        </div>
      </div>

      <PrimaryButton
        type="button"
        className="bg-skin-black md:max-w-xs absolute left-0 md:left-auto right-0 md:right-2 bottom-0 md:mb-4 rounded-none md:rounded-md"
        onClick={() => {
          // clear local storage
          localStorage.removeItem("car");
          supabase.auth.signOut();
        }}
      >
        Sign Out
      </PrimaryButton>
    </>
  );
};

export default Account;
