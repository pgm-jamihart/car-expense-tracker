import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { PageTitle } from "../components";
import {
  UpdateFuelExpense,
  UpdateInsuranceExpense,
  UpdateMaintenanceExpense,
  UpdateOtherExpense,
  UpdateParkingExpense,
} from "../components/Form";
import { supabase } from "../config/supabaseClient";
import BaseLayout from "../Layouts/BaseLayout";

const UpdateExpense = () => {
  let { id } = useParams<{ id: string }>();
  const [expenseData, setExpenseData] = useState<any>({});

  useEffect(() => {
    (async () => {
      const { data: expense, error: expenseError } = await supabase
        .from("expenses")
        .select("*")
        .eq("id", id);

      if (expenseError) {
        console.log(expenseError);
      }

      if (expense) {
        const categoryId = expense[0].category_id;
        console.log(categoryId);

        const { data, error } = await supabase
          .from("categories")
          .select("id, type")
          .eq("id", categoryId);

        if (error) {
          console.log(error);
        }

        if (data) {
          setExpenseData({ ...expense[0], category: data[0] });
        }
      }
    })();
  }, [id]);

  const switchForm = () => {
    switch (expenseData?.category?.type) {
      case "Fuel":
        return <UpdateFuelExpense expense={expenseData} />;
      case "Parking":
        return <UpdateParkingExpense expense={expenseData} />;
      case "Maintenance":
        return <UpdateMaintenanceExpense expense={expenseData} />;
      case "Insurance":
        return <UpdateInsuranceExpense expense={expenseData} />;
      case "Other":
        return <UpdateOtherExpense expense={expenseData} />;
      default:
        return <div>No form for this category</div>;
    }
  };

  return (
    <BaseLayout>
      <PageTitle>{`Update ${expenseData?.category?.type} expense`}</PageTitle>

      {switchForm()}
    </BaseLayout>
  );
};

export default UpdateExpense;
