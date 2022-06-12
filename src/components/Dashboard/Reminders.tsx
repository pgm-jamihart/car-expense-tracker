import React, { useEffect, useState } from "react";
import { BsFillTrashFill } from "react-icons/bs";
import { FiMoreHorizontal } from "react-icons/fi";
import { IoMdClose } from "react-icons/io";
import { supabase } from "../../config/supabaseClient";

interface Props {
  currentCarId: number;
}

const Reminders = ({ currentCarId }: Props) => {
  const [reminders, setReminders] = useState<
    {
      car_id: number;
      created_at: string;
      date: string;
      id: number;
      name: string;
      type: string;
    }[]
  >([]);
  const [more, setMore] = useState<boolean>(false);

  useEffect(() => {
    (async () => {
      const { data, error } = await supabase
        .from("reminders")
        .select("*")
        .eq("car_id", currentCarId)
        .order("date", {
          ascending: true,
        });

      if (error) {
        console.log(error);
      }

      if (data) {
        setReminders(data);
      }
    })();
  }, [currentCarId]);

  const readableDate = (date: string) => {
    const newDate = new Date(date);

    const options: any = {
      day: "numeric",
      weekday: "long",
      year: "numeric",
      month: "long",
    };

    const optionsShort: any = {
      day: "numeric",
      month: "short",
      year: "numeric",
    };

    // check if date is in the future
    const today = new Date();

    return (
      <div
        className={`${newDate > today ? "text-skin-blue" : "text-skin-red"}`}
      >
        <span className="hidden lg:block">
          {newDate.toLocaleDateString("en-UK", options)}
        </span>
        <span className="lg:hidden block">
          {newDate.toLocaleDateString("en-UK", optionsShort)}
        </span>
      </div>
    );
  };

  const handleDelete = async (id: number) => {
    const { data, error } = await supabase
      .from("reminders")
      .delete()
      .match({ id });

    if (error) {
      console.log(error);
    }

    if (data) {
      setReminders(reminders.filter((reminder) => reminder.id !== id));
    }
  };

  return (
    <div className="bg-slate-200/50 rounded-md border-2 p-4">
      <div className=" flex justify-between items-center">
        <h3 className=" lg:mb-0">Reminders</h3>
        <button
          className="bg-skin-light_gray rounded-full p-1 hover:bg-skin-gray transition-all duration-200 ease-in-out text-skin-white"
          onClick={() => setMore(!more)}
        >
          {more ? <IoMdClose /> : <FiMoreHorizontal />}
        </button>
      </div>
      <div className="  px-2 py-4 h-[17.3rem] max-h-[17.3rem] overflow-auto">
        {reminders.length > 0 ? (
          <>
            {reminders?.map((reminder) => (
              <div
                key={reminder.date}
                className="min-w-[12rem] flex justify-between border-b-2 border-slate-300 pb-1 my-1"
              >
                <div>
                  <span className="font-bold text-skin-black block">
                    {reminder.name}
                  </span>
                  <span className="text-sm text-skin-dark_gray">
                    {reminder.type}
                  </span>
                </div>
                <div className="flex items-center">
                  {readableDate(reminder.date)}

                  {more && (
                    <button
                      className="ml-2 bg-skin-red rounded-full p-2 hover:bg-red-800 transition-all duration-200 ease-in-out text-skin-white"
                      onClick={() => {
                        handleDelete(reminder.id);
                      }}
                    >
                      <BsFillTrashFill />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </>
        ) : (
          <div className="text-center mt-8">
            <span className="text-skin-dark_gray text-sm">No reminders</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default Reminders;
