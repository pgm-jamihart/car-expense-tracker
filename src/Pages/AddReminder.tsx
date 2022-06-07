import React from "react";
import { PushToTalkButton } from "@speechly/react-ui";
import { BigTranscript } from "@speechly/react-ui";
import { ReminderFrom } from "../components/Form";
import { PageTitle } from "../components";

const AddReminder = () => {
  return (
    <>
      <PageTitle>Add reminder</PageTitle>

      <div className="z-[101] bg-skin-dark_gray relative pl-2 rounded-sm">
        <BigTranscript
          highlightColor="#FCA311"
          backgroundColor="none"
          formatText={true}
        />
      </div>

      <ReminderFrom />

      <div className="z-[101] fixed right-10 bottom-[1.85rem]">
        <PushToTalkButton size="60px"></PushToTalkButton>
      </div>
    </>
  );
};

export default AddReminder;
