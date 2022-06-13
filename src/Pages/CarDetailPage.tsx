import React, { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import * as Yup from "yup";
import { Formik, Field } from "formik";
import { PageTitle } from "../components";
import { PrimaryButton } from "../components/Buttons";
import { supabase } from "../config/supabaseClient";
import * as paths from "../routes";
import { ErrorBanner, TextInput } from "../components/Form";
import { AiOutlineEdit } from "react-icons/ai";
import { useAuth } from "../context/AuthProvider";
import { IoMdClose } from "react-icons/io";
import { SnackBarContext } from "../context/SnackBarContext";
import { CircularProgress } from "@mui/material";

interface Props {
  setCarChanged: (value: boolean) => void;
  carChanged: boolean;
}

const validationSchema = Yup.object().shape({
  year: Yup.number().required().label("Year"),
  mileage: Yup.number().required().label("Mileage"),
});

const CarDetailPage = ({ setCarChanged, carChanged }: Props) => {
  const navigate = useNavigate();
  let { id } = useParams<{ id: string }>();
  const [currentCarData, setCurrentCarData] = useState<any[]>([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [photo_url, setPhoto_url] = useState("");
  const [imageURI, setImageURI] = useState(null);
  const [editImage, setEditImage] = useState(false);
  const auth = useAuth();
  const { setSnackBar } = useContext(SnackBarContext);

  const carId = Number(id);

  useEffect(() => {
    setLoading(true);
    (async () => {
      const { data, error } = await supabase
        .from("cars")
        .select("id, brand, model, year, mileage, photo_url")
        .eq("id", carId);
      if (error) {
        throw error;
      }

      if (data) {
        setCurrentCarData(data);
        setPhoto_url(data[0].photo_url);
        setLoading(false);
      }
    })();
  }, [carId]);

  const handleDeleteCar = async (id: number) => {
    // delete all expenses associated with this car
    const { error } = await supabase
      .from("expenses")
      .delete()
      .match({ car_id: id });
    if (error) {
      console.log(error);
    } else {
      const { error: mileageError } = await supabase
        .from("mileage")
        .delete()
        .match({ car_id: id });

      if (mileageError) {
        console.log(mileageError);
      } else {
        const { error } = await supabase.from("cars").delete().eq("id", id);
        if (error) {
          console.log(error);
        }
        navigate(paths.GARAGE);
      }
    }
  };

  const handleSelectCar = (
    id: number,
    brand: string,
    model: string,
    year: string,
    mileage: number
  ) => {
    localStorage.setItem(
      "car",
      JSON.stringify({
        id: id,
        brand: brand,
        model: model,
        year: year,
        mileage: mileage,
        photo_url: photo_url,
      })
    );

    setCarChanged(!carChanged);

    navigate(paths.DASHBOARD);
  };

  const handleImageUpload = async (e: { preventDefault: () => void }) => {
    e.preventDefault();
    let car_image = "";

    if (imageURI) {
      const { data: storageData, error: storageError } = await supabase.storage
        .from("cars")
        .upload(
          `${auth.user?.id}/${Date.now() + "_" + carId}.png`,
          imageURI || ""
        );

      if (storageError) {
        console.log(storageError);
      }

      if (storageData) {
        setPhoto_url(storageData.Key);
        car_image = storageData.Key;
      }

      const { data: carData, error: carError } = await supabase
        .from("cars")
        .update({
          photo_url: car_image,
        })
        .match({
          id: carId,
        });

      if (carError) {
        console.log(carError);
      }

      if (carData) {
        localStorage.setItem(
          "car",
          JSON.stringify({
            id: carId,
            brand: currentCarData[0].brand,
            model: currentCarData[0].model,
            year: currentCarData[0].year,
            mileage: currentCarData[0].mileage,
            photo_url: car_image,
          })
        );

        setSnackBar("Car image updated");

        setTimeout(() => {
          setSnackBar("");
        }, 6000);
      }
    }
  };

  return (
    <>
      {loading && (
        <div className="absolute left-0 top-0 right-0 bottom-0 bg-skin-white z-20 flex justify-center items-center">
          <CircularProgress />
        </div>
      )}

      {currentCarData[0] && (
        <div>
          <PageTitle>
            <span className="">{currentCarData[0].brand} </span>
            <span className="text-xl font-light md:italic block md:inline ">
              {currentCarData[0].model}
            </span>
          </PageTitle>

          <button
            className="my-8 bg-skin-dark_blue text-skin-white py-1 px-4 rounded-md absolute md:top-0 -top-2 right-6"
            onClick={() => {
              handleSelectCar(
                carId,
                currentCarData[0].brand,
                currentCarData[0].model,
                currentCarData[0].year,
                currentCarData[0].mileage
              );
            }}
          >
            Select
          </button>

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

                {photo_url ? (
                  <img
                    src={`https://togpdpbjnxnodlpvzjco.supabase.co/storage/v1/object/public/${photo_url}`}
                    alt="car"
                    className="lg:w-full lg:max-h-[17rem] w-44 h-full max-h-[10rem] object-cover rounded-md bg-skin-black"
                  />
                ) : (
                  <img
                    src="../car_illustration.png"
                    alt="car fallback"
                    className="bg-skin-light_blue lg:w-full lg:max-h-[17rem] w-44 h-full max-h-[10rem] object-cover rounded-md"
                  />
                )}
              </div>
            </div>

            {editImage && (
              <form
                onSubmit={handleImageUpload}
                className={`mb-5 flex justify-center lg:justify-start lg:flex-col-reverse flex-wrap lg:absolute ${
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
                    id="photo"
                    name="photo"
                    onChange={(e: any) => setImageURI(e.target.files[0])}
                    accept="image/*"
                  />
                </div>
              </form>
            )}

            <Formik
              enableReinitialize={true}
              initialValues={{
                year: currentCarData[0].year || "",
                mileage: currentCarData[0].mileage || "",
              }}
              validationSchema={validationSchema}
              onSubmit={async (values, { setSubmitting }) => {
                try {
                  setSubmitting(true);

                  const { error } = await supabase
                    .from("cars")
                    .update({
                      year: values.year,
                      mileage: values.mileage,
                    })
                    .match({ id: carId });

                  if (error) {
                    setError(error.message);
                  } else {
                    const d = new Date();
                    const mm =
                      d.getMonth() + 1 < 10
                        ? "0" + (d.getMonth() + 1)
                        : d.getMonth() + 1;
                    const dd =
                      d.getDate() < 10 ? "0" + d.getDate() : d.getDate();
                    const yyyy = d.getFullYear();
                    const today = `${yyyy}-${mm}-${dd}`;

                    const { error: mileageError } = await supabase
                      .from("mileage")
                      .insert({
                        car_id: carId,
                        mileage: values.mileage,
                        date: today,
                      });
                    if (mileageError) {
                      console.log(mileageError);
                    }

                    localStorage.setItem(
                      "car",
                      JSON.stringify({
                        id: currentCarData[0].id,
                        brand: currentCarData[0].brand,
                        model: currentCarData[0].model,
                        year: values.year,
                        mileage: values.mileage,
                        photo_url: currentCarData[0].photo_url,
                      })
                    );

                    navigate(paths.GARAGE);

                    setSnackBar("Car updated");

                    setTimeout(() => {
                      setSnackBar("");
                    }, 6000);
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
                <form
                  onSubmit={handleSubmit}
                  className="flex flex-col my-0 mx-auto lg:w-full"
                >
                  {error && <ErrorBanner error={error} />}

                  <div className="mb-4">
                    <div>
                      <label htmlFor="year" className="font-bold text-base">
                        Year
                      </label>

                      <div className="flex items-start">
                        <Field
                          type="number"
                          as={TextInput}
                          name="year"
                          placeholder="Year"
                        />
                        <span className="h-10 w-10 mt-2 ml-2 flex items-center justify-center bg-skin-light_blue rounded-sm">
                          <AiOutlineEdit className="text-2xl text-skin-blue" />
                        </span>
                      </div>
                    </div>

                    <div>
                      <label htmlFor="mileage" className="font-bold text-base">
                        Mileage
                      </label>

                      <div className="flex items-start">
                        <Field
                          type="number"
                          as={TextInput}
                          name="mileage"
                          placeholder="Mileage"
                        />
                        <span className="h-10 w-10 mt-2 ml-2 flex items-center justify-center bg-skin-light_blue rounded-sm">
                          <AiOutlineEdit className="text-2xl text-skin-blue" />
                        </span>
                      </div>
                    </div>
                  </div>

                  {values.year !== currentCarData[0].year ||
                  values.mileage !== currentCarData[0].mileage ? (
                    <PrimaryButton
                      type="submit"
                      className="bg-skin-dark_blue md:max-w-sm"
                      disabled={isSubmitting}
                    >
                      Update car
                    </PrimaryButton>
                  ) : null}
                </form>
              )}
            </Formik>
          </div>

          <PrimaryButton
            className="bg-skin-red rounded-none absolute bottom-0 right-0 md:rounded-md md:bottom-6 md:left-6 md:max-w-sm"
            type="button"
            onClick={() => handleDeleteCar(currentCarData[0].id)}
          >
            Delete
          </PrimaryButton>
        </div>
      )}
    </>
  );
};

export default CarDetailPage;
