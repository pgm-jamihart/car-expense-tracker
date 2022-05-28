import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { PageTitle } from "../components";
import { PrimaryButton } from "../components/Buttons";
import { supabase } from "../config/supabaseClient";
import BaseLayout from "../Layouts/BaseLayout";
import * as paths from "../routes";

const CarDetailPage = () => {
  const navigate = useNavigate();
  let { id } = useParams<{ id: string }>();
  const [data, setData] = useState<any[]>([]);

  const carId = Number(id);

  useEffect(() => {
    (async () => {
      const { data, error } = await supabase
        .from("cars")
        .select("id, brand, model, year, millage")
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
    const { data, error } = await supabase.from("cars").delete().eq("id", id);
    if (error) {
      throw error;
    }

    navigate(paths.GARAGE);
  };

  return (
    <BaseLayout>
      {data[0] && (
        <div>
          <PageTitle>{data[0].brand}</PageTitle>
          <h2>{data[0].model}</h2>
          <h3>{data[0].year}</h3>
          <h4>{data[0].millage}</h4>

          <PrimaryButton
            className="bg-skin-red"
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
