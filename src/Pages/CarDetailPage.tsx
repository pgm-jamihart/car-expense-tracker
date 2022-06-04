import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import * as Yup from "yup";
import { Formik, Field } from "formik";
import { PageTitle } from "../components";
import { PrimaryButton } from "../components/Buttons";
import { supabase } from "../config/supabaseClient";
import BaseLayout from "../Layouts/BaseLayout";
import * as paths from "../routes";
import { ErrorBanner, TextInput } from "../components/Form";
import { AiOutlineEdit } from "react-icons/ai";

const validationSchema = Yup.object().shape({
  year: Yup.number().required().label("Year"),
  mileage: Yup.number().required().label("Mileage"),
});

const CarDetailPage = () => {
  const navigate = useNavigate();
  let { id } = useParams<{ id: string }>();
  const [data, setData] = useState<any[]>([]);
  const [error, setError] = useState("");

  const carId = Number(id);

  useEffect(() => {
    (async () => {
      const { data, error } = await supabase
        .from("cars")
        .select("id, brand, model, year, mileage")
        .eq("id", carId);
      if (error) {
        throw error;
      }

      if (data) {
        setData(data);
      }
    })();
  }, [carId]);

  const handleDeleteCar = async (id: number) => {
    // delete all expenses associated with this car
    const { data, error } = await supabase
      .from("expenses")
      .delete()
      .match({ car_id: id });
    if (error) {
      console.log(error);
    } else {
      const { data, error } = await supabase.from("cars").delete().eq("id", id);
      if (error) {
        console.log(error);
      }
      navigate(paths.GARAGE);
    }
  };

  const handleSelectCar = (
    id: number,
    brand: string,
    model: string,
    year: string,
    mileage: string
  ) => {
    localStorage.setItem(
      "car",
      JSON.stringify({
        id: id,
        brand: brand,
        model: model,
        year: year,
        mileage: mileage,
      })
    );
    navigate(paths.DASHBOARD);
  };

  return (
    <BaseLayout>
      {data[0] && (
        <div>
          <PageTitle>
            <span className="">{data[0].brand} </span>
            <span className="text-xl font-light md:italic block md:inline ">
              {data[0].model}
            </span>
          </PageTitle>

          <button
            className="my-8 bg-skin-dark_blue text-skin-white py-1 px-4 rounded-md absolute md:top-0 -top-2 right-6"
            onClick={() => {
              handleSelectCar(
                carId,
                data[0].brand,
                data[0].model,
                data[0].year,
                data[0].mileage
              );
            }}
          >
            Select
          </button>

          <Formik
            enableReinitialize={true}
            initialValues={{
              year: data[0].year || "",
              mileage: data[0].mileage || "",
            }}
            validationSchema={validationSchema}
            onSubmit={async (values, { setSubmitting }) => {
              try {
                setSubmitting(true);

                const { data, error } = await supabase
                  .from("cars")
                  .update({
                    year: values.year,
                    mileage: values.mileage,
                  })
                  .match({ id: carId });

                if (error) {
                  setError(error.message);
                } else {
                  localStorage.setItem(
                    "car",
                    JSON.stringify({
                      id: data[0].id,
                      brand: data[0].brand,
                      model: data[0].model,
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
              <form
                onSubmit={handleSubmit}
                className="flex flex-col my-0 mx-auto "
              >
                {error && <ErrorBanner error={error} />}
                {isSubmitting ? (
                  <div className="text-center my-6">
                    <div
                      className="spinner-border text-skin-yellow"
                      role="status"
                    >
                      <span className="sr-only">Loading...</span>
                    </div>
                  </div>
                ) : (
                  <div className="mb-4">
                    <div>
                      <label htmlFor="year" className="font-bold text-base">
                        Year
                      </label>

                      <div className="flex items-start">
                        <Field
                          type="input"
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
                          type="input"
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
                )}

                {values.year !== data[0].year ||
                values.mileage !== data[0].mileage ? (
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

          <PrimaryButton
            className="bg-skin-red rounded-none absolute bottom-0 right-0 md:rounded-md md:bottom-6 md:left-6 md:max-w-sm"
            type="button"
            onClick={() => handleDeleteCar(data[0].id)}
          >
            Delete
          </PrimaryButton>
        </div>
      )}
    </BaseLayout>
  );
};

export default CarDetailPage;
