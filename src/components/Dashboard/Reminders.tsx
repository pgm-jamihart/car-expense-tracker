import React, { useEffect, useState } from "react";
import { BsFillTrashFill } from "react-icons/bs";
import { FiMoreHorizontal } from "react-icons/fi";
import { IoMdClose } from "react-icons/io";
import { supabase } from "../../config/supabaseClient";

interface Props {
  currentCarId: number;
}

const Reminders = ({ currentCarId }: Props) => {
  const [reminders, setReminders] = useState<any[]>([]);
  const [more, setMore] = useState(false);

  console.log(reminders);

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
    console.log(newDate);
    const options: any = {
      day: "numeric",
      weekday: "long",
      year: "numeric",
      month: "long",
    };

    // check if date is in the future
    const today = new Date();

    return (
      <span
        className={`${newDate > today ? "text-skin-blue" : "text-skin-red"}`}
      >
        {newDate.toLocaleDateString("en-UK", options)}
      </span>
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
    <div>
      {reminders.length > 0 && (
        <div>
          <div className="p-4 flex justify-between items-center">
            <h3 className=" lg:mb-0">Reminders</h3>
            <button
              className="bg-skin-light_gray rounded-full p-1 hover:bg-skin-gray transition-all duration-200 ease-in-out text-skin-white"
              onClick={() => setMore(!more)}
            >
              {more ? <IoMdClose /> : <FiMoreHorizontal />}
            </button>
          </div>
          <div className="bg-slate-200/50 border-2 border-skin-blue rounded-md px-2 py-4 max-h-[17rem] overflow-y-auto">
            {reminders?.map((reminder) => (
              <div
                key={reminder.date}
                className="flex justify-between border-b-2 border-slate-300 pb-1 my-1"
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
          </div>
        </div>
      )}
    </div>
  );
};

export default Reminders;
