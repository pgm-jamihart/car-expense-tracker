import React from "react";

import { FaParking, FaGasPump } from "react-icons/fa";
import { FiTool, FiMoreVertical } from "react-icons/fi";
import { BsShieldFillPlus, BsFillTrashFill } from "react-icons/bs";
import { AiFillEdit } from "react-icons/ai";
import { supabase } from "../../config/supabaseClient";
import { Link, useNavigate } from "react-router-dom";
import * as paths from "../../routes";

interface Props {
  expenses: any[];

  open: boolean;
}

const Timeline = ({ expenses, open }: Props) => {
  const navigate = useNavigate();

  const handleDelete = async (id: string) => {
    const { data, error } = await supabase
      .from("expenses")
      .delete()
      .match({ id });

    if (error) {
      console.log(error);
    }

    navigate(0);
  };

  return (
    <div>
      {expenses.map((expense, index) => {
        // transform date to readable format
        const date = new Date(expense.date);
        const month = date.toLocaleString("default", { month: "long" });
        const day = date.getDate();
        const year = date.getFullYear();
        const dateString = `${day} ${month} ${year}`;

        // switch icon based on expense type
        let icon: any;
        switch (expense.category.type) {
          case "Fuel":
            icon = <FaGasPump />;
            break;
          case "Insurance":
            icon = <BsShieldFillPlus />;
            break;
          case "Maintenance":
            icon = <FiTool />;
            break;
          case "Parking":
            icon = <FaParking />;
            break;
          default:
            icon = <FiMoreVertical />;
            break;
        }

        // check last index and add a line break
        const lastIndex = expenses.length - 1;

        return (
          <div key={index} className="flex items-start ">
            <div className="flex flex-col items-center mr-8">
              <div className="text-4xl text-skin-dark_blue bg-slate-400/20 md:w-14 md:h-14 w-12 h-12 p-3 flex items-center justify-center rounded-full border-2 border-skin-dark_blue">
                {icon}
              </div>

              {lastIndex > index && (
                <div className="h-5 w-1 bg-skin-dark_blue my-1 rounded-md"></div>
              )}
            </div>

            <div className="flex items-start justify-between border-b pb-1 w-full border-skin-blue">
              <div>
                <p className="text-base md:text-lg font-bold">
                  {expense.category.type}
                </p>
                <p className="text-xs">
                  {expense.name ||
                    expense.type_maintenance ||
                    expense.type_insurance ||
                    expense.type_of_expense}
                </p>
              </div>
              <div className="flex flex-col items-end">
                <p className="text-sm md:text-base text-skin-gray">
                  {dateString}
                </p>
                <p className="text-sm md:text-base text-skin-blue font-semibold">
                  € {expense.total}
                </p>
              </div>
            </div>

            {open && (
              <div className="flex items-center justify-center ml-4 pt-2">
                <button
                  className="mr-2 rounded-full p-2 bg-skin-red text-skin-white"
                  onClick={() => {
                    handleDelete(expense.id);
                  }}
                >
                  <BsFillTrashFill />
                </button>

                <Link
                  className="rounded-full p-2 bg-skin-light_gray text-skin-black"
                  to={paths.UPDATE_EXPENSE.replace(":id", expense.id)}
                >
                  <AiFillEdit />
                </Link>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default Timeline;
