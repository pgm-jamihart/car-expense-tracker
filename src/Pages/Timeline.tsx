import React from "react";
import { PageTitle } from "../components";
import { SpeedDialTooltipOpen } from "../components/Buttons";
import BaseLayout from "../Layouts/BaseLayout";

const Timeline = () => {
  return (
    <BaseLayout>
      <PageTitle>Timeline</PageTitle>

      <SpeedDialTooltipOpen />
    </BaseLayout>
  );
};

export default Timeline;
